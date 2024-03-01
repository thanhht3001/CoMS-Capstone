import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import '../css/_list.css';

function List() {
    const [contracts, setContracts] = useState([]);
    const [searchByName, setSearchByName] = useState('');
    const [contractName, setContractName] = useState('');
    const [contractCode, setContractCode] = useState('');
    const [dropdownMenuClass, setDropdownMenuClass] = useState(
        "inbox-filter__dropdown-menu dropdown-menu"
    );
    const [currentPage, setCurrentPage] = useState(0);
    const [version, setVersion] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const filterRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    const statusOptions = [
        { value: 8, label: "Approving" },
        { value: 3, label: "Approved" },
        { value: 4, label: "Rejected" },
        { value: 1, label: "Completed" },
        // { value: 5, label: "Signed" },
        { value: 6, label: "Finalized" },
        { value: 7, label: "Liquidated" }
    ];

    const openFilter = () => {
        if (
            dropdownMenuClass === "inbox-filter__dropdown-menu dropdown-menu show"
        ) {
            setIsFilterOpen(false);
            setDropdownMenuClass("");
        } else {
            setIsFilterOpen(true);
            setDropdownMenuClass("inbox-filter__dropdown-menu dropdown-menu show");
        }
    };

    const openOptionMenu = (id) => {
        if (document.getElementById("option-menu-" + id).classList.contains('show')) {
            document.getElementById("option-menu-" + id).classList.remove('show');
        } else {
            document.getElementById("option-menu-" + id).classList.add('show');
        }
    }

    const closeFilterMenu = (e) => {
        if (!filterRef?.current?.contains(e.target)) {
            setDropdownMenuClass('inbox-filter__dropdown-menu dropdown-menu');
        }
    }

    document.addEventListener('mousedown', closeFilterMenu);

    const fetchContractData = async () => {
        let url = `https://localhost:7073/Contracts/yours?CurrentPage=1&pageSize=10&IsYours=true`;
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

    const fetchNext = async () => {
        if (!hasNext) {
            return;
        }
        const res = await fetch(`https://localhost:7073/Contracts/yours?CurrentPage=${currentPage + 1}&pageSize=10`, {
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

    const fetchPrevious = async () => {
        if (!hasPrevious) {
            return;
        }
        const res = await fetch(`https://localhost:7073/Contracts/yours?CurrentPage=${currentPage - 1}&pageSize=10`, {
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
                const res = await fetch(`https://localhost:7073/Contracts?id=${id}`, {
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
                        text: "Contract has been deleted.",
                        icon: "success"
                    });
                    fetchContractData();
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

    const handleChooseContract = (id) => {
        navigate("/contract-details", {
            state: {
                contractId: id
            }
        });
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            let url = `https://localhost:7073/Contracts/yours?IsYours=true&CurrentPage=1&PageSize=10&ContractName=${searchByName}`;
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

    const handleEditClick = (id) => {
        navigate("/edit-partner-service", {
            state: {
                contractId: id
            }
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsFilterOpen(false);
        let url = `https://localhost:7073/Contracts/yours?IsYours=true&CurrentPage=1&PageSize=10&ContractName=${contractName}&Code=${contractCode}`;
        if (selectedStatus !== null) {
            url = url + `&Status=${selectedStatus.value}`;
        }
        if (version > 0) {
            url = url + `&Version=${version}`;
        }
        const res = await fetch(url, {
            mode: "cors",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
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
                icon: "error",
                title: "Oops...",
                text: data.title,
            });
        }
    };

    const handleReset = () => {
        setIsFilterOpen(true)
        setContractName("");
        setContractCode("");
        setSelectedStatus(null);
        setVersion(0);
        fetchContractData();
    };

    const handleStatusChange = (data) => {
        setSelectedStatus(data);
    };

    const handleContractNameChange = e => {
        setContractName(e.target.value);
    }

    const handleContractCodeChange = e => {
        setContractCode(e.target.value);
    }

    const handleVersionChange = e => {
        setVersion(e.target.value);
    }

    useEffect(() => {
        fetchContractData();
    }, []);

    return (
        <div className='contract-list'>
            <h2 className="intro-y">
                Contract List
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
                            <Icon icon="lucide:search" className='icon' />
                            <input type="text" className="form-control box" placeholder="Type contract name..." value={searchByName}
                                onChange={handleSearchByNameChange} onKeyDown={handleKeyDown} />
                            <div
                                className="inbox-filter dropdown"
                                data-tw-placement="bottom-start"
                                ref={filterRef}
                            >
                                <Icon
                                    icon="lucide:chevron-down"
                                    onClick={openFilter}
                                    className="icon"
                                />
                                <div className={dropdownMenuClass}>
                                    <div className="dropdown-content">
                                        <form onSubmit={handleSubmit}>
                                            <div>
                                                <div>
                                                    <label
                                                        htmlFor="input-filter-1"
                                                        className="form-label"
                                                    >
                                                        Contract Name
                                                    </label>
                                                    <input
                                                        id="input-filter-1"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Type contract name..."
                                                        value={contractName} onChange={handleContractNameChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="input-filter-2"
                                                        className="form-labe2"
                                                    >
                                                        Contract Code
                                                    </label>
                                                    <input
                                                        id="input-filter-2"
                                                        type="text"
                                                        className="form-contro2"
                                                        placeholder="Type contract code..."
                                                        value={contractCode} onChange={handleContractCodeChange}
                                                    />
                                                </div>
                                                <div>
                                                    {/* <label
                                                        htmlFor="input-filter-4"
                                                        className="form-label"
                                                    >
                                                        Version
                                                    </label>
                                                    <input
                                                        id="input-filter-4"
                                                        type="number"
                                                        className="form-contro2"
                                                        placeholder="Type contract version..." value={version}
                                                        min={0} onChange={handleVersionChange}
                                                    /> */}
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="input-filter-4"
                                                        className="form-label"
                                                    >
                                                        Status
                                                    </label>
                                                    <Select id="input-filter-3" options={statusOptions} className="form-select flex-1"
                                                        value={selectedStatus} onChange={handleStatusChange} />
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-secondary ml-2"
                                                        type="button"
                                                        onClick={handleReset}
                                                    >
                                                        Reset
                                                    </button>
                                                    <button
                                                        className="btn btn-primary ml-2"
                                                        type="submit"
                                                    >
                                                        Search
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
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
                                <tr className="intro-x" id={contract.id}>
                                    <td>
                                        <div>
                                            <div className="w-10 h-10 image-fit zoom-in">
                                                {contract.code}
                                                {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-15.jpg" title="Uploaded at 5 April 2022" /> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {contract.contractName && contract.contractName.length > 25 ? (
                                            <a href="javascript:;" onClick={() => handleChooseContract(contract.id)} title={contract.contractName}>
                                                {contract.contractName.slice(0, 30)}...
                                            </a>
                                        ) : (
                                            <a href="javascript:;" onClick={() => handleChooseContract(contract.id)}>{contract.contractName}</a>
                                        )}
                                        {/* <a onClick={() => handleChooseContract(contract.id)} >
                                            {contract.contractName}
                                            </a> */}
                                        <div>{contract.partnerName && contract.partnerName.length > 25 ? (
                                            <a title={contract.partnerName}>
                                                {contract.partnerName.slice(0, 30)}...
                                            </a>
                                        ) : (
                                            <a>{contract.partnerName}</a>
                                        )}
                                        </div>
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
                                            <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(contract.id)} />
                                            {parseInt(jwtDecode(token).id) === contract?.creatorId ? (
                                                <div id={"option-menu-" + contract.id}>
                                                    <ul className="dropdown-content">
                                                        <li>
                                                            <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseContract(contract.id)}> <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                        </li>
                                                        {(contract.statusString !== "Rejected") ? (
                                                            <></>
                                                        ) : (
                                                            <><li>
                                                                <a href="javascript:;" className="dropdown-item"
                                                                    onClick={() => handleEditClick(contract.id)}> <Icon icon="bx:edit"
                                                                        className="icon" /> Edit </a>
                                                            </li>
                                                                <li>
                                                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleDeleteClick(contract.id)}>
                                                                        <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                                                </li></>
                                                        )}
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
                                            {/* <a class="flex items-center mr-3" href="javascript:;"> <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Edit </a>
                                    <a class="flex items-center text-danger" href="javascript:;" data-tw-toggle="modal" data-tw-target="#delete-confirmation-modal"> <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Delete </a> */}
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