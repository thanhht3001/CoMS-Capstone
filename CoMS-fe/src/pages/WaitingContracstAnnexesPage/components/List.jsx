import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [contractAnnexes, setContractAnnexes] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");

  const fetchContractAnnexData = async () => {
    let url = `https://localhost:7073/ContractAnnexes/manager?Status=8&CurrentPage=1&PageSize=10`;
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
      `https://localhost:7073/ContractAnnexes/manager?CurrentPage=${
        currentPage + 1
      }&pageSize=10&Status=8`,
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
      `https://localhost:7073/ContractAnnexes/manager?CurrentPage=${
        currentPage - 1
      }&pageSize=10&Status=8`,
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
    navigate("/contractannex-details", {
      state: {
        contractAnnexId: id,
      },
    });
  };
  const handleChooseContract = (id) => {
    navigate("/contract-details", {
      state: {
        contractId: id,
      },
    });
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      let url = `https://localhost:7073/ContractAnnexes/yours?IsYours=true&CurrentPage=1&PageSize=10&ContractAnnexName=${searchByName}&Status=8`;
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

  useEffect(() => {
    fetchContractAnnexData();
  }, []);

  return (
    <div className="waiting-contract-annex-list">
      <h2 className="intro-y">Approving Contract List</h2>
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
              <input
                type="text"
                className="form-control box"
                placeholder="Type contract name..."
                value={searchByName}
                onChange={handleSearchByNameChange}
                onKeyDown={handleKeyDown}
              />
              <Icon icon="lucide:search" className="icon" />
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
                  <td>{contractAnnex.version}</td>
                  <td>{contractAnnex.createdDateString}</td>
                  <td>
                    <div className="text-danger">
                      {/* <i data-lucide="check-square" class="w-4 h-4 mr-2"></i>  */}
                      {contractAnnex.statusString}{" "}
                    </div>
                  </td>
                  <td className="table-report__action">
                    <div>
                      <a
                        href="javascript:;"
                        className="dropdown-item"
                        onClick={() =>
                          handleChooseContractAnnex(contractAnnex.id)
                        }
                      >
                        {" "}
                        View Details{" "}
                      </a>
                      {/* <Icon icon="lucide:more-horizontal" className="icon" onClick={() => openOptionMenu(contract.id)} />
                                        <div id={"option-menu-" + contract.id}>
                                            <ul className="dropdown-content">
                                                <li>
                                                    <a href="" className="dropdown-item"> <Icon icon="bx:edit" className="icon" /> View Details </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:;" className="dropdown-item">
                                                        <Icon icon="lucide:trash-2" className="icon" /> Delete </a>
                                                </li> 
                                            </ul>
                                        </div> */}
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
    </div>
  );
}

export default List;
