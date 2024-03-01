import { Margin } from "@syncfusion/ej2-react-documenteditor";
import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import '../css/_comment.css';

function Comment() {
  const [commentData, setCommentData] = useState([]);
  const token = localStorage.getItem("Token");
  const location = useLocation();
  let contractId = null;
  const [comments, setComments] = useState([]);
  // const [autoPlay, setAutoPlay] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://localhost:7073/Comments/contract?contractId=${contractId}`,
          {
            mode: "cors",
            method: "GET",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
        const data = await response.json();
        const comments = data.items;
        // console.log(data.items);
        // const comments = data; // assuming the data is an array of comments

        // Fetch user details for each comment
        const commentsWithData = await Promise.all(
          comments.map(async (comment) => {
            const res = await fetch(
              `https://localhost:7073/Users/id?id=${comment.userId}`,
              {
                mode: "cors",
                method: "GET",
                headers: new Headers({
                  Authorization: `Bearer ${token}`,
                }),
              }
            );
            const userData = await res.json();

            return {
              ...comment,
              user: {
                username: userData.username,
                image: userData.image,
              },
            };
          })
        );
        // console.log(commentsWithData);
        setCommentData(commentsWithData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="liquidation-comment">
      <div>
        <div>Comments</div>
        <div>
          <Icon icon="lucide:message-circle" className="icon" />
          <textarea rows={1} placeholder="Post a comment..." />
        </div>
      </div>
      <div>
        {commentData && commentData.length > 0 ? (
          <div>
            {commentData.map((item) => (
              <div>
                <div>
                  <img alt="" src={item.user.image} />
                </div>
                <div>
                  <div>
                    <a>{item.fullName}</a>
                    <a>Reply</a>
                  </div>
                  <div>{formatDistanceToNow(new Date(item.createdAt))} ago</div>
                  <div>{item.content}</div>
                </div>
              </div>
            ))}
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
