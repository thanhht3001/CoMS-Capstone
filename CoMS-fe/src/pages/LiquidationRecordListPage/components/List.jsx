import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import '../css/_list.css';

function List() {
    const [liquidationRecords, setLiquidationRecords] = useState([]);
    const [searchByName, setSearchByName] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const navigate = useNavigate();
    // const [selectedContract, setSelectedContract] = useState(0);
    const token = localStorage.getItem("Token");

    const openOptionMenu = (id) => {
        if (document.getElementById("option-menu-" + id).classList.contains('show')) {
            document.getElementById("option-menu-" + id).classList.remove('show');
        } else {
            document.getElementById("option-menu-" + id).classList.add('show');
        }
    }

    const fetchLiquidationRecordData = async () => {
        let url = `https://localhost:7073/LiquidationRecords/all?CurrentPage=1&pageSize=20`;
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
            setLiquidationRecords(data.items);
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
        const res = await fetch(`https://localhost:7073/LiquidationRecords/all?CurrentPage=${currentPage + 1}&pageSize=20`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setLiquidationRecords(data.items);
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
        const res = await fetch(`https://localhost:7073/LiquidationRecords/all?CurrentPage=${currentPage - 1}&pageSize=20`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setLiquidationRecords(data.items);
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
                const res = await fetch(`https://localhost:7073/LiquidationRecords/id?id=${id}`, {
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
                        text: "Liquidation record has been deleted.",
                        icon: "success"
                    });
                    fetchLiquidationRecordData();
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

    const handleChooseRecord = (id) => {
        navigate("/liquidation-record-details", {
            state: {
                contractId: id
            }
        });
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            let url = `https://localhost:7073/LiquidationRecords/all?CurrentPage=1&PageSize=20&LiquidationRecordName=${searchByName}`;
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
                setLiquidationRecords(data.items);
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
        //const dummyContracts = [
        //{ id: 1, name: 'Contract 1' },
        //{ id: 2, name: 'Contract 2' },
        //{ id: 3, name: 'Contract 3' },
        //];

        //setLiquidationRecords(dummyContracts);
        fetchLiquidationRecordData();
    }, []);

    return (
        <div className='liquidation-list'>
            <h2 className="intro-y">
                Liquidation Record List
            </h2>
            <div>
                <div className="intro-y">
                    <button className="btn btn-primary" onClick={() => navigate("/choose-template")}>Add New</button>
                    {/* <div class="dropdown">
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
                    </div> */}
                    {/* <div class="hidden md:block mx-auto text-slate-500">Showing 1 to 10 of 150 entries</div> */}
                    <div>
                        <div>
                            <input type="text" className="form-control box" placeholder="Search by name" value={searchByName}
                                onChange={handleSearchByNameChange} onKeyDown={handleKeyDown} />
                            <Icon icon="lucide:search" className='icon' />
                        </div>
                    </div>
                </div>
                <div className="intro-y">
                    <table className="table table-report">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>LIQUIDATION RECORD NAME</th>
                                <th>VERSION</th>
                                <th>CREATED AT</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liquidationRecords && liquidationRecords.length > 0 ? (

                                liquidationRecords.map(liquidation => (
                                    <tr className="intro-x" id={liquidation.id}>
                                        <td>
                                            <div>
                                                <div className="w-10 h-10 image-fit zoom-in">
                                                    {liquidation.id}
                                                    {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-15.jpg" title="Uploaded at 5 April 2022" /> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <a href="javascript:;" onClick={() => handleChooseRecord(liquidation.id)} >{liquidation.liquidationName}</a>
                                        </td>
                                        <td>{liquidation.version}</td>
                                        <td>{liquidation.createdDateString}</td>
                                        <td>
                                            <div className="text-danger">
                                                {/* <i data-lucide="check-square" class="w-4 h-4 mr-2"></i>  */}
                                                {liquidation.statusString} </div>
                                        </td>
                                        <td className="table-report__action">
                                            <div>
                                                <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(liquidation.id)} />
                                                {parseInt(jwtDecode(token).id) === liquidation?.id ? (
                                                    <div id={"option-menu-" + liquidation.id}>
                                                        <ul className="dropdown-content">
                                                            <li>
                                                                <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseRecord(liquidation.id)}> <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                            </li>
                                                            <li>
                                                                <a href="javascript:;" className="dropdown-item"> <Icon icon="bx:edit" className="icon" /> Edit </a>
                                                            </li>
                                                            <li>
                                                                <a href="javascript:;" className="dropdown-item" onClick={() => handleDeleteClick(liquidation.id)}>
                                                                    <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div id={"option-menu-" + liquidation.id}>
                                                        <ul className="dropdown-content">
                                                            <li>
                                                                <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseRecord(liquidation.id)}> <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                                {/* <a class="flex items-center mr-3" href="javascript:;"> <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Edit </a>
                                    <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal"> <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Delete </a> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))

                            ) : (
                                <tr>
                                    <h3>No partners available</h3>
                                </tr>
                            )}
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