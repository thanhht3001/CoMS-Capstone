import { formatDistanceToNow } from "date-fns";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/contract-details.css";
import $ from "jquery";
import "../js/jquery.signalR-2.4.1";
import "../css/_sign.css";

function Contract() {
  const [state, setState] = useState({
    contractAnnex: null,
    contractAnnexFile: null,
    responseFields: {
      isSuccess: false,
      code: null,
      responseSuccess: null,
      responseFailed: null,
    },
  });
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  const txtLogRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const { contractAnnex, contractAnnexFile, responseFields } = state;
  const token = localStorage.getItem("Token");
  let contractAnnexId = location.state?.contractAnnexId;

  const fetchContract = async () => {
    try {
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
      setState((prevState) => ({ ...prevState, contractAnnex: data }));
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  const fetchContractFile = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/ContractFiles/contractId?contractId=${contractAnnexId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setState((prevState) => ({ ...prevState, contractAnnexFile: data }));
    } catch (error) {
      console.error("Error fetching contract file:", error);
    }
  };

  const fetchCoordinates = async () => {
    const searchText = "Đại diện Bên A";
    const res = await fetch(
      `https://localhost:7073/Coordinate/get?ContractId=${contractAnnexId}&SearchText=${searchText}`,
      {
        mode: "cors",
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    if (res.status === 200) {
      const dataList = await res.json();
      if (dataList && dataList.length > 0) {
        const firstItem = dataList[0];
        if (firstItem) {
          setCenterX(firstItem.x);
          setCenterY(firstItem.y);
          console.log(firstItem);
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Không tìm thấy vị trí ký",
      });
    }
  };

  const writeToLog = (log) => {
    $(txtLogRef.current).append(log + "\n");
  };

  const handleConnect = async () => {
    const connection = $.hubConnection("http://localhost:8080/signalr/hubs");
    const simpleHubProxy = connection.createHubProxy("simpleHub");

    simpleHubProxy.on("addMessage", (name, message) => {
      try {
        setState((prevState) => ({
          ...prevState,
          responseFields: JSON.parse(message),
        }));
      } catch (error) {
        console.error("Error parsing JSON:", error.message);
      }
    });
    connection.start().done(() => {
      let alpha = 0;
      if (centerY > 220) {
        alpha = -20;
      } else if (centerY >= 200) {
        alpha = -3;
      } else if (centerY >= 130) {
        alpha = 20;
      } else if (centerY >= 80) {
        alpha = 40;
      } else {
        alpha = 55;
      }
      console.log(centerX);
      console.log(centerY);
      writeToLog("Connected.");
      simpleHubProxy.invoke("setUserName", "user");
      simpleHubProxy.invoke(
        "send",
        JSON.stringify({
          llx: centerX + 310,
          lly: (centerY - alpha - 50) * 2,
          urx: centerX + 450,
          ury: (centerY - alpha + 125) * 2,
          searchText: "",
          FileType: "PDF",
          Token: `${token}`,
          FileID: `${contractAnnexFile?.uuid}`,
        })
      );
    });
    if (responseFields.code != null) {
      connection.stop();
      console.log("Connection stopped!");
    }
  };

  useEffect(() => {
    if (responseFields.code !== null) {
      console.log(responseFields);
      if (responseFields.responseFailed) {
        console.log(
          `Code: ${responseFields.code}, Response Failed: ${responseFields.responseFailed}`
        );
        Swal.fire({
          title: "Loading...",
          onBeforeOpen: () => Swal.showLoading(),
        });
        setTimeout(() => {
          Swal.update({
            icon: "error",
            title: "",
            text: responseFields.responseFailed,
          });
        }, 10000);
      } else {
        Swal.fire({
          title: "Loading...",
          onBeforeOpen: () => Swal.showLoading(),
        });
        if (responseFields.isSuccess) {
          console.log(
            `Code: ${responseFields.code}, Response Success: ${responseFields.responseSuccess}`
          );

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sign Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/waiting-sign-contract");
        }
      }
    }
  }, [responseFields]);

  useEffect(() => {
    if (contractAnnexId) {
      fetchCoordinates();
      fetchContractFile();
      fetchContract();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No contractId provided",
      });
    }
  }, [contractAnnexId]);

  return (
    <div className="contract-details-annex">
      {contractAnnex ? (
        <div className="contract-detail-conten">
          <div>
            <h2 className="contract-name">{contractAnnex.contractName}</h2>
            <div className="categoryName">{contractAnnex.contractCategory}</div>
          </div>
          <div>
            <div className="leading-relaxed text-slate-500 text-xs">
              {contractAnnex.updatedDate !== null
                ? `Updated ${formatDistanceToNow(
                    new Date(contractAnnex.updatedDate)
                  )} ago`
                : `Created ${formatDistanceToNow(
                    new Date(contractAnnex.createdDate)
                  )} ago`}
            </div>
          </div>
          <div className="sign">
            <button className="btn" onClick={handleConnect}>
              Sign
            </button>
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

export default Contract;
