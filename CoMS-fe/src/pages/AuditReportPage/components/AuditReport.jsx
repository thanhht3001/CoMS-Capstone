import React, { useEffect } from "react";
import { Icon } from '@iconify/react';
import "../css/_audit-report.css";

function AuditReport() {

    useEffect(() => {
    }, []);

    return (
        <div className="your-contracts">
            <div className="intro-y">
                <h2>
                    Audit Trail Report
                </h2>
                <div>
                    <button class="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300"> <i data-lucide="file-text" class="hidden sm:block w-4 h-4 mr-2"><Icon icon="lucide:filter" className="icon" /></i> Filter </button> 
                    <div>
                        <Icon icon="lucide:search" className="icon" />
                        <input type="text" className="form-control" placeholder="Search by name" />
                    </div>
                     <button class="btn box flex items-center text-slate-600 dark:text-slate-300"> <i data-lucide="file-text" class="hidden sm:block w-4 h-4 mr-2"></i> Export to PDF </button>

                </div>
            </div>
            <div className="intro-y">
                <table className="table-report">
                    <thead>
                        <tr>
                            <th>CONTRACT CODE</th>
                            <th>USER NAME</th>
                            <th>ROLE</th>
                            <th>ACTION</th>
                            <th>DESCRIPTION</th>
                            <th>TIMESTAMP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr>
                        <tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr><tr className="intro-x">
                            <td>
                                <div>
                                    <a href="">101023/ABC</a>
                                </div>
                            </td>
                            <td>
                                <a href="">Nguyen Thai Phong</a>
                                <div>phong@gmail.com</div>
                            </td>
                            <td>Staff</td>
                            <td>Edit Contract</td>
                            <td>
                                <div>Chỉnh sửa hợp đồng A</div>
                            </td>
                            <td className="table-report__action">
                                <div>
                                    09:22 PM, 21/10/2023
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="intro-y">
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-left" className="icon" /> </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevron-left" className="icon" /> </a>
                        </li>
                        <li className="page-item"> <a className="page-link" href="#">...</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">1</a> </li>
                        <li className="page-item active"> <a className="page-link" href="#">2</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">3</a> </li>
                        <li className="page-item"> <a className="page-link" href="#">...</a> </li>
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevron-right" className="icon" /> </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#"> <Icon icon="lucide:chevrons-right" className="icon" /> </a>
                        </li>
                    </ul>
                </nav>
                <select className="form-select box">
                    <option>10</option>
                    <option>25</option>
                    <option>35</option>
                    <option>50</option>
                </select>
            </div>
        </div>
    );
}

export default AuditReport;