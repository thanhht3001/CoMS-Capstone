import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import LoginPage from './pages/UserLoginPage';
import PartnerCodePage from './pages/PartnerCodePage';
import HomePage from './pages/HomePage';
import CreateTemplate from './pages/CreateTemplatePage';
import TemplateList from './pages/TemplateListPage';
import AuditReportPage from './pages/AuditReportPage';
import CategoryListPage from './pages/CategoryListPage';
import ChooseTemplate from './pages/ChooseTemplatePage';
import ContractList from './pages/ContractListPage';
import Contract from './pages/CreateContractPage';
import EditTemplate from './pages/EditTemplatePage';
import WaitingContracts from './pages/WaitingContracstsPage';
import ApproveContracts from './pages/ApproveContractsPage';
import RejectedContracts from './pages/RejectedContractsPage';
import PartnerWaitingContracts from './pages/PartnerWaitngContractsPage';
import PartnerApprovedContracts from './pages/PartnerApprovedContractsPage';
import ContractDetails from './pages/ContractDetailsPage';
import ApproveContractDetails from './pages/ApproveContractDetailsPage';
import PartnerApproveContractDetails from './pages/PartnerApproveContractDetailsPage';
import TemplateDetails from './pages/TemplateDetailsPage';
import PreviewContract from './pages/PreviewContractPage';
import SignContractList from './pages/SignContractPage';
import SignContractDetails from './pages/SignContractDetailsPage';
import PartnerWaitingSignContracts from './pages/PartnerSignContractPage';
import PartnerSignContractDetails from './pages/PartnerSignContractDetailsPage';
import PartnerList from './pages/PartnerListPage';
import CreatePartner from './pages/CreatePartnerPage';
import PartnerDetails from './pages/PartnerDetailsPage';
import EditPartner from './pages/EditPartnerPage';
import ChoosePartnerAndService from './pages/ChoosePartnerAndServicePage';
import EditContract from './pages/EditContractPage';
import UserList from './pages/UserListPage';
import CreateUser from './pages/CreateUserPage';
import UserDetails from './pages/UserDetailsPage';
import EditUser from './pages/EditUserPage';
import ServiceList from './pages/ServiceListPage';
import ActionReports from './pages/ActionReportsPage';
import CategoryList from './pages/CategoryListPage';
import CreateFlow from './pages/CreateFlowPage';
import CreateCategory from './pages/CreateCategoryPage';
import LiquidationRecordListPage from './pages/LiquidationRecordListPage';
import LiquidationRecordDetailsPage from './pages/LiquidationRecordDetailsPage';
import ContractStatistic from './pages/ContractStatisticPage';
import ContractAnnexList from './pages/ContractAnnexListPage';
import CreateContractAnnex from './pages/CreateContractAnnexPage';
import EditContractAnnex from './pages/EditContractAnnexPage';
import ContractAnnexDetails from './pages/ContractAnnexDetailsPage';
import WaitingContractAnnexes from './pages/WaitingContracstAnnexesPage';
import PreviewContractAnnex from './pages/PreviewContractAnnexPage';
import SignContractAnnexes from './pages/SignContractAnnexPage';
import SignContractAnnexDetails from './pages/SignContractAnnexDetailsPage';
import PartnerWaitingContractAnnexes from './pages/PartnerWaitngContractAnnexesPage';
import PartnerWaitingSignContractAnnexes from './pages/PartnerSignContractAnnexPage';
import PartnerApproveContractAnnexDetails from './pages/PartnerApproveContractAnnexDetailsPage';
import PartnerContractDetails from './pages/PartnerContractDetailsPage';
import SystemSettings from './pages/SystemSettingsPage';
import EditSystemSettings from './pages/EditSystemSettingsPage';
import ReviewedHistoryContracts from './pages/ReviewedHistoryContracstsPage';
import PartnerSignContractAnnexDetails from './pages/PartnerApproveContractAnnexDetailsPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<LoginPage/>}/>
      <Route exact path="/login" element={<LoginPage/>}/>
      <Route exact path="/partner-code" element={<PartnerCodePage/>}/>
      <Route exact path="/home" element={<HomePage/>}/>
      <Route exact path="/template" element={<TemplateList />}/>
      <Route exact path="/create-template" element={<CreateTemplate/>}/>
      <Route exact path="/edit-template" element={<EditTemplate/>}/>
      <Route exact path="/audit-report" element={<AuditReportPage/>}/>
      <Route exact path="/category-list" element={<CategoryListPage/>}/>
      <Route exact path="/choose-template" element={<ChooseTemplate/>}/>
      <Route exact path="/contract" element={<ContractList/>}/>
      <Route exact path="/create-contract" element={<Contract/>}/>
      <Route exact path="/edit-contract" element={<EditContract/>}/>
      <Route exact path="/waiting-contract" element={<WaitingContracts/>}/>
      <Route exact path="/approved-contract" element={<ApproveContracts/>}/>
      <Route exact path="/rejected-contract" element={<RejectedContracts/>}/>
      <Route exact path="/partner-waiting-contract" element={<PartnerWaitingContracts/>}/>
      <Route exact path="/partner-approve-contract" element={<PartnerApprovedContracts/>}/>
      <Route exact path="/contract-details" element={<ContractDetails/>}/>
      <Route exact path="/approve-contract-details" element={<ApproveContractDetails/>}/>
      <Route exact path="/partner-approve-contract-details" element={<PartnerApproveContractDetails/>}/>
      <Route exact path="/template-details" element={<TemplateDetails/>}/>
      <Route exact path="/preview-contract" element={<PreviewContract/>}/>
      <Route exact path="/waiting-sign-contract" element={<SignContractList/>}/>
      <Route exact path="/sign-contract-details" element={<SignContractDetails/>}/>
      <Route exact path="/partner-sign-contract" element={<PartnerWaitingSignContracts/>}/>
      <Route exact path="/partner-sign-contract-details" element={<PartnerSignContractDetails/>}/>
      <Route exact path="/partner-list" element={<PartnerList/>}/>
      <Route exact path="/create-partner" element={<CreatePartner/>}/>
      <Route exact path="/partner-details" element={<PartnerDetails/>}/>
      <Route exact path="/edit-partner" element={<EditPartner/>}/>
      <Route exact path="/edit-partner-service" element={<ChoosePartnerAndService/>}/>
      <Route exact path="/user" element={<UserList/>}/>
      <Route exact path="/create-user" element={<CreateUser/>}/>
      <Route exact path="/user-details" element={<UserDetails />}/>
      <Route exact path="/edit-user" element={<EditUser />}/>
      <Route exact path="/service" element={<ServiceList />}/>
      <Route exact path="/action-reports" element={<ActionReports />}/>
      <Route exact path="/category-list" element={<CategoryList/>}/>
      <Route exact path="/create-flow" element={<CreateFlow/>}/>
      <Route exact path="/create-category" element={<CreateCategory/>}/>
      <Route exact path="/liquidation-record" element={<LiquidationRecordListPage/>}/>
      <Route exact path="/liquidation-record-details" element={<LiquidationRecordDetailsPage/>}/>
      <Route exact path="/contract-statistic" element={<ContractStatistic/>}/>
      <Route exact path="/contractannex" element={<ContractAnnexList/>}/>
      <Route exact path="/create-contractannex" element={<CreateContractAnnex/>}/>
      <Route exact path="/edit-contractannex" element={<EditContractAnnex/>}/>
      <Route exact path="/contractannex-details" element={<ContractAnnexDetails/>}/>
      <Route exact path="/waiting-contractannex" element={<WaitingContractAnnexes/>}/>
      <Route exact path="/preview-contractannex" element={<PreviewContractAnnex/>}/>
      <Route exact path="/sign-contractannex" element={<SignContractAnnexes/>}/>
      <Route exact path="/sign-contractannex-details" element={<SignContractAnnexDetails/>}/>
      <Route exact path="/partner-waiting-contractannex" element={<PartnerWaitingContractAnnexes/>}/>
      <Route exact path="/partner-sign-contractannex" element={<PartnerWaitingSignContractAnnexes/>}/>
      <Route exact path="/partner-approve-contractannex-details" element={<PartnerApproveContractAnnexDetails/>}/>
      <Route exact path="/partner-contract-details" element={<PartnerContractDetails/>}/>
      <Route exact path="/settings" element={<SystemSettings/>}/>
      <Route exact path="/edit-settings" element={<EditSystemSettings/>}/>
      <Route exact path="/reviewed-history-contract" element={<ReviewedHistoryContracts/>}/>
      <Route exact path="/partner-sign-contractannex-details" element={<PartnerSignContractAnnexDetails/>}/>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
