import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "react-datepicker/dist/react-datepicker.css";
import "../css/_contract.css";
import "../css/_top-bar.css";
import { useState } from "react";
import Swal from "sweetalert2";

function ContractAnnex() {
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [file, setFile] = useState();
  const token = localStorage.getItem("Token");;
  const navigate = useNavigate();
  const location = useLocation();
  let action = location.state.action;
  let contractCategoryId = null;
  let partnerId = null;
  let serviceId = null;
  let names = null;
  let values = null;
  let effectiveDate = null;
  let approveDate = null;
  let signDate = null;
  let contractId = null;
  let contractAnnexId = null;

  const getData = () => {
    try {
      console.log("Get data", location.state);
      contractId = location.state.contractId;
      contractCategoryId = location.state.contractCategoryId;
      partnerId = location.state.partnerId;
      serviceId = location.state.serviceId;
      names = location.state.names;
      values = location.state.values;
      effectiveDate = location.state.effectiveDate;
      approveDate = location.state.approveDate;
      signDate = location.state.signDate;
      setFile(location.state.file);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cannot access this page!",
      });
      navigate("/");
    }
  }

  const handleConfirmClick = async (e) => {
    e.preventDefault();
    setIsFetched(true);
    contractId = location.state.contractId;
    contractCategoryId = location.state.contractCategoryId;
    partnerId = location.state.partnerId;
    serviceId = location.state.serviceId;
    names = location.state.names;
    values = location.state.values;
    effectiveDate = location.state.effectiveDate;
    approveDate = location.state.approveDate;
    signDate = location.state.signDate;
    const res = await fetch("https://localhost:7073/ContractAnnexes", {
      mode: "cors",
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        name: names,
        value: values,
        contractId: contractId,
        contractCategoryId: contractCategoryId,
        effectiveDate: effectiveDate,
        approveDate: approveDate,
        signDate: signDate,
        serviceId: serviceId,
        partnerId: partnerId,
        status: 8,
        templateType: 1
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      const res2 = await fetch(`https://localhost:7073/ContractAnnexes/id?id=${data}`, {
        mode: "cors",
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      });
      if (res2.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Create Contract Annex Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/contractannex-details", {
          state: {
            contractAnnexId: data
          }
        });
      } else {
        const data2 = await res2.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data2.title,
        });
        setIsFetched(false);
      }
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
      setIsFetched(false);
    }
  };

  const handleBackClick = async () => {
    contractId = location.state.contractId;
    contractCategoryId = location.state.contractCategoryId;
    partnerId = location.state.partnerId;
    serviceId = location.state.serviceId;
    names = location.state.names;
    values = location.state.values;
    effectiveDate = location.state.effectiveDate;
    approveDate = location.state.approveDate;
    signDate = location.state.signDate;
    const oldFields = location.state.fields;
    if (action === 'create') {
      navigate("/create-contractannex", {
        state: {
          contractId: contractId, contractCategoryId: contractCategoryId, serviceId: serviceId,
          partnerId: partnerId, names: names, values: values, effectiveDate: effectiveDate, approveDate: approveDate, 
          signDate: signDate, oldFields: oldFields
        }
      });
    } else {
      navigate("/", {
        state: {
          contractId: contractId, contractCategoryId: contractCategoryId, serviceId: serviceId,
          partnerId: partnerId, names: names, values: values, effectiveDate: effectiveDate, approveDate: approveDate, 
          signDate: signDate, oldFields: oldFields, contractAnnexId: location.state.contractAnnexId
        }
      });
    }
  };

  const handleConfirmEditClick = async (e) => {
    e.preventDefault();
    setIsFetched(true);
    // contractCategoryId = location.state.contractCategoryId;
    contractId = location.state.contractId;
    partnerId = location.state.partnerId;
    serviceId = location.state.serviceId;
    names = location.state.names;
    values = location.state.values;
    effectiveDate = location.state.effectiveDate;
    approveDate = location.state.approveDate;
    signDate = location.state.signDate;
    const res = await fetch(`https://localhost:7073/Contracts?contractId=${contractId}`, {
      mode: "cors",
      method: "PUT",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        name: names,
        value: values,
        effectiveDate: effectiveDate,
        sendDate: approveDate,
        reviewDate: signDate,
        serviceId: serviceId,
        partnerId: partnerId,
        status: 8
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      const res2 = await fetch(`https://localhost:7073/ContractAnnexes/id=${data}`, {
        mode: "cors",
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      });
      if (res2.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Edit Contract Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/contractannex-details", {
          state: {
            contractAnnexId: data
          }
        });
      } else {
        const data2 = await res2.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data2.title,
        });
        setIsFetched(false);
      }
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
      setIsFetched(false);
    }
  };

  useEffect(() => {
    getData();
    console.log(location.state.action);
    console.log(location.state.values);
    console.log(location.state.names);
  }, []);

  return (
    <div>
      <div className="preview-annex-topbar intro-y">
        {action === 'create' ? (
          <h2>Add New Contract Annex</h2>
        ) : (
          <h2>Edit Contract</h2>
        )}
        <div>
          <div className="dropdown">
            <button
              className="dropdown-toggle btn btn-secondary"
              aria-expanded="false"
              data-tw-toggle="dropdown"
              type="button"
              onClick={handleBackClick}
            >
              {" "}Back
            </button>
            {action === 'create' ? (
              <button
                className="dropdown-toggle btn btn-primary"
                aria-expanded="false"
                data-tw-toggle="dropdown"
                type="button"
                onClick={handleConfirmClick}
              >
                {" "}
                <Icon icon="line-md:loading-alt-loop" style={{ display: isFetched ? "block" : "none" }} className='icon' />Confirm
              </button>
            ) : (
              <button
                className="dropdown-toggle btn btn-primary"
                aria-expanded="false"
                data-tw-toggle="dropdown"
                type="button"
                onClick={handleConfirmEditClick}
              >
                {" "}
                <Icon icon="line-md:loading-alt-loop" style={{ display: isFetched ? "block" : "none" }} className='icon' />Confirm
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="main">
        <div className="main-body">
          <div className="main-content">
            <div className="pos intro-y preview-contract">
              <div className="intro-y">
                <div className="post intro-y box">
                  <div className="post__content tab-content">
                    <div
                      className="tab-pane active"
                      role="tabpanel"
                      aria-labelledby="content-tab"
                    >
                      <div className="dark:border-darkmode-400">
                        <div className="dark:border-darkmode-400">
                          <Icon icon="lucide:chevron-down" className="icon" />{" "}
                          Preview Contract{" "}
                        </div>
                        <div className="mt-5" >
                          {loading ? (
                            <div style={{ textAlign: "center" }}>
                              <Icon icon="line-md:loading-alt-loop" className='icon' />
                            </div>
                          ) : (
                            <div>
                              <iframe width="100%" height="1000px" src={URL.createObjectURL(file)} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractAnnex;
