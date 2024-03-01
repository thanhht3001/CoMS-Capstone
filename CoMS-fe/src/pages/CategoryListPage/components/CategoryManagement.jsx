import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import "../css/_category-management.css";
function getStatusText(status) {
    return status === 1 ? 'Active' : status === 2 ? 'Inactive' : 'Unknown';
}
function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [searchByName, setSearchByName] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    const openOptionMenu = (id) => {
        if (document.getElementById("option-menu-" + id).classList.contains('show')) {
            document.getElementById("option-menu-" + id).classList.remove('show');
        } else {
            document.getElementById("option-menu-" + id).classList.add('show');
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
            setCategories(data);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    };
    const handleDeleteClick = async (id) => {
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
                const res = await fetch(`https://localhost:7073/ContractCategories/id?id=${id}`, {
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
                        text: "Contract Category has been deleted.",
                        icon: "success"
                    });
                    fetchContractCategoryData();
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

    useEffect(() => {
        fetchContractCategoryData();
    }, []);

    return (
        <div className="category-list">
            <div className="intro-y">
                <h2>
                    Category Management
                </h2>
                <div class="button-group">
                    <button class="btn box flex items-center text-slate-600 dark:text-slate-300" onClick={() => navigate("/create-category")}>
                        <i data-lucide="file-text" class="hidden sm:block w-4 h-4 mr-2"></i>
                        <Icon icon="lucide:plus" className="icon" />
                        Add New
                    </button>
                    {/* <button class="btn box flex items-center text-slate-600 dark:text-slate-300">
                        <i data-lucide="file-text" class="hidden sm:block w-4 h-4 mr-2"></i>
                        <Icon icon="lucide:filter" className="icon" />
                        Filter
                    </button> */}
                    <div>
                        <Icon icon="lucide:search" className="icon" />
                        <input type="text" className="form-control" placeholder="Search by name" />
                    </div>
                </div>

            </div>
            <div className="intro-y">
                <table className="table-report">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CATEGORY NAME</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories && categories.length > 0 ? (
                            categories.map(ContractCategory => (
                                <tr className="intro-x" key={ContractCategory.id}>
                                    <td>
                                        <div>
                                            <div className="w-10 h-10 image-fit zoom-in">
                                                {ContractCategory.id}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {ContractCategory.categoryName}
                                    </td>
                                    <td>
                                        <div className="text-danger">
                                            {getStatusText(ContractCategory.status)}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {/* <a href="/create-flow"> <Icon icon="lucide:edit" className="icon" /> Edit</a> */}
                                            <a onClick={() => handleDeleteClick(ContractCategory.id)}> <Icon icon="lucide:trash-2" className="icon" /> Delete</a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No contract categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="intro-y">
                <nav>
                    {/*<ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-left" className="icon" /> </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevron-left" className="icon" /> </a>
                        </li>
                        <li className="page-item"> <a className="page-link" href="#">...</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">1</a> </li>
                        <li className="page-item active"> <a className="page-link" href="#">2</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">3</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">...</a> </li>
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevron-right" className="icon" /> </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-right" className="icon" /> </a>
                        </li>
                        </ul>*/}
                </nav>
            </div>
        </div>
    );
}

export default CategoryManagement;