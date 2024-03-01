import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select';
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_user.css";
import { filesDb } from "../../../components/Firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

function User() {
  const [error, setError] = useState({});
  const [formInputs, setFormInputs] = useState({
    image: "https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/images%2Fdownload.png?alt=media&token=bffbf9bd-9c70-4db1-8c3d-3e5bff90d229",
    fullName: "",
    position: "",
    email: "",
    password: "",
    phone: "",
    roleId: 0,
    username: "",
    dob: "",
  });
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("Token");

  const roleOptions = [
    { value: 1, label: "Staff" },
    { value: 2, label: "Manager" },
    { value: 3, label: "Sale Manager" }
  ];

  const handleRoleChange = (data) => {
    setSelectedRole(data);
    setFormInputs({ ...formInputs, ["roleId"]: data.value });
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

  const handleFormSubmit = async (event) => {
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
    const res = await fetch(`https://localhost:7073/Users`, {
      mode: "cors",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInputs),
    });
    if (res.status === 200) {
      Swal.fire({
        title: "Successfully!",
        text: "User information has been created.",
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const phoneRegex = /^(09|03|07|08|05)+([0-9]{7,8})\b$/;

    if (name === "phone") {
      if (!value.trim()) {
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

    setFormInputs({ ...formInputs, [name]: value.trim() });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => { }, []);

  return (
    <div className="user">
      <form onSubmit={handleFormSubmit}>
        <h2>New User Information</h2>
        <div>
          <div>
            <div>
              {image !== "" ? (
                <img alt="avatar" src={URL.createObjectURL(image)} />
              ) : (
                <img alt="avatar" src={formInputs.image} />
              )}
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
                    placeholder="Type full name..."
                    value={formInputs.fullName}
                    onChange={handleInputChange}
                    maxLength={150}
                    required
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
                    placeholder="Type position..."
                    value={formInputs.position}
                    onChange={handleInputChange}
                    maxLength={50}
                    required
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
                    onChange={handleInputChange}
                    maxLength={50}
                    required
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
                      onChange={handleInputChange}
                      minLength={6}
                      maxLength={20}
                      required
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
                  <label htmlFor="update-profile-form-5">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="update-profile-form-5"
                    type="email"
                    name="email"
                    placeholder="Input email..."
                    value={formInputs.email}
                    onChange={handleInputChange}
                    maxLength={50}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="update-profile-form-6">
                    Date Of Birth <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="update-profile-form-6"
                    type="date"
                    name="dob"
                    value={formInputs.dob}
                    onChange={handleInputChange}
                    max={getCurrentDateTime()}
                    required
                  />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="update-profile-form-8">
                    Phone Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="update-profile-form-8"
                    name="phone"
                    type="number"
                    placeholder="Input phone number..."
                    value={formInputs.phone}
                    onChange={handleInputChange}
                    style={error.phone ? { borderColor: "red" } : {}}
                    required
                  />
                  {error.phone && (
                    <p style={{ color: "red" }}>
                      {error.phone !== "Phone number is required!"
                        ? error.phone : ""}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="update-profile-form-7">
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
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            style={{
              backgroundColor: "blue",
              color: "white",
            }}
          >
            <Icon icon="line-md:loading-alt-loop" style={{ display: isSaving ? "block" : "none" }} className='icon' />Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default User;
