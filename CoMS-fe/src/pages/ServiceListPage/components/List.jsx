import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [services, setServices] = useState([]);
  const [contractCategories, setContractCategories] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [dropdownMenuClass, setDropdownMenuClass] = useState(
    "inbox-filter__dropdown-menu dropdown-menu"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [price, setPrice] = useState(1000000);
  const [editingId, setEditingId] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedContractCategory, setSelectedContractCategory] = useState(null);
  const [selectedNewContractCategory, setNewSelectedContractCategory] = useState(null);
  const filterRef = useRef(null); // replace with your actual logic
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");

  const contractCategoryList = contractCategories.map(category => {
    return { label: category.categoryName, value: category.id }
  })

  const fetchServiceData = async () => {
    let url = `https://localhost:7073/Services?CurrentPage=1&PageSize=10`;
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
      setServices(data.items);
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
      `https://localhost:7073/Services?CurrentPage=${currentPage + 1
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
      setServices(data.items);
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
      `https://localhost:7073/Services?CurrentPage=${currentPage - 1
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
      setServices(data.items);
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

  const fetchContractCategoryData = async () => {
    const res = await fetch("https://localhost:7073/ContractCategories/active", {
      mode: "cors",
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      setContractCategories(data);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.title
      })
    }
  };

  const handleSearchByNameChange = (event) => {
    setSearchByName(event.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      let url = `https://localhost:7073/Services?CurrentPage=1&PageSize=10&ServiceName=${searchByName}`;
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
        setServices(data.items);
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

  const handleServiceNameChange = (event) => {
    setServiceName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFilterOpen(false);
    let url = `https://localhost:7073/Services?CurrentPage=1&PageSize=10&ServiceName=${serviceName}`;
    if (selectedContractCategory !== null) {
      url += `&ContractCategoryId=${selectedContractCategory.value}`;
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
      setServices(data.items);
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
    setServiceName("");
    setSelectedContractCategory(null);
    fetchServiceData();
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

  const handleDeleteClick = async (id) => {
    document.getElementById("option-menu-" + id).classList.remove("show");
    Swal.fire({
      title: "Are you sure?",
      text: "This service will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://localhost:7073/Services?id=${id}`,
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
            text: "Service has been deleted.",
            icon: "success",
          });
          fetchServiceData();
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

  const handleEditClick = (id, name, description, price, contractCategoryId, contractCategoryName) => {
    setEditingId(id);
    setNewServiceName(name);
    setDescription(description);
    setPrice(price);
    setNewSelectedContractCategory({ value: contractCategoryId, label: contractCategoryName });
    setIsOpened(true);
  };

  const handleSelectContractCategory = (data) => {
    setSelectedContractCategory(data);
  }

  const handleSelectNewContractCategory = (data) => {
    setNewSelectedContractCategory(data);
  }

  const handleCreate = async (event) => {
    event.preventDefault();
    if(newServiceName.trim().length <= 0){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Service name is not empty!",
      });
      return;
    }
    if(description.trim().length <= 0){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Service description is not empty!",
      });
      return;
    }
    if (editingId > 0) {
      var newArray = services.filter(function (service) {
        return service.id !== editingId && service.serviceName.toUpperCase() === newServiceName.toUpperCase()
      });
      if (newArray.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Service name already exists!",
        });
        return;
      }
      console.log(editingId);
      let url = `https://localhost:7073/Services?id=${editingId}`;
      const res = await fetch(url, {
        mode: "cors",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "serviceName": newServiceName, "description": description, "price": price,
          "contractCategoryId": selectedNewContractCategory.value
        })
      });
      if (res.status === 200) {
        setIsOpened(false);
        setNewServiceName("");
        setDescription("");
        setNewSelectedContractCategory(null);
        setEditingId(0);
        Swal.fire({
          title: "Successfully!",
          text: "Service has been updated.",
          icon: "success",
        });
        fetchServiceData();
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.title,
        });
      }
    } else {
      var newArray = services.filter(function (service) {
        return service.serviceName.toUpperCase() === newServiceName.toUpperCase()
      });
      if (newArray.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Service name already exists!",
        });
        return;
      }
      let url = `https://localhost:7073/Services`;
      const res = await fetch(url, {
        mode: "cors",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "serviceName": newServiceName, "description": description, "price": price,
          "contractCategoryId": selectedNewContractCategory.value
        })
      });
      if (res.status === 200) {
        setIsOpened(false);
        setNewServiceName("");
        setDescription("");
        setNewSelectedContractCategory(null);
        Swal.fire({
          title: "Successfully!",
          text: "New service has been created.",
          icon: "success",
        });
        fetchServiceData();
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

  const handleNewServiceNameChange = (event) => {
    setNewServiceName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleCloseClick = () => {
    setIsOpened(false);
    setIsFetching(false);
    setNewServiceName("");
    setDescription("");
    setNewSelectedContractCategory(null);
    setEditingId(0);
  };

  useEffect(() => {
    setIsFetching(false);
    fetchServiceData();
    fetchContractCategoryData();
    const closeMenu = () => {
      setMenuOpenId(null);
    };
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div>
      <div className="service-list">
        <h2 className="intro-y">Service List</h2>
        <div>
          <div className="intro-y">
            <button
              className="btn btn-primary"
              onClick={() => setIsOpened(true)}
            >
              Add New
            </button>
            <div>
              <div>
                <Icon icon="lucide:search" className="icon" />
                <input
                  type="text"
                  placeholder="Type service name..."
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
                              Service Name
                            </label>
                            <input
                              id="input-filter-1"
                              type="text"
                              className="form-control"
                              placeholder="Type service name..."
                              value={serviceName}
                              onChange={handleServiceNameChange}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="input-filter-4"
                              className="form-label"
                            >
                              Contract Category
                            </label>
                            <Select id="input-filter-3" options={contractCategoryList} className="form-select flex-1"
                              value={selectedContractCategory} onChange={handleSelectContractCategory} />
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
                  <th>SERVICE NAME</th>
                  <th>DESCRIPTION</th>
                  <th>PRICE</th>
                  <th>CONTRACT CATEGORY</th>
                  {/* <th>STATUS</th> */}
                </tr>
              </thead>
              <tbody>
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <tr className="intro-x" id={service.id}>
                      <td>
                        {service.serviceName}
                      </td>
                      <td>
                        {/* <a
                        href="javascript:;"
                        onClick={() => handleChoosePartner(service.id)}
                      >
                        {service.description}
                      </a>
                      <div>{service.representativePosition}</div> */}
                        {service.description}
                      </td>
                      <td>{service.price}</td>
                      <td>{service.contractCategoryName}</td>
                      {/* <td>
                      <span
                        style={{
                          color: service.status === 0 ? "red" : "green",
                        }}
                      >
                        {service.statusString}
                      </span>
                    </td> */}
                      <td className="table-report__action">
                        <div>
                          <Icon
                            icon="lucide:more-horizontal"
                            className="icon"
                            onClick={(event) =>
                              toggleOptionMenu(event, service.id)
                            }
                          />
                          <div
                            id={"option-menu-" + service.id}
                            className={menuOpenId === service.id ? "show" : ""}
                          >
                            <ul className="dropdown-content">
                              {/* <li>
                                <a
                                  href="javascript:;"
                                  className="dropdown-item"
                                  onClick={() => handleChoosePartner(service.id)}
                                >
                                  {" "}
                                  <Icon
                                    icon="lucide:eye"
                                    className="icon"
                                    onClick={() =>
                                      handleChoosePartner(service.id)
                                    }
                                  />{" "}
                                  View Details{" "}
                                </a>
                              </li> */}
                              <li>
                                <a
                                  href="javascript:;"
                                  className="dropdown-item"
                                  onClick={() => handleEditClick(service.id, service.serviceName, service.description, service.price,
                                    service.contractCategoryId, service.contractCategoryName)}
                                >
                                  {" "}
                                  <Icon
                                    icon="bx:edit"
                                    className="icon"
                                  />{" "}
                                  Edit{" "}
                                </a>
                              </li>
                              <li>
                                <a
                                  href="javascript:;"
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleDeleteClick(service.id)
                                  }
                                >
                                  <Icon icon="lucide:trash" className='icon' />{" "}
                                  Delete{" "}
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
                    <h3>No services available</h3>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="intro-y">
            <nav>
              <ul className="pagination">
                <li
                  className={"page-item " + (hasPrevious ? "active" : "disabled")}
                  onClick={fetchPrevious}
                >
                  <a className="page-link" href="javascript:;">
                    {" "}
                    <Icon icon="lucide:chevron-left" className="icon" />{" "}
                  </a>
                </li>
                <li
                  className={"page-item " + (hasNext ? "active" : "disabled")}
                  onClick={fetchNext}
                >
                  <a className="page-link" href="javascript:;">
                    {" "}
                    <Icon icon="lucide:chevron-right" className="icon" />{" "}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div style={{ display: isOpened ? "block" : "none" }} className="popup">
        <div className="popup-inner">
          {editingId > 0 ? (<h2>Edit Service</h2>) : (<h2>Add New Service</h2>)}
          <form onSubmit={handleCreate}>
            <label className="form-label">
              Service Name:
              <input className="form-control" type="text" placeholder="Type service name..." maxLength={50} value={newServiceName}
                onChange={handleNewServiceNameChange} required />
            </label>
            <label className="form-label">
              Description:
              <textarea className="form-control" placeholder="Type service description..." rows={3} maxLength={250} value={description}
                onChange={handleDescriptionChange} required />
            </label>
            <label className="form-label">
              Price:
              <input className="form-control" type="number" placeholder="Type price..." min={1000000} value={price}
                onChange={handlePriceChange} required />
            </label>
            <label className="form-label">
              Contract Category:
              <Select id="select-category" options={contractCategoryList} className="form-select" value={selectedNewContractCategory}
                onChange={handleSelectNewContractCategory} required />
            </label>
            <div>
              <button className="btn btn-secondary" type="button" onClick={handleCloseClick}>Close</button>
              <button className="btn btn-primary" type="submit"><Icon icon="line-md:loading-alt-loop"
                style={{ display: isFetching ? "block" : "none" }} className='icon' />Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default List;
