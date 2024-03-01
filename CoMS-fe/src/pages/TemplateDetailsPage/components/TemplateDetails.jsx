import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import Swal from "sweetalert2";
import { jwtDecode } from 'jwt-decode';
import '../css/style.css';

function Details() {
    const [template, setTemplate] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    const fetchTemplateData = async (id) => {
        const res = await fetch(
            `https://localhost:7073/Templates/get-template-info?id=${id}`,
            {
                mode: "cors",
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                }),
            }
        );
        if (res.status === 200) {
            const data = await res.json();
            setTemplate(data);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.title,
            });
        }
    }

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
        });
    }

    const handleEditClick = (data) => {
        navigate("/edit-template", {
            state: {
                id: data
            }
        });
    }

    useEffect(() => {
        if (!location.state || !location.state.templateId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'You accessed this page in wrong way!',
            });
            navigate("/template");
        } else {
            fetchTemplateData(location.state.templateId);
        }
    }, []);

    return (
        <div>
            <div className="template-details intro-y news box">
                <a href="/template"><Icon icon="ion:return-up-back" className="icon" />Back to Template List</a>
                <div>
                    <h2 className="intro-y">
                        {template?.templateName}
                    </h2>
                    {template?.statusString === "Activating" ? (
                        <></>
                    ) : (
                        <>
                            {parseInt(jwtDecode(token).id) === template?.userId ? (
                                <div>
                                    <button className="btn btn-secondary" onClick={() => handleEditClick(template.id)}>
                                        <Icon icon="lucide:edit" className="icon" />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteClick(template?.id)}>
                                        <Icon icon="lucide:trash" className="icon" />
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </div>
                <div className="intro-y dark:text-slate-500"> {template?.createdDateString}
                    <span>•</span>
                    <span className="text-primary">{template?.contractCategoryName}</span>
                    <span>•</span> {template?.templateTypeName}
                </div>
                <div className="intro-y">
                    <div className="news__preview">
                        <object width="100%" height="700" data={template?.templateLink} type="application/pdf">   </object>
                    </div>
                </div>
                {/* <div class="intro-y flex relative pt-16 sm:pt-6 items-center pb-6">
                <a href="" class="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full border border-slate-300 dark:border-darkmode-400 dark:bg-darkmode-300 dark:text-slate-300 text-slate-500 mr-2 tooltip" title="Bookmark"> <i data-lucide="bookmark" class="w-3 h-3"></i> </a>
                <div class="intro-x flex mr-3">
                    <div class="intro-x w-8 h-8 sm:w-10 sm:h-10 image-fit">
                        <img alt="Midone - HTML Admin Template" class="rounded-full border border-white zoom-in tooltip" src="dist/images/profile-11.jpg" title="Brad Pitt" />
                    </div>
                    <div class="intro-x w-8 h-8 sm:w-10 sm:h-10 image-fit -ml-4">
                        <img alt="Midone - HTML Admin Template" class="rounded-full border border-white zoom-in tooltip" src="dist/images/profile-9.jpg" title="Kate Winslet" />
                    </div>
                    <div class="intro-x w-8 h-8 sm:w-10 sm:h-10 image-fit -ml-4">
                        <img alt="Midone - HTML Admin Template" class="rounded-full border border-white zoom-in tooltip" src="dist/images/profile-3.jpg" title="Matt Damon" />
                    </div>
                </div>
                <div class="absolute sm:relative -mt-12 sm:mt-0 w-full flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm">
                    <div class="intro-x mr-1 sm:mr-3"> Comments: <span class="font-medium">28</span> </div>
                    <div class="intro-x mr-1 sm:mr-3"> Views: <span class="font-medium">202k</span> </div>
                    <div class="intro-x sm:mr-3 ml-auto"> Likes: <span class="font-medium">94k</span> </div>
                </div>
                <a href="" class="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full text-primary bg-primary/10 dark:bg-darkmode-300 dark:text-slate-300 ml-auto sm:ml-0 tooltip" title="Share"> <i data-lucide="share-2" class="w-3 h-3"></i> </a>
                <a href="" class="intro-x w-8 h-8 sm:w-10 sm:h-10 flex flex-none items-center justify-center rounded-full bg-primary text-white ml-2 tooltip" title="Download PDF"> <i data-lucide="share" class="w-3 h-3"></i> </a>
            </div> */}
                <div className="intro-y">
                    <p>Description:</p>
                    <p>{template?.description}</p>
                </div>
                <div className="intro-y dark:border-darkmode-400">
                    <div>
                        <div className="image-fit">
                            <img alt="Creator Avatar" src={template?.userImage} />
                        </div>
                        <div>
                            <span>{template?.userName}</span>, Author
                            <div>{template?.email}</div>
                        </div>
                    </div>
                    {/* <div class="flex items-center text-slate-600 dark:text-slate-500 sm:ml-auto mt-5 sm:mt-0">
                    Share this post:
                    <a href="" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Facebook"> <i class="w-3 h-3 fill-current" data-lucide="facebook"></i> </a>
                    <a href="" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Twitter"> <i class="w-3 h-3 fill-current" data-lucide="twitter"></i> </a>
                    <a href="" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border dark:border-darkmode-400 ml-2 text-slate-400 zoom-in tooltip" title="Linked In"> <i class="w-3 h-3 fill-current" data-lucide="linkedin"></i> </a>
                </div> */}
                </div>
                {/* <div className="intro-y dark:border-darkmode-400">
                <div>2 Comments</div>
                <div className="news__input">
                    <Icon icon="lucide:message-circle" className='icon' />
                    <textarea className="form-control" rows="1" placeholder="Post a comment..."></textarea>
                </div>
            </div>
            <div className="intro-y">
                <div>
                    <div>
                        <div className="image-fit">
                            <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/profile-11.jpg" />
                        </div>
                        <div class="ml-3 flex-1">
                            <div class="flex items-center"> <a href="" class="font-medium">Brad Pitt</a> <a href="" class="ml-auto text-xs text-slate-500">Reply</a> </div>
                            <div class="text-slate-500 text-xs sm:text-sm">53 seconds ago</div>
                            <div class="mt-2">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400">
                    <div class="flex">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit">
                            <img alt="Midone - HTML Admin Template" class="rounded-full" src="dist/images/profile-9.jpg" />
                        </div>
                        <div class="ml-3 flex-1">
                            <div class="flex items-center"> <a href="" class="font-medium">Kate Winslet</a> <a href="" class="ml-auto text-xs text-slate-500">Reply</a> </div>
                            <div class="text-slate-500 text-xs sm:text-sm">45 seconds ago</div>
                            <div class="mt-2">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem </div>
                        </div>
                    </div>
                </div> 
            </div> */}
            </div>
        </div>
    )
}

export default Details;