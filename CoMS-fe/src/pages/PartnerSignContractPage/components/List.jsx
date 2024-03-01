import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import '../css/_list.css';

function List() {
    const [contracts, setContracts] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");
    const [searchName, setSearchName] = useState('');
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchContractData = async () => {
        let url = `https://localhost:7073/Contracts/partner?DocumentStatus=1&IsApproved=true&CurrentPage=1&PageSize=10`;
        if (searchName !== "") {
            url = url + `&ContractName=${searchName}`;
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
            setContracts(data.items);
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

    const handleSearchByNameChange = e => {
        setSearchName(e.target.value);
    }

    const handleChooseContract = (id) => {
        navigate("/partner-sign-contract-details", {
            state: {
                contractId: id
            }
        });
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            fetchContractData();
        }
    }

    const fetchNext = async () => {
        if (!hasNext) {
            return;
        }
        const res = await fetch(`https://localhost:7073/Contracts/partner?DocumentStatus=1&IsApproved=true&CurrentPage=${currentPage + 1}&pageSize=10`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            console.log('helonẽt');
            const data = await res.json();
            setContracts(data.items);
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
        const res = await fetch(`https://localhost:7073/Contracts/partner?DocumentStatus=1&IsApproved=true&CurrentPage=${currentPage - 1}&pageSize=10`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            console.log('helo');
            const data = await res.json();
            setContracts(data.items);
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
        fetchContractData();
    }, []);

    return (<div className='sign-contract-list'>
        <h2 className="intro-y">
            Waiting for signature list
        </h2>
        <div>
            <div className="intro-y">
                <div>
                    <div>
                        <input type="text" className="form-control box" placeholder="Search..." value={searchName}
                            onChange={handleSearchByNameChange} onKeyDown={handleKeyDown} />
                        <Icon icon="lucide:search" className='icon' />
                    </div>
                </div>
            </div>
            <div className="intro-y">
                <table className="table table-report">
                    <thead>
                        <tr>
                            <th>CODE</th>
                            <th>CONTRACT NAME</th>
                            {/* <th>VERSION</th> */}
                            <th>CREATED AT</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(contract => (
                            <tr className="intro-x">
                                <td>
                                    <div>
                                        <div className="w-10 h-10 image-fit zoom-in">
                                            {contract.code}
                                            {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-15.jpg" title="Uploaded at 5 April 2022" /> */}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <a onClick={() => handleChooseContract(contract.id)} >{contract.contractName}</a>
                                    <div>{contract.partnerName}</div>
                                </td>
                                {/* <td>{contract.version}</td> */}
                                <td>{contract.createdDateString}</td>
                                <td>
                                    <div className="text-danger">
                                        {/* <i data-lucide="check-square" class="w-4 h-4 mr-2"></i>  */}
                                        {contract.statusString} </div>
                                </td>
                                <td className="table-report__action">
                                    <div>
                                        <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseContract(contract.id)}> View Details </a>
                                        {/* <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(contract.id)} />
                                        <div id={"option-menu-" + contract.id}>
                                            <ul className="dropdown-content">
                                                <li>
                                                    <a href="" className="dropdown-item"> <Icon icon="bx:edit" className="icon" /> View Details </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:;" className="dropdown-item">
                                                        <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                                </li> 
                                            </ul>
                                        </div> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="intro-y">
                <nav>
                    <ul className="pagination">
                        <li className={"page-item " + (hasPrevious ? "active" : "disabled")} onClick={fetchPrevious}>
                            <a className="page-link" >
                                <Icon icon="lucide:chevron-left" className='icon' />
                            </a>
                        </li>
                        <li className={"page-item " + (hasNext ? "active" : "disabled")} onClick={fetchNext}>
                            <a className="page-link" >
                                <Icon icon="lucide:chevron-right" className='icon' />
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            {/* <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
            <nav class="w-full sm:w-auto sm:mr-auto">
                <ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-left"></i> </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevron-left"></i> </a>
                    </li>
                    <li class="page-item"> <a class="page-link" href="#">...</a> </li>
                    <li class="page-item"> <a class="page-link" href="#">1</a> </li>
                    <li class="page-item active"> <a class="page-link" href="#">2</a> </li>
                    <li class="page-item"> <a class="page-link" href="#">3</a> </li>
                    <li class="page-item"> <a class="page-link" href="#">...</a> </li>
                    <li class="page-item">
                        <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevron-right"></i> </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-right"></i> </a>
                    </li>
                </ul>
            </nav>
            <select class="w-20 form-select box mt-3 sm:mt-0">
                <option>10</option>
                <option>25</option>
                <option>35</option>
                <option>50</option>
            </select>
        </div> */}

        </div>
    </div>);
}

export default List;