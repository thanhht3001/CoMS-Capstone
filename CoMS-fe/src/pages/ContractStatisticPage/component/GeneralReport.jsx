import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import '../css/_report-box.css';

function GeneralReport() {
    const [reports, setReports] = useState([]);
    const [draftReport, setDraftReport] = useState({
        title: "Approving Contracts",
        total: 0,
        percent: 0
    });
    const [approvedReport, setApprovedReport] = useState({
        title: "Approved Contracts",
        total: 0,
        percent: 0
    });
    const [signedReport, setSignedReport] = useState({
        title: "Completed Contracts",
        total: 0,
        percent: 0
    });
    const [finalizedReport, setFinalizedReport] = useState({
        title: "Finalized Contracts",
        total: 0,
        percent: 0
    });
    const token = localStorage.getItem("Token");

    const fetchReportsData = async () => {
        let url = `https://localhost:7073/Contracts/general-reports`;
        const res = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setReports(data);
            setDraftReport({
                title: "Approving Contracts",
                total: data[0].total,
                percent: data[0].percent
            })
            setApprovedReport({
                title: "Approved Contracts",
                total: data[1].total,
                percent: data[1].percent
            });
            setSignedReport({
                title: "Completed Contracts",
                total: data[2].total,
                percent: data[2].percent
            });
            setFinalizedReport({
                title: "Finalized Contracts",
                total: data[3].total,
                percent: data[3].percent
            });
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    }

    useEffect(() => {
        fetchReportsData();
    }, []);

    return (
        <div className="general-report-part">
            <div className="intro-y">
                <h2>
                    General Report
                </h2>
                <a href=""> <Icon icon="lucide:refresh-cw" width={16} height={16} className="icon" /> Reload Data </a>
            </div>
            <div>
                <div className="intro-y">
                    <div className="report-box zoom-in">
                        <div className="box">
                            <div>
                                <Icon icon="ic:round-pending-actions" className="report-box__icon" color="#1e40af" />
                                <div>
                                    <div className="report-box__indicator tooltip" title="33% Higher than last month">
                                        {draftReport.percent}%
                                        {/* <Icon icon="lucide:chevron-up" className="icon" /> */}
                                    </div>
                                </div>
                            </div>
                            <div>{draftReport.total}</div>
                            <div>{draftReport.title}</div>
                        </div>
                    </div>
                </div>
                <div className="intro-y">
                    <div className="report-box zoom-in">
                        <div className="box">
                            <div>
                                <Icon icon="carbon:task-approved" className="report-box__icon" color="#f97316" />
                                <div>
                                    <div class="report-box__indicator bg-danger tooltip" title="2% Lower than last month">
                                        {approvedReport.percent}%
                                        {/* <Icon icon="lucide:chevron-down" className="icon" /> */}
                                    </div>
                                </div>
                            </div>
                            <div>{approvedReport.total}</div>
                            <div>{approvedReport.title}</div>
                        </div>
                    </div>
                </div>
                <div className="intro-y">
                    <div className="report-box zoom-in">
                        <div className="box">
                            <div>
                                <Icon icon="clarity:contract-line" className="report-box__icon" color="#facc15" />
                                <div>
                                    <div class="report-box__indicator tooltip" title="12% Higher than last month">
                                        {signedReport.percent}%
                                        {/* <Icon icon="lucide:chevron-up" className="icon" /> */}
                                    </div>
                                </div>
                            </div>
                            <div>{signedReport.total}</div>
                            <div>{signedReport.title}</div>
                        </div>
                    </div>
                </div>
                <div className="intro-y">
                    <div className="report-box zoom-in">
                        <div className="box">
                            <div>
                                <Icon icon="la:file-contract" className="report-box__icon" color="#84cc16" />
                                <div>
                                    <div class="report-box__indicator tooltip" title="22% Higher than last month">
                                        {finalizedReport.percent}%
                                        {/* <Icon icon="lucide:chevron-up" className="icon" />  */}
                                    </div>
                                </div>
                            </div>
                            <div>{finalizedReport.total}</div>
                            <div>{finalizedReport.title}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GeneralReport;