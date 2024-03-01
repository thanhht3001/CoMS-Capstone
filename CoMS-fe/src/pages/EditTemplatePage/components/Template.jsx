import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { filesDb } from '../../../components/Firebase';
import { getDownloadURL, listAll, ref, uploadBytes, getStorage } from 'firebase/storage';
import { Icon } from '@iconify/react';
import '../css/_template.css';
import '../css/_top-bar.css';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { DocumentEditorContainerComponent, Toolbar, Inject } from '@syncfusion/ej2-react-documenteditor';
import { DocumentEditorComponent, Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog } from '@syncfusion/ej2-react-documenteditor';
import {
    PdfBitmap,
    PdfDocument,
    PdfPageOrientation,
    PdfPageSettings,
    PdfSection,
    SizeF
} from '@syncfusion/ej2-pdf-export';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense("Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCfEx3R3xbf1x0ZFBMYl9bR3JPMyBoS35RckViWHxedXZWQ2RdVEB2");

function Template() {
    const location = useLocation();
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [url, setUrl] = useState('');
    const [saveMenuClass, setSaveMenuClass] = useState('dropdown-menu');
    const [templateUrl, setTemplateUrl] = useState([]);
    const [contractCategories, setContractCategories] = useState([]);
    const [templateTypes, setTemplateTypes] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previewPdf, setPreviewPdf] = useState(null);
    const [selectedContractCategory, setSelectedContractCategory] = useState(null);
    const [selectedTemplateType, setSelectedTemplateType] = useState(null);
    const saveMenuRef = useRef(null);
    const [sfdt, setSfdt] = useState({});
    const [templateId, setTemplateId] = useState(0);
    const token = localStorage.getItem("Token");
    const storage = getStorage();
    const navigate = useNavigate();
    let editorObj = DocumentEditorContainerComponent;

    let items = [
        "New",
        "Open",
        "Separator",
        "Undo",
        "Redo",
        "Separator",
        "Image",
        "Table",
        "Hyperlink",
        "Bookmark",
        "TableOfContents",
        "Separator",
        "Header",
        "Footer",
        "PageSetup",
        "PageNumber",
        "Break",
        'InsertFootnote',
        'InsertEndnote',
        "Separator",
        "Find"
    ];

    const contractCategoryList = contractCategories.map(category => {
        return { label: category.categoryName, value: category.id }
    })

    const templateTypeList = [
        { value: 0, label: "Contract"},
        { value: 1, label: "Contract Annex"},
        { value: 2, label: "Liquidation Record"}
    ];

    const fetchContractCategoryData = async () => {
        const res = await fetch("https://localhost:7073/ContractCategories/active", {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setContractCategories(data);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    };

    const fetchTemplateInfo = async (id) => {
        const res = await fetch(`https://localhost:7073/Templates/get-template-info?id=${id}`, {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplateName(data.templateName);
            setTemplateDescription(data.description);
            setSelectedContractCategory({ value: data.contractCategoryId, label: data.contractCategoryName });
            setSelectedTemplateType({ value: data.templateType, label: data.templateTypeString });
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const fetchEditDraft = async () => {
        const res = await fetch(`https://localhost:7073/Templates?templateId=${templateId}`, {
            mode: "cors",
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({
                "templateName": templateName, "description": templateDescription, "status": 1, "templateLink": url,
                "contractCategoryId": selectedContractCategory.value,
                "templateTypeId": selectedTemplateType.value
            })
        });
        if (res.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Save As Draft Successfully!',
                showConfirmButton: false,
                timer: 1500
            })
            navigate("/template");
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const openSaveMenu = () => {
        if (saveMenuClass === 'dropdown-menu show') {
            setSaveMenuClass('dropdown-menu');
        } else {
            setSaveMenuClass('dropdown-menu show');
        }
    }

    const closeSaveMenu = (e) => {
        if (!saveMenuRef?.current?.contains(e.target)) {
            setSaveMenuClass('dropdown-menu');
        }
    }

    document.addEventListener('mousedown', closeSaveMenu);

    const handleSaveDocClick = () => {
        if (templateName === '') {
            editorObj.documentEditor.save("untitled", "Docx");
        } else {
            editorObj.documentEditor.save(templateName, "Docx");
        }
    }

    const handleSavePdfClick = () => {
        let pdfdocument = new PdfDocument();
        let count = editorObj.documentEditor.pageCount;
        editorObj.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;
        let loadedPage = 0;
        for (let i = 1; i <= count; i++) {
            setTimeout(() => {
                let format = 'image/jpeg';
                // Getting pages as image
                let image = editorObj.documentEditor.exportAsImage(i, format);
                image.onload = function () {
                    let imageHeight = parseInt(
                        image.style.height.toString().replace('px', '')
                    );
                    let imageWidth = parseInt(
                        image.style.width.toString().replace('px', '')
                    );
                    let section = pdfdocument.sections.add();
                    let settings = new PdfPageSettings(0);
                    if (imageWidth > imageHeight) {
                        settings.orientation = PdfPageOrientation.Landscape;
                    }
                    settings.size = new SizeF(imageWidth, imageHeight);
                    (section).setPageSettings(settings);
                    let page = section.pages.add();
                    let graphics = page.graphics;
                    let imageStr = image.src.replace('data:image/jpeg;base64,', '');
                    let pdfImage = new PdfBitmap(imageStr);
                    graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
                    loadedPage++;
                    if (loadedPage == count) {
                        // Exporting the document as pdf
                        pdfdocument.save(
                            (templateName === ''
                                ? 'untitled'
                                : templateName) + '.pdf'
                        );
                    }
                };
            }, 500);
        }
    }

    const handleTemplateNameChange = e => {
        setTemplateName(e.target.value);
    }

    const handleTemplateDescriptionChange = e => {
        setTemplateDescription(e.target.value);
    }

    const handleSelectContractCategory = (data) => {
        setSelectedContractCategory(data);
    }

    const handleSelectTemplateType = (data) => {
        setSelectedTemplateType(data);
    }

    const handleEditClick = async (e) => {
        setLoading(true);
        e.preventDefault();
        var formData = new FormData();
        editorObj.documentEditor.saveAsBlob('Docx').then(function (exportedDocument) {
            formData.append("File", exportedDocument);
        });
        let editorContent = { content: editorObj.documentEditor.serialize() };
        const res = await fetch(`https://localhost:7073/Templates?templateId=${templateId}`, {
            mode: "cors",
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({
                "templateName": templateName, "description": templateDescription, "status": 2, "templateLink": url,
                "contractCategoryId": selectedContractCategory.value,
                "templateTypeId": selectedTemplateType.value
            })
        });
        if (res.status === 200) {
            const data = await res.json();
            const addTemplateRes = await fetch(`https://localhost:7073/TemplateFiles/update-template?templateId=${data.id}&templateName=${templateName}`, {
                mode: "cors",
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                }),
                body: formData
            });
            if (addTemplateRes.status === 200) {
                const exportPdfRes = await fetch(`https://localhost:7073/TemplateFiles/pdf?id=${data.id}`, {
                    mode: "cors",
                    method: "POST",
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify(editorContent),
                });
                if (exportPdfRes.status === 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Save Template Successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setLoading(false);
                    navigate("/template");
                } else {
                    const exportData = await exportPdfRes.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: exportData.title
                    })
                }
            }
            else {
                const templateFileData = await addTemplateRes.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: templateFileData.title
                })
            }
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleSaveAsDraftClick = async (e) => {
        if (selectedContractCategory === null) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You need to choose a contract category!",
            });
            return;
        }
        if (selectedTemplateType === null) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You need to choose a template type!",
            });
            return;
        }
        e.preventDefault();
        var formData = new FormData();
        editorObj.documentEditor.saveAsBlob('Docx').then(function (exportedDocument) {
            formData.append("File", exportedDocument);
            // setPreviewUrl(URL.createObjectURL(exportedDocument));
        });
        let editorContent = { content: editorObj.documentEditor.serialize() };
        const res = await fetch(`https://localhost:7073/Templates?templateId=${templateId}`, {
            mode: "cors",
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
            body: JSON.stringify({
                "templateName": templateName, "description": templateDescription, "status": 1, "templateLink": url,
                "contractCategoryId": selectedContractCategory.value,
                "templateTypeId": selectedTemplateType.value
            })
        });
        if (res.status === 200) {
            const data = await res.json();
            const addTemplateRes = await fetch(`https://localhost:7073/TemplateFiles/update-template?templateId=${data.id}&templateName=${templateName}`, {
                mode: "cors",
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                }),
                body: formData
            });
            if (addTemplateRes.status === 200) {
                const exportPdfRes = await fetch(`https://localhost:7073/TemplateFiles/pdf?id=${data.id}`, {
                    mode: "cors",
                    method: "POST",
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify(editorContent),
                });
                if (exportPdfRes.status === 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Save As Darft Successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/template");
                } else {
                    const exportData = await exportPdfRes.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: exportData.title
                    })
                }
            }
            else {
                const templateFileData = await addTemplateRes.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: templateFileData.title
                })
            }
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const fetchTemplateData = async (id) => {
        if (isFetched) {
            return;
        }
        const res = await fetch(`https://localhost:7073/Templates/get-template?id=${id}`, {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setSfdt(data);
            try {
                editorObj.documentEditor.open(data.sfdt);
            } catch (e) {
                console.error(e);
            }
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleEditorClick = () => {
        setIsFetched(true);
    }

    const handleInsertClick = (name) => {
        editorObj.documentEditor.editor.insertField('MERGEFIELD ' + name + ' \\* MERGEFORMAT');
    }

    useEffect(() => {
        fetchContractCategoryData();
        fetchTemplateInfo(location.state.id);
    }, []);

    useEffect(() => {
        setTemplateId(location.state.id);
        fetchTemplateData(location.state.id);
    }, [sfdt]);

    return (
        <div>
            <form onSubmit={handleEditClick}>
                <div className="topbar-edit intro-y">
                    <h2>
                        Edit Template
                    </h2>
                    <div>
                        {/* <button type="button" className="btn box">
                            <Icon icon="lucide:eye" className='icon' /> Preview </button> */}
                        <div className="dropdown" ref={saveMenuRef}>
                            <button className="dropdown-toggle btn btn-primary" aria-expanded="false" data-tw-toggle="dropdown" type='button' onClick={openSaveMenu}> Save
                                <Icon icon="lucide:chevron-down" className='icon' /></button>
                            <div className={saveMenuClass}>
                                <ul className="dropdown-content">
                                    <li>
                                        <button className="dropdown-item" type='submit'> <Icon icon="lucide:file-text" className='icon' /> As Template </button>
                                    </li>
                                    {/* <li>
                                        <button className="dropdown-item" type='button' onClick={handleSaveAsDraftClick}> <Icon icon="lucide:file-text" className='icon' /> As Draft </button>
                                    </li> */}
                                    <li>
                                        <button className="dropdown-item" type='button' onClick={handleSavePdfClick}> <Icon icon="lucide:file-text" className='icon' /> Export to PDF </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" type='button' onClick={handleSaveDocClick}> <Icon icon="lucide:file-text" className='icon' /> Export to Word </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main">
                    <div className="main-body">
                        <div className="main-content">
                            <div className="pos intro-y template-edit">
                                <div className="intro-y">
                                    <div className="post intro-y box">
                                        <div className="post__content tab-content">
                                            <div className="tab-pane active" role="tabpanel" aria-labelledby="content-tab">
                                                <div className="dark:border-darkmode-400">
                                                    <div className="dark:border-darkmode-400">
                                                        <Icon icon="lucide:chevron-down" className='icon' /> Template Information </div>
                                                    <div class="mt-5">
                                                        <div>
                                                            <div>Template name <span>*</span></div>
                                                            <input type="text" className="intro-y form-control py-3 px-4 box pr-10"
                                                                value={templateName} onChange={handleTemplateNameChange}
                                                                placeholder="Template Name" required />
                                                        </div>
                                                        <div>
                                                            <div>Description <span>*</span></div>
                                                            <textarea className="form-control" name='fieldContent' placeholder='Description about the template' value={templateDescription}
                                                                rows={10} onChange={handleTemplateDescriptionChange} required />
                                                        </div>
                                                        <div>
                                                            <div>Contract Category <span>*</span></div>
                                                            <Select id="select-category" options={contractCategoryList} className="form-select"
                                                                value={selectedContractCategory} onChange={handleSelectContractCategory}
                                                                required />
                                                        </div>
                                                        <div>
                                                            <div>Template Type <span>*</span></div>
                                                            <Select id="select-type" options={templateTypeList} className="form-select"
                                                                value={selectedTemplateType} onChange={handleSelectTemplateType} required />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane active" role="tabpanel" aria-labelledby="content-tab">
                                                <div className="dark:border-darkmode-400">
                                                    <div className="dark:border-darkmode-400">
                                                        <Icon icon="lucide:chevron-down" className='icon' /> Template Content </div>
                                                    <div class="mt-5">
                                                        <div>
                                                            <div>
                                                                <div className='parent'>
                                                                    <div>
                                                                        <div>
                                                                            <div>Click to add:</div>
                                                                            <div>
                                                                                <span>For Contract:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Contract Title')}>Contract Title</li>
                                                                                    <li onClick={() => handleInsertClick('Contract Code')}>Contract Code</li>
                                                                                    <li onClick={() => handleInsertClick('Created Date')}>Created Date</li>
                                                                                    <li onClick={() => handleInsertClick('Contract Duration')}>Contract Duration</li>
                                                                                    <li onClick={() => handleInsertClick('Execution Time')}>Execution Time</li>
                                                                                    <li onClick={() => handleInsertClick('Payment Duration')}>Payment Duration</li>
                                                                                </ul>
                                                                                <span>For Company:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Company Name')}>Name</li>
                                                                                    <li onClick={() => handleInsertClick('Company Address')}>Address</li>
                                                                                    <li onClick={() => handleInsertClick('Company Tax Code')}>Tax Code</li>
                                                                                    <li onClick={() => handleInsertClick('Company Email')}>Email</li>
                                                                                    <li onClick={() => handleInsertClick('Company Phone')}>Phone</li>
                                                                                    <li onClick={() => handleInsertClick('Company Hotline')}>Hotline</li>
                                                                                    <li onClick={() => handleInsertClick('Company Phone Number')}>Code</li>
                                                                                    <li onClick={() => handleInsertClick('Signer Name')}>Signer Name</li>
                                                                                    <li onClick={() => handleInsertClick('Signer Position')}>Signer Position</li>
                                                                                    <li onClick={() => handleInsertClick('Company Signature')}>Signature</li>
                                                                                </ul>
                                                                                <span>For Partner:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Partner Name')}>Name</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Address')}>Address</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Tax Code')}>Tax Code</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Email')}>Email</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Phone Number')}>Phone</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Code')}>Code</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Signer Name')}>Signer Name</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Signer Position')}>Signer Position</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Signature')}>Signature</li>
                                                                                </ul>
                                                                                <span>For Service:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Service Name')}>Service Name</li>
                                                                                    <li onClick={() => handleInsertClick('Service Price')}>Service Price</li>
                                                                                </ul>
                                                                                <span>For Payment:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Bank Account')}>Bank Account</li>
                                                                                    <li onClick={() => handleInsertClick('Account Number')}>Account Number</li>
                                                                                    <li onClick={() => handleInsertClick('Bank')}>Bank</li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group col-md-12 editor" onClick={handleEditorClick}>
                                                                            <DocumentEditorContainerComponent id='content' ref={(ins => editorObj = ins)}
                                                                                height='1300' enableToolbar={true} toolbarItems={items} readOnly={true} showPropertiesPane={true}
                                                                                serviceUrl='https://ej2services.syncfusion.com/production/web-services/api/documenteditor/'>
                                                                                <Inject services={[Toolbar]}></Inject>
                                                                            </DocumentEditorContainerComponent>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="loading-icon" style={{display: loading ? "flex" : "none"}}>
                                    <div>
                                        <Icon icon="line-md:loading-alt-loop" className='icon' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Template;