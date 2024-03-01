import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "../js/jquery.signalR-2.4.1";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/_sign.css";

function SignalRComponent() {
  const txtLogRef = useRef();
  const navigate = useNavigate();
  const [contractFile, setContractFile] = useState(null);
  const token = localStorage.getItem("Token");
  let contractId = null;
  const location = useLocation();
  const [responseFields, setResponseFields] = useState({
    isSuccess: false,
    code: null,
    responseSuccess: null,
    responseFailed: null,
  });

  useEffect(() => {
    if (responseFields.code !== null) {
      console.log(responseFields);
        if (!responseFields.isSuccess) {
          // Xử lý khi isSuccess là false
          console.log(`Code: ${responseFields.code}, Response Failed: ${responseFields.responseFailed}`);
          Swal.fire({
            icon: "error",
            title: "",
            text: responseFields.responseFailed,
          });
        } else {
          // Xử lý khi isSuccess là true
          console.log(`Code: ${responseFields.code}, Response Success: ${responseFields.responseSuccess}`);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sign Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/waiting-sign-contract");
        }
      }else{
        
      }
  }, [responseFields]);

  try {
    if (!location.state || !location.state.contractId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No contractId provided",
      });
    } else {
      contractId = location.state.contractId;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No contractId provided",
    });
  }

  const writeToLog = (log) => {
    $(txtLogRef.current).append(log + "\n");
  };

  const fetchContractFile = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/ContractFiles/contractId?contractId=${contractId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setContractFile(data);
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  const handleConnect = async () => {
    const connection = $.hubConnection("http://localhost:8080/signalr/hubs");
    const simpleHubProxy = connection.createHubProxy("simpleHub");
    simpleHubProxy.on("addMessage", (name, message) => {
      // Xử lý sự kiện và tin nhắn từ server ở đây
      try {
        setResponseFields(JSON.parse(message));
      } catch (error) {
        console.error("Lỗi khi phân tích JSON:", error.message);
      }
      // console.log( responseFields);
    });
    // Conditionally register the event handler based on the value of check

    connection.start().done(() => {
      writeToLog("Connected.");
      simpleHubProxy.invoke("setUserName", "user");
      simpleHubProxy.invoke(
        "send",
        JSON.stringify({
          llx: 100,
          lly: 100,
          urx: 100,
          ury: 250,
          searchText: "",
          FileType: "PDF",
          Token: token,
          FileID: contractFile.uuid,
        })
      );
      console.log(contractFile.uuid);
    });

    // connection.stop();
    // writeToLog("Disconnected.");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchContractFile();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sign-annex">
      <button className="btn" onClick={handleConnect}>
        Sign
      </button>
      {/* <fieldset>
        <legend>Log</legend>
        <textarea ref={txtLogRef} cols="60" rows="15"></textarea>
      </fieldset> */}
    </div>
  );
}

export default SignalRComponent;
