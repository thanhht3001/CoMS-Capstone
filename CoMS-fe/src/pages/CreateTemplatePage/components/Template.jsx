import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { filesDb } from '../../../components/Firebase';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { Icon } from '@iconify/react';
import '../css/_template.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/_top-bar.css';
import { registerLicense } from '@syncfusion/ej2-base';
import { DocumentEditorContainerComponent, Toolbar, Inject } from '@syncfusion/ej2-react-documenteditor';
import {
    PdfBitmap,
    PdfDocument,
    PdfPageOrientation,
    PdfPageSettings,
    PdfSection,
    SizeF
} from '@syncfusion/ej2-pdf-export';
registerLicense("Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCfEx3R3xbf1x0ZFBMYl9bR3JPMyBoS35RckViWHxedXZWQ2RdVEB2");

function Template() {
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [url, setUrl] = useState('');
    const [saveMenuClass, setSaveMenuClass] = useState('dropdown-menu');
    const [templateUrl, setTemplateUrl] = useState([]);
    const [contractCategories, setContractCategories] = useState([]);
    const [templateTypes, setTemplateTypes] = useState([]);
    const [previewPdf, setPreviewPdf] = useState(null);
    const [selectedContractCategory, setSelectedContractCategory] = useState(null);
    const [selectedTemplateType, setSelectedTemplateType] = useState(null);
    const [templateId, setTemplateId] = useState(0);
    const [totalTextField, setTotalTextField] = useState(0);
    const [totalTitle, setTotalTitle] = useState(0);
    const [loading, setLoading] = useState(false);
    const saveMenuRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");
    let editorObj = DocumentEditorContainerComponent | null;

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
        { value: 1, label: "Contract Annex"}
        // { value: 2, label: "Liquidation Record"}
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

    const fetchCreateTemplate = async () => {
        var formData = new FormData();
        editorObj.documentEditor.saveAsBlob('Docx').then(function (exportedDocument) {
            formData.append('File', exportedDocument);
        });
        let sfdt = { content: editorObj.documentEditor.serialize() };
        const res = await fetch("https://localhost:7073/Templates/add", {
            mode: "cors",
            method: "POST",
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
            const addTemplateRes = await fetch(`https://localhost:7073/TemplateFiles?templateId=${data.id}&templateName=${templateName}`, {
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
                    body: JSON.stringify(sfdt),
                });
                if (exportPdfRes.status === 200) {
                    setLoading(false);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Create Template Successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/template");
                } else {
                    setLoading(false);
                    const exportData = await exportPdfRes.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: exportData.title
                    })
                }
            }
            else {
                setLoading(false);
                const templateFileData = await addTemplateRes.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: templateFileData.title
                })
            }
        } else {
            setLoading(false);
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const fetchCreateDraft = async () => {
        var formData = new FormData();
        editorObj.documentEditor.saveAsBlob('Docx').then(function (exportedDocument) {
            formData.append('File', exportedDocument);
        });
        let sfdt = { content: editorObj.documentEditor.serialize() };
        const res = await fetch("https://localhost:7073/Templates/add", {
            mode: "cors",
            method: "POST",
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
        if (templateName === null) {
            templateName = "";
        }
        if (res.status === 200) {
            const data = await res.json();
            const addTemplateRes = await fetch(`https://localhost:7073/TemplateFiles?templateId=${data.id}&templateName=${templateName}`, {
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
                    body: JSON.stringify(sfdt),
                });
                if (exportPdfRes.status === 200) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Save As Draft Successfully!',
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

    const handleCreateClick = (e) => {
        e.preventDefault();
        let filePath = `files/1.docx`;
        // editorObj.documentEditor.saveAsBlob('Docx').then(function (exportedDocument) {

        //     var formData = new FormData();
        //     formData.append('fileName', 'sample.docx');
        //     formData.append('data', exportedDocument);
        //     const fileRef = ref(filesDb, filePath);
        //     uploadBytes(fileRef, exportedDocument);
        //     setPreviewUrl(URL.createObjectURL(exportedDocument));
        // });
        let url = `https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/files%2F1.docx?alt=media&token=86218259-40cd-4c00-b12b-cd0342fffff4`;
        setUrl(url);
        setLoading(true);
        fetchCreateTemplate();
    }

    const handleSaveAsDraftClick = (e) => {
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
        fetchCreateDraft();
    }

    const handlePreview = () => {
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
                    if (loadedPage === count) {
                        // Exporting the document as pdf
                        setPreviewPdf(pdfdocument);
                    }
                };
            }, 500);
        }
    }

    const handleInsertClick = (name) => {
        editorObj.documentEditor.editor.insertField('MERGEFIELD ' + name + ' \\* MERGEFORMAT');
    }

    useEffect(() => {
        fetchContractCategoryData();
        listAll(ref(filesDb, "files")).then(files => {
            console.log(files);
            files.items.forEach(val => {
                getDownloadURL(val).then(url => {
                    setTemplateUrl(data => [...data, url]);
                })
            })
        })
    }, []);

    return (
        <div>
            <form onSubmit={handleCreateClick}>
                <div className="topbar intro-y">
                    <h2>
                        Add New Template
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
                                        <button className="dropdown-item" type='submit'> <Icon icon="lucide:file-text" className='icon' /> As New Template </button>
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
                            <div className="pos intro-y template">
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
                                                                                {selectedTemplateType && selectedTemplateType.value === 1 && (
                                                                                    <>
                                                                                        <span>For Contract Annex:</span>
                                                                                        <ul>
                                                                                            <li onClick={() => handleInsertClick('Contract Annex Code')}> Contract Annex Code <span style={{color: "red"}}>*</span> </li>
                                                                                            <li onClick={() => handleInsertClick('Created Date')}>Created Date</li>
                                                                                            <li onClick={() => handleInsertClick('Contract Duration')}>New Duration<span style={{color: "red"}}>*</span></li>
                                                                                            <li onClick={() => handleInsertClick('Contract Title')}>Contract Title <span style={{color: "red"}}>*</span></li>
                                                                                            <li onClick={() => handleInsertClick('Contract Code')}>Contract Code <span style={{color: "red"}}>*</span></li>
                                                                                            <li onClick={() => handleInsertClick('Sign Date')}>Sign Date</li>
                                                                                        </ul>
                                                                                    </>
                                                                                )}
                                                                                {selectedTemplateType && selectedTemplateType.value === 0 && (
                                                                                    <>
                                                                                <span>For Contract:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Contract Title')}>Contract Title <span style={{color: "red"}}>*</span></li>
                                                                                    <li onClick={() => handleInsertClick('Contract Code')}>Contract Code <span style={{color: "red"}}>*</span></li>
                                                                                    <li onClick={() => handleInsertClick('Contract Duration')}>Contract Duration <span style={{color: "red"}}>*</span></li>
                                                                                    <li onClick={() => handleInsertClick('Created Date')}>Created Date</li>
                                                                                    <li onClick={() => handleInsertClick('Execution Time')}>Execution Time</li>
                                                                                    <li onClick={() => handleInsertClick('Payment Duration')}>Payment Duration</li>
                                                                                    
                                                                                </ul>
                                                                                </>
                                                                                )}
                                                                                <span>For Company:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Company Name')}>Name</li>
                                                                                    <li onClick={() => handleInsertClick('Company Address')}>Address</li>
                                                                                    <li onClick={() => handleInsertClick('Company Tax Code')}>Tax Code</li>
                                                                                    <li onClick={() => handleInsertClick('Company Email')}>Email</li>
                                                                                    <li onClick={() => handleInsertClick('Company Phone')}>Phone</li>
                                                                                    <li onClick={() => handleInsertClick('Company Hotline')}>Hotline</li>
                                                                                    <li onClick={() => handleInsertClick('Signer Name')}>Signer Name</li>
                                                                                    <li onClick={() => handleInsertClick('Signer Position')}>Signer Position</li>
                                                                                    {/* <li onClick={() => handleInsertClick('Company Signature')}>Signature</li> */}
                                                                                </ul>
                                                                                <span>For Partner:</span>
                                                                                <ul>
                                                                                    <li onClick={() => handleInsertClick('Partner Name')}>Name</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Address')}>Address</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Tax Code')}>Tax Code</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Email')}>Email</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Phone Number')}>Phone</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Signer Name')}>Signer Name</li>
                                                                                    <li onClick={() => handleInsertClick('Partner Signer Position')}>Signer Position</li>
                                                                                    {/* <li onClick={() => handleInsertClick('Partner Signature')}>Signature</li> */}
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
                                                                        <div className="form-group col-md-12 editor">
                                                                            <DocumentEditorContainerComponent ref={(ins => editorObj = ins)}
                                                                                height='1200' enableToolbar={true} toolbarItems={items} readOnly={true} showPropertiesPane={true}
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