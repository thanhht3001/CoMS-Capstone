import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [contractAnnexes, setContractAnnexes] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [contractCode, setContractCode] = useState("");
  const [dropdownMenuClass, setDropdownMenuClass] = useState(
    "inbox-filter__dropdown-menu dropdown-menu"
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [version, setVersion] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");

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

  const closeFilterMenu = (e) => {
    if (!filterRef?.current?.contains(e.target)) {
      setDropdownMenuClass("inbox-filter__dropdown-menu dropdown-menu");
    }
  };

  document.addEventListener("mousedown", closeFilterMenu);

  const fetchContractData = async () => {
    let url = `https://localhost:7073/ContractAnnexes/partner?DocumentStatus=3&IsApproved=false&CurrentPage=1&PageSize=20`;
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
      `https://localhost:7073/ContractAnnexes/partner?DocumentStatus=3&IsApproved=false&CurrentPage=${
        currentPage + 1
      }&pageSize=20`,
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
      `https://localhost:7073/ContractAnnexes/partner?DocumentStatus=3&IsApproved=false&CurrentPage=${
        currentPage - 1
      }&pageSize=20`,
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

  const handleChooseContractAnnex = (id) => {
    navigate("/partner-approve-contractannex-details", {
      state: {
        contractAnnexId: id,
      },
    });
  };
  const handleChooseContract = (id) => {
    navigate("/partner-contract-details", {
      state: {
        contractId: id,
      },
    });
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      let url = `https://localhost:7073/ContractAnnexes/partner?ContractAnnexName=${searchByName}&DocumentStatus=3&IsApproved=false&CurrentPage=1&PageSize=20`;
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

  const handleSearchByNameChange = (e) => {
    setSearchByName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFilterOpen(false);
    let url = `https://localhost:7073/ContractAnnexes/partner?IsApproved=false&CurrentPage=1&PageSize=10&Code=${contractCode}`;
    if (version > 0) {
      url = url + `&Version=${version}`;
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
      setContractAnnexes(data.items);
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
    setContractCode("");
    setVersion(0);
    fetchContractData();
  };

  const handleContractCodeChange = (e) => {
    setContractCode(e.target.value);
  };

  const handleVersionChange = (e) => {
    setVersion(e.target.value);
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <div className="partner-waiting-contract-annex-list">
      <h2 className="intro-y">Waiting Contract Annex List</h2>
      <div>
        <div className="intro-y">
          {/* <button className="btn btn-primary" onClick={() => navigate("/choose-template")}>Add New</button> */}
          {/* <div class="dropdown">
                <button class="dropdown-toggle btn px-2 box" aria-expanded="false" data-tw-toggle="dropdown">
                    <span class="w-5 h-5 flex items-center justify-center"> <i class="w-4 h-4" data-lucide="plus"></i> </span>
                </button>
                <div class="dropdown-menu w-40">
                    <ul class="dropdown-content">
                        <li>
                            <a href="" class="dropdown-item"> <i data-lucide="printer" class="w-4 h-4 mr-2"></i> Print </a>
                        </li>
                        <li>
                            <a href="" class="dropdown-item"> <i data-lucide="file-text" class="w-4 h-4 mr-2"></i> Export to Excel </a>
                        </li>
                        <li>
                            <a href="" class="dropdown-item"> <i data-lucide="file-text" class="w-4 h-4 mr-2"></i> Export to PDF </a>
                        </li>
                    </ul>
                </div>
            </div> */}
          {/* <div class="hidden md:block mx-auto text-slate-500">Showing 1 to 10 of 150 entries</div> */}
          <div>
            <div>
              <Icon icon="lucide:search" className="icon" />
              <input
                type="text"
                className="form-control box"
                placeholder="Type contract name..."
                value={searchByName}
                onChange={handleSearchByNameChange}
                onKeyDown={handleKeyDown}
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
                            htmlFor="input-filter-2"
                            className="form-labe2"
                          >
                            Contract Code
                          </label>
                          <input
                            id="input-filter-2"
                            type="text"
                            className="form-contro2"
                            placeholder="Type contract code..."
                            value={contractCode}
                            onChange={handleContractCodeChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="input-filter-4"
                            className="form-label"
                          >
                            Version
                          </label>
                          <input
                            id="input-filter-4"
                            type="number"
                            className="form-contro2"
                            placeholder="Type contract version..."
                            value={version}
                            min={0}
                            onChange={handleVersionChange}
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
                <th>PARTNER</th>
                <th>CREATED AT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {contractAnnexes.map((contractAnnex) => (
                <tr className="intro-x">
                  <td>
                    <div>
                      <div className="w-10 h-10 image-fit zoom-in">
                        <a
                        href="javascript:;"
                        onClick={() => handleChooseContractAnnex(contractAnnex.id)}
                      >
                        {contractAnnex.code}
                      </a>
                      </div>
                    </div>
                  </td>
                  <td>
                  <a
                        href="javascript:;"
                        onClick={() => handleChooseContract(contractAnnex.contractId)}
                      >
                        {contractAnnex.contractName}
                      </a>
                    <div>
                      <a
                        href="javascript:;"
                        onClick={() => handleChooseContract(contractAnnex.contractId)}
                        style={{ color: 'gray' }}
                      >
                        {contractAnnex.contractCode}
                      </a>
                    </div>
                  </td>
                  <td>{contractAnnex.partnerName}</td>
                  <td>{contractAnnex.createdDateString}</td>
                  <td>
                    <div className="text-danger">
                      {/* <i data-lucide="check-square" class="w-4 h-4 mr-2"></i>  */}
                      Approving{" "}
                    </div>
                  </td>
                  <td className="table-report__action">
                    <div>
                      <a
                        href="javascript:;"
                        className="dropdown-item"
                        onClick={() => handleChooseContractAnnex(contractAnnex.id)}
                      >
                        {" "}
                        View Details{" "}
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
          <nav>
            <ul className="pagination">
              {/* <li className="page-item">
                                <a class="page-link" href="#"> <i class="w-4 h-4" data-lucide="chevrons-left"></i> </a>
                            </li> */}
              <li
                className={"page-item " + (hasPrevious ? "active" : "disabled")}
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
    </div>
  );
}

export default List;
