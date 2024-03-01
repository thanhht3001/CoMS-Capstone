import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../css/_export.css';

const Export = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");

  return (
    <div className="export">
      <button className="btn" style={{backgroundColor: 'gray', color: 'white'}} onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default Export;