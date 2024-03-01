import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";
import "../css/attachment.css";
import { filesDb } from "../../../components/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Attachment() {
  const [attachments, setAttachments] = useState([]);
  const [actionHistories, setActionHistories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentAuditPage, setCurrentAuditPage] = useState(0);
  const [isAuthor, setIsAuthor] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [hasAuditNext, setHasAuditNext] = useState(false);
  const [hasAuditPrevious, setHasAuditPrevious] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [reload, setReload] = useState(false);
  const [menuClass, setMenuClass] = useState("dropdown-menu");
  const [status, setStatus] = useState(0);
  const [isAnnexOpened, setAnnexIsOpened] = useState(false);
  const [contractAnnexes, setContractAnnexes] = useState([]);
  const [hasAnnexNext, setHasAnnexNext] = useState(false);
  const [hasAnnexPrevious, setHasAnnexPrevious] = useState(false);
  const [currentAnnexPage, setCurrentAnnexPage] = useState(0);
  const [focusedRow, setFocusedRow] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [contract, setContract] = useState(null);

  let contractId = null;
  let menuRef = useRef(null);

  try {
    if (!location.state || !location.state.contractId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No contractId provided",
      });
    } else {
      contractId = location.state.contractId;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No contractId provided",
    });
  }

  const openMenu = () => {
    if (menuClass == "dropdown-menu") {
      setMenuClass("dropdown-menu show");
    } else {
      setMenuClass("dropdown-menu");
    }
  };

  const closeMenu = (e) => {
    if (!menuRef?.current?.contains(e.target)) {
      setMenuClass("dropdown-menu");
    }
  };

  document.addEventListener("mousedown", closeMenu);

  const fetchContractData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/Contracts/id?id=${contractId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setStatus(data.status);
      setContract(data);
    } catch (error) {
      console.error("Error fetching author data:", error);
    }
  };

  const fetchAuthorData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/Contracts/author?contractId=${contractId}`,
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
      fetchContractData();
    } catch (error) {
      console.error("Error fetching author data:", error);
    }
  };

  const fetchAttachmentData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/Attachments/all?ContractId=${contractId}&CurrentPage=1&pageSize=3`,
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
      `https://localhost:7073/Attachments/all?ContractId=${contractId}&CurrentPage=${currentPage + 1
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
      `https://localhost:7073/Attachments/all?ContractId=${contractId}&CurrentPage=${currentPage - 1
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

  const fetchAuditData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/ActionHistories/contract?ContractId=${contractId}&CurrentPage=1&PageSize=5`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setActionHistories(data.items);
        setHasAuditNext(data.has_next);
        setHasAuditPrevious(data.has_previous);
        setCurrentAuditPage(data.current_page);
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.title,
        });
      }
    } catch (error) {
      console.error("Error fetching audit data:", error);
    }
  };

  const fetchAuditNext = async () => {
    if (!hasAuditNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/ActionHistories/contract?ContractId=${contractId}&CurrentPage=${currentAuditPage + 1
      }&pageSize=5`,
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
      setActionHistories(data.items);
      setHasAuditNext(data.has_next);
      setHasAuditPrevious(data.has_previous);
      setCurrentAuditPage(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const fetchAuditPrevious = async () => {
    if (!hasAuditPrevious) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/ActionHistories/contract?ContractId=${contractId}&CurrentPage=${currentAuditPage - 1
      }&pageSize=5`,
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
      setActionHistories(data.items);
      setHasAuditNext(data.has_next);
      setHasAuditPrevious(data.has_previous);
      setCurrentAuditPage(data.current_page);
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
        const res = await fetch(`https://localhost:7073/Contracts?id=${id}`, {
          mode: "cors",
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Contract has been deleted.",
            icon: "success",
          });
          navigate("/contract");
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
          const res = await fetch("https://localhost:7073/Attachments", {
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
              contractId: contractId,
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

  //test
  const handleCreateContractAnnexClick = (id) => {
    navigate("/create-contractannex", {
      state: {
        contractId: id,
      },
    });
  };

  const handleChooseContractAnnex = (id) => {
    navigate("/contractannex-details", {
      state: {
        contractAnnexId: id,
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
        const res = await fetch(`https://localhost:7073/Attachments?id=${id}`, {
          mode: "cors",
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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

  const fetchContractAnnexData = async () => {
    let url = `https://localhost:7073/ContractAnnexes/contract?IsYours=true&contractId=${contractId}&CurrentPage=1&PageSize=5`;
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
      setContractAnnexes(data.items);
      setHasAnnexNext(data.has_next);
      console.log("has next: " + data.has_next);
      setHasAnnexPrevious(data.has_previous);
      console.log("has previous: " + data.has_previous);
      setCurrentAnnexPage(data.current_page);
      console.log("current page: " + data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const fetchAnnexNext = async () => {
    if (!hasAnnexNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/ContractAnnexes/contract?IsYours=true&contractId=${contractId}&CurrentPage=${currentAnnexPage + 1
      }&pageSize=5`,
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
      setContractAnnexes(data.items);
      console.log("data item: " + data.items);
      setHasAnnexNext(data.has_next);
      setHasAnnexPrevious(data.has_previous);
      setCurrentAnnexPage(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };
  const fetchAnnexPrevious = async () => {
    if (!hasAnnexPrevious) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/ContractAnnexes/contract?IsYours=true&contractId=${contractId}&CurrentPage=${currentAnnexPage - 1
      }&pageSize=5`,
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
      setContractAnnexes(data.items);
      setHasAnnexNext(data.has_next);
      setHasAnnexPrevious(data.has_previous);
      setCurrentAnnexPage(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleAuditClick = () => {
    fetchAuditData();
    setIsOpened(true);
  };

  const handleAnnexClick = () => {
    fetchContractAnnexData();
    setAnnexIsOpened(true);
  };

  const handleCloseClick = () => {
    setIsOpened(false);
    setAnnexIsOpened(false);
  };

  useEffect(() => {
    fetchAuthorData();
    fetchAttachmentData();
  }, [reload]);

  return (
    <div>
      <div className="attachment">
        <div className="author-access">
          { (isAuthor || status === 6 ) && (
            <button className="btn btn-info" onClick={openMenu}>
              <Icon icon="iwwa:option" className="icon" />
            </button>
          )}
          <div className="intro-x dropdown profile-part" ref={menuRef}>
            <div className={menuClass}>
              <ul className="dropdown-content">
                {( status === 6) &&
                  (console.log("status: " + status),
                    (
                      <li>
                        <a
                          href="javascript:;"
                          className="dropdown-item"
                          onClick={() => handleAnnexClick()}
                        >
                          <Icon
                            icon="teenyicons:attachment-solid"
                            width={16}
                            height={16}
                          />{" "}
                          Contract Annexes
                        </a>
                      </li>
                    ))}

                {(isAuthor) ? (
                  <>
                    <li>
                      <a
                        href="javascript:;"
                        className="dropdown-item"
                        onClick={() => handleAuditClick()}
                      >
                        <Icon
                          icon="fluent-mdl2:compliance-audit"
                          width={16}
                          height={16}
                        />{" "}
                        Audit Log
                      </a>
                    </li>
                    {contract?.statusString === "Rejected" ? (
                      <>
                        <li>
                          <a
                            href="javascript:;"
                            className="dropdown-item"
                            onClick={() => handleEditClick(contractId)}
                          >
                            <Icon icon="lucide:edit" width={16} height={16} /> Edit
                          </a>
                        </li>
                        <li>
                          <a
                            href="javascript:;"
                            className="dropdown-item"
                            onClick={() => handleDeleteClick(contractId)}
                          >
                            <Icon icon="lucide:trash" width={16} height={16} />{" "}
                            Delete
                          </a>
                        </li>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </div>
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
                  <div>
                    {formatDistanceToNow(new Date(item.uploadDate))} ago
                  </div>
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
                  {/* <li className="page-item">
                                <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-left"></i> </a>
                            </li> */}
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
                  {/* <li className="page-item"> <a class="page-link" href="#">...</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">1</a> </li>
                            <li class="page-item active"> <a class="page-link" href="#">2</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">3</a> </li>
                            <li class="page-item"> <a class="page-link" href="#">...</a> </li> */}
                  <li
                    className={"page-item " + (hasNext ? "active" : "disabled")}
                    onClick={fetchNext}
                  >
                    <a className="page-link" href="javascript:;">
                      <Icon icon="lucide:chevron-right" className="icon" />
                    </a>
                  </li>
                  {/* <li class="page-item">
                                <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-right"></i> </a>
                            </li> */}
                </ul>
              </nav>
              {/* <select class="w-20 form-select box mt-3 sm:mt-0">
                        <option>10</option>
                        <option>25</option>
                        <option>35</option>
                        <option>50</option>
                    </select> */}
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
      <div style={{ display: isOpened ? "block" : "none" }} className="popup">
        <div className="popup-inner">
          <div>
            <div>
              <h1>Audit Log</h1>
              <div className="intro-y" style={{ overflow: "hidden" }}>
                <table className="table table-report">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionHistories && actionHistories.length > 0 ? (
                      actionHistories.map((actionHistory) => (
                        <tr className="intro-x" id={actionHistory.id}>
                          <td>{actionHistory.fullName}</td>
                          <td>
                            {actionHistory.actionTypeString}
                          </td>
                          <td>{actionHistory.createdAtString}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <h3>No audit data available</h3>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="intro-y">
                <nav>
                  <ul className="pagination">
                    <li
                      className={
                        "page-item " +
                        (hasAuditPrevious ? "active" : "disabled")
                      }
                      onClick={fetchAuditPrevious}
                    >
                      <a className="page-link" href="javascript:;">
                        {" "}
                        <Icon
                          icon="lucide:chevron-left"
                          className="icon"
                        />{" "}
                      </a>
                    </li>
                    <li
                      className={
                        "page-item " + (hasAuditNext ? "active" : "disabled")
                      }
                      onClick={fetchAuditNext}
                    >
                      <a className="page-link" href="javascript:;">
                        {" "}
                        <Icon
                          icon="lucide:chevron-right"
                          className="icon"
                        />{" "}
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div>
            <button className="btn btn-secondary" onClick={handleCloseClick}>
              Close
            </button>
          </div>
        </div>
      </div>

      <div
        style={{ display: isAnnexOpened ? "block" : "none" }}
        className="popup"
      >
        <div className="popup-inner">
          <div>
            <div>
              <h1>Contract Annex</h1>
              <div className="intro-y" style={{ overflow: "hidden" }}>
                <table className="table table-report">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>CREATE DATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractAnnexes && contractAnnexes.length > 0 ? (
                      contractAnnexes.map((contractAnnex) => (
                        <tr className="intro-x" id={contractAnnex.id}>
                          <td
                            onClick={() =>
                              handleChooseContractAnnex(contractAnnex.id)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {contractAnnex.code}
                          </td>
                          <td>{contractAnnex.createdDateString}</td>
                          <td>{contractAnnex.statusString}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <h3>No Contract Annex data available</h3>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="intro-y">
                <nav>
                  <ul className="pagination">
                    <li
                      className={
                        "page-item " +
                        (hasAnnexPrevious ? "active" : "disabled")
                      }
                      onClick={fetchAnnexPrevious}
                    >
                      <a className="page-link" href="javascript:;">
                        {" "}
                        <Icon
                          icon="lucide:chevron-left"
                          className="icon"
                        />{" "}
                      </a>
                    </li>
                    <li
                      className={
                        "page-item " + (hasAnnexNext ? "active" : "disabled")
                      }
                      onClick={fetchAnnexNext}
                    >
                      <a className="page-link" href="javascript:;">
                        {" "}
                        <Icon
                          icon="lucide:chevron-right"
                          className="icon"
                        />{" "}
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div>
            {isAuthor ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => handleCreateContractAnnexClick(contractId)}
                >
                  Create New
                </button>
              </>
            ) : (
              <></>
            )}

            <button className="btn btn-secondary" onClick={handleCloseClick}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attachment;
