import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";
import "../css/attachment.css";
import { filesDb } from "../../../components/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Attachment() {
  const [attachments, setAttachments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAuthor, setIsAuthor] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [reload, setReload] = useState(false);
  const [contractAnnex, setContractAnnex] = useState(null);

  let contractAnnexId = null;

  try {
    if (!location.state || !location.state.contractAnnexId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No contractAnnexId provided",
      });
    } else {
      contractAnnexId = location.state.contractAnnexId;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No contractAnnexId provided",
    });
    console.log("Error:", error);
  }

  const fetchContractAnnex = async () => {
    try {
      console.log("Fetching contract annex...");
      const response = await fetch(
        `https://localhost:7073/ContractAnnexes/id?id=${contractAnnexId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setContractAnnex(data);
    } catch (error) {
      console.error("Error fetching contract annex:", error);
    }
  };

  const fetchAuthorData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/ContractAnnexes/author?contractAnnexId=${contractAnnexId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setIsAuthor(data.isAuthor);
    } catch (error) {
      console.error("Error fetching author data:", error);
    }
  };

  const openOptionMenu = (id) => {
    if (
      document.getElementById("option-menu-" + id).classList.contains("show")
    ) {
      document.getElementById("option-menu-" + id).classList.remove("show");
    } else {
      document.getElementById("option-menu-" + id).classList.add("show");
    }
  };

  const fetchAttachmentData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/Attachments/annex?ContractAnnexId=${contractAnnexId}&CurrentPage=1&pageSize=3`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setAttachments(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Error fetching attachment:", error);
    }
  };

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Attachments/annex?ContractAnnexId=${contractAnnexId}&CurrentPage=${
        currentPage + 1
      }&pageSize=3`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      setAttachments(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const fetchPrevious = async () => {
    if (!hasPrevious) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Attachments/annex?ContractAnnexId=${contractAnnexId}&CurrentPage=${
        currentPage - 1
      }&pageSize=3`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      setAttachments(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://localhost:7073/ContractAnnexes/id?id=${id}`,
          {
            mode: "cors",
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Contract Annex has been deleted.",
            icon: "success",
          });
          navigate("/contractannex");
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

  const handleUploadClick = async () => {
    const { value: file } = await Swal.fire({
      title: "Select file",
      input: "file",
      inputAttributes: {
        accept:
          "image/*,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "aria-label": "Upload your attachment",
      },
    });

    if (file) {
      let filename = file.name;
      let storageRef = ref(filesDb, `attachments/${filename}`);

      getDownloadURL(storageRef)
        .then(async (url) => {
          const { value: newFilename } = await Swal.fire({
            title: "File already exists",
            text: "Do you want to rename the file?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, rename it!",
            cancelButtonText: "No, keep the same!",
            input: "text",
            inputPlaceholder: "Enter new filename",
          });

          if (newFilename) {
            // Get the file extension
            const fileExtension = filename.split(".").pop();

            // Append the file extension to the new filename
            filename = `${newFilename}.${fileExtension}`;

            handleUpload(file, filename);
            console.log("new filename: " + filename);
          }
        })
        .catch((error) => {
          if (error.code === "storage/object-not-found") {
            // File doesn't exist
            handleUpload(file, filename);
            console.log("filename1: " + filename);
          }
        });
    }
  };

  const handleUpload = async (file, filename) => {
    let storageRef = ref(filesDb, `attachments/${filename}`);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const uploadTask = uploadBytesResumable(storageRef, file);
      let url;

      uploadTask.on(
        "state_changed",
        async (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          Swal.fire({
            title: "Uploading...",
            html: `Progress: <b>${Math.round(progress)}</b>%`,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        },
        (error) => {
          // Handle the error here
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Upload fails.",
          });
        },
        async () => {
          // Upload completed successfully, now we can get the download URL
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            url = downloadURL;
          });
          //convert date to ISO 8601 format
          let dateStr = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Ho_Chi_Minh",
          });
          let dateObj = new Date(dateStr);
          let isoStr =
            dateObj.getFullYear() +
            "-" +
            ("0" + (dateObj.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + dateObj.getDate()).slice(-2) +
            "T" +
            ("0" + dateObj.getHours()).slice(-2) +
            ":" +
            ("0" + dateObj.getMinutes()).slice(-2) +
            ":" +
            ("0" + dateObj.getSeconds()).slice(-2) +
            "." +
            ("00" + dateObj.getMilliseconds()).slice(-3) +
            "Z";
          const res = await fetch("https://localhost:7073/Attachments/annex", {
            mode: "cors",
            method: "POST",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            }),
            body: JSON.stringify({
              fileName: filename,
              fileLink: url,
              uploadDate: isoStr,
              description: "New attachment",
              contractAnnexId: contractAnnexId,
            }),
          });
          if (res.status === 200) {
            Swal.fire({
              title: "Uploaded!",
              text: "Your file has been uploaded.",
              icon: "success",
              showConfirmButton: true,
            });
          } else {
            const data = await res.json();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.title,
            });
          }
          setReload(!reload);
        }
      );
    };
    reader.readAsDataURL(file);
    fetchAttachmentData();
  };

  const handleEditClick = (id) => {
    navigate("/edit-partner-service", {
      state: {
        contractId: id,
      },
    });
  };

  const handleDeleteAttachmentClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://localhost:7073/Attachments/annex?id=${id}`,
          {
            mode: "cors",
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Attachment has been deleted.",
            icon: "success",
          });
          fetchAttachmentData();
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
    fetchAuthorData();
    fetchContractAnnex();
    fetchAttachmentData();
  }, [contractAnnexId, reload]);

  return (
    <div className="attachment-annex">
      <div className="author-access">
        {/* <button
          className="btn btn-secondary"
          onClick={() => handleEditClick(contractAnnexId)}
          disabled={!isAuthor}
          style={!isAuthor ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <Icon icon="lucide:edit" className="icon" />
        </button> */}
        <button
          className="btn btn-danger"
          onClick={() => handleDeleteClick(contractAnnexId)}
          disabled={!isAuthor}
          style={!isAuthor ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <Icon icon="lucide:trash" className="icon" />
        </button>
      </div>
      <h2 class="text-lg font-medium truncate mr-5 mt-4 mb-2">
        Attachments
        {isAuthor ? (
          <button onClick={() => handleUploadClick()}>
            {" "}
            <Icon icon="lucide:plus" className="icon" />{" "}
          </button>
        ) : (
          <></>
        )}
      </h2>
      {attachments.length > 0 ? (
        <div>
          {attachments.map((item) => (
            <div>
              <div>
                <a href="">
                  <Icon icon="mdi:file" className="icon" />
                </a>
              </div>
              <div>
                <a href={item.fileLink}>{item.fileName}</a>
                <div>{formatDistanceToNow(new Date(item.uploadDate))} ago</div>
              </div>
              {isAuthor ? (
                <div className="options">
                  <div>
                    <Icon
                      icon="lucide:trash"
                      className="icon"
                      onClick={() => handleDeleteAttachmentClick(item?.id)}
                    />
                    {/* <div id={"option-menu-" + item?.id}>
                      <ul className="dropdown-content">
                        <li>
                          <a href="javascript:;" className="dropdown-item" onClick={() => handleEditClick(item?.id, item?.content)}>
                            <Icon icon="bx:edit" className="icon" />
                            Edit </a>
                        </li>
                        <li>
                          <a href="javascript:;" className="dropdown-item" onClick={() => handleDeleteClick(item?.id)}>
                            <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
          <div className="intro-y paging">
            <nav>
              <ul className="pagination">
                <li
                  className={
                    "page-item " + (hasPrevious ? "active" : "disabled")
                  }
                  onClick={fetchPrevious}
                >
                  <a className="page-link" href="javascript:;">
                    <Icon icon="lucide:chevron-left" className="icon" />
                  </a>
                </li>
                <li
                  className={"page-item " + (hasNext ? "active" : "disabled")}
                  onClick={fetchNext}
                >
                  <a className="page-link" href="javascript:;">
                    <Icon icon="lucide:chevron-right" className="icon" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
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
