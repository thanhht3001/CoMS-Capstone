import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "react-datepicker/dist/react-datepicker.css";
import "../css/_contract.css";
import "../css/_top-bar.css";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

function Contract() {
  const [fields, setFields] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [approveDate, setApproveDate] = useState("");
  const [signDate, setSignDate] = useState("");
  const location = useLocation();
  const [saveMenuClass, setSaveMenuClass] = useState("dropdown-menu");
  const [loading, setLoading] = useState(false);
  const [isApproveDateValid, setIsApproveDateValid] = useState(true);
  const [isEffectiveDateInvalid, setIsEffectiveDateValid] = useState(true);
  const [isSignDateValid, setIsSignDateValid] = useState(true);
  const saveMenuRef = useRef(null);
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);

  const fetchContract = async (contractId) => {
    try {
      const res = await fetch(
        `https://localhost:7073/Contracts/partner-service?id=${contractId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        setContract(data);
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.title,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (contract !== null) {
      fetchTemplateFields();
    }
  }, [contract]);

  const fetchTemplateFields = async () => {
    if (contract === null) {
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7073/api/TemplateFields/Annex?contractId=${contract.id}&contractCategoryId=${contract.contractCategoryId}
        &partnerId=${contract.partnerId}&serviceId=${contract.serviceId}&templateType=1`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        setFields(data);
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.title,
        });
        //navigate("/choose-template");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    var inputs = document.getElementsByName("fields");
    var values = [].map.call(inputs, function (input) {
      return input.value;
    });
    var names = [].map.call(fields, function (field) {
      return field.name;
    });
    const res = await fetch("https://localhost:7073/ContractAnnexes/preview", {
      mode: "cors",
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        name: names,
        value: values,
        contractCategoryId: contract.contractCategoryId,
        templateType: 1,
      }),
    });
    if (res.status === 200) {
      console.log("preview success", approveDate, effectiveDate, signDate);
      const data = await res.blob();
      navigate("/preview-contractannex", {
        state: {
          file: data,
          contractId: contract.id,
          contractCategoryId: contract.contractCategoryId,
          serviceId: contract.serviceId,
          partnerId: contract.partnerId,
          names: names,
          values: values,
          effectiveDate: effectiveDate,
          approveDate: approveDate, 
          signDate: signDate,
          fields: fields,
          action: "create",
        },
      });
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleEffectiveDateChange = (e) => {
    if (approveDate !== "" && e.target.value <= approveDate) {
      setIsEffectiveDateValid(false);
      return;
    } else {
      if (signDate !== "" && e.target.value <= signDate) {
        setIsEffectiveDateValid(false);
        return;
      } else {
        setIsEffectiveDateValid(true);
      }
    }
    setEffectiveDate(e.target.value);
  };

  const handleApproveDateChange = (e) => {
    if (signDate !== "" && e.target.value >= signDate) {
      setIsApproveDateValid(false);
      return;
    } else {
      if (effectiveDate !== "" && e.target.value >= effectiveDate) {
        setIsApproveDateValid(false);
        return;
      } else {
        setIsApproveDateValid(true);
      }
    }
    setApproveDate(e.target.value);
  };

  const handleSignDateChange = (e) => {
    if (approveDate !== "" && e.target.value <= approveDate) {
      setIsSignDateValid(false);
      return;
    } else {
      if (effectiveDate !== "" && e.target.value >= effectiveDate) {
        setIsSignDateValid(false);
        return;
      } else {
        setIsSignDateValid(true);
      }
    }
    setSignDate(e.target.value);
  };

  const handleContentChange = (id, data) => {
    const index = fields.findIndex((field) => field.id === id);
    var newFields = [...fields];
    newFields[index]["content"] = data.target.value;
    setFields(newFields);
  };

  const closeSaveMenu = (e) => {
    if (!saveMenuRef?.current?.contains(e.target)) {
      setSaveMenuClass("dropdown-menu");
    }
  };

  document.addEventListener("mousedown", closeSaveMenu);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate() + 1).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (
      location.state.contractId === undefined ||
      location.state.contractId === null
    ) {
      navigate("/contract-details");
    } else {
      fetchContract(location.state.contractId).then(() => {
        console.log(location.state.oldFields);
        if (location.state.oldFields !== undefined || location.state.oldFields) {
          setFields(location.state.oldFields);
        } else {
          fetchTemplateFields();
        }
        if (location.state.effectiveDate !== undefined || location.state.effectiveDate) {
          setEffectiveDate(location.state.effectiveDate);
        }
        if (location.state.approveDate !== undefined || location.state.approveDate) {
          setApproveDate(location.state.approveDate);
        }
        if (location.state.signDate !== undefined || location.state.signDate) {
          setSignDate(location.state.signDate);
        }
      });
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleCreateClick}>
        <div className="create-contract-annex-topbar intro-y">
          <h2>Add New Contract Annex</h2>
          <div>
            <div className="dropdown" ref={saveMenuRef}>
              <button
                className="dropdown-toggle btn btn-primary1"
                aria-expanded="false"
                data-tw-toggle="dropdown"
                type="button"
                onClick={() => window.history.back()}
              >
                {" "}
                
                Back
              </button>
              <button
                className="dropdown-toggle btn btn-primary"
                aria-expanded="false"
                data-tw-toggle="dropdown"
                type="submit"
              >
                {" "}
                <Icon
                  icon="line-md:loading-alt-loop"
                  style={{ display: loading ? "block" : "none" }}
                  className="icon"
                />
                Create
              </button>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="main-body">
            <div className="main-content">
              <div className="pos intro-y template">
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
                            Contract Information{" "}
                          </div>
                          <div className="mt-5">
                            {fields.length > 0 ? (
                              <>
                                {fields.map((item) => (
                                  <>
                                    {(item?.name === "Company Signature") |
                                    (item?.name === "Partner Signature") |
                                    (item?.name === "Created Date") ? (
                                      <input
                                        id={item?.name}
                                        name="fields"
                                        type="text"
                                        className={
                                          "intro-y form-control py-3 px-4 box pr-10 " +
                                          (item?.isReadOnly ? "isReadonly" : "")
                                        }
                                        placeholder={
                                          "Type " + item?.name + "..."
                                        }
                                        value={item?.content}
                                        required
                                        readOnly={item?.isReadOnly}
                                        style={{ display: "none" }}
                                      />
                                    ) : (
                                      <div>
                                        {item?.name.includes("Duration") ? (
                                          <div>
                                            {item?.name + " (month)"}{" "}
                                            <span>*</span>
                                          </div>
                                        ) : (
                                          <div>
                                            {item?.name} <span>*</span>
                                          </div>
                                        )}
                                        {item?.type === "text" ? (
                                          <input
                                            id={item?.name}
                                            name="fields"
                                            type="text"
                                            className={
                                              "intro-y form-control py-3 px-4 box pr-10 " +
                                              (item?.isReadOnly
                                                ? "isReadonly"
                                                : "")
                                            }
                                            placeholder={
                                              "Type " + item?.name + "..."
                                            }
                                            value={item?.content}
                                            onChange={(e) =>
                                              handleContentChange(item?.id, e)
                                            }
                                            required
                                            readOnly={item?.isReadOnly}
                                          />
                                        ) : (
                                          <input
                                            id={item?.name}
                                            name="fields"
                                            type="number"
                                            className={
                                              "intro-y form-control py-3 px-4 box pr-10 " +
                                              (item?.isReadOnly
                                                ? "isReadonly"
                                                : "")
                                            }
                                            placeholder={
                                              "Type " + item?.name + "..."
                                            }
                                            value={item?.content}
                                            onChange={(e) =>
                                              handleContentChange(item?.id, e)
                                            }
                                            required
                                            readOnly={item?.isReadOnly}
                                            min={item?.minValue}
                                          />
                                        )}
                                      </div>
                                    )}
                                  </>
                                ))}
                              </>
                            ) : (
                              <div></div>
                            )}
                            <div>
                              <div>
                                Deadline For Approval<span>*</span>
                              </div>
                              <input
                                className="form-control"
                                type="date"
                                name="approveDate"
                                value={approveDate}
                                onChange={handleApproveDateChange}
                                min={getCurrentDateTime()} // Thêm thuộc tính min
                                required
                              />
                              <div><span style={{ display: (isApproveDateValid ? "none" : "block") }}>Approve Date should be before Signing Date and Efffective Date!</span></div>
                            </div>
                            <div>
                              <div>
                                Deadline For Signing <span>*</span>
                              </div>
                              <input
                                className="form-control"
                                type="date"
                                name="signDate"
                                value={signDate}
                                onChange={handleSignDateChange}
                                min={getCurrentDateTime()} // Thêm thuộc tính min
                                required
                              />
                              <div><span style={{ display: (isSignDateValid ? "none" : "block") }}>Signing Date should be after Approve Date and before Efffective Date!</span></div>
                            </div>
                            <div>
                              <div>
                                Effective Date <span>*</span>
                              </div>
                              <input
                                className="form-control"
                                type="date"
                                name="effectiveDate"
                                value={effectiveDate}
                                onChange={handleEffectiveDateChange}
                                min={getCurrentDateTime()} // Thêm thuộc tính min
                                required
                              />
                              <div>
                                <span
                                  style={{
                                    display: isEffectiveDateInvalid
                                      ? "none"
                                      : "block",
                                  }}
                                >
                                  Effective Date should be after Send Date and
                                  Review Date!
                                </span>
                              </div>
                            </div>
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
      </form>
    </div>
  );
}

export default Contract;
