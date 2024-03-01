import { formatDistanceToNow } from "date-fns";
import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/liquidation-record-details.css";

function LiquidationRecordDetails() {
  const [liquidation, setLiquidation] = useState(null);
  const location = useLocation();
  const [categorieName, setCategorieName] = useState(null);
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
      console.log("Fetching liquidation...");
      const response = await fetch(
        `https://localhost:7073/LiquidationRecords/id?id=${contractId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setLiquidation(data);
    } catch (error) {
      console.error("Error fetching liquidation:", error);
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
    <div class="liquidation-record-details">
      {liquidation ? (
        <div class="liquidation-record-detail-content">
          <div>
            <h2 class="liquidation-record-name">
              {liquidation.liquidationName}
            </h2>
            {/*<div className="categoryName">
              {categorieName}
            /div>*/}
          </div>
          <div>
            {liquidation?.updatedDate !== null ? (
              <div class="leading-relaxed text-slate-500 text-xs">
                Updated {formatDistanceToNow(new Date(liquidation.updatedDate))} ago
              </div>
            ) : (
              <div class="leading-relaxed text-slate-500 text-xs">
                Created {formatDistanceToNow(new Date(liquidation.createdDate))} ago
              </div>
            )}
          </div>
          <div>
            <object
              data={liquidation.link}
              type="application/pdf"
              width="100%"
              height="900px"
            >
              <p>
                Alternative text - include a link{" "}
                <a href={liquidation.link}>to the PDF!</a>
              </p>
            </object>
          </div>
        </div>
      ) : (
        <p>Loading liquidation...</p>
      )}
    </div>
  );
}

export default LiquidationRecordDetails;
