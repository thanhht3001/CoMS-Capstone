import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import { $ } from 'react-jquery-plugin';
import { Icon } from '@iconify/react';
import {
    BsFillEyeFill,
    BsFillEyeSlashFill,
} from "react-icons/bs";
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { filesDb } from "../components/Firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import '../assets/css/_top-bar.css';

function Header() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState({});
    const [formInputs, setFormInputs] = useState({
        image: "",
        fullName: "",
        position: "",
        email: "",
        password: "",
        phone: "",
        username: "",
        dob: "",
        roleId: 0,
    });
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const [notificationClass, setNotificationClass] = useState('notification-content dropdown-menu');
    const [profileClass, setProfileClass] = useState('dropdown-menu');
    const [image, setImage] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const navigate = useNavigate();
    let notificationRef = useRef(null);
    let profileRef = useRef(null);
    const token = localStorage.getItem("Token");

    let headers = new Headers();
    let url = "https://localhost:7073/Users/current-user";
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    const openSearch = () => {
        $(".top-bar, .top-bar-boxed")
            .find(".search")
            .find("input")
            .each(function () {
                $(this).on("focus", function () {
                    $(".top-bar, .top-bar-boxed")
                        .find(".search-result")
                        .addClass("show");
                });

                $(this).on("focusout", function () {
                    $(".top-bar, .top-bar-boxed")
                        .find(".search-result")
                        .removeClass("show");
                });
            });
    }

    const openNotification = () => {
        if (notificationClass == 'notification-content dropdown-menu') {
            setNotificationClass('notification-content dropdown-menu show');
        } else {
            setNotificationClass('notification-content dropdown-menu');
        }
    }

    const openProfile = () => {
        if (profileClass == 'dropdown-menu') {
            setProfileClass('dropdown-menu show');
        } else {
            setProfileClass('dropdown-menu');
        }
    }

    const closeNotificationMenu = (e) => {
        if (!notificationRef?.current?.contains(e.target)) {
            setNotificationClass('notification-content dropdown-menu');
        }
    }

    const closeProfileMenu = (e) => {
        if (!profileRef?.current?.contains(e.target)) {
            setProfileClass('dropdown-menu');
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate() + 1).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const fetchUserData = async () => {
        if (jwtDecode(token).role === 'Partner') {
            url = "https://localhost:7073/Partners/current-partner"
        }
        const res = await fetch(url, { mode: 'cors', method: 'GET', headers: headers });
        if (res.status === 200) {
            const data = await res.json();
            setCurrentUser(data);
            setFormInputs({ ...formInputs, ["image"]: data.image });
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const fetchNotifications = async () => {
        if (jwtDecode(token).role === 'Manager') {
            const res = await fetch(`https://localhost:7073/UserFlowDetails/notifications?CurrentPage=1&PageSize=5`,
                {
                    mode: 'cors', method: 'GET', headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            if (res.status === 200) {
                const data = await res.json();
                console.log("Noti", data);
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Sale Manager') {
            const res = await fetch(`https://localhost:7073/Templates/notifications?CurrentPage=1&PageSize=5`,
                {
                    mode: 'cors', method: 'GET', headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Staff') {
            const res = await fetch(`https://localhost:7073/PartnerReviews/notifications?CurrentPage=1&PageSize=5`,
                {
                    mode: 'cors', method: 'GET', headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Partner') {
            const res = await fetch(`https://localhost:7073/PartnerReviews/partner-notifications?CurrentPage=1&PageSize=5`,
                {
                    mode: 'cors', method: 'GET', headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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

    const fetchNext = async () => {
        if (!hasNext) {
            return;
        }
        if (jwtDecode(token).role === 'Manager') {
            const res = await fetch(`https://localhost:7073/UserFlowDetails/notifications?CurrentPage=${currentPage + 1}&pageSize=5`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Sale Manager') {
            const res = await fetch(`https://localhost:7073/Templates/notifications?CurrentPage=${currentPage + 1}&pageSize=5`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Staff') {
            const res = await fetch(`https://localhost:7073/PartnerReviews/notifications?CurrentPage=${currentPage + 1}&pageSize=5`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Partner') {
            const res = await fetch(`https://localhost:7073/PartnerReviews/partner-notifications?CurrentPage=${currentPage + 1}&pageSize=5`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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

    const fetchPrevious = async () => {
        if (!hasPrevious) {
            return;
        }
        if (jwtDecode(token).role === 'Manager') {
            const res = await fetch(`https://localhost:7073/UserFlowDetails/notifications?CurrentPage=${currentPage - 1}&pageSize=5`, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Sale Manager') {
            const res = await fetch(`https://localhost:7073/Templates/notifications?CurrentPage=${currentPage - 1}&PageSize=5`,
                {
                    mode: 'cors', method: 'GET', headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Staff') {
            const res = await fetch(`https://localhost:7073/PartnerReviews/notifications?CurrentPage=${currentPage - 1}&PageSize=5`,
                {
                    mode: 'cors', method: 'GET', headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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
        if (jwtDecode(token).role === 'Partner') {
            const res = await fetch(`https://localhost:7073/PartnerReviews/partner-notifications?CurrentPage=${currentPage - 1}&PageSize=5`,
                {
                    mode: 'cors', method: 'GET', headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            if (res.status === 200) {
                const data = await res.json();
                setNotifications(data.items);
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

    const fetchScheduleData = async () => {
        if (jwtDecode(token).role === 'Staff' || jwtDecode(token).role === 'Manager') {
            url = "https://localhost:7073/Schedules";
            const res = await fetch(url, { mode: 'cors', method: 'GET', headers: headers });
            if (res.status === 200) {
                const data = await res.json();
                setSchedule(data);
            }
        }
    }

    const handleChooseContract = (id) => {
        if (location.pathname === "/contract-details" && location.state?.contractId === id) {
            // If we're already on the contract-details page for the same ID, reload the page
            window.location.reload();
        } else {
            navigate("/contract-details", {
                state: {
                    contractId: id
                }
            });
        }
    }

    const handleChooseContractAnnex = (id) => {
        if (location.pathname === "/contractannex-details" && location.state?.contractAnnexId === id) {
            // If we're already on the contractannex-details page for the same ID, reload the page
            window.location.reload();
        } else {
            navigate("/contractannex-details", {
                state: {
                    contractAnnexId: id
                }
            });
        }
    }

    const handleProfileClick = () => {
        setProfileClass('dropdown-menu');
        setShowPopup(true);
    }

    const handleCloseClick = () => {
        setShowPopup(false);
    }

    const handleEditClick = (e) => {
        setIsEditing(true);
    }

    const handleCancelClick = () => {
        let timer = setTimeout(function () {
        }, 5000);
        setIsEditing(false);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const phoneRegex = /^(09|03|07|08|05)+([0-9]{7,8})\b$/;
        if (name === "phone") {
            if (!value) {
                setError({ ...error, phone: "Phone number is required!" });
            } else if (
                !phoneRegex.test(value) ||
                value.length > 11 ||
                value.length < 10
            ) {
                setError({ ...error, phone: "Invalid Vietnamese phone number!" });
            } else {
                setError({ ...error, phone: "" });
            }
        }
        setFormInputs({ ...formInputs, [name]: value });
    };

    const handleUploadClick = async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.hidden = true;
        fileInput.addEventListener("change", (e) => {
            setImage(e.target.files[0]);
            setImageUpload(e.target.files[0]);
            setFormInputs({ ...formInputs, ["image"]: `https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/users%2F${e.target.files[0].name}?alt=media` });
        });
        fileInput.click();
    };

    const handleUpload = async () => {
        setIsUploading(true);
        let storageRef = ref(filesDb, `users/${imageUpload.name}`);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const uploadTask = uploadBytesResumable(storageRef, imageUpload);
            let url;
            uploadTask.on(
                "state_changed",
                async (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Upload fails.",
                    });
                },
                async () => {
                    setIsUploading(false);
                }
            );
        };
        reader.readAsDataURL(imageUpload);
    };

    const handleFormSubmit = async (event) => {
        setIsSaving(true);
        event.preventDefault();
        const errors = {};
        for (const key in formInputs) {
            if (formInputs[key] === null || formInputs[key] === "") {
                errors[key] = `${key} is required.`;
            }
            if (key === "phone" && error.phone) {
                errors[key] = "Invalid phone number!";
            }
        }
        if (Object.keys(errors).length > 0) {
            setIsSaving(false);
            setError(errors);
            return;
        }
        if (imageUpload !== null) {
            handleUpload();
        }
        console.log(formInputs);
        const res = await fetch(`https://localhost:7073/Users?id=${currentUser?.id}`, {
            mode: "cors",
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formInputs),
        });
        if (res.status === 200) {
            Swal.fire({
                title: "Successfully!",
                text: "User information has been updated.",
                icon: "success",
            });
            const data = await res.json();
            setIsSaving(false);
            fetchUserData();
            setIsEditing(false);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.title,
            });
            setIsSaving(false);
        }
    };

    const handleChooseTemplateClick = (id) => {
        if (location.pathname === "/template-details" && location.state?.templateId === id) {
            // If we're already on the template-details page for the same ID, reload the page
            window.location.reload();
        } else {
            navigate("/template-details", {
                state: {
                    templateId: id
                }
            });
        }
    }

    const handleDismissClick = async (id) => {
        const res = await fetch(`https://localhost:7073/Schedules/dismiss?id=${id}`, {
            mode: "cors",
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (res.status === 200) {
            setSchedule(null);
            fetchScheduleData();
        } else {
            const data = await res.json();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.title,
            });
        }
    }

    const handlePartnerChooseContract = (id) => {
        if (location.pathname === "/partner-approve-contract-details" && location.state?.contractId === id) {
            // If we're already on the contract-details page for the same ID, reload the page
            window.location.reload();
        } else {
            navigate("/partner-approve-contract-details", {
                state: {
                    contractId: id
                }
            });
        }
    }

    const authen = () => {
        if (token === null) {
            navigate('/');
        }
    }

    document.addEventListener('mousedown', closeNotificationMenu);
    document.addEventListener('mousedown', closeProfileMenu);

    useEffect(() => {
        authen();
        openSearch();
        fetchUserData();
        fetchNotifications();
        fetchScheduleData();
    }, [])

    useEffect(() => {
        if (currentUser && isEditing) {
            setError({});
            setFormInputs({
                image: currentUser.image || "",
                fullName: currentUser.fullName || "",
                position: currentUser.position || "",
                email: currentUser.email || "",
                password: currentUser.password || "",
                phone: currentUser.phone || "",
                username: currentUser.username || "",
                dob: currentUser.dob || "",
                roleId: currentUser.roleId || "",
            });
        }
    }, [currentUser, isEditing]);

    return (
        <header className='header'>
            <div className="top-bar">
                <nav aria-label="breadcrumb" className="breadcrumb-bar">
                    <ol className="breadcrumb">
                        {/* <li className="breadcrumb-item"><a href="#">{location.pathname.split("/")}</a></li> */}
                        {schedule !== null ? (
                            <li className="breadcrumb-item active" aria-current="page">Hello {currentUser?.fullName},
                                &nbsp;{schedule?.description}&nbsp;Remaining time is {schedule.remainTime}!&nbsp;
                                <a href="javascript:;" onClick={() => handleDismissClick(schedule?.id)}>Dismiss</a></li>
                        ) : (
                            <></>
                        )}
                    </ol>
                </nav>
                {/* <div className="search-notification">
                    <div className="search">
                        <input type="text" className="search__input form-control" placeholder="Search..." />
                        <Icon icon="lucide:search" className='search__icon' />
                    </div>
                    <a className="notification" href=""> <i data-lucide="search" className="notification__icon"></i> </a>
                    <div className="search-result">
                        <div className="search-result__content">
                            <div className="search-result__content__title">Pages</div>
                            <div className="search-result__item">
                                <a href="">
                                    <div className="bg-success/20 dark:bg-success/10"><Icon icon="lucide:inbox" width={16} height={16} /> </div>
                                    <div>Mail Settings</div>
                                </a>
                                <a href="">
                                    <div className="bg-pending/10 text-pending"><Icon icon="lucide:users" width={16} height={16} /></div>
                                    <div>Users & Permissions</div>
                                </a>
                                <a href="">
                                    <div className="bg-primary/10 dark:bg-primary/20 text-primary/80"><Icon icon="uil:credit-card" width={16} height={16} /> </div>
                                    <div>Transactions Report</div>
                                </a>
                            </div>
                            <div className="search-result__content__title">Users</div>
                            <div className="search-result__item">
                                <a href="">
                                    <div className="image-fit">
                                        {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/profile-7.jpg"> 
                                    </div>
                                    <div class="ml-3">Kevin Spacey</div>
                                    <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">kevinspacey@left4code.com</div>
                                </a>
                                <a href="">
                                    <div className="image-fit">
                                        {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/profile-2.jpg"> 
                                    </div>
                                    <div class="ml-3">Johnny Depp</div>
                                    <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">johnnydepp@left4code.com</div>
                                </a>
                                <a href="">
                                    <div className="image-fit">
                                        {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/profile-5.jpg"> 
                                    </div>
                                    <div class="ml-3">Johnny Depp</div>
                                    <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">johnnydepp@left4code.com</div>
                                </a>
                                <a href="">
                                    <div className="image-fit">
                                        {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/profile-9.jpg"> 
                                    </div>
                                    <div class="ml-3">Morgan Freeman</div>
                                    <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">morganfreeman@left4code.com</div>
                                </a>
                            </div>
                            <div class="search-result__content__title">Products</div>
                            <a href="" class="flex items-center mt-2">
                                <div class="w-8 h-8 image-fit">
                                    {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/preview-9.jpg"> 
                                </div>
                                <div class="ml-3">Oppo Find X2 Pro</div>
                                <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">Smartphone &amp; Tablet</div>
                            </a>
                            <a href="" class="flex items-center mt-2">
                                <div class="w-8 h-8 image-fit">
                                    {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/preview-1.jpg"> 
                                </div>
                                <div class="ml-3">Nikon Z6</div>
                                <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">Photography</div>
                            </a>
                            <a href="" class="flex items-center mt-2">
                                <div class="w-8 h-8 image-fit">
                                    {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/preview-2.jpg"> 
                                </div>
                                <div class="ml-3">Sony Master Series A9G</div>
                                <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">Electronic</div>
                            </a>
                            <a href="" class="flex items-center mt-2">
                                <div class="w-8 h-8 image-fit">
                                    {/* <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/preview-8.jpg"> 
                                </div>
                                <div class="ml-3">Dell XPS 13</div>
                                <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">PC &amp; Laptop</div>
                            </a>
                        </div>
                    </div>
                </div> */}
                <div className="intro-x dropdown notification-part" ref={notificationRef}>
                    <div className="dropdown-toggle notification" onClick={openNotification} role="button" aria-expanded="false" data-tw-toggle="dropdown">
                        <Icon icon="lucide:bell" width={20} height={20} className="notification__icon dark:text-slate-500" />
                        {notifications.length > 0 ? (
                            <div className='notification--bullet'></div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className={notificationClass}>
                        <div className="notification-content__box dropdown-content">
                            <div className="notification-content__title">Notifications</div>
                            {notifications.length > 0 ? (
                                <>
                                    {notifications.map(item => (
                                        <>
                                            {jwtDecode(token).role === 'Manager' ? (
                                                <div id={item.contractId || item.contractAnnexId}
                                                    className="notification-item-first"
                                                    onClick={() => {
                                                        if (item.contractId) {
                                                            handleChooseContract(item.contractId);
                                                        } else if (item.contractAnnexId) {
                                                            handleChooseContractAnnex(item.contractAnnexId);
                                                        }
                                                    }}>
                                                    <div>
                                                        {item?.type === "Approve" ? (
                                                            <img alt="Notification Bell" class="rounded-full" src="https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/images%2Fnotification-bell.png?alt=media&token=a8aced5c-20e4-46f5-a952-8d195fae60da" />
                                                        ) : (
                                                            <img alt="Partner Review" class="rounded-full" src="https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/images%2Fpartner.jpg?alt=media&token=ad5929ac-bfa3-4c50-ad5d-203426d8d974" />
                                                        )}
                                                        <div className="dark:border-darkmode-600"></div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <a href="javascript:;">{item?.title}</a>
                                                            <div>{item?.long}</div>
                                                        </div>
                                                        <div>{item?.message}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {jwtDecode(token).role === 'Sale Manager' ? (
                                                        <div id={item?.templateId} className="notification-item-first" onClick={() => handleChooseTemplateClick(item?.templateId)}>
                                                            <div>
                                                                <img alt="Notification Bell" class="rounded-full" src="https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/images%2Fnotification-bell.png?alt=media&token=a8aced5c-20e4-46f5-a952-8d195fae60da" />
                                                                <div className="dark:border-darkmode-600"></div>
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    <a href="javascript:;">{item?.title}</a>
                                                                    <div>{item?.long}</div>
                                                                </div>
                                                                <div>{item?.message}</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {jwtDecode(token).role === 'Staff' ? (
                                                                <div id={item?.contractId} className="notification-item-first" onClick={() => handleChooseContract(item?.contractId)}>
                                                                    <div>
                                                                        <img alt="Notification Bell" class="rounded-full" src="https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/images%2Fnotification-bell.png?alt=media&token=a8aced5c-20e4-46f5-a952-8d195fae60da" />
                                                                        <div className="dark:border-darkmode-600"></div>
                                                                    </div>
                                                                    <div>
                                                                        <div>
                                                                            <a href="javascript:;">{item?.title}</a>
                                                                            <div>{item?.long}</div>
                                                                        </div>
                                                                        <div>{item?.message}</div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div id={item?.contractId} className="notification-item-first" onClick={() => handlePartnerChooseContract(item?.contractId)}>
                                                                    <div>
                                                                        <img alt="Notification Bell" class="rounded-full" src="https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/images%2Fnotification-bell.png?alt=media&token=a8aced5c-20e4-46f5-a952-8d195fae60da" />
                                                                        <div className="dark:border-darkmode-600"></div>
                                                                    </div>
                                                                    <div>
                                                                        <div>
                                                                            <a href="javascript:;">{item?.title}</a>
                                                                            <div>{item?.long}</div>
                                                                        </div>
                                                                        <div>{item?.message}</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    ))}
                                    <div className="intro-y paging">
                                        <nav>
                                            <ul className="pagination">
                                                <li className={"page-item " + (hasPrevious ? "active" : "disabled")} onClick={fetchPrevious}>
                                                    <a className="page-link" href="javascript:;"> <Icon icon="lucide:chevron-left" className="icon" /> </a>
                                                </li>
                                                <li className={"page-item " + (hasNext ? "active" : "disabled")} onClick={fetchNext}>
                                                    <a className="page-link" href="javascript:;"> <Icon icon="lucide:chevron-right" className="icon" /> </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div></>
                            ) : (
                                <div>
                                    No notifications
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="intro-x dropdown profile-part" ref={profileRef}>
                    <div className="dropdown-toggle image-fit zoom-in" onClick={openProfile} role="button" aria-expanded="false" data-tw-toggle="dropdown">
                        <img alt="Avatar" src={currentUser?.image} />
                    </div>
                    <div className={profileClass}>
                        <ul className="dropdown-content">
                            <li>
                                {jwtDecode(token).role === 'Partner' ? (
                                    <>
                                        <div>{currentUser?.representative}</div>
                                        <div className=" dark:text-slate-500">{currentUser?.companyName}</div>
                                    </>
                                ) : (
                                    <>
                                        <div>{currentUser?.fullName}</div>
                                        <div className=" dark:text-slate-500">{currentUser?.role}</div>
                                    </>
                                )}
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {jwtDecode(token).role !== 'Partner' ? (
                                <li>
                                    <a href="javascript:;" class="dropdown-item" onClick={handleProfileClick}>
                                        <Icon icon="lucide:user" width={16} height={16} /> Profile </a>
                                </li>
                            ) : (
                                <></>
                            )}
                            {/* <li>
                                <a href="" class="dropdown-item"> <Icon icon="lucide:edit" width={16} height={16} /> Add Account </a>
                            </li>
                            <li>
                                <a href="" class="dropdown-item"> <Icon icon="lucide:lock" width={16} height={16} /> Reset Password </a>
                            </li>
                            <li>
                                <a href="" class="dropdown-item"> <Icon icon="lucide:help-circle" width={16} height={16} /> Help </a>
                            </li> */}
                            {/* <li>
                                <hr className="dropdown-divider" />
                            </li> */}
                            <li>
                                <a href="/" class="dropdown-item"> <Icon icon="lucide:toggle-right" width={16} height={16} /> Logout </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='profile-popup' style={{ display: showPopup ? "block" : "none" }}>
                <div className="profile-details">
                    <form id='edit-form'>
                        <h2>User Profile</h2>
                        <div>
                            <div>
                                <div>
                                    <img alt="avatar" src={formInputs.image} />
                                    <div title="Remove this profile photo?">
                                        {" "}
                                        <i data-lucide="x"></i>{" "}
                                    </div>
                                </div>
                                {isEditing ? (
                                    <div>
                                        <button
                                            onClick={handleUploadClick}
                                            disabled={isUploading}
                                            className="btn btn-primary"
                                            type="button"
                                            style={
                                                isUploading
                                                    ? { backgroundColor: "gray", borderColor: "gray" }
                                                    : {}
                                            }
                                        >
                                            Change Photo
                                        </button>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <label htmlFor="update-profile-form-1">Full Name {isEditing ? (
                                                <span style={{ color: "red" }}>*</span>
                                            ) : (<></>)}</label>
                                            {isEditing ? (
                                                <>
                                                    <input className='editing'
                                                        type="text"
                                                        name="fullName"
                                                        placeholder="Input full name..."
                                                        value={formInputs.fullName}
                                                        onChange={handleInputChange} maxLength={150} required
                                                    />
                                                    {error.fullName && <p style={{ color: "red" }}>* is required</p>}
                                                </>
                                            ) : (
                                                <p>{currentUser?.fullName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="update-profile-form-2">
                                                Position
                                            </label>
                                            {isEditing ? (
                                                <input className='editing'
                                                    type="text"
                                                    name="position"
                                                    placeholder="Input position..."
                                                    value={formInputs.position}
                                                    onChange={handleInputChange} maxLength={50} disabled
                                                />
                                            ) : (
                                                <p>{currentUser?.position}</p>
                                            )}
                                        </div>

                                    </div>
                                    <div>
                                        <div>
                                            <label htmlFor="update-profile-form-3">Username</label>
                                            {isEditing ? (
                                                <input className='editing'
                                                    type="text"
                                                    name="username"
                                                    placeholder="Input username..."
                                                    value={formInputs.username}
                                                    onChange={handleInputChange} maxLength={50} disabled
                                                />
                                            ) : (
                                                <p>{currentUser?.username}</p>
                                            )}
                                        </div>
                                        <div className="inputDiv">
                                            <label className="label" htmlFor="update-profile-form-4">
                                                Password {isEditing ? (
                                                    <span style={{ color: "red" }}>*</span>
                                                ) : (<></>)}
                                            </label>
                                            <div className="" style={{ position: "relative" }}>
                                                {isEditing ? (
                                                    <>
                                                        <input className='editing'
                                                            type={showPassword ? "text" : "password"}
                                                            name="password"
                                                            placeholder="Input password..."
                                                            value={formInputs.password}
                                                            onChange={handleInputChange} maxLength={20} required
                                                        />
                                                        {error.password && <p style={{ color: "red" }}>* is required</p>}
                                                    </>
                                                ) : (
                                                    <input
                                                        className="password"
                                                        type={showPassword ? "text" : "password"}
                                                        id="update-profile-form-1"
                                                        name="password"
                                                        placeholder="Input password..."
                                                        value={currentUser?.password}
                                                        disabled
                                                        style={{
                                                            paddingRight: "2.5rem",
                                                            width: "100%",
                                                            height: "40px",
                                                            padding: "12px",
                                                            fontSize: "0.875rem",
                                                            lineHeight: "1.25rem"
                                                        }}
                                                    />
                                                )}
                                                <div
                                                    className="toggle"
                                                    onClick={togglePasswordVisibility}
                                                    style={{
                                                        position: "absolute",
                                                        right: "0.5rem",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                    }}
                                                >
                                                    {showPassword ? (
                                                        <BsFillEyeFill className="icon" />
                                                    ) : (
                                                        <BsFillEyeSlashFill className="icon" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <label htmlFor="update-profile-form-5">Email</label>
                                            {isEditing ? (
                                                <input
                                                    id="update-profile-form-5"
                                                    type="email"
                                                    name="email"
                                                    placeholder="Input email..."
                                                    value={formInputs.email}
                                                    onChange={handleInputChange} maxLength={50} disabled
                                                />
                                            ) : (
                                                <p>{currentUser?.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="update-profile-form-6">Date Of Birth {isEditing ? (
                                                <span style={{ color: "red" }}>*</span>
                                            ) : (<></>)}</label>
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        id="update-profile-form-6"
                                                        name="dob"
                                                        type="date"
                                                        placeholder="Input dob..."
                                                        value={formInputs.dob}
                                                        onChange={handleInputChange}
                                                        max={getCurrentDateTime()}
                                                        required
                                                    />
                                                    {error.dob && <p style={{ color: "red" }}>* is required</p>}
                                                </>
                                            ) : (
                                                <p>{currentUser?.dob}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <label htmlFor="update-profile-form-7">Phone Number {isEditing ? (
                                                <span style={{ color: "red" }}>*</span>
                                            ) : (<></>)}</label>
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        id="update-profile-form-7"
                                                        type="number"
                                                        name="phone"
                                                        placeholder="Input phone number..."
                                                        value={formInputs.phone}
                                                        onChange={handleInputChange}
                                                        style={error.phone ? { borderColor: "red" } : {}} required
                                                    />
                                                    {error.phone && (
                                                        <p style={{ color: "red" }}>
                                                            {error.phone === "Phone number is required!" ? "* is required" : error.phone}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p>{currentUser?.phone}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="update-profile-form-8">Role</label>
                                            {isEditing ? (
                                                <input
                                                    id="update-profile-form-8"
                                                    type="text"
                                                    name="role"
                                                    value={currentUser?.role} disabled
                                                />
                                            ) : (
                                                <p>{currentUser?.role}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="edit">
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={handleCancelClick}
                                >
                                    Cancel
                                </button>
                                <button
                                    id='btn-save'
                                    className="btn btn-primary"
                                    type="button" onClick={handleFormSubmit}
                                >
                                    <Icon icon="line-md:loading-alt-loop" style={{ display: isSaving ? "block" : "none" }} className='icon' /> Save
                                </button>
                            </div>
                        ) : (
                            <div className="edit">
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={handleCloseClick}
                                >
                                    Close
                                </button>
                                <button
                                    id='btn-edit'
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleEditClick}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </header>
    )
}

export default Header;