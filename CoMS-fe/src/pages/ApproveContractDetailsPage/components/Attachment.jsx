import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/attachment.css";
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from "date-fns";

function Attachment() {
  const [attachment, setAttachment] = useState(null);
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

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(
          `https://localhost:7073/Attachments/all?ContractId=${contractId}`,
          {
            mode: "cors",
            method: "GET",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
        const data = await response.json();
        setAttachment(data.items);
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };

    fetchComment();
  }, []);

  return (
    <div className="attachment-approve">
      <h2 class="text-lg font-medium truncate mr-5 mt-4 mb-2">Attachments</h2>
      <script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script>
      {attachment ? (
        <div>
          {attachment.map((item) => (
            <div>
              <div><a href=""><Icon icon="mdi:file" className="icon" /></a></div>
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
          <div class="leading-relaxed text-slate-500 text-xs">
            No file attachment
          </div>
        </div>
      )}
    </div>
  );
}

export default Attachment;
