import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import "../css/_your-contracts.css";

function YourContracts() {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [contracts, setContracts] = useState([]);
    const [dropdownMenuClass, setDropdownMenuClass] = useState('inbox-filter__dropdown-menu dropdown-menu');
    const [optionMenuClass, setOptionMenuClass] = useState('');
    const [searchByName, setSearchByName] = useState('');
    const [contractName, setContractName] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [selectedContractStatus, setSelectedContractStatus] = useState(null);
    const filterRef = useRef(null);
    const optionMenuRef = useRef(null);
    const token = localStorage.getItem("Token");
    const navigate = useNavigate();


    const fetchContractData = async () => {
        let url = `https://localhost:7073/Contracts/yours?CurrentPage=1&pageSize=5&IsYours=true`;
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
        const res = await fetch(`https://localhost:7073/Contracts/yours?CurrentPage=${currentPage + 1}&pageSize=5&IsYours=true`, {
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
        const res = await fetch(`https://localhost:7073/Contracts/yours?CurrentPage=${currentPage - 1}&pageSize=5&IsYours=true`, {
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

    const openFilter = () => {
        if (dropdownMenuClass === 'inbox-filter__dropdown-menu dropdown-menu show') {
            setDropdownMenuClass('');
        } else {
            setDropdownMenuClass('inbox-filter__dropdown-menu dropdown-menu show');
        }
    }

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

    // const closeOptionMenu = (e) => {
    //     if (!optionMenuRef?.current?.contains(e.target)) {
    //         setOptionMenuClass("");
    //     }
    // }

    const handleSearchByNameChange = e => {
        setSearchByName(e.target.value);
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            let url = `https://localhost:7073/Contracts/yours?CurrentPage=1&PageSize=5&ContractName=${searchByName}&IsYours=true`;
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = `https://localhost:7073/Contracts/yours?CurrentPage=1&PageSize=5&ContractName=${contractName}&IsYours=true`;
        if (selectedContractStatus !== null) {
            url = url + `&Status=${selectedContractStatus}`;
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

    const handleContractStatusChange = (e) => {
        setSelectedContractStatus(e.target.value);
    }

    const handleContractNameChange = (e) => {
        setContractName(e.target.value)
    }

    const handleDateChange = (e) => {
        // let startDate = convertDate(e.startDate);
        // let endDate = convertDate(e.endDate);
        setStartDate(e.startDate);
        setEndDate(e.endDate);
        var date = new Date(e.startDate);
        alert(date);
    };

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

    const handleEditClick = (id) => {
        navigate("/edit-partner-service", {
            state: {
                contractId: id
            }
        });
    }

    document.addEventListener('mousedown', closeFilterMenu);
    // document.addEventListener('mousedown', closeOptionMenu);

    useEffect(() => {
        fetchContractData();
    }, []);

    return (
        <div className="your-contracts">
            <div className="intro-y">
                <h2>
                    Your Contracts
                </h2>
                {/* <div>
                    <div>
                        <Icon icon="lucide:search" className="icon" />
                        <input type="text" className="form-control" placeholder="Search by name" />
                    </div>
                    <button class="btn box flex items-center text-slate-600 dark:text-slate-300"> <i data-lucide="file-text" class="hidden sm:block w-4 h-4 mr-2"></i> Export to Excel </button>
                    <button class="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300"> <i data-lucide="file-text" class="hidden sm:block w-4 h-4 mr-2"></i> Export to PDF </button>
                </div> */}
                <div>
                    <Icon icon="lucide:search" className="icon" />
                    <input type="text" placeholder="Type contract name" value={searchByName} onChange={handleSearchByNameChange}
                        onKeyDown={handleKeyDown} />
                    <div className="inbox-filter dropdown" data-tw-placement="bottom-start" ref={filterRef}>
                        <Icon icon="lucide:chevron-down" onClick={openFilter} className="icon" />
                        {/* <i class="dropdown-toggle w-4 h-4 cursor-pointer text-slate-500" role="button" aria-expanded="false" data-tw-toggle="dropdown" data-lucide="chevron-down"></i> */}
                        <div className={dropdownMenuClass}>
                            <div className="dropdown-content">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div>
                                            <label for="input-filter-1" className="form-label">Contract Name</label>
                                            <input id="input-filter-1" type="text" className="form-control"
                                                placeholder="Type contract name" value={contractName} onChange={handleContractNameChange} />
                                        </div>
                                        {/* <div>
                                        <label for="input-filter-2" className="form-label">Created By</label>
                                        <input id="input-filter-2" type="text" className="form-control" placeholder="example@gmail.com" />
                                    </div> */}
                                        {/* <div>
                                        <label for="input-filter-3" className="form-label">Created At</label>
                                    </div> */}
                                        <div>
                                            <label for="input-filter-4" className="form-label">Status</label>
                                            <select id="input-filter-4" className="form-select" value={selectedContractStatus}
                                                onChange={handleContractStatusChange}>
                                                <option value="1">Completed</option>
                                                <option value="2">Draft</option>
                                                <option value="3">Approved</option>
                                                <option value="4">Rejected</option>
                                                {/* <option value="5">Signed</option> */}
                                                <option value="6">Finalized</option>
                                                <option value="7">Liquidated</option>
                                                <option value="8">Approving</option>
                                            </select>
                                        </div>
                                        <div>
                                            {/* <button class="btn btn-secondary w-32 ml-auto">Create Filter</button> */}
                                            <button className="btn btn-primary ml-2" type="submit">Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="intro-y">
                <table className="table-report">
                    <thead>
                        <tr>
                            <th>CREATOR</th>
                            <th>CONTRACT NAME</th>
                            <th>CREATE DATE</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(contract => (
                            <tr className="intro-x">
                                <td>
                                    <div>
                                        <div className="image-fit zoom-in">
                                            <img alt="Creator Avatar" class="tooltip rounded-full" src={contract.creatorImage} title="Uploaded at 3 June 2020" />
                                        </div>
                                        {/* <div className="image-fit zoom-in">
                                        <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-6.jpg" title="Uploaded at 6 August 2020">
                                    </div>
                                    <div className="image-fit zoom-in">
                                        <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-13.jpg" title="Uploaded at 3 July 2022">
                                    </div> */}
                                    </div>
                                </td>
                                <td>
                                    {contract.contractName && contract.contractName.length > 25 ? (
                              <a onClick={() => handleChooseContract(contract.id)} title={contract.contractName}>
                                {contract.contractName.slice(0, 30)}...
                              </a>
                            ) : (
                              <a onClick={() => handleChooseContract(contract.id)}>{contract.contractName}</a>
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
                                <td>{contract.createdDateString}</td>
                                <td>
                                    <div>{contract.statusString}</div>
                                </td>
                                <td className="table-report__action">
                                    <div>
                                        <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(contract.id)} />
                                        {parseInt(jwtDecode(token).id) !== contract?.creatorId ? (
                                            <div id={"option-menu-" + contract.id}>
                                                <ul className="dropdown-content">
                                                    <li>
                                                        <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseContract(contract.id)}> <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        ) : (
                                            <div id={"option-menu-" + contract.id}>
                                                <ul className="dropdown-content">
                                                    <li>
                                                        <a href="javascript:;" className="dropdown-item" onClick={() => handleChooseContract(contract.id)}> <Icon icon="lucide:eye" className='icon' /> View Details </a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:;" className="dropdown-item"
                                                            onClick={() => handleEditClick(contract.id)}>
                                                            <Icon icon="lucide:check-square" className="icon" /> Edit </a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:;" className="dropdown-item" onClick={() => handleDeleteClick(contract.id)}>
                                                            <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {/* <tr className="intro-x">
                            <td>
                                <div>
                                    <div className="image-fit zoom-in">
                                        <img alt="Creator Avatar" class="tooltip rounded-full" src="https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/281349832_3114845732069443_2942167027652900504_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=zOsWlA8MS6UAX-hJcio&_nc_ht=scontent.fsgn5-6.fna&_nc_e2o=f&oh=00_AfDcA8QzxAVu7f0crqkTF-33hc5doV1vqCCqjTUxdAPBfg&oe=65339CBE" title="Uploaded at 18 October 2022" />
                                    </div>
                                    <div className="image-fit zoom-in">
                                        {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-5.jpg" title="Uploaded at 15 June 2021">
                                    </div>
                                    <div className="image-fit zoom-in">
                                        {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-5.jpg" title="Uploaded at 12 June 2020"> 
                                    </div>
                                </div>
                            </td>
                            <td>
                                <a href="">Hop dong dich vu 2</a>
                                <div>Company B</div>
                            </td>
                            <td>09/04/2023</td>
                            <td>
                                <div> Completed </div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(2)} />
                                    <div id="2">
                                        <ul className="dropdown-content">
                                            <li>
                                                <a href="" className="dropdown-item"> <Icon icon="lucide:check-square" className="icon" /> Edit </a>
                                            </li>
                                            <li>
                                                <a href="" className="dropdown-item"> <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="intro-x">
                            <td>
                                <div>
                                    <div className="image-fit zoom-in">
                                        <img alt="Creator Avatar" class="tooltip rounded-full" src="https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/281349832_3114845732069443_2942167027652900504_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=zOsWlA8MS6UAX-hJcio&_nc_ht=scontent.fsgn5-6.fna&_nc_e2o=f&oh=00_AfDcA8QzxAVu7f0crqkTF-33hc5doV1vqCCqjTUxdAPBfg&oe=65339CBE" title="Uploaded at 5 September 2020" />
                                    </div>
                                    <div className="image-fit zoom-in">
                                        {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-14.jpg" title="Uploaded at 23 August 2021">
                                    </div>
                                    <div className="image-fit zoom-in">
                                        {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-9.jpg" title="Uploaded at 27 July 2020"> 
                                    </div>
                                </div>
                            </td>
                            <td>
                                <a href="">Hop dong dich vu 3</a>
                                <div>Company C</div>
                            </td>
                            <td>10/03/2023</td>
                            <td>
                                <div> Waiting </div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(3)} />
                                    <div id="3">
                                        <ul className="dropdown-content">
                                            <li>
                                                <a href="" className="dropdown-item"> <Icon icon="lucide:check-square" className="icon" /> Edit </a>
                                            </li>
                                            <li>
                                                <a href="" className="dropdown-item"> <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <a href=""> <Icon icon="lucide:check-square" className="icon" /> Edit </a>
                                    <a href=""> <Icon icon="lucide:trash-2" className="icon" /> Delete </a> 
                                </div>
                            </td>
                        </tr>
                        <tr className="intro-x">
                            <td>
                                <div>
                                    <div className="image-fit zoom-in">
                                        <img alt="Creator Avatar" class="tooltip rounded-full" src="https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/281349832_3114845732069443_2942167027652900504_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=zOsWlA8MS6UAX-hJcio&_nc_ht=scontent.fsgn5-6.fna&_nc_e2o=f&oh=00_AfDcA8QzxAVu7f0crqkTF-33hc5doV1vqCCqjTUxdAPBfg&oe=65339CBE" title="Uploaded at 21 May 2020" />
                                    </div>
                                    <div className="image-fit zoom-in">
                                        {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-6.jpg" title="Uploaded at 4 February 2022">
                                    </div>
                                    <div className="image-fit zoom-in">
                                        {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-14.jpg" title="Uploaded at 24 July 2020"> 
                                    </div>
                                </div>
                            </td>
                            <td>
                                <a href="">Hop dong dich vu 4</a>
                                <div>Company D</div>
                            </td>
                            <td>16/04/2023</td>
                            <td>
                                <div> Finalized </div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(4)} />
                                    <div id="4">
                                        <ul className="dropdown-content">
                                            <li>
                                                <a href="" className="dropdown-item"> <Icon icon="lucide:check-square" className="icon" /> Edit </a>
                                            </li>
                                            <li>
                                                <a href="" className="dropdown-item"> <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
            <div className="intro-y">
                <nav>
                    <ul className="pagination">
                        {/* <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-left" className="icon" /> </a>
                        </li> */}
                        <li className={"page-item " + (hasPrevious ? "active" : "disabled")} onClick={fetchPrevious}>
                            <a className="page-link" href="javascript:;"> <Icon icon="lucide:chevron-left" className="icon" /> </a>
                        </li>
                        {/* <li className="page-item"> <a className="page-link" href="#">...</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">1</a> </li>
                        <li className="page-item active"> <a className="page-link" href="#">2</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">3</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">...</a> </li> */}
                        <li className={"page-item " + (hasNext ? "active" : "disabled")} onClick={fetchNext}>
                            <a className="page-link" href="javascript:;"> <Icon icon="lucide:chevron-right" className="icon" /> </a>
                        </li>
                        {/* <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-right" className="icon" /> </a>
                        </li> */}
                    </ul>
                </nav>
                {/* <select className="form-select box">
                    <option>10</option>
                    <option>25</option>
                    <option>35</option>
                    <option>50</option>
                </select> */}
            </div>
        </div >
    );
}

export default YourContracts;