import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [systemSettings, setSystemSettings] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");

  const fetchSettingsData = async () => {
    let url = `https://localhost:7073/SystemSettings`;
    const res = await fetch(url, {
      mode: "cors",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      setSystemSettings(data);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleEditClick = () => {
    navigate("/edit-settings");
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  return (
    <div className="system-settings">
      <div className="intro-y">
        <h2>
          System Settings
        </h2>
        <div>
          <button type="button" className="btn btn-primary box" onClick={handleEditClick}> Edit </button>
        </div>
      </div>
      <div className="pos intro-y">
        <div className="intro-y">
          <div className="post intro-y box">
            <div className="post__content tab-content">
              <div id="content" className="tab-pane active" role="tabpanel" aria-labelledby="content-tab">
                <div className="dark:border-darkmode-400">
                  <div className="dark:border-darkmode-400">
                    <Icon icon="lucide:chevron-down" className="icon" /> Company Information </div>
                  <div>
                    <div className="editor">
                      <p>Name: {systemSettings?.companyName}</p>
                      <p>Address: {systemSettings?.address}</p>
                      <p>Phone Number: {systemSettings?.phone}</p>
                      <p>Hotline: {systemSettings?.hotline}</p>
                      <p>Email: {systemSettings?.email}</p>
                      <p>Tax Code: {systemSettings?.taxCode}</p>
                    </div>
                  </div>
                </div>
                <div className="dark:border-darkmode-400">
                  <div className="dark:border-darkmode-400"> <Icon icon="lucide:chevron-down" className="icon" /> Payment Information </div>
                  <div>
                    <div>
                      <p>Bank Name: {systemSettings?.bankName}</p>
                      <p>Bank Account: {systemSettings?.bankAccount}</p>
                      <p>Bank Account Number: {systemSettings?.bankAccountNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="dark:border-darkmode-400">
                  <div className="dark:border-darkmode-400"> <Icon icon="lucide:chevron-down" className="icon" /> Gmail </div>
                  <div>
                    <div>
                      <p>App Password: {systemSettings?.appPassword}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
