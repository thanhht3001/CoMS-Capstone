import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [users, setUsers] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dropdownMenuClass, setDropdownMenuClass] = useState(
    "inbox-filter__dropdown-menu dropdown-menu"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const filterRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");

  const roleOptions = [
    { value: 1, label: "Staff" },
    { value: 2, label: "Manager" },
    { value: 3, label: "Sale Manager" },
    { value: 4, label: "Admin" }
  ];

  const statusOptions = [
    { value: 0, label: "Inactive" },
    { value: 1, label: "Active" }
  ];

  const closeFilterMenu = (e) => {
    if (!filterRef?.current?.contains(e.target)) {
      setDropdownMenuClass('inbox-filter__dropdown-menu dropdown-menu');
    }
  }

  document.addEventListener('mousedown', closeFilterMenu);

  const fetchUserData = async () => {
    let url = `https://localhost:7073/Users?CurrentPage=1&PageSize=10`;
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
      setUsers(data.items);
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

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Users?CurrentPage=${currentPage + 1
      }&pageSize=10`,
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
      setUsers(data.items);
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
      `https://localhost:7073/Users?CurrentPage=${currentPage - 1
      }&pageSize=10`,
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
      setUsers(data.items);
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

  const handleSearchByNameChange = (event) => {
    setSearchByName(event.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      let url = `https://localhost:7073/Users?CurrentPage=1&PageSize=10&Fullname=${searchByName}`;
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
        setUsers(data.items);
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

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleStatusChange = (data) => {
    setSelectedStatus(data);
  };

  const handleRoleChange = (data) => {
    setSelectedRole(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFilterOpen(false);
    let url = `https://localhost:7073/Users?CurrentPage=1&PageSize=10&Fullname=${fullName}&Email=${email}`;
    if (selectedStatus !== null) {
      url = url + `&Status=${selectedStatus.value}`;
    }
    if (selectedRole !== null) {
      url = url + `&RoleId=${selectedRole.value}`;
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
      setUsers(data.items);
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

  const handleReset = () => {
    setIsFilterOpen(true);
    setSearchByName("");
    setFullName("");
    setEmail("");
    setSelectedStatus(null);
    setSelectedRole(null);
  };

  const handleInactiveClick = async (id) => {
    document.getElementById("option-menu-" + id).classList.remove("show");
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
          fetchUserData();
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
    document.getElementById("option-menu-" + id).classList.remove("show");
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
          fetchUserData();
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

  const handleChooseUser = (id) => {
    navigate("/user-details", {
      state: {
        userId: id,
      },
    });
  };

  const handleEditClick = (id) => {
    navigate("/edit-user", {
      state: {
        userId: id,
      },
    });
  };

  useEffect(() => {
    fetchUserData();
    const closeMenu = () => {
      setMenuOpenId(null);
    };
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div className="user-list">
      <h2 className="intro-y">User List</h2>
      <div>
        <div className="intro-y">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/create-user")}
          >
            Add New
          </button>
          <div>
            <div>
              <Icon icon="lucide:search" className="icon" />
              <input
                type="text"
                placeholder="Type User Full Name"
                value={searchByName}
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
                            Full Name
                          </label>
                          <input
                            id="input-filter-1"
                            type="text"
                            className="form-control"
                            placeholder="Type full name..."
                            value={fullName}
                            onChange={handleFullNameChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="input-filter-2"
                            className="form-labe2"
                          >
                            Email
                          </label>
                          <input
                            id="input-filter-2"
                            type="text"
                            className="form-contro2"
                            placeholder="Type email..."
                            value={email}
                            onChange={handleEmailChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="input-filter-4"
                            className="form-label"
                          >
                            Role
                          </label>
                          <Select id="input-filter-3" options={roleOptions} className="form-select flex-1"
                            value={selectedRole} onChange={handleRoleChange} />
                        </div>
                        <div>
                          <label
                            htmlFor="input-filter-4"
                            className="form-label"
                          >
                            Status
                          </label>
                          <Select id="input-filter-3" options={statusOptions} className="form-select flex-1"
                            value={selectedStatus} onChange={handleStatusChange} />
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
                <th>FULL NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr className="intro-x" id={user.id}>
                    <td>
                      <img
                        alt="Midone - HTML Admin Template"
                        class="tooltip rounded-full"
                        src={user.image}
                        title="Uploaded at 5 April 2022"
                      />
                    </td>
                    <td>
                      <a
                        href="javascript:;"
                        onClick={() => handleChooseUser(user.id)}
                      >
                        {user.fullName}
                      </a>
                      <div>{user.username}</div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.status === 0 ? (
                        <span style={{ color: "red" }}>
                          Inactive
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>
                          Active
                        </span>
                      )}
                    </td>
                    <td className="table-report__action">
                      <div>
                        <Icon
                          icon="lucide:more-horizontal"
                          className="icon"
                          onClick={(event) =>
                            toggleOptionMenu(event, user.id)
                          }
                        />
                        <div
                          id={"option-menu-" + user.id}
                          className={menuOpenId === user.id ? "show" : ""}
                        >
                          <ul className="dropdown-content">
                            <li>
                              <a
                                href="javascript:;"
                                className="dropdown-item"
                                onClick={() => handleChooseUser(user.id)}
                              >
                                {" "}
                                <Icon
                                  icon="lucide:eye"
                                  className="icon"
                                />{" "}
                                View Details{" "}
                              </a>
                            </li>
                            <li>
                              <a
                                href="javascript:;"
                                className="dropdown-item"
                                onClick={() => handleEditClick(user.id)}
                              >
                                {" "}
                                <Icon
                                  icon="bx:edit"
                                  className="icon"
                                />{" "}
                                Edit{" "}
                              </a>
                            </li>
                            {user.role === "Admin" ? (
                              <></>
                            ) : (
                              <>
                                {user.status === 1 ? (
                                  <li>
                                    <a
                                      href="javascript:;"
                                      className="dropdown-item"
                                      onClick={() =>
                                        handleInactiveClick(user.id)
                                      }
                                    >
                                      <Icon
                                        icon="dashicons:no"
                                        className="icon"
                                      />{" "}
                                      Inactive{" "}
                                    </a>
                                  </li>
                                ) : (
                                  <li>
                                    <a
                                      href="javascript:;"
                                      className="dropdown-item"
                                      onClick={() =>
                                        handleActiveClick(user.id)
                                      }
                                    >
                                      <Icon
                                        icon="subway:tick"
                                        className="icon"
                                      />{" "}
                                      Active{" "}
                                    </a>
                                  </li>
                                )}
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <h3>No users available</h3>
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
