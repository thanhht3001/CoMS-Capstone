import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import { jwtDecode } from 'jwt-decode';
import '../css/_comment.css';

function Comment() {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("Token");
  const location = useLocation();
  let contractId = null;

  try {
    if (!location.state || !location.state.contractId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'No contractId provided',
      });
    } else {
      contractId = location.state.contractId;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: 'No contractId provided',
    });
  }

  const openOptionMenu = (id) => {
    if (document.getElementById("option-menu-" + id).classList.contains('show')) {
      document.getElementById("option-menu-" + id).classList.remove('show');
    } else {
      document.getElementById("option-menu-" + id).classList.add('show');
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/Comments/contract?contractId=${contractId}&CurrentPage=1&PageSize=10`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setComments(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(`https://localhost:7073/Comments/contract?ContractId=${contractId}&CurrentPage=${currentPage + 1}&pageSize=10`, {
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
    const res = await fetch(`https://localhost:7073/Comments/contract?ContractId=${contractId}&CurrentPage=${currentPage - 1}&pageSize=10`, {
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

  const fetchEditClick = async () => {
    try {
      const res = await fetch(`https://localhost:7073/Comments`, {
        mode: 'cors',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id": editingCommentId, "content": editingContent })
      });
      if (res.status === 200) {
        const data = await res.json();
        setEditingCommentId(0);
        setEditingContent('');
        setIsEditing(false);
        fetchComments();
      } else {
        const data = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.title
        })
      }
    } catch (error) {
      console.error("Error fetching edit comment:", error);
    }
  }

  const handleContentChange = event => {
    setContent(event.target.value);
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let url = `https://localhost:7073/Comments`;
      const res = await fetch(url, {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "contractId": contractId, "content": content, "replyId": 0, "commentType": 1 })
      });
      if (res.status === 200) {
        setContent('');
        fetchComments();
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
    document.getElementById("option-menu-" + id).classList.remove('show');
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
        const res = await fetch(`https://localhost:7073/Comments?id=${id}`, {
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
            text: "Comment has been deleted.",
            icon: "success"
          });
          fetchComments();
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

  const handleEditClick = (id, content) => {
    document.getElementById("option-menu-" + id).classList.remove('show');
    setEditingCommentId(id);
    setIsEditing(true);
    setEditingContent(content);
    fetchComments();
  }

  const handleCancelClick = () => {
    setEditingCommentId(0);
    setEditingContent('');
    setIsEditing(false);
    fetchComments();
  }

  const handleEditingContentChange = event => {
    setEditingContent(event.target.value);
  }

  const handleEditCommentKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchEditClick();
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comment">
      <div>
        <div>Comments</div>
        <div>
          <Icon icon="lucide:message-circle" className="icon" />
          <textarea rows={1} placeholder="Post a comment..." value={content} onChange={handleContentChange} onKeyDown={handleKeyDown} />
        </div>
      </div>
      <div>
        {comments.length > 0 ? (
          <div>
            {comments.map((item) => (
              <>
                {item?.commentType === "Normal" ? (
                  <div id={item?.id}>
                    <div>
                      <img alt="" src={item.userImage} />
                    </div>
                    {(isEditing && editingCommentId === item?.id) ? (
                      <div className="editing">
                        <textarea rows={1} placeholder="Type your new comment..." value={editingContent}
                          onChange={handleEditingContentChange} onKeyDown={handleEditCommentKeyDown} />
                        <button className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
                        <button className="btn btn-primary" onClick={fetchEditClick}>Edit</button>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <a>{item.fullName}</a>
                          {parseInt(jwtDecode(token).id) === item?.userId ? (
                            <div>
                              <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(item?.id)} />
                              <div id={"option-menu-" + item?.id}>
                                <ul className="dropdown-content">
                                  <li>
                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleEditClick(item?.id, item?.content)}>
                                      <Icon icon="bx:edit" className="icon" />
                                      Edit </a>
                                  </li>
                                  <li>
                                    <a href="javascript:;" className="dropdown-item" onClick={() => handleDeleteClick(item?.id)}>
                                      <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <a href="javascript:;"></a>
                          )}
                        </div>
                        <div>{formatDistanceToNow(new Date(item.createdAt))} ago</div>
                        <div>{item.content}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </>
            ))}
            <div className="intro-y paging">
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
          </div>) : (
          <div class="leading-relaxed text-slate-500 text-xs">
            No comment
          </div>
        )}
      </div>
      {/* <h2 class="text-lg font-medium truncate mr-5">Comments</h2>
      {commentData && commentData.length > 0 ? (
        <div>
          <div class="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4"></div>

          {commentData.map((item) => (
            <div key={item.id}>
              {/* {console.log(item)} 
              <div class="intro-x cursor-pointer box relative flex items-center p-5 mt-5">
                <div class="w-12 h-12 flex-none image-fit rounded-full overflow-hidden">
                  <img alt="" src={item.user.image} />
                </div>
                <div class="ml-4 mr-auto">
                  <div class="font-medium">{item.fullName}</div>
                  <div class="text-gray-600 text-xs mt-0.5">
                    {formatDistanceToNow(new Date(item.createdAt))} ago
                  </div>
                  <div class="text-gray-600 text-xs mt-0.5">{item.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="leading-relaxed text-slate-500 text-xs">
          No comment
        </div>
      )} */}
    </div>
  );
}

export default Comment;
