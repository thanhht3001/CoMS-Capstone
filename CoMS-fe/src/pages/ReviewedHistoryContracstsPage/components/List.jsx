import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [sortConfig, setSortConfig] = useState({
    key: "code",
    direction: "ascending",
  });


  

  const sortedContracts = [...contracts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  const fetchContractData = async () => {
    let url = `https://localhost:7073/Contracts/user?CurrentPage=1&PageSize=10`;
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

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(
      `https://localhost:7073/Contracts/user?CurrentPage=${
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
      `https://localhost:7073/Contracts/user?CurrentPage=${
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

  const handleChooseContract = (id) => {
    navigate("/contract-details", {
      state: {
        contractId: id,
      },
    });
  };




  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <div className="review-contract-list">
      <h2 className="intro-y">Reviewed History Contracts</h2>
      <div>
        <div className="intro-y">
        </div>
        <div className="intro-y">
          <table className="table table-report">
            <thead>
              <tr>
                <th onClick={() => requestSort("code")}>CODE</th>
                <th onClick={() => requestSort("contractName")}>
                  CONTRACT NAME
                </th>
                <th onClick={() => requestSort("creatorName")}>CREATED BY</th>
                <th onClick={() => requestSort("createdDateString")}>CREATED DATE</th>
                <th onClick={() => requestSort("flowDetailStatusString")}>
                  ACTION
                </th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {sortedContracts.map((contract) => (
                <tr className="intro-x">
                  <td>
                    <div>
                      <div className="w-10 h-10 image-fit zoom-in">
                        {contract.code}
                      </div>
                    </div>
                  </td>
                  <td>
                    {contract.contractName &&
                    contract.contractName.length > 25 ? (
                      <a
                        onClick={() => handleChooseContract(contract.id)}
                        title={contract.contractName}
                      >
                        {contract.contractName.slice(0, 30)}...
                      </a>
                    ) : (
                      <a onClick={() => handleChooseContract(contract.id)}>
                        {contract.contractName}
                      </a>
                    )}
                    <div>
                      {contract.partnerName &&
                      contract.partnerName.length > 25 ? (
                        <a title={contract.partnerName}>
                          {contract.partnerName.slice(0, 30)}...
                        </a>
                      ) : (
                        <a>{contract.partnerName}</a>
                      )}
                    </div>
                  </td>
                  <td>{contract.creatorName}</td>
                  <td>{contract.createdDateString}</td>
                  <td>
                    <div style={{ color: contract.flowDetailStatusString === 'Rejected' ? 'red' : contract.flowDetailStatusString === 'Approved' ? 'green' : contract.flowDetailStatusString === 'Signed' ? 'blue' : 'black' }}>
                      {contract.flowDetailStatusString}{" "}
                    </div>
                  </td>
                  {/* <td className="table-report__action">
                    <div>
                      <a
                        href="javascript:;"
                        className="dropdown-item"
                        onClick={() => handleChooseContract(contract.id)}
                      >
                        {" "}
                        View Details{" "}
                      </a>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
          <nav>
            <ul className="pagination">
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
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default List;
