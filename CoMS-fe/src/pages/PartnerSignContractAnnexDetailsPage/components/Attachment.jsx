import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/attachment.css";
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from "date-fns";

function Attachment() {
  const [attachments, setAttachments] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem("Token");

  let contractAnnexId = null;

  try {
    if (!location.state || !location.state.contractAnnexId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'No contractAnnexId provided',
      });
    } else {
      contractAnnexId = location.state.contractAnnexId;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: 'No contractAnnexId provided',
    });
  }

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(
          `https://localhost:7073/Attachments/annex?ContractAnnexId=${contractAnnexId}&CurrentPage=1&PageSize=3`,
          {
            mode: "cors",
            method: "GET",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
        const data = await response.json();
        setAttachments(data);
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };

    fetchComment();
  }, []);

  return (
    <div className="attachment-approve">
      <h2 className="text-lg font-medium truncate mr-5 mt-4 mb-2">Attachments</h2>
      <script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script>
      {attachments.length > 0 ? (
        <div>
          {attachments.map((item) => (
            <div key={item.id}>
              <div>
                <a href=""><Icon icon="mdi:file" className="icon" /></a>
              </div>
              <div>
                <a href={item.fileLink}>{item.fileName}</a>
                <div>{formatDistanceToNow(new Date(item.uploadDate))} ago</div>
              </div>
              <div>
                <a href="javascript:;"><Icon icon="lucide:more-horizontal" className="icon" /></a>
                <div></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="leading-relaxed text-slate-500 text-xs">
            No file attachment
          </div>
        </div>
      )}
    </div>
  );
}

export default Attachment;
