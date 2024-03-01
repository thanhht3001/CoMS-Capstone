import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [contractAnnexes, setContracts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [searchName, setSearchName] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchContractData = async () => {
    let url = `https://localhost:7073/ContractAnnexes/manager/sign?Status=3&IsYours=true&CurrentPage=1&PageSize=10`;
    if (searchName !== null) {
      url = url + `&ContractAnnexName=${searchName}`;
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

  const handleSearchByNameChange = (e) => {
    setSearchName(e.target.value);
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
      fetchContractData();
    }
  };

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/ContractAnnexes/manager/sign?Status=3&IsYours=true&CurrentPage=${
        currentPage + 1
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
      console.log("helonẽt");
      const data = await res.json();
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
    }
    const res = await fetch(
      `https://localhost:7073/ContractAnnexes/manager/sign?Status=3&IsYours=true&CurrentPage=${
        currentPage - 1
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
      console.log("helo");
      const data = await res.json();
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

  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <div className="sign-contract-annex-list">
      <h2 className="intro-y">Waiting for signature list</h2>
      <div>
        <div className="intro-y">
          <div>
            <div>
              <input
                type="text"
                className="form-control box"
                placeholder="Search..."
                value={searchName}
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
                          onClick={() =>
                            handleChooseContractAnnex(contractAnnex.id)
                          }
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
                    </div>
                  </td>
                </tr>
              ))}
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
                <a className="page-link">
                  <Icon icon="lucide:chevron-left" className="icon" />
                </a>
              </li>
              <li
                className={"page-item " + (hasNext ? "active" : "disabled")}
                onClick={fetchNext}
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
  );
}

export default List;
