import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import "../css/_details.css";
import {
  BsFillShieldLockFill,
  BsFillEyeFill,
  BsFillEyeSlashFill,
} from "react-icons/bs";

function Details() {
  const [partner, setPartner] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("Token");
  const [showPassword, setShowPassword] = useState(false);
  let partnerId = location.state?.partnerId;

  const fetchPartnerData = async (async) => {
    const res = await fetch(`https://localhost:7073/Partners?id=${partnerId}`, {
      mode: "cors",
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      setPartner(data);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleUpdateStatusClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "That partner's status will change!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://localhost:7073/Partners/update-status?id=${id}`,
          {
            mode: "cors",
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          Swal.fire({
            title: "Change!",
            text: "Status has been changed.",
            icon: "success",
          });
          fetchPartnerData();
        } else {
          const data = await res.json();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.title,
          });
        }
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePartner = (id) => {
    navigate("/edit-partner", {
      state: {
        partnerId: id,
      },
    });
  };

  useEffect(() => {
    if (!location.state || !location.state.partnerId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You accessed this page in wrong way!",
      });
      navigate("/partner-list");
    } else {
      fetchPartnerData(location.state.partnerId);
    }
  }, []);

  return (
    <div className="partner-details">
      <h2>Partner Information</h2>
      <div>
        <div>
          <span
            style={{
              color: partner?.status === 0 ? "red" : "green",
            }}
          >
            {partner?.statusString}
          </span>
          <div>
            <img alt="avatar" src={partner?.image} />
            <div title="Remove this profile photo?">
              {" "}
              <i data-lucide="x"></i>{" "}
            </div>
          </div>
          <div>
            {/* <button className="btn btn-primary" type="button">
              Change Photo
            </button> */}
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Representative</label>
                <p>{partner?.representative}</p>
              </div>
              <div>
                <label htmlFor="update-profile-form-1">
                  Representative Position
                </label>
                <p>{partner?.representativePosition}</p>
              </div>
              
            </div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Email</label>
                <p>{partner?.email}</p>
              </div>
              <div>
                <label htmlFor="update-profile-form-1">Tax Code</label>
                <p>{partner?.taxCode}</p>
              </div>
              
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Phone</label>
                <p>{partner?.phone}</p>
              </div>
              <div>
                <label htmlFor="update-profile-form-1">Address</label>
                <p>{partner?.address}</p>
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Company Name</label>
                <p>{partner?.companyName}</p>
              </div>
              <div>
                <label htmlFor="update-profile-form-1">Abbreviation Company Name</label>
                <p>{partner?.abbreviation}</p>
              </div>
              <div className="inputDiv">
                <label className="label" htmlFor="update-profile-form-1">
                  Code
                </label>
                <div className="" style={{ position: "relative" }}>
                  <input
                    className="password"
                    type={showPassword ? "text" : "password"}
                    id="update-profile-form-1"
                    name="code"
                    placeholder="Input text"
                    value={partner?.code}
                    disabled
                    style={{
                      paddingRight: "2.5rem",
                      width: "100%",
                      height: "40px",
                      padding: "12px",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem",
                    }}
                  />
                  
                  <div
                    className="toggle"
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "0.5rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {showPassword ? (
                      <BsFillEyeFill className="icon" />
                    ) : (
                      <BsFillEyeSlashFill className="icon" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                className="btn btn-primary"
                type="button"
                style={{
                  backgroundColor: partner?.status === 0 ? "green" : "red",
                  color: "white",
                }}
                onClick={() => handleUpdateStatusClick(partner?.id)}
              >
                {partner?.status === 0 ? "Active" : "Inactive"}
              </button>
              <button
                className="btn btn-primary"
                type="button"
                style={{
                  backgroundColor: "blue",
                  color: "white",
                }}
                onClick={() => handlePartner(partner?.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => navigate("/partner-list")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
