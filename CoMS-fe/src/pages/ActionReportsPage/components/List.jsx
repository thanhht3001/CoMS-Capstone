import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import '../css/_list.css';

function List() {
    const [actionHistories, setActionHistories] = useState([]);
    const [searchByName, setSearchByName] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    const fetchActionHistoryData = async () => {
        let url = `https://localhost:7073/ActionHistories/recent?CurrentPage=1&pageSize=10`;
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
            setActionHistories(data.items);
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

    const fetchNext = async () => {
        if (!hasNext) {
            return;
        }
        const res = await fetch(`https://localhost:7073/ActionHistories/recent?CurrentPage=${currentPage + 1}&pageSize=10`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setActionHistories(data.items);
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
        const res = await fetch(`https://localhost:7073/ActionHistories/recent?CurrentPage=${currentPage - 1}&pageSize=10`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setActionHistories(data.items);
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

    const handleExportClick = async () => {
        let url = `https://localhost:7073/ActionHistories/export`;
        const res = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.blob();
            const outputFilename = `action-reports.xlsx`;
            const url = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', outputFilename);
            document.body.appendChild(link);
            link.click();
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleChooseContract = (id) => {
        navigate("/contract-details", {
            state: {
                contractId: id
            }
        });
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            let url = `https://localhost:7073/Contracts/yours?CurrentPage=1&PageSize=10&ContractName=${searchByName}`;
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
                setActionHistories(data.items);
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

    const handleSearchByNameChange = e => {
        setSearchByName(e.target.value);
    }

    useEffect(() => {
        fetchActionHistoryData();
    }, []);

    return (
        <div className='action-history-list'>
            <h2 className="intro-y">
                Action Reports
            </h2>
            <div>
                <div className="intro-y">
                    {/* <button className="btn btn-primary" onClick={() => navigate("/choose-template")}>Add New</button>
                    <div class="dropdown">
                        <button class="dropdown-toggle btn px-2 box" aria-expanded="false" data-tw-toggle="dropdown">
                            <span class="w-5 h-5 flex items-center justify-center"> <i class="w-4 h-4" data-lucide="plus"></i> </span>
                        </button>
                        <div class="dropdown-menu w-40">
                            <ul class="dropdown-content">
                                <li>
                                    <a href="" class="dropdown-item"> <i data-lucide="printer" class="w-4 h-4 mr-2"></i> Print </a>
                                </li>
                                <li>
                                    <a href="" class="dropdown-item"> <i data-lucide="file-text" class="w-4 h-4 mr-2"></i> Export to Excel </a>
                                </li>
                                <li>
                                    <a href="" class="dropdown-item"> <i data-lucide="file-text" class="w-4 h-4 mr-2"></i> Export to PDF </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="hidden md:block mx-auto text-slate-500">Showing 1 to 10 of 150 entries</div> */}
                    <div>
                        <div>
                            {/* <input type="text" className="form-control box" placeholder="Type contract name..." value={searchByName}
                                onChange={handleSearchByNameChange} onKeyDown={handleKeyDown} />
                            <Icon icon="lucide:search" className='icon' /> */}
                            <button className="btn btn-success" type="button"
                                onClick={handleExportClick}><Icon icon="file-icons:microsoft-excel" className="icon" />Export</button>
                        </div>
                    </div>
                </div>
                <div className="intro-y">
                    <table className="table table-report">
                        <thead>
                            <tr>
                                <th>IMAGE</th>
                                <th>FULL NAME</th>
                                <th>ACTION TYPE</th>
                                <th>CONTRACT CODE</th>
                                <th>CREATED AT</th>
                                {/* <th>ACTIONS</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {actionHistories.map(actionHistory => (
                                <tr className="intro-x" id={actionHistory.id}>
                                    <td>
                                        <div>
                                            <div className="w-10 h-10 image-fit zoom-in">
                                                <img alt="Avatar" class="tooltip rounded-full" src={actionHistory.userImage} />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {actionHistory.fullName}
                                        {/* <div>{contract.partnerName}</div> */}
                                    </td>
                                    <td>{actionHistory.actionTypeString}</td>
                                    <td>
                                        {/* <a href="javascript:;" onClick={() => handleChooseContract(actionHistory.id)} ></a> */}
                                        {actionHistory.contractCode}</td>
                                    <td>
                                        <div className="text-danger">
                                            {/* <i data-lucide="check-square" class="w-4 h-4 mr-2"></i>  */}
                                            {actionHistory.createdAtString} </div>
                                    </td>
                                    {/* <td className="table-report__action">
                                        <div>
                                            <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(contract.id)} />
                                            {parseInt(jwtDecode(token).id) === contract?.creatorId ? (
                                                <div id={"option-menu-" + contract.id}>
                                                    <ul className="dropdown-content">
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseContract(contract.id)}> <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item"
                                                                onClick={() => handleEditClick(contract.id)}> <Icon icon="bx:edit"
                                                                    className="icon" /> Edit </a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleDeleteClick(contract.id)}>
                                                                <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div id={"option-menu-" + contract.id}>
                                                    <ul className="dropdown-content">
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseContract(contract.id)}> <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                            <a class="flex items-center mr-3" href="javascript:;"> <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Edit </a>
                                    <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal"> <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Delete </a>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                            <li class="page-item"> <a class="page-link" href="#">1</a> </li>
                            <li class="page-item active"> <a class="page-link" href="#">2</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">3</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">...</a> </li> */}
                            <li className={"page-item " + (hasNext ? "active" : "disabled")} onClick={fetchNext}>
                                <a className="page-link" href="javascript:;">
                                    <Icon icon="lucide:chevron-right" className='icon' />
                                </a>
                            </li>
                            {/* <li class="page-item">
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
        </div>
    );
}

export default List;