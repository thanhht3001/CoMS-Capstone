import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../css/_export.css';

const Export = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  let contractId = location.state.contractId;

  const handleApprove = async () => {
    try {
      console.log("Fetching Approve Contract By Manager...");
      const res = await fetch(
        `https://localhost:7073/Contracts/approveOrReject?id=${contractId}&isApproved=true`,
        {
          mode: "cors",
          method: "PUT",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Approve Contract Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/waiting-contract");
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.title,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="export">
      <button className="btn" onClick={handleApprove}>Approve</button>
      <button className="btn">Reject</button>
    </div>
  );
};

export default Export;
