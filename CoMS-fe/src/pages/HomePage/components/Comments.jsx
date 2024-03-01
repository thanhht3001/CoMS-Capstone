import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import "../css/_comments.css";

function Comments() {
    const [comments, setComments] = useState([]);
    // const [autoPlay, setAutoPlay] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    // let timeOut = null;
    const token = localStorage.getItem("Token");
    const navigate = useNavigate();

    const fetchCommentData = async () => {
        let url = `https://localhost:7073/Comments/all?CurrentPage=1&PageSize=1`;
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
            setComments(data.items);
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
        const res = await fetch(`https://localhost:7073/Comments/all?CurrentPage=${currentPage + 1}&pageSize=1`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setComments(data.items);
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
        const res = await fetch(`https://localhost:7073/Comments/all?CurrentPage=${currentPage - 1}&pageSize=1`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setComments(data.items);
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

    const fetchDismissComment = async (id) => {
        const res = await fetch(`https://localhost:7073/Comments/dismiss?id=${id}`, {
            mode: 'cors',
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            fetchCommentData();
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    const handleViewDetailClick = async (id) => {
        const res = await fetch(`https://localhost:7073/Comments?id=${id}`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            navigate("/contract-details", {
                state: {
                    contractId: data.contractId
                }
            });
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
        fetchCommentData();
        // timeOut = autoPlay && setTimeout(() => {
        //     fetchNext();
        // }, 2500)
    }, []);

    return (
        <div className="comments">
            <div className="intro-x">
                <h2>
                    Comments
                </h2>
                <button onClick={fetchPrevious} disabled={!hasPrevious} data-carousel="important-notes" data-target="prev" 
                    className={"tiny-slider-navigator btn dark:text-slate-300 " + (hasPrevious ? "" : "disabled")}> 
                    <Icon icon="lucide:chevron-left" className="icon" /> </button>
                <button onClick={fetchNext} disabled={!hasNext} data-carousel="important-notes" data-target="next" 
                    className={"tiny-slider-navigator btn dark:text-slate-300 " + (hasNext ? "" : "disabled")}> <Icon icon="lucide:chevron-right" className="icon" /> 
                    </button>
            </div>
            <div className="intro-x">
                {comments.map(comment => (
                    <div id={comment.id} className="box zoom-in">
                        <div className="tiny-slider" id="important-notes">
                            {/* onMouseEnter={() => { setAutoPlay(false) }} onMouseLeave={() => { setAutoPlay(true) }} */}
                            <div>
                                <div>{comment.fullName}</div>
                                <div>{comment.long}</div>
                                <div>{comment.content}</div>
                                <div>
                                    <button type="button" className="btn btn-secondary" onClick={() => handleViewDetailClick(comment?.id)}>View Details</button>
                                    <button type="button" className="btn btn-outline-secondary" 
                                        onClick={() => fetchDismissComment(comment.id)}>Dismiss</button>
                                </div>
                            </div>
                            {/* <div>
                            <div>Lorem Ipsum is simply dummy text</div>
                            <div>20 Hours ago</div>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</div>
                            <div>
                                <button type="button" className="btn btn-secondary">View Notes</button>
                                <button type="button" className="btn btn-outline-secondary">Dismiss</button>
                            </div>
                        </div>
                        <div>
                            <div>Lorem Ipsum is simply dummy text</div>
                            <div>20 Hours ago</div>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</div>
                            <div>
                                <button type="button" className="btn btn-secondary">View Notes</button>
                                <button type="button" className="btn btn-outline-secondary">Dismiss</button>
                            </div>
                        </div>
                        <div>
                            <div>Lorem Ipsum is simply dummy text</div>
                            <div>20 Hours ago</div>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</div>
                            <div>
                                <button type="button" className="btn btn-secondary">View Notes</button>
                                <button type="button" className="btn btn-outline-secondary">Dismiss</button>
                            </div>
                        </div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Comments;