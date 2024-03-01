import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const token = localStorage.getItem("Token");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [searchByPepresentative, setSearchByPepresentative] = useState("");
  const [pepresentative, setPepresentative] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedPartnerStatus, setSelectedPartnerStatus] = useState("1");
  const [dropdownMenuClass, setDropdownMenuClass] = useState(
    "inbox-filter__dropdown-menu dropdown-menu"
  );
  const filterRef = useRef(null); // replace with your actual logic
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSearchByNameChange = (event) => {
    setSearchByPepresentative(event.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      let url = `https://localhost:7073/Partners/all?CurrentPage=1&PageSize=5&Pepresentative=${searchByPepresentative}`;
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
        setPartners(data.items);
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
    }
  };

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Partners/all?CurrentPage=${
        currentPage + 1
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
      setPartners(data.items);
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
      `https://localhost:7073/Partners/all?CurrentPage=${
        currentPage - 1
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
      setPartners(data.items);
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

  const openFilter = () => {
    if (
      dropdownMenuClass === "inbox-filter__dropdown-menu dropdown-menu show"
    ) {
      setIsFilterOpen(false);
      setDropdownMenuClass("");
    } else {
      setIsFilterOpen(true);
      setDropdownMenuClass("inbox-filter__dropdown-menu dropdown-menu show");
    }
  };

  const handlePepresentativeChange = (event) => {
    setPepresentative(event.target.value);
  };

  const handleCompanyNameChange = (event) => {
    console.log(event.target.value);
    setCompanyName(event.target.value);
  };

  const handlePartnerStatusChange = (event) => {
    setSelectedPartnerStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFilterOpen(false);
    let url = `https://localhost:7073/Partners/all?CurrentPage=1&PageSize=5&Pepresentative=${pepresentative}`;
    if (selectedPartnerStatus != 2) {
      url = url + `&Status=${selectedPartnerStatus}`;
    }
    console.log(companyName);
    if (companyName !== null && companyName !== "") {
      url = url + `&CompanyName=${companyName}`;
    }
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
      setPartners(data.items);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleReset = () => {
    setIsFilterOpen(true);
    setSearchByPepresentative("");
    setPepresentative("");
    setCompanyName("");
    setSelectedPartnerStatus("1");
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

  const toggleOptionMenu = (event, id) => {
    event.stopPropagation();
    setMenuOpenId((prevId) => (prevId === id ? null : id));
    // Add any additional logic for handling the option menu here
    if (
      document.getElementById("option-menu-" + id).classList.contains("show")
    ) {
      document.getElementById("option-menu-" + id).classList.remove("show");
    } else {
      document.getElementById("option-menu-" + id).classList.add("show");
    }
  };

  const fetchPartnerData = async () => {
    let url = `https://localhost:7073/Partners/all?CurrentPage=1&PageSize=5`;
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
      setPartners(data.items);
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

  const handleUpdateStatusClick = async (id) => {
    document.getElementById("option-menu-" + id).classList.remove("show");
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

  const handleChoosePartner = (id) => {
    navigate("/partner-details", {
      state: {
        partnerId: id,
      },
    });
  };

  const handleChoosePartnerEdit = (id) => {
    navigate("/edit-partner", {
      state: {
        partnerId: id,
      },
    });
  };

  useEffect(() => {
    fetchPartnerData();
    const closeMenu = () => {
      setMenuOpenId(null);
    };
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div className="partner-list">
      <h2 className="intro-y">Partner List</h2>
      <div>
        <div className="intro-y">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/create-partner")}
          >
            Add New
          </button>
          <div>
            <div>
              <Icon icon="lucide:search" className="icon" />
              <input
                type="text"
                placeholder="Type Pepresentative"
                value={searchByPepresentative}
                onChange={handleSearchByNameChange}
                onKeyDown={handleKeyDown}
                disabled={isFilterOpen}
              />
              <div
                className="inbox-filter dropdown"
                data-tw-placement="bottom-start"
                ref={filterRef}
              >
                <Icon
                  icon="lucide:chevron-down"
                  onClick={openFilter}
                  className="icon"
                />
                <div className={dropdownMenuClass}>
                  <div className="dropdown-content">
                    <form onSubmit={handleSubmit}>
                      <div>
                        <div>
                          <label
                            htmlFor="input-filter-1"
                            className="form-label"
                          >
                            Prepresentative
                          </label>
                          <input
                            id="input-filter-1"
                            type="text"
                            className="form-control"
                            placeholder="Type Pepresentative"
                            value={pepresentative}
                            onChange={handlePepresentativeChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="input-filter-2"
                            className="form-labe2"
                          >
                            Company Name
                          </label>
                          <input
                            id="input-filter-2"
                            type="text"
                            className="form-contro2"
                            placeholder="Type Company Name"
                            value={companyName}
                            onChange={handleCompanyNameChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="input-filter-4"
                            className="form-label"
                          >
                            Status
                          </label>
                          <select
                            id="input-filter-4"
                            className="form-select"
                            value={selectedPartnerStatus}
                            onChange={handlePartnerStatusChange}
                          >
                            <option value="2">Status</option>
                            <option value="1">Active</option>
                            <option value="0">InActive</option>
                          </select>
                        </div>
                        <div>
                          <button
                            className="btn btn-secondary ml-2"
                            type="button"
                            onClick={handleReset}
                          >
                            Reset
                          </button>
                          <button
                            className="btn btn-primary ml-2"
                            type="submit"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro-y" style={{ overflow: 'hidden' }}>
          <table className="table table-report">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>REPRESENTATIVE</th>
                <th>EMAIL</th>
                <th>COMPANY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {partners && partners.length > 0 ? (
                partners.map((partner) => (
                  <tr className="intro-x" id={partner.id}>
                    <td>
                      <img
                        alt="Midone - HTML Admin Template"
                        class="tooltip rounded-full"
                        src={partner.image}
                        title="Uploaded at 5 April 2022"
                      />
                    </td>
                    <td>
                      <a
                        href="javascript:;"
                        onClick={() => handleChoosePartner(partner.id)}
                      >
                        {partner.representative}
                      </a>
                      <div>{partner.representativePosition}</div>
                    </td>
                    <td>{partner.email}</td>
                    <td>{partner.companyName}</td>
                    <td>
                      <span
                        style={{
                          color: partner.status === 0 ? "red" : "green",
                        }}
                      >
                        {partner.statusString}
                      </span>
                    </td>
                    <td className="table-report__action">
                      <div>
                        <Icon
                          icon="lucide:more-horizontal"
                          className="icon"
                          onClick={(event) =>
                            toggleOptionMenu(event, partner.id)
                          }
                        />
                        <div
                          id={"option-menu-" + partner.id}
                          className={menuOpenId === partner.id ? "show" : ""}
                        >
                          <ul className="dropdown-content">
                            <li>
                              <a
                                href="javascript:;"
                                className="dropdown-item"
                                onClick={() => handleChoosePartner(partner.id)}
                              >
                                {" "}
                                <Icon
                                  icon="lucide:eye"
                                  className="icon"
                                  onClick={() =>
                                    handleChoosePartner(partner.id)
                                  }
                                />{" "}
                                View Details{" "}
                              </a>
                            </li>
                            <li>
                              <a
                                href="javascript:;"
                                className="dropdown-item"
                                onClick={() => handleChoosePartnerEdit(partner.id)}
                              >
                                {" "}
                                <Icon
                                  icon="bx:edit"
                                  className="icon"
                                  onClick={() =>
                                    handleChoosePartnerEdit(partner.id)
                                  }
                                />{" "}
                                Edit{" "}
                              </a>
                            </li>
                            <li>
                              <a
                                href="javascript:;"
                                className="dropdown-item"
                                onClick={() =>
                                  handleUpdateStatusClick(partner.id)
                                }
                              >
                                <Icon
                                  icon={
                                    partner.status === 0
                                      ? "subway:tick"
                                      : "dashicons:no"
                                  }
                                  className="icon"
                                />{" "}
                                {partner.status === 0 ? "Active" : "InActive"}{" "}
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <h3>No partners available</h3>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="intro-y">
          <nav>
            <ul className="pagination">
              {/* <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-left" className="icon" /> </a>
                        </li> */}
              <li
                className={"page-item " + (hasPrevious ? "active" : "disabled")}
                onClick={fetchPrevious}
              >
                <a className="page-link" href="javascript:;">
                  {" "}
                  <Icon icon="lucide:chevron-left" className="icon" />{" "}
                </a>
              </li>
              {/* <li className="page-item"> <a className="page-link" href="#">...</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">1</a> </li>
                        <li className="page-item active"> <a className="page-link" href="#">2</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">3</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">...</a> </li> */}
              <li
                className={"page-item " + (hasNext ? "active" : "disabled")}
                onClick={fetchNext}
              >
                <a className="page-link" href="javascript:;">
                  {" "}
                  <Icon icon="lucide:chevron-right" className="icon" />{" "}
                </a>
              </li>
              {/* <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-right" className="icon" /> </a>
                        </li> */}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default List;
