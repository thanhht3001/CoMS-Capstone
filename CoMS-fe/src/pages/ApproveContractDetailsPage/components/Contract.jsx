import { formatDistanceToNow } from "date-fns";
import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/contract-details.css";

function Contract() {
  const [contract, setContract] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem("Token");
  let contractId = null;

  try {
    if (!location.state || !location.state.contractId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'No contractId provided',
      });
    } else {
      contractId = location.state.contractId;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: 'No contractId provided',
    });
  }


  // const fetchContractTempplate = async (id) => {
  //   try {
  //     console.log("Fetching Contract Tempplate...");
  //     const res = await fetch(
  //       `https://localhost:7073/Templates/${id}`,
  //       {
  //         mode: "cors",
  //         method: "GET",
  //         headers: new Headers({
  //           Authorization: `Bearer ${token}`,
  //         }),
  //       }
  //     );
  //     if (res.status === 200) {
  //       const data = await res.json();
  //       console.log(data);
  //       setCategorieName(data.contractCategoryName);
  //     } else {
  //       const data = await res.json();
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: data.title,
  //       });
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: error.title,
  //     });
  //   }
  // };

  const fetchContract = async () => {
    try {
      console.log("Fetching contract...");
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
      setContract(data);
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchContract();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div class="contract-details">
      {contract ? (
        <div class="contract-detail-conten">
          <div>
            <h2 class="contract-name">
              {contract.contractName}
            </h2>
            <div className="categoryName">
              {contract?.contractCategory}
            </div>
          </div>

          <div>
            <div class="leading-relaxed text-slate-500 text-xs">
              Updated {formatDistanceToNow(new Date(contract.updatedDate))} ago
            </div>
          </div>
          <div>
            <object
              data={contract.link}
              type="application/pdf"
              width="100%"
              height="900px"
            >
              <p>
                Alternative text - include a link{" "}
                <a href={contract.link}>to the PDF!</a>
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

export default Contract;
