import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/attachment.css";
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from "date-fns";

function Attachment() {
  const [attachments, setAttachments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("Token");

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

  const fetchAttachments = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/Attachments/all?contractId=${contractId}&CurrentPage=1&PageSize=3`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setAttachments(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Error fetching contract attachments:", error);
    }
  };

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Attachments/all?ContractAnnexId=${contractId}&CurrentPage=${
        currentPage + 1
      }&pageSize=3`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      setAttachments(data.items);
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

  const fetchPrevious = async () => {
    if (!hasPrevious) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Attachments/all?ContractAnnexId=${contractId}&CurrentPage=${
        currentPage - 1
      }&pageSize=3`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      setAttachments(data.items);
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

  useEffect(() => {
    fetchAttachments();
  }, []);

  return (
    <div className="attachment-partner-approve">
      <h2 class="text-lg font-medium truncate mr-5 mt-4 mb-2">Attachments</h2>
      {attachments.length > 0 ? (
        <div>
          {attachments.map((item) => (
            <div>
              <div><a href=""><Icon icon="mdi:file" className="icon" /></a></div>
              <div>
                <a href={item.fileLink}>{item.fileName}</a>
                <div>{formatDistanceToNow(new Date(item.uploadDate))} ago</div>
              </div>
              <div>
              </div>
            </div>
          ))}
          <div className="intro-y paging">
            <nav>
              <ul className="pagination">
                {/* <li className="page-item">
                                <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-left"></i> </a>
                            </li> */}
                <li
                  className={
                    "page-item " + (hasPrevious ? "active" : "disabled")
                  }
                  onClick={fetchPrevious}
                >
                  <a className="page-link" href="javascript:;">
                    <Icon icon="lucide:chevron-left" className="icon" />
                  </a>
                </li>
                {/* <li className="page-item"> <a class="page-link" href="#">...</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">1</a> </li>
                            <li class="page-item active"> <a class="page-link" href="#">2</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">3</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">...</a> </li> */}
                <li
                  className={"page-item " + (hasNext ? "active" : "disabled")}
                  onClick={fetchNext}
                >
                  <a className="page-link" href="javascript:;">
                    <Icon icon="lucide:chevron-right" className="icon" />
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
      ) : (
        <div>
          <div class="leading-relaxed text-slate-500 text-xs">
            No file attachment
          </div>
        </div>
      )}
    </div>
  );
}

export default Attachment;
