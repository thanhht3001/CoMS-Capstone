import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select';
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import "../css/_edit.css";
import { filesDb } from "../../../components/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  BsFillShieldLockFill,
  BsFillEyeFill,
  BsFillEyeSlashFill,
} from "react-icons/bs";

function Edit() {
  const [error, setError] = useState({});
  const [formInputs, setFormInputs] = useState({
    image: "",
    fullName: "",
    position: "",
    email: "",
    password: "",
    phone: "",
    username: "",
    dob: "",
    roleId: 0,
  });
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("Token");
  let userId = null;

  const roleOptions = [
    { value: 1, label: "Staff" },
    { value: 2, label: "Manager" },
    { value: 3, label: "Sale Manager" }
  ];

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

  const handleRoleChange = (data) => {
    setSelectedRole(data);
    setFormInputs({ ...formInputs, ["roleId"]: data.value });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const phoneRegex = /^(09|03|07|08|05)+([0-9]{7,8})\b$/;
    if (name === "phone") {
      if (!value) {
        setError({ ...error, phone: "Phone number is required!" });
      } else if (
        !phoneRegex.test(value) ||
        value.length > 11 ||
        value.length < 10
      ) {
        setError({ ...error, phone: "Invalid Vietnamese phone number!" });
      } else {
        setError({ ...error, phone: "" });
      }
    }
    setFormInputs({ ...formInputs, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUploadClick = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.hidden = true;
    fileInput.addEventListener("change", (e) => {
      setImage(e.target.files[0]);
      setImageUpload(e.target.files[0]);
      setFormInputs({ ...formInputs, ["image"]: `https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/users%2F${e.target.files[0].name}?alt=media` });
    });
    fileInput.click();
  };

  const handleUpload = async () => {
    setIsUploading(true);
    let storageRef = ref(filesDb, `users/${imageUpload.name}`);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const uploadTask = uploadBytesResumable(storageRef, imageUpload);
      let url;
      uploadTask.on(
        "state_changed",
        async (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Upload fails.",
          });
        },
        async () => {
          setIsUploading(false);
        }
      );
    };
    reader.readAsDataURL(imageUpload);
  };

  const handleFormSubmit = async (event, id) => {
    setIsSaving(true);
    event.preventDefault();
    const errors = {};
    for (const key in formInputs) {
      if (key === "phone" && error.phone) {
        errors[key] = "Invalid phone number!";
      }
    }
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    if (imageUpload !== null) {
      handleUpload();
    }
    console.log(formInputs);
    const res = await fetch(`https://localhost:7073/Users?id=${id}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInputs),
    });
    if (res.status === 200) {
      Swal.fire({
        title: "Successfully!",
        text: "User information has been updated.",
        icon: "success",
      });
      const data = await res.json();
      setIsSaving(false);
      navigate("/user-details", {
        state: {
          userId: data.id,
        },
      });
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
      setIsSaving(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  useEffect(() => {
    if (user) {
      setFormInputs({
        image: user.image || "",
        fullName: user.fullName || "",
        position: user.position || "",
        email: user.email || "",
        password: user.password || "",
        phone: user.phone || "",
        username: user.username || "",
        dob: user.dob || "",
        roleId: user.roleId || "",
      });
      setSelectedRole({ value: user.roleId, label: user.role });
    }
  }, [user]);

  useEffect(() => {
    if (!location.state || !location.state.userId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You accessed this page in wrong way!",
      });
      navigate("/user");
    } else {
      userId = location.state.userId;
      fetchUserData(location.state.userId);
    }
  }, []);

  return (
    <div className="user-edit">
      <form onSubmit={e => handleFormSubmit(e, user?.id)}>
        <h2>Edit User Information</h2>
        <div>
          <div>
            {user?.status === 0 ? (
              <span
                style={{ color: "red" }}
              >
                Inactive
              </span>
            ) : (
              <span
                style={{ color: "green" }}
              >
                Active
              </span>
            )}
            <div>
              <img alt="avatar" src={formInputs.image} />
              <div title="Remove this profile photo?">
                {" "}
                <i data-lucide="x"></i>{" "}
              </div>
            </div>
            <div>
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="btn btn-primary"
                type="button"
                style={
                  isUploading
                    ? { backgroundColor: "gray", borderColor: "gray" }
                    : {}
                }
              >
                Change Photo
              </button>
            </div>
          </div>
          <div>
            <div>
              <div>
                <div>
                  <label htmlFor="update-profile-form-1">
                    Full Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Input full name..."
                    value={formInputs.fullName}
                    onChange={handleInputChange} maxLength={150} required
                  />
                </div>
                <div>
                  <label htmlFor="update-profile-form-2">
                    Position{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="update-profile-form-2"
                    type="text"
                    name="position"
                    placeholder="Input position..."
                    value={formInputs.position}
                    onChange={handleInputChange} maxLength={50} required
                  />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="update-profile-form-3">
                    Username <span style={{ color: "red" }}>*</span>{" "}
                  </label>
                  <input
                    id="update-profile-form-3"
                    type="text"
                    name="username"
                    placeholder="Input username..."
                    value={formInputs.username}
                    onChange={handleInputChange} maxLength={50} required
                  />
                </div>
                <div className="inputDiv">
                  <label className="label" htmlFor="update-profile-form-4">
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input flex" style={{ position: "relative" }}>
                    <input
                      className="inputData"
                      type={showPassword ? "text" : "password"}
                      id="update-profile-form-4"
                      name="password"
                      placeholder="Input password..."
                      value={formInputs.password}
                      onChange={handleInputChange} minLength={6} maxLength={20} required
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
                  <label htmlFor="update-profile-form-6">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="update-profile-form-6"
                    type="email"
                    name="email"
                    placeholder="Input email..."
                    value={formInputs.email}
                    onChange={handleInputChange} maxLength={50} required
                  />
                </div>
                <div>
                  <label htmlFor="update-profile-form-7">
                    Date Of Birth <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="update-profile-form-7"
                    name="dob"
                    type="date"
                    placeholder="Input dob..."
                    value={formInputs.dob}
                    onChange={handleInputChange}
                    max={getCurrentDateTime()}
                    required
                  />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="update-profile-form-5">
                    Phone Number<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="update-profile-form-5"
                    type="number"
                    name="phone"
                    placeholder="Input phone number..."
                    value={formInputs.phone}
                    onChange={handleInputChange}
                    style={error.phone ? { borderColor: "red" } : {}} required
                  />
                  {error.phone && (
                    <p style={{ color: "red" }}>
                      {error.phone === "Phone number is required!" ? "" : error.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="update-profile-form-8">
                    Role <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select id="input-filter-3" options={roleOptions} className="form-select flex-1"
                    value={selectedRole} onChange={handleRoleChange} required />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
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
            type="submit"
          >
            <Icon icon="line-md:loading-alt-loop" style={{ display: isSaving ? "block" : "none" }} className='icon' /> Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
