import { formatDistanceToNow } from "date-fns";
import React, { useState, useEffect } from "react";
import { useLocation} from "react-router-dom";
import Swal from "sweetalert2";
import "../css/contract-details.css";

function ContractAnnex() {
  const [contractAnnex, setContractAnnex] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem("Token");
  let contractAnnexId = null;

  try {
    if (!location.state || !location.state.contractAnnexId) {
      console.log("Test",location.state.contractAnnexId);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'No contractAnnexId provided',
      });
    } else {
      contractAnnexId = location.state.contractAnnexId;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: 'No contractAnnexId provided',
    });
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchContractAnnex();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div class="contract-details-annex">
      {contractAnnex ? (
        <div class="contract-detail-conten">
          <div>
            <h2 class="contract-name">
              {contractAnnex.contractAnnexName}
            </h2>
          </div>
          <div className="categoryName" style={{ color: 'gray', fontStyle: 'italic' }}>
            {contractAnnex?.contractName}
          </div>
          <div>
            {contractAnnex?.updatedDate !== null ? (
              <div class="leading-relaxed text-slate-500 text-xs">
                Updated {formatDistanceToNow(new Date(contractAnnex.updatedDate))} ago
              </div>
            ) : (
              <div class="leading-relaxed text-slate-500 text-xs">
                Created {formatDistanceToNow(new Date(contractAnnex.createdDate))} ago
              </div>
            )}
          </div>
          <div>
            <object
              data={contractAnnex.link}
              type="application/pdf"
              width="100%"
              height="900px"
            >
              <p>
                Alternative text - include a link{" "}
                <a href={contractAnnex.link}>to the PDF!</a>
              </p>
            </object>
          </div>
        </div>
      ) : (
        <p>Loading contract...</p>
      )}
    </div>
  );
}

export default ContractAnnex;
