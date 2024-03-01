import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import "../css/_details.css";
import { BsFillEyeFill,
  BsFillEyeSlashFill,
} from "react-icons/bs";

function Details() {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("Token");
  const [showPassword, setShowPassword] = useState(false);
  let userId = location.state?.userId;

  const fetchUserData = async (id) => {
    const res = await fetch(`https://localhost:7073/Users/id?id=${id}`, {
      mode: "cors",
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      setUser(data);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleInactiveClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be inactive!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, inactive it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://localhost:7073/Users/inactive?id=${id}`,
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
            text: "User has been inactive.",
            icon: "success",
          });
          fetchUserData(id);
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

  const handleActiveClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be active!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, active it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://localhost:7073/Users/active?id=${id}`,
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
            text: "User has been active!",
            icon: "success",
          });
          fetchUserData(id);
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

  const handleEditClick = (id) => {
    navigate("/edit-user", {
      state: {
        userId: id,
      },
    });
  };

  useEffect(() => {
    if (!location.state || !location.state.userId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You accessed this page in wrong way!",
      });
      navigate("/user");
    } else {
      fetchUserData(location.state.userId);
    }
  }, []);

  return (
    <div className="user-details">
      <h2>User Information</h2>
      <div>
        <div>
          <div>
            {user?.status === 0 ? (
              <span
                style={{
                  color: "red"
                }}
              >
                Inactive
              </span>
            ) : (
              <span
                style={{
                  color: "green",
                }}
              >
                Active
              </span>
            )}
            <img alt="avatar" src={user?.image} />
            <div title="Remove this profile photo?">
              {" "}
              <i data-lucide="x"></i>{" "}
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Full Name</label>
                <p>{user?.fullName}</p>
              </div>
              <div>
                <label htmlFor="update-profile-form-1">
                  Position
                </label>
                <p>{user?.position}</p>
              </div>

            </div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Username</label>
                <p>{user?.username}</p>
              </div>
              <div className="inputDiv">
                <label className="label" htmlFor="update-profile-form-1">
                  Password
                </label>
                <div className="" style={{ position: "relative" }}>
                  <input
                    className="password"
                    type={showPassword ? "text" : "password"}
                    id="update-profile-form-1"
                    name="code"
                    placeholder="Input text"
                    value={user?.password}
                    disabled
                    style={{
                      paddingRight: "2.5rem",
                      width: "100%",
                      height: "40px",
                      padding: "12px",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem"
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
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Email</label>
                <p>{user?.email}</p>
              </div>
              <div>
                <label htmlFor="update-profile-form-1">Date Of Birth</label>
                <p>{user?.dob}</p>
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="update-profile-form-1">Phone Number</label>
                <p>{user?.phone}</p>
              </div>
              <div>
                <label htmlFor="update-profile-form-1">Role</label>
                <p>{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="edit">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => navigate("/user")}
        >
          Back
        </button>
        {user?.status === 0 ? (
          <button
            className="btn"
            type="button"
            style={{
              backgroundColor: "green",
              color: "white",
            }}
            onClick={() => handleActiveClick(user?.id)}
          >
            Active
          </button>
        ) : (
          <button
            className="btn"
            type="button"
            style={{
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => handleInactiveClick(user?.id)}
          >
            Inactive
          </button>
        )}
        <button
          className="btn btn-primary"
          type="button"
          style={{
            backgroundColor: "blue",
            color: "white",
          }}
          onClick={() => handleEditClick(user?.id)}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default Details;
