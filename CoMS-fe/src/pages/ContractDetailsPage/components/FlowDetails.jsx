import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import Swal from "sweetalert2";
import "../css/_flow-details.css";
import { jwtDecode } from "jwt-decode";
import $ from "jquery";
import "../js/jquery.signalR-2.4.1";

function FlowDetails() {
  const [flowDetails, setFlowDetails] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isSigner, setIsSigner] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [partnerComment, setPartnerComment] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem("Token");
  const [state, setState] = useState({
    contract: null,
    contractFile: null,
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
  const navigate = useNavigate();

  const { contractFile, responseFields } = state;

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

  const fetchFlowDetailData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/UserFlowDetails?ContractId=${contractId}&CurrentPage=1&PageSize=4`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setIsRejected(false);
      setFlowDetails(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
      if (data.items.length > 0) {
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].userId === parseInt(jwtDecode(token).id) && data.items[i].flowRole === 'Approver' && data.items[i].status === 0) {
            setIsApprover(true);
            break;
          } else if (data.items[i].userId === parseInt(jwtDecode(token).id) && data.items[i].flowRole === 'Signer' && data.items[i - 1].status === 1) {
            setIsSigner(true);
            break;
          }
        }
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].statusString === "Rejected") {
            setIsRejected(true);
            break;
          }
        }
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].statusString === "Signed") {
            setIsSigned(true);
            break;
          }
        }
      }
    } catch (error) {
      setFlowDetails([]);
      console.error("Error fetching flow detais:", error);
    }
  };

  const fetchNext = async () => {
    if (!hasNext) {
      return;
    }
    const res = await fetch(`https://localhost:7073/UserFlowDetails?ContractId=${contractId}&CurrentPage=${currentPage + 1}&pageSize=4`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      setFlowDetails(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.title
      })
    }
  }

  const fetchPrevious = async () => {
    if (!hasPrevious) {
      return;
    }
    const res = await fetch(`https://localhost:7073/UserFlowDetails?ContractId=${contractId}&CurrentPage=${currentPage - 1}&pageSize=4`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      setFlowDetails(data.items);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(data.current_page);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.title
      })
    }
  }

  const fetchPartnerReview = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/PartnerComments?contractId=${contractId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setPartnerComment(data);
      }
    } catch (error) {
      console.error("Error fetching partner comment:", error);
    }
  };

  const fetchPartnerComment = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/PartnerComments?contractId=${contractId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setPartnerComment(data);
      }
    } catch (error) {
      console.error("Error fetching partner comment:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://localhost:7073/Comments/contract?contractId=${contractId}`,
        {
          mode: "cors",
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      const data = await response.json();
      setComments(data.items);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleApprove = async () => {
    try {
      console.log("Fetching Approve Contract By Manager...");
      const res = await fetch(
        `https://localhost:7073/Contracts/approveOrReject?id=${contractId}&isApproved=true`,
        {
          mode: "cors",
          method: "PUT",
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Approve Contract Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchFlowDetailData();
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.title,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (result.isConfirmed) {
            const { value: text } = await Swal.fire({
              title: "<strong>Provide a reason</strong>",
              icon: "info",
              input: "textarea",
              inputPlaceholder: "Type your reason here...",
              inputAttributes: {
                "aria-label": "Type your reason here"
              },
              showCancelButton: true
            });
            if (text) {
              try {
                console.log("Fetching Reject Contract By Manager...");
                const res = await fetch(
                  `https://localhost:7073/Contracts/approveOrReject?id=${contractId}&isApproved=false`,
                  {
                    mode: "cors",
                    method: "PUT",
                    headers: new Headers({
                      Authorization: `Bearer ${token}`,
                    }),
                  }
                );
                if (res.status === 200) {
                  let url = `https://localhost:7073/Comments`;
                  const res2 = await fetch(url, {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "contractId": contractId, "content": text, "replyId": 0, "commentType": 0 })
                  });
                  if (res2.status === 200) {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "Rejected Contract.",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    fetchFlowDetailData();
                    fetchComments();
                  } else {
                    const data2 = await res2.json();
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: data2.title,
                    });
                  }
                } else {
                  const data = await res.json();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.title
                  })
                }
              } catch (error) {
                console.error(error);
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "You have to enter a reason to reject!"
              })
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
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
      setState((prevState) => ({ ...prevState, contractFile: data }));
    } catch (error) {
      console.error("Error fetching contract file:", error);
    }
  };

  const fetchCoordinates = async () => {
    const searchText = "ĐẠI DIỆN BÊN A";
    const res = await fetch(
      `https://localhost:7073/Coordinate/contract?Id=${contractId}&SearchText=${searchText}`,
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
          FileID: `${contractFile?.uuid}`,
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
          // navigate("/waiting-sign-contract");
          // fetchFlowDetailData();
          navigate("/contract-details", {
            state: {
              contractId: contractId,
            },
          });
        }
      }
    }
  }, [responseFields]);

  useEffect(() => {
    if (contractId) {
      fetchCoordinates();
      fetchContractFile();
      fetchFlowDetailData();
      fetchPartnerComment();
      fetchComments();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No contractId provided",
      });
    }
  }, [contractId]);
  
  // useEffect(()=>{
  //   if(isSigner){
  //     fetchCoordinates();
  //   }
  // },[isSigner])


  return (flowDetails !== undefined) ? (
    <div className="flow-details">
      <div className="intro-y">
        <h2>
          Flow Status
        </h2>
        {isApprover ? (
          <>
            {isRejected ? (
              <div>Contract Rejected</div>
            ) : (
              <div>
                <button className="btn" onClick={handleApprove}>
                  <Icon icon="typcn:tick" className="icon" />
                </button>
                <button className="btn" onClick={handleReject}>
                  <Icon icon="octicon:x-16" className="icon" />
                </button>
              </div>
            )}
          </>
        ) : isSigner ? (
          <>
            {isSigned ? (
              <></>
            ) : (
              <div>
                <button className="btn" onClick={handleConnect}>
                  Sign
                </button>
                <button style={{ display: "none" }}></button>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div>
        {flowDetails?.length > 0 ? (
          <>
            {flowDetails.map((item) => (
              <>
                {item.status !== 0 ? (
                <div id={item?.id} className="intro-y flow" >
                  <div className="box zoom-in" style={{ background: '#e5e5e5', padding: '10px', borderRadius: '10px' }}>
                    <div className="image-fit">
                      <img alt="Avatar" src={item?.userImage} />
                    </div>
                    <div>
                      <div>{item?.fullName}</div>
                      <div>{item?.flowRole}</div>
                    </div>
                    {item?.statusString === "Rejected" ? (
                      <div className="rejected">{item?.statusString}</div>
                    ) : (
                      <div className="approved">{item?.statusString}</div>
                    )}
                  </div>
                </div>
                )
                  :
                  (
                    <div id={item?.id} className="intro-y flow">
                      <div className="box zoom-in">
                        <div className="image-fit">
                          <img alt="Avatar" src={item?.userImage} />
                        </div>
                        <div>
                          <div>{item?.fullName}</div>
                          <div>{item?.flowRole}</div>
                        </div>
                        {item?.statusString === "Rejected" ? (
                          <div className="rejected">{item?.statusString}</div>
                        ) : (
                          <div className="approved">{item?.statusString}</div>
                        )}
                      </div>
                    </div>)}
              </>
            ))}
            {/* <div className="intro-y paging">
              <nav>
                <ul className="pagination">
                  <li className={"page-item " + (hasPrevious ? "active" : "disabled")} onClick={fetchPrevious}>
                    <a className="page-link" href="javascript:;">
                      <Icon icon="lucide:chevron-left" className='icon' />
                    </a>
                  </li>
                  <li className={"page-item " + (hasNext ? "active" : "disabled")} onClick={fetchNext}>
                    <a className="page-link" href="javascript:;">
                      <Icon icon="lucide:chevron-right" className='icon' />
                    </a>
                  </li>
                </ul>
              </nav>
            </div> */}
          </>
        ) : (
          <></>
        )}
        {comments.length > 0 ? (
          <>
            {comments.map((item) => (
              <>
                {item?.commentType === "Reason" ? (
                  <div id={item?.id} className="intro-y view-partner-comment">
                    <div className="box zoom-in">
                      {/* <div className="image-fit">
              <img alt="Avatar" /> 
            </div> */}
                      <div>
                        <div>
                          <div>{item?.fullName}</div>
                          <div>{item?.long}</div>
                        </div>
                        <div className="rejected">Rejected</div>
                      </div>
                      <div>Reason: {item?.content}</div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ))}
          </>
        ) : (
          <></>
        )}
        {partnerComment !== null ? (
          <div id={partnerComment?.id} className="intro-y view-partner-comment">
            <div className="box zoom-in">
              {/* <div className="image-fit">
              <img alt="Avatar" /> 
            </div> */}
              <div>
                <div>
                  <div>Partner</div>
                  <div>{partnerComment?.long}</div>
                </div>
                <div className="rejected">Rejected</div>
              </div>
              <div>Reason: {partnerComment?.content}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : null;
}

export default FlowDetails;
