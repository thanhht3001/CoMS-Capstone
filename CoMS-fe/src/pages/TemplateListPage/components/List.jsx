import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import '../css/style.css';

function List() {
    const [templates, setTemplates] = useState([]);
    const [contractCategories, setContractCategories] = useState([]);
    const [templateTypes, setTemplateTypes] = useState([]);
    const [dropdownMenuClass, setDropdownMenuClass] = useState('inbox-filter__dropdown-menu dropdown-menu');
    const [templateName, setTemplateName] = useState('');
    const [searchByName, setSearchByName] = useState('');
    const [creatorEmail, setCreatorEmail] = useState('');
    const [templateStatus, setTemplateStatus] = useState(3);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [selectedContractCategory, setSelectedContractCategory] = useState(null);
    const [selectedTemplateType, setSelectedTemplateType] = useState(null);
    const navigate = useNavigate();
    const filterRef = useRef(null);
    const optionMenuRef = useRef(null);
    const token = localStorage.getItem("Token");

    const contractCategoryList = contractCategories.map(category => {
        return { label: category.categoryName, value: category.id }
    })

    const templateTypeList = [
        { value: 0, label: "Contract"},
        { value: 1, label: "Contract Annex"},
        // { value: 2, label: "Liquidation Record"}
    ];

    const openFilter = () => {
        if (dropdownMenuClass === 'inbox-filter__dropdown-menu dropdown-menu show') {
            setDropdownMenuClass('inbox-filter__dropdown-menu dropdown-menu');
        } else {
            setDropdownMenuClass('inbox-filter__dropdown-menu dropdown-menu show');
        }
    }

    const openOptionMenu = (id) => {
        if (document.getElementById('option-menu-' + id).classList.contains('show')) {
            document.getElementById('option-menu-' + id).classList.remove('show');
        } else {
            document.getElementById('option-menu-' + id).classList.add('show');
        }
    }

    const closeFilterMenu = (e) => {
        if (!filterRef?.current?.contains(e.target)) {
            setDropdownMenuClass('inbox-filter__dropdown-menu dropdown-menu');
        }
    }

    document.addEventListener('mousedown', closeFilterMenu);

    const fetchTemplateData = async () => {
        setTemplateStatus(2);
        let url = `https://localhost:7073/Templates?currentPage=1&pageSize=12&status=2`;
        const res = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplates(data.items);
            setHasNext(data.has_next);
            setHasPrevious(data.has_previous);
            setCurrentPage(data.current_page);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

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

    const handleTrashClick = async () => {
        setTemplateStatus(0);
        let url = `https://localhost:7073/Templates?currentPage=1&pageSize=12&status=0`;
        const res = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplates(data.items);
            setHasNext(data.has_next);
            setHasPrevious(data.has_previous);
            setCurrentPage(data.current_page);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleDraftClick = async () => {
        setTemplateStatus(1);
        let url = `https://localhost:7073/Templates?currentPage=1&pageSize=10&status=1`;
        const res = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplates(data.items);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleActivatingClick = async () => {
        setTemplateStatus(3);
        let url = `https://localhost:7073/Templates?currentPage=1&pageSize=12&status=3`;
        const res = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplates(data.items);
            setHasNext(data.has_next);
            setHasPrevious(data.has_previous);
            setCurrentPage(data.current_page);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = `https://localhost:7073/Templates?CurrentPage=1&PageSize=12&Status=${templateStatus}&TemplateName=${templateName}&Creator=${creatorEmail}`;
        if (selectedContractCategory !== null) {
            url = url + `&ContractCategoryId=${selectedContractCategory.value}`;
        }
        if (selectedTemplateType !== null) {
            url = url + `&TemplateTypeId=${selectedTemplateType.value}`;
        }
        const res = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplates(data.items);
            setHasNext(data.has_next);
            setHasPrevious(data.has_previous);
            setCurrentPage(data.current_page);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            let url = `https://localhost:7073/Templates?CurrentPage=1&PageSize=12&Status=${templateStatus}&TemplateName=${searchByName}`;
            const res = await fetch(url, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setTemplates(data.items);
                setHasNext(data.has_next);
                setHasPrevious(data.has_previous);
                setCurrentPage(data.current_page);
            } else {
                const data = await res.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.title
                })
            }
        }
    }

    const handleDeleteClick = async (id) => {
        document.getElementById('option-menu-' + id).classList.remove('show');
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:7073/Templates?id=${id}`, {
                    mode: 'cors',
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 200) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Template has been deleted.",
                        icon: "success"
                    });
                    if (templateStatus === 0) {
                        handleTrashClick();
                    }
                    if (templateStatus === 1) {
                        handleDraftClick();
                    }
                    if (templateStatus === 2) {
                        fetchTemplateData();
                    }
                    if (templateStatus === 3) {
                        handleActivatingClick();
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
        });
    }

    const handleActivateClick = async (id) => {
        document.getElementById('option-menu-' + id).classList.remove('show');
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, activate it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:7073/Templates/activate?id=${id}`, {
                    mode: 'cors',
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 200) {
                    Swal.fire({
                        title: "Activated!",
                        text: "Template has been activating!",
                        icon: "success"
                    });
                    if (templateStatus === 0) {
                        handleTrashClick();
                    }
                    if (templateStatus === 1) {
                        handleDraftClick();
                    }
                    if (templateStatus === 2) {
                        fetchTemplateData();
                    }
                    if (templateStatus === 3) {
                        handleActivatingClick();
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
        });
    }

    const handleDeactivateClick = async (id) => {
        document.getElementById('option-menu-' + id).classList.remove('show');
        Swal.fire({
            title: "Are you sure?",
            text: "No template in this category is being activated right now!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, deactivate it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:7073/Templates/deactivate?id=${id}`, {
                    mode: 'cors',
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 200) {
                    Swal.fire({
                        title: "Deactivated!",
                        text: "Template has been deactivated!",
                        icon: "success"
                    });
                    if (templateStatus === 0) {
                        handleTrashClick();
                    }
                    if (templateStatus === 1) {
                        handleDraftClick();
                    }
                    if (templateStatus === 2) {
                        fetchTemplateData();
                    }
                    if (templateStatus === 3) {
                        handleActivatingClick();
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
        });
    }

    const handleSelectContractCategory = (data) => {
        setSelectedContractCategory(data);
    }

    const handleSelectTemplateType = (data) => {
        setSelectedTemplateType(data);
    }

    const handleTemplateNameChange = e => {
        setTemplateName(e.target.value);
    }

    const handleSearchByNameChange = e => {
        setSearchByName(e.target.value);
    }

    const handleCreatorEmailChange = e => {
        setCreatorEmail(e.target.value);
    }

    const handleEditClick = (data) => {
        navigate("/edit-template", {
            state: {
                id: data
            }
        });
    }

    const handleViewDetailsClick = (id) => {
        navigate("/template-details", {
            state: {
                templateId: id
            }
        });
    }

    const handleRestoreClick = async (id) => {
        document.getElementById('option-menu-' + id).classList.remove('show');
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, restore it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(`https://localhost:7073/Templates/restore?id=${id}`, {
                    mode: 'cors',
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 200) {
                    Swal.fire({
                        title: "Deactivated!",
                        text: "Template has been restored!",
                        icon: "success"
                    });
                    if (templateStatus === 0) {
                        handleTrashClick();
                    }
                    if (templateStatus === 1) {
                        handleDraftClick();
                    }
                    if (templateStatus === 2) {
                        fetchTemplateData();
                    }
                    if (templateStatus === 3) {
                        handleActivatingClick();
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
        });
    }

    const fetchNext = async () => {
        if (!hasNext) {
            return;
        }
        const res = await fetch(`https://localhost:7073/Templates?CurrentPage=${currentPage + 1}&pageSize=12&status=${templateStatus}`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplates(data.items);
            setHasNext(data.has_next);
            setHasPrevious(data.has_previous);
            setCurrentPage(data.current_page);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const fetchPrevious = async () => {
        if (!hasPrevious) {
            return;
        }
        const res = await fetch(`https://localhost:7073/Templates?CurrentPage=${currentPage - 1}&pageSize=12&status=${templateStatus}`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setTemplates(data.items);
            setHasNext(data.has_next);
            setHasPrevious(data.has_previous);
            setCurrentPage(data.current_page);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    useEffect(() => {
        handleActivatingClick();
        fetchContractCategoryData();
    }, []);

    return (
        <div className="template-list">
            <div>
                <h2 className="intro-y">
                    Template List
                </h2>
                <div className="intro-y box">
                    <div>
                        <a href='javascript:;' className={"" + (templateStatus === 3 ? "active" : "")}
                            onClick={handleActivatingClick}><Icon icon="fluent-mdl2:activate-orders" className='icon' /> Activating </a>
                        <a href="javascript:;" className={"" + (templateStatus === 2 ? "active" : "")}
                            onClick={fetchTemplateData}><Icon icon="ant-design:file-done-outlined" className='icon' />
                            Templates  </a>
                        {/* <a href='javascript:;' className={"" + (templateStatus === 1 ? "active" : "")}
                            onClick={handleDraftClick}><Icon icon="lucide:file" className='icon' /> Draft </a> */}
                        {/* <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md"> <i class="w-4 h-4 mr-2" data-lucide="video"></i> Videos </a>
                        <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md"> <i class="w-4 h-4 mr-2" data-lucide="file"></i> Documents </a>
                        <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md"> <i class="w-4 h-4 mr-2" data-lucide="users"></i> Shared </a> */}
                        <a href="javascript:;" className={"" + (templateStatus === 0 ? "active" : "")}
                            onClick={handleTrashClick}> <Icon icon="lucide:trash" className='icon' /> Trash </a>
                    </div>
                    {/* <div class="border-t border-slate-200 dark:border-darkmode-400 mt-4 pt-4">
                        <a href="" class="flex items-center px-3 py-2 rounded-md">
                            <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
                            Custom Work
                        </a>
                        <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md">
                            <div class="w-2 h-2 bg-success rounded-full mr-3"></div>
                            Important Meetings
                        </a>
                        <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md">
                            <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
                            Work
                        </a>
                        <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md">
                            <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
                            Design
                        </a>
                        <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md">
                            <div class="w-2 h-2 bg-danger rounded-full mr-3"></div>
                            Next Week
                        </a>
                        <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md"> <i class="w-4 h-4 mr-2" data-lucide="plus"></i> Add New Label </a>
                    </div> */}
                </div>
            </div>
            <div>
                <div className="intro-y">
                    <div>
                        <Icon icon="lucide:search" className='icon' />
                        <input type="text" className="form-control box" placeholder="Search templates" value={searchByName}
                            onChange={handleSearchByNameChange} onKeyDown={handleKeyDown} />
                        <form onSubmit={handleSubmit}>
                            <div className="inbox-filter dropdown" data-tw-placement="bottom-start" ref={filterRef}>
                                <Icon icon="lucide:chevron-down" className='icon dropdown-toggle' onClick={openFilter} />
                                <div className={dropdownMenuClass}>
                                    <div className="dropdown-content">
                                        <div>
                                            <div>
                                                <label for="input-filter-1" className="form-label">Template Name</label>
                                                <input id="input-filter-1" type="text" className="form-control"
                                                    placeholder="Type template name..." value={templateName}
                                                    onChange={handleTemplateNameChange} />
                                            </div>
                                            <div>
                                                <label for="input-filter-2" className="form-label">Creator</label>
                                                <input id="input-filter-2" type="text" className="form-control"
                                                    placeholder="example@gmail.com" value={creatorEmail}
                                                    onChange={handleCreatorEmailChange} />
                                            </div>
                                            <div>
                                                <label for="input-filter-3" className="form-label">Category</label>
                                                <Select id="input-filter-3" options={contractCategoryList} className="form-select flex-1"
                                                    value={selectedContractCategory} onChange={handleSelectContractCategory} />
                                            </div>
                                            <div>
                                                <label for="input-filter-4" className="form-label">Type</label>
                                                <Select id="input-filter-4" options={templateTypeList} className="form-select flex-1"
                                                    value={selectedTemplateType} onChange={handleSelectTemplateType} />
                                            </div>
                                            <div>
                                                {/* <button className="btn btn-secondary w-32 ml-auto">Create Filter</button> */}
                                                <button className="btn btn-primary ml-2" type="submit">Search</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div>
                        {/* <button className="btn btn-primary">Upload</button> */}
                        <div className="dropdown">
                            <button className="dropdown-toggle btn box" aria-expanded="false" data-tw-toggle="dropdown"
                                onClick={() => navigate("/create-template")}>
                                <span> <Icon icon="lucide:plus" className='icon' /> </span>
                            </button>
                            {/* <div class="dropdown-menu w-40">
                                <ul class="dropdown-content">
                                    <li>
                                        <a href="" class="dropdown-item"> <i data-lucide="file" class="w-4 h-4 mr-2"></i> Share Files </a>
                                    </li>
                                    <li>
                                        <a href="" class="dropdown-item"> <i data-lucide="settings" class="w-4 h-4 mr-2"></i> Settings </a>
                                    </li>
                                </ul>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="intro-y">
                    {templates.map(template => (
                        <div id={template.id} className="intro-y">
                            <div className="file box zoom-in" >
                                <div>
                                    {/* <input className="form-check-input" type="checkbox" /> */}
                                </div>
                                <a onClick={() => handleViewDetailsClick(template.id)} className="file__icon file__icon--file">
                                    <div className="file__icon__file-name"></div>
                                </a>
                                {template.templateName === '' ? (
                                    <a onClick={() => handleViewDetailsClick(template.id)}>Untitled</a>
                                ) : (
                                    <a onClick={() => handleViewDetailsClick(template.id)}>{template.templateName}</a>
                                )}
                                <div>Creator: {template.email}</div>
                                <div>Category: {template.contractCategoryName}</div>
                                <div>Type: {template.templateTypeString}</div>
                                <div className="dropdown">
                                    <a className="dropdown-toggle" href="javascript:;" aria-expanded="false"
                                        data-tw-toggle="dropdown" onClick={() => openOptionMenu(template.id)}>
                                        <Icon icon="lucide:more-vertical" className='icon' /></a>
                                    {templateStatus === 3 ? (
                                        <div id={"option-menu-" + template.id} className="dropdown-menu">
                                            <ul className="dropdown-content">
                                                <li>
                                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleDeactivateClick(template.id)}>
                                                        <Icon icon="mdi:toggle-switch-off" className='icon' /> Deactivate </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleViewDetailsClick(template.id)}>
                                                        <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <>
                                            {(templateStatus === 2 && parseInt(jwtDecode(token).id) === template.userId) ? (
                                                <div id={"option-menu-" + template.id} className="dropdown-menu">
                                                    <ul className="dropdown-content">
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleViewDetailsClick(template.id)}>
                                                                <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleActivateClick(template.id)}>
                                                                <Icon icon="ion:switch" className='icon' /> Activate </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleEditClick(template.id)}>
                                                                <Icon icon="lucide:edit" className='icon' /> Edit </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleDeleteClick(template.id)}>
                                                                <Icon icon="lucide:trash" className='icon' /> Delete </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <>
                                                    {templateStatus === 2 ? (
                                                        <div id={"option-menu-" + template.id} className="dropdown-menu">
                                                            <ul className="dropdown-content">
                                                                <li>
                                                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleViewDetailsClick(template.id)}>
                                                                        <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                                </li>
                                                                <li>
                                                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleActivateClick(template.id)}>
                                                                        <Icon icon="ion:switch" className='icon' /> Activate </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <div id={"option-menu-" + template.id} className="dropdown-menu">
                                                            <ul className="dropdown-content">
                                                                <li>
                                                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleRestoreClick(template.id)}>
                                                                        <Icon icon="lucide:archive-restore" className='icon' /> Restore </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="intro-y">
                    <nav>
                        <ul className="pagination">
                            {/* <li className="page-item">
                                <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-left"></i> </a>
                            </li> */}
                            <li className={"page-item " + (hasPrevious ? "active" : "disabled")} onClick={fetchPrevious}>
                                <a className="page-link" href="javascript:;">
                                    <Icon icon="lucide:chevron-left" className='icon' />
                                </a>
                            </li>
                            {/* <li className="page-item"> <a class="page-link" href="#">...</a> </li>
                            <li className="page-item"> <a class="page-link" href="#">1</a> </li>
                            <li className="page-item active"> <a class="page-link" href="#">2</a> </li>
                            <li className="page-item"> <a class="page-link" href="#">3</a> </li>
                            <li className="page-item"> <a class="page-link" href="#">...</a> </li> */}
                            <li className={"page-item " + (hasNext ? "active" : "disabled")} onClick={fetchNext}>
                                <a className="page-link" href="javascript:;">
                                    <Icon icon="lucide:chevron-right" className='icon' />
                                </a>
                            </li>
                            {/* <li className="page-item">
                                <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-right"></i> </a>
                            </li> */}
                        </ul>
                    </nav>
                    {/* <select class="w-20 form-select box mt-3 sm:mt-0">
                        <option>10</option>
                        <option>25</option>
                        <option>35</option>
                        <option>50</option>
                    </select> */}
                </div>
            </div>
        </div >
    )
}

export default List;