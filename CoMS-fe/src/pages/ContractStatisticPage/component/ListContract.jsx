import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import Select from 'react-select';
import "../css/_statisticlist.css";

function List() {
  const [contracts, setContracts] = useState([]);
  const [contractCount, setContractCount] = useState([0]);
  const [services, setServices] = useState([]);
  const [servicesCount, setServicesCount] = useState([0]);
  const [servicespopup, setServicesPopup] = useState([]);
  const [contractAnnexesPopup, setContractAnnexesPopup] = useState([]);
  const [totalServicespopup, setTotalServicespopup] = useState([]);
  const [totalAnnexesPopup, setTotalAnnexesPopup] = useState([]);
  const [partners, setPartners] = useState([]);
  const [partnersCount, setPartnersCount] = useState([0]);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [searchServiceName, setSearchServiceName] = useState("");
  const [searchPartnerName, setSearchPartnerName] = useState("");
  const [serviceOrPartner, setServiceOrPartner] = useState("service");
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextService, setHasNextService] = useState(false);
  const [hasPreviousService, setHasPreviousService] = useState(false);
  const [currentPageService, setCurrentPageService] = useState(0);
  const [hasNextPartner, setHasNextPartner] = useState(false);
  const [hasPreviousPartner, setHasPreviousPartner] = useState(false);
  const [currentPagePartner, setCurrentPagePartner] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const statusOptions = [
    { value: 8, label: "Approving" },
    { value: 3, label: "Approved" },
    { value: 4, label: "Rejected" },
    { value: 1, label: "Completed" },
    // { value: 5, label: "Signed" },
    { value: 6, label: "Finalized" },
    { value: 7, label: "Liquidated" }
];
  const [serviecOfPartnerClass, setServiecOfPartnerClass] = useState(
    "serviecOfPartnerClass dropdown"
  );
  const [dropdownMenuClass, setDropdownMenuClass] = useState(
    "inbox-filter__dropdown-menu dropdown-menu"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const [isPopupVisible, setPopupVisibility] = useState(false);
  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisibility(false);
      }
    };
    if (isPopupVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.body.classList.add("overlay-active");
    } else {
      document.body.classList.remove("overlay-active");
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.classList.remove("overlay-active");
    };
  }, [isPopupVisible]);

  const [isContractAnnexPopupVisible, setContractAnnexPopupVisibility] = useState(false);
  const toggleContractAnnexPopup = () => {
    setContractAnnexPopupVisibility(!isContractAnnexPopupVisible);
  };
  const contractAnnexPopuppopupRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (contractAnnexPopuppopupRef.current && !contractAnnexPopuppopupRef.current.contains(event.target)) {
        setPopupVisibility(false);
      }
    };
    if (isContractAnnexPopupVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.body.classList.add("overlay-active");
    } else {
      document.body.classList.remove("overlay-active");
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.classList.remove("overlay-active");
    };
  }, [isContractAnnexPopupVisible]);


  const fetchContractData = async () => {
    let url = `https://localhost:7073/Contracts/statistics?CurrentPage=1&pageSize=10`;
    if (searchName !== "") {
      url = url + `&ContractName=${searchName}`;
    }
    if (serviceId !== "") {
      url = url + `&ServiceId=${serviceId}`;
    }
    if (partnerId !== "") {
      url = url + `&PartnerId=${partnerId}`;
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
      setContractCount(data.total_count);
      setContracts(data.items);
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

  const fetchServiceData = async () => {
    let url = `https://localhost:7073/Services?CurrentPage=1&PageSize=10`;
    if (searchServiceName !== "") {
      url = url + `&ServiceName=${searchServiceName}`;
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
      setServicesCount(data.total_count);
      setHasNextService(data.has_next);
      setHasPreviousService(data.has_previous);
      setCurrentPageService(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const fetchPartnerData = async () => {
    let url = `https://localhost:7073/Partners/all?CurrentPage=1&PageSize=10`;
    if (searchPartnerName !== "") {
      url = url + `&CompanyName=${searchPartnerName}`;
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
      setPartnersCount(data.total_count);
      setHasNextPartner(data.has_next);
      setHasPreviousPartner(data.has_previous);
      setCurrentPagePartner(data.current_page);
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
    setSearchName("");
    setStartDate("");
    setSelectedStatus(null);
    setEndDate("");
    setServiceId("");
    setPartnerId("");
    fetchContractData();
  };

  const handleStatusChange = (data) => {
    setSelectedStatus(data);
};

  const handleSearchByNameChange = (e) => {
    setSearchName(e.target.value);
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setEndDate("");
  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearchByServiceNameChange = (e) => {
    setSearchServiceName(e.target.value);
  };
  const handleSearchByPartnerNameChange = (e) => {
    setSearchPartnerName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFilterOpen(false);
    let url = `https://localhost:7073/Contracts/statistics?CurrentPage=1&PageSize=10`;
    if (searchName !== "") {
      url = url + `&ContractName=${searchName}`;
    }
    if (startDate !== "") {
      url = url + `&StartDate=${startDate}`;
    }
    if (endDate !== "") {
      url = url + `&EndDate=${endDate}`;
    }
    if (serviceId !== "" && partnerId ==="") {
      url = url + `&ServiceId=${serviceId}`;
    }
    if (partnerId !== "" && serviceId === "") {
      url = url + `&PartnerId=${partnerId}`;
    }
    if (selectedStatus !== null) {
      url = url + `&Status=${selectedStatus.value}`;
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
      setContracts(data.items);
      setContractCount(data.total_count);
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

  const handleChooseService = async (id) => {
    let url = `https://localhost:7073/Contracts/statistics?ServiceId=${id}&CurrentPage=1&pageSize=10`;
    if (searchName !== "") {
      url = url + `&ContractName=${searchName}`;
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
      setContractCount(data.total_count);
      setServiceId(id);
      setContracts(data.items);
      setPartnerId("");
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleChoosePartner = async (id) => {
    let url = `https://localhost:7073/Contracts/statistics?PartnerId=${id}&CurrentPage=1&pageSize=10`;
    if (searchName !== "") {
      url = url + `&ContractName=${searchName}`;
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
      setContractCount(data.total_count);
      setPartnerId(id);
      setContracts(data.items);
      setServiceId("");
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleChoosePartnerGetServices = async (id) => {
    let url = `https://localhost:7073/Services/getsbyPartnerId?partnerId=${id}`;
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
      setServicesPopup(data.items);
      setTotalServicespopup(data.total_count);
      togglePopup();
    } else {     
      const data = await res.json();
      setServicesPopup([]);
      setTotalServicespopup(0);
      togglePopup();
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: data.title,
      // });
    }
  };

  const handleChooseContractGetContractAnnexes = async (id) => {
    let url = `https://localhost:7073/ContractAnnexes/contract?contractId=${id}&Status=6&IsYours=false`;
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
      setContractAnnexesPopup(data.items);
      setTotalAnnexesPopup(data.total_count);
      toggleContractAnnexPopup();
    } else {     
      const data = await res.json();
      setContractAnnexesPopup([]);
      setTotalAnnexesPopup(0);
      toggleContractAnnexPopup();    
    }
  };

  const handleChooseContract = (id) => {
    navigate("/contract-details", {
      state: {
        contractId: id,
      },
    });
  };

  const handleContractKeyDown = async (e) => {
    if (e.key === "Enter") {
      fetchContractData();
    }
  };
  const handleServiceKeyDown = async (e) => {
    if (e.key === "Enter") {
      fetchServiceData();
    }
  };
  const handlePartnerKeyDown = async (e) => {
    if (e.key === "Enter") {
      fetchPartnerData();
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

  const openServiceOfPartner = () => {
    if (serviecOfPartnerClass == "serviecOfPartnerClass dropdown") {
      setServiecOfPartnerClass("serviecOfPartnerClass dropdown show");
    } else {
      setServiecOfPartnerClass("serviecOfPartnerClass dropdown");
    }
  };
  const closeFilterMenu = (e) => {
    if (!filterRef?.current?.contains(e.target)) {
      setDropdownMenuClass("inbox-filter__dropdown-menu dropdown-menu");
    }
  };

  document.addEventListener("mousedown", closeFilterMenu);

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate() + 1).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    let url = `https://localhost:7073/Contracts/statistics?CurrentPage=${currentPage + 1}&pageSize=10`;
    if (searchName !== "") {
      url = url + `&ContractName=${searchName}`;
    }
    if (serviceId !== "") {
      url = url + `&ServiceId=${serviceId}`;
    }
    if (partnerId !== "") {
      url = url + `&PartnerId=${partnerId}`;
    }
    const res = await fetch(url,
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
      setContractCount(data.total_count);
      setContracts(data.items);
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
    }let url = `https://localhost:7073/Contracts/statistics?CurrentPage=${currentPage - 1}&pageSize=10`;
    if (searchName !== "") {
      url = url + `&ContractName=${searchName}`;
    }
    if (serviceId !== "") {
      url = url + `&ServiceId=${serviceId}`;
    }
    if (partnerId !== "") {
      url = url + `&PartnerId=${partnerId}`;
    }
    const res = await fetch(url,
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
      setContractCount(data.total_count);
      setContracts(data.items);
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

  const fetchNextService = async () => {
    if (!hasNextService) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Services?CurrentPage=${
        currentPageService + 1
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
      setHasNextService(data.has_next);
      setHasPreviousService(data.has_previous);
      setCurrentPageService(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const fetchPreviousService = async () => {
    if (!hasPreviousService) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Services?CurrentPage=${
        currentPageService - 1
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
      setHasNextService(data.has_next);
      setHasPreviousService(data.has_previous);
      setCurrentPageService(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const fetchNextPartner = async () => {
    if (!hasNextPartner) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Partners/all?CurrentPage=${
        currentPagePartner + 1
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
      setPartners(data.items);
      setHasNextPartner(data.has_next);
      setHasPreviousPartner(data.has_previous);
      setCurrentPagePartner(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const fetchPreviousPartner = async () => {
    if (!hasPreviousPartner) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Partners/all?CurrentPage=${
        currentPagePartner - 1
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
      setPartners(data.items);
      setHasNextPartner(data.has_next);
      setHasPreviousPartner(data.has_previous);
      setCurrentPagePartner(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleToggleServiceOrPartner = (view) => {  
    setServiceId("");
    setPartnerId("");
    setServiceOrPartner(view);
  };

  useEffect(() => {
    fetchContractData();
    fetchServiceData();
    fetchPartnerData();
  }, []);

  useEffect(() => {
    fetchContractData();
  }, [serviceId, partnerId]);

  const totalServicesPrice = services?.reduce(
    (total, service) => total + service?.price,
    0
  );
  const totalServicesPricePopup = servicespopup?.reduce(
    (total, servicepopup) => total + servicepopup?.price,
    0
  );

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 0.6, marginRight: "20px" }}>
        {serviceOrPartner === "service" ? (
          <div className="services-list">
            <div>
              <div className="intro-y">
                <div style={{ display: "flex", alignItems: "center" }}>
                  
                  <div className="toggle-buttons">
                    <button
                      onClick={() => handleToggleServiceOrPartner("service")}
                      className={serviceOrPartner === "service" ? "active" : ""}
                    >
                      Service
                    </button>
                    <button
                      onClick={() => handleToggleServiceOrPartner("partner")}
                      className={serviceOrPartner === "partner" ? "active" : ""}
                    >
                      Partner
                    </button>
                  </div>
                  <div
                    style={{
                      marginLeft: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      className="form-control box"
                      placeholder="Search service..."
                      value={searchServiceName}
                      onChange={handleSearchByServiceNameChange}
                      onKeyDown={handleServiceKeyDown}
                    />
                    <Icon icon="lucide:search" className="icon" />
                  </div>
                </div>
              </div>
              <div className="intro-y">
                <table className="table table-report">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>CATEGORY</th>
                      <th>PRICE (Vnd)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr
                        className="intro-x"
                        onClick={() => handleChooseService(service.id)}
                      >
                        <td>
                          {service.serviceName && service.serviceName.length > 15 ? (
                            <a title={service.serviceName}>
                              {service.serviceName.slice(0, 15)}...
                            </a>
                          ) : (
                            <a>{service.serviceName}</a>
                          )}
                        </td>
                        <td>
                          <div className="text-danger">
                            {service.contractCategoryName}{" "}
                          </div>
                        </td>
                        <td>{service.price}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#00ff00' }}>
                      <td>Total: {servicesCount}</td>
                      <td> </td>
                      <td> {totalServicesPrice} Vnd</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                className="intro-y"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <nav>
                  <ul className="pagination">
                    <li
                      className={
                        "page-item " +
                        (hasPreviousService ? "active" : "disabled")
                      }
                      onClick={fetchPreviousService}
                    >
                      <a className="page-link">
                        <Icon icon="lucide:chevron-left" className="icon" />
                      </a>
                    </li>
                    <li
                      className={
                        "page-item " + (hasNextService ? "active" : "disabled")
                      }
                      onClick={fetchNextService}
                    >
                      <a className="page-link">
                        <Icon icon="lucide:chevron-right" className="icon" />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        ) : (
          <div className="partners-list">
            <div>
              <div className="intro-y">
                <div style={{ display: "flex", alignItems: "center" }}>
                  
                  <div className="toggle-buttons">
                    <button
                      onClick={() => handleToggleServiceOrPartner("service")}
                      className={serviceOrPartner === "service" ? "active" : ""}
                    >
                      Service
                    </button>
                    <button
                      onClick={() => handleToggleServiceOrPartner("partner")}
                      className={serviceOrPartner === "partner" ? "active" : ""}
                    >
                      Partner
                    </button>
                  </div>
                  <div
                    style={{
                      marginLeft: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      className="form-control box"
                      placeholder="Search partner..."
                      value={searchPartnerName}
                      onChange={handleSearchByPartnerNameChange}
                      onKeyDown={handlePartnerKeyDown}
                    />
                    <Icon icon="lucide:search" className="icon" />
                  </div>
                </div>
              </div>
              <div className="intro-y">
                <table className="table table-report">
                  <thead>
                    <tr>
                      <th>COMPANY NAME</th>
                      <th></th>
                      <th>SERVICES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr className="intro-x">
                        <td>
                          <a onClick={() => handleChoosePartner(partner.id)}>
                            {partner.companyName && partner.companyName.length > 15 ? (
                              <a title={partner.companyName}>
                                {partner.companyName.slice(0, 15)}...
                              </a>
                            ) : (
                              <a>{partner.companyName}</a>
                            )}
                          </a>
                        </td>
                        <td>
                          {/* {partner.representative.length > 15 ? (
                              <a title={partner.representative}>
                                {partner.representative.slice(0, 15)}...
                              </a>
                            ) : (
                              <a>{partner.representative}</a>
                            )}  */}
                            </td>
                        <td>
                          <Icon
                            icon="lucide:eye"
                            className="icon"
                            onClick={() =>
                              handleChoosePartnerGetServices(partner.id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total partners:</td>
                      <td></td>
                      <td>{partnersCount} </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {isPopupVisible && (
                <div className="overlay">
                  <div ref={popupRef} className="popup">
                    <h2 style={{fontSize : 25, marginBottom: 10}}> List services</h2>
                    <Icon
                      icon="carbon:close-outline"
                      className="popup-close-icon"
                      onClick={togglePopup}
                    />
                    <h3 className="popup-title" style={{fontSize : 15}}>Total: {totalServicespopup}  </h3>
                    { servicespopup?.length > 0 ? (
                      <table className="table-service-report">
                        <thead>
                          <tr>
                            <th>SERVICE NAME</th>
                            <th style={{textAlign: "center"}}>PRICE (Vnd)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {servicespopup.map((servicepopup, index) => (
                            <tr key={index} className="intro-x">
                              <td>
                              {servicepopup.serviceName && servicepopup.serviceName.length > 25 ? (
                              <a title={servicepopup.serviceName}>
                                {servicepopup.serviceName.slice(0, 25)}...
                              </a>
                            ) : (
                              <a>{servicepopup.serviceName}</a>
                            )}</td>
                              <td style={{textAlign: "center"}}>{servicepopup.price}</td>
                            </tr>
                          ))}
                          <tr style={{backgroundColor: "#f2f2f2"}}>
                            <td>Total price: </td>
                            <td style={{textAlign: "center"}}>{totalServicesPricePopup} </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <p>No services available</p>
                    )}
                  </div>
                </div>
              )}
              <div className="intro-y">
                <nav>
                  <ul className="pagination">
                    <li
                      className={
                        "page-item " +
                        (hasPreviousPartner ? "active" : "disabled")
                      }
                      onClick={fetchPreviousPartner}
                    >
                      <a className="page-link">
                        <Icon icon="lucide:chevron-left" className="icon" />
                      </a>
                    </li>
                    <li
                      className={
                        "page-item " + (hasNextPartner ? "active" : "disabled")
                      }
                      onClick={fetchNextPartner}
                    >
                      <a className="page-link">
                        <Icon icon="lucide:chevron-right" className="icon" />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="contracts-statistic-list" style={{ flex: 1.4 }}>
        <div>
          <div className="intro-y" style={{ display: "flex" }}>
            <div className="h2" style={{ flex: 1, marginLeft: "0px" }}>
              <h2 className="intro-y">List contracts</h2>
              <a>Total: {contractCount}</a>
            </div>
            <div className="search" style={{ flex: 1, marginRight: "0px" }}>
              <div>
                <Icon icon="lucide:search" className="icon" />
                <input
                  type="text"
                  className="form-control box"
                  placeholder="Type contract name..."
                  value={searchName}
                  onChange={handleSearchByNameChange}
                  onKeyDown={handleContractKeyDown}
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
                              Contract Name
                            </label>
                            <input
                              id="input-filter-1"
                              type="text"
                              className="form-control"
                              placeholder="Type contract name..."
                              value={searchName}
                              onChange={handleSearchByNameChange}
                            />
                          </div>
                          <div> <label
                                                        htmlFor="input-filter-4"
                                                        className="form-label"
                                                    >
                                                        Status
                                                    </label>
                                                    <Select id="input-filter-3" options={statusOptions} className="form-select flex-1"
                                                        value={selectedStatus} onChange={handleStatusChange} /></div>
                          <div>
                            <label
                              htmlFor="input-filter-4"
                              className="form-label"
                            >
                              Start Date
                            </label>
                            <input
                              id="input-filter-4"
                              type="datetime-local"
                              className="form-contro2"
                              placeholder="Type start date..."
                              value={startDate}
                              min={getMinDateTime()}
                              onChange={handleStartDateChange}
                            /></div>
                          <div>
                            <label
                              htmlFor="input-filter-e"
                              className="form-label"
                            >
                              End Date
                            </label>
                            <input
                              id="input-filter-e"
                              type="datetime-local"
                              className="form-contro2"
                              placeholder="Type end date..."
                              value={endDate}
                              min={startDate}
                              onChange={handleEndDateChange}
                            />
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
          <div className="intro-y">           
            <table className="table table-report">
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>CONTRACT NAME</th>
                  <th>CREATED AT</th>
                  <th>STATUS</th>
                  <th>ANNEXES</th>
                </tr>
              </thead>
              {contracts?.length > 0 ? (
              <tbody>                
                {contracts?.map((contract) => (
                  <tr className="intro-x" id={contract.id}>
                    <td>
                      <div>
                        <div className="w-10 h-10 image-fit zoom-in">
                        {contract.code && contract.code.length > 15 ? (
                            <a title={contract.code}>
                              {contract.code.slice(0, 15)}...
                            </a>
                          ) : (
                            <a>{contract.code}</a>
                          )}
                          {/* <img alt="Midone - HTML Admin Template" class="tooltip rounded-full" src="dist/images/preview-15.jpg" title="Uploaded at 5 April 2022" /> */}
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        href="javascript:;"
                        onClick={() => handleChooseContract(contract.id)}
                      >{contract.contractName && contract.contractName.length > 15 ? (
                        <a title={contract.contractName}>
                          {contract.contractName.slice(0, 15)}...
                        </a>
                      ) : (
                        <a>{contract.contractName}</a>
                      )}
                       
                      </a>
                      <div>
                      {contract.partnerName && contract.partnerName.length > 15 ? (
                              <a title={contract.partnerName}>
                                {contract.partnerName.slice(0, 15)}...
                              </a>
                            ) : (
                              <a>{contract.partnerName}</a>
                            )}
                            </div>
                    </td>
                    <td>{contract.createdDateString}</td>
                    <td>
                      <div className="text-danger">
                        {contract.statusString}{" "}
                      </div>
                    </td>
                    <td>
                          <Icon
                            icon="lucide:eye"
                            className="icon"
                            onClick={() =>
                              handleChooseContractGetContractAnnexes(contract.id)
                            }
                          />
                        </td>
                  </tr>
                ))}
              </tbody>
              ):
              (
  <p>No contract available</p>
              )}
            </table>
            
            {isContractAnnexPopupVisible && (
                <div className="overlay">
                  <div ref={contractAnnexPopuppopupRef} className="popup">
                    <h2 style={{fontSize : 25, marginBottom: 10}}> List contract annexes</h2>
                    <Icon
                      icon="carbon:close-outline"
                      className="popup-close-icon"
                      onClick={toggleContractAnnexPopup}
                    />
                    <h2 className="popup-title" style={{fontSize : 15}}>Total: {totalAnnexesPopup}  </h2>
                    { contractAnnexesPopup?.length > 0 ? (
                      <table className="table-annex-report">
                        <thead>
                          <tr>
                            <th>CONTRACT ANNEX CODE</th>
                            <th>CREATE DATE</th>
                            <th>STATUS</th>
                            {/* <th style={{textAlign: "center"}}>PRICE (Vnd)</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {contractAnnexesPopup.map((contractAnnexe, index) => (
                            <tr key={index} className="intro-x">
                              <td>
                              {contractAnnexe.code && contractAnnexe.code.length > 25 ? (
                              <a title={contractAnnexe.code}>
                                {contractAnnexe.code.slice(0, 25)}...
                              </a>
                            ) : (
                              <a>{contractAnnexe.code}</a>
                            )}
                            </td>
                              <td >{contractAnnexe.createdDateString}</td>
                              <td >{contractAnnexe.statusString}</td>
                            </tr>
                          ))}
                          
                        </tbody>
                      </table>
                    ) : (
                      <p>No contract annex available</p>
                    )}
                  </div>
                </div>
              )}
          </div>
          <div className="intro-y">
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
      </div>
    </div>
  );
}

export default List;
