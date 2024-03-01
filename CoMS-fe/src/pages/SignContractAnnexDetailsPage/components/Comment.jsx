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
          `https://localhost:7073/Comments/annex?contractAnnexId=${contractId}`,
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
    <div className="comment-annex">
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
          <div className="leading-relaxed text-slate-500 text-xs">
            No comment
          </div>
        )}
      </div>      
    </div>
  );
}

export default Comment;
