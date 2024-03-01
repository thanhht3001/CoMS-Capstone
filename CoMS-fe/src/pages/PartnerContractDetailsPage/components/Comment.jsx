import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation} from "react-router-dom";
import { Icon } from '@iconify/react';
import '../css/_comment.css';

function Comment() {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
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

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/PartnerComments?contractId=${contractId}&CurrentPage=1&PageSize=10`,
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
    const res = await fetch(`https://localhost:7073/PartnerComments?ContractId=${contractId}&CurrentPage=${currentPage + 1}&pageSize=10`, {
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
    const res = await fetch(`https://localhost:7073/PartnerComments?ContractId=${contractId}&CurrentPage=${currentPage - 1}&pageSize=10`, {
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

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let url = `https://localhost:7073/PartnerComments`;
      const res = await fetch(url, {
        mode: 'cors',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"contractId": contractId, "content": content})
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

  const handleContentChange = event => {
    setContent(event.target.value);
  }

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="partner-comment">
      <div>
        <div>Comments</div>
        {/* <div>
          <Icon icon="lucide:message-circle" className="icon" />
          <textarea rows={1} placeholder="Post a comment..." value={content} onChange={handleContentChange} onKeyDown={handleKeyDown}/>
        </div> */}
      </div>
      <div>
        {comments && comments.length > 0 ? (
          <div>
            {comments.map((item) => (
              <div>
                {/* <div>
                  <img alt="" src={item.user.image} /> 
                </div> */}
                <div>
                  <div>
                    {/* <a>{item.fullName}</a> */}
                    {/* <a>Reply</a> */}
                  </div>
                  <div>{item?.long}</div>
                  <div>{item.content}</div>
                </div>
              </div>
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
