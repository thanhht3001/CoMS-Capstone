import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_partner.css";
import { filesDb } from "../../../components/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { BsFillShieldLockFill, BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

function Partner() {
  const [partner, setPartner] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("Token");
  let partnerId = location.state?.partnerId;
  const [error, setError] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formInputs, setFormInputs] = useState({
    image: "https://firebasestorage.googleapis.com/v0/b/coms-64e4a.appspot.com/o/images%2Fdownload.png?alt=media&token=bffbf9bd-9c70-4db1-8c3d-3e5bff90d229",
    representative: "",
    representativePosition: "",
    email: "",
    code: "",
    phone: "",
    address: "",
    companyName: "",
    taxCode: "",
    abbreviation : "",
  });

  const handleUploadClick = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.hidden = true;
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        let filename = file.name;
        let storageRef = ref(filesDb, `images/${filename}`);
        handleUpload(file, filename);
      }
    });
    fileInput.click();
  };

  const handleUpload = async (file, filename) => {
    setIsUploading(true);
    let storageRef = ref(filesDb, `images/${filename}`);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const uploadTask = uploadBytesResumable(storageRef, file);
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
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            url = downloadURL;
            setFormInputs((prevState) => ({ ...prevState, image: url }));
          });
          setIsUploading(false);
        }
      );
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    for (const key in formInputs) {
      if (formInputs[key] === null || formInputs[key] === "") {
        errors[key] = `${key} is required.`;
      }
      if (key === "phone" && error.phone) {
        errors[key] = "Invalid phone number";
      }
      if (key === "email" && error.email) {
        errors[key] = "Invalid email format";
      }
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const res = await fetch(`https://localhost:7073/Partners/add`, {
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
        title: "Updated!",
        text: "Create a partner successfully.",
        icon: "success",
      });
      const data = await res.json();
      navigate("/partner-details", {
        state: {
          partnerId: data.id,
        },
      });
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const phoneRegex = /^(09|03|07|08|05)+([0-9]{7,8})\b$/;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (name === "phone") {
      if (!value.trim()) {
        setError({ ...error, phone: "Phone number is required" });
      } else if (
        !phoneRegex.test(value) ||
        value.length > 11 ||
        value.length < 10
      ) {
        setError({ ...error, phone: "Invalid Vietnamese phone number" });
      } else {
        setError({ ...error, phone: "" });
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        setError({ ...error, email: "Email is required" });
      } else if (!emailRegex.test(value)) {
        setError({ ...error, email: "Invalid email format" });
      } else {
        setError({ ...error, email: "" });
      }
    }

    setFormInputs({ ...formInputs, [name]: value.trim() });
  };

  useEffect(() => {}, []);


  return (
    <div className="partner">
      <h2>New Partner Information</h2>
      <div>
        <div>
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
                  Representative <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="representative"
                  placeholder="Input Representative"
                  value={formInputs.representative}
                  onChange={handleInputChange}
                  style={error.representative ? { borderColor: "red" } : {}}
                />
                {error.representative && (
                  <p style={{ color: "red" }}>* is required</p>
                )}
              </div>
              <div>
                <label htmlFor="update-profile-form-2">
                  Representative Position{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="update-profile-form-2"
                  type="text"
                  name="representativePosition"
                  placeholder="Input Representative Position"
                  value={formInputs.representativePosition}
                  onChange={handleInputChange}
                  style={
                    error.representativePosition ? { borderColor: "red" } : {}
                  }
                />
                {error.representativePosition && (
                  <p style={{ color: "red" }}>* is required</p>
                )}
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="update-profile-form-3">
                  Email <span style={{ color: "red" }}>*</span>{" "}
                </label>
                <input
                  id="update-profile-form-3"
                  type="text"
                  name="email"
                  placeholder="Input Email"
                  value={formInputs.email}
                  onChange={handleInputChange}
                  style={error.email ? { borderColor: "red" } : {}}
                />
                {error.email && (
                  <p style={{ color: "red" }}>
                    {error.email !== "email is required."
                      ? error.email
                      : "* is required"}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="update-profile-form-8">
                  Tax Code <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="update-profile-form-8"
                  name="taxCode"
                  type="text"
                  placeholder="Input Tax Code"
                  value={formInputs.taxCode}
                  onChange={handleInputChange}
                  style={error.taxCode ? { borderColor: "red" } : {}}
                />
                {error.taxCode && <p style={{ color: "red" }}>* is required</p>}
              </div>             
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>
                <label htmlFor="update-profile-form-5">
                  Phone <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="update-profile-form-5"
                  type="number"
                  name="phone"
                  placeholder="Input Phone"
                  value={formInputs.phone}
                  onChange={handleInputChange}
                  style={error.phone ? { borderColor: "red" } : {}}
                />
                {error.phone && (
                  <p style={{ color: "red" }}>
                    {error.phone && (
                      <p style={{ color: "red" }}>
                        {error.phone === "phone is required."
                          ? "* is required"
                          : error.phone}
                      </p>
                    )}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="update-profile-form-6">
                  Address <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="update-profile-form-6"
                  type="text"
                  name="address"
                  placeholder="Input Address"
                  value={formInputs.address}
                  onChange={handleInputChange}
                  style={error.address ? { borderColor: "red" } : {}}
                />
                {error.address && <p style={{ color: "red" }}>* is required</p>}
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="update-profile-form-7">
                  Company Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="update-profile-form-7"
                  name="companyName"
                  type="text"
                  placeholder="Input Company Name"
                  value={formInputs.companyName}
                  onChange={handleInputChange}
                  style={error.companyName ? { borderColor: "red" } : {}}
                />
                {error.companyName && (
                  <p style={{ color: "red" }}>* is required</p>
                )}
              </div>
              <div>
                <label htmlFor="update-profile-form-7">
                Abbreviation Company Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="update-profile-form-7"
                  name="abbreviation"
                  type="text"
                  placeholder="Input Abbreviation Company Name"
                  value={formInputs.abbreviation}
                  onChange={handleInputChange}
                  style={error.abbreviation ? { borderColor: "red" } : {}}
                />
                {error.abbreviation && (
                  <p style={{ color: "red" }}>* is required</p>
                )}
              </div>
              <div className="inputDiv">
                <label className="label" htmlFor="update-profile-form-4">
                  Code <span style={{ color: "red" }}>*</span>
                </label>
                <div className="input flex" style={{ position: "relative" }}>
                  <input
                    className="inputData"
                    type={showPassword ? "text" : "password"}
                    id="update-profile-form-4"
                    name="code"
                    placeholder="Input Code"
                    value={formInputs.code}
                    onChange={handleInputChange}
                    style={
                      error.code
                        ? { borderColor: "red", paddingRight: "2.5rem" }
                        : { paddingRight: "2.5rem" }
                    }
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
                {error.code && <p style={{ color: "red" }}>* is required</p>}
              </div>
            </div>
            <div>
              {/* <button
                className="btn btn-primary"
                type="button"
                style={{
                  backgroundColor: partner?.status === 0 ? "green" : "red",
                  color: "white",
                }}
                onClick={() => handleUpdateStatusClick(partner?.id)}
              >
                {partner?.status === 0 ? "Active" : "Inactive"}
              </button> */}
              <button
                className="btn btn-primary"
                type="button"
                style={{
                  backgroundColor: "blue",
                  color: "white",
                }}
                onClick={handleFormSubmit}
              >
                Save
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

export default Partner;
