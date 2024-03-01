import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../css/_list.css";

function List() {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [hotline, setHotline] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [email, setEmail] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isHotlineValid, setIsHotlineValid] = useState(true);
  const [isAppPasswordValid, setIsAppPasswordValid] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");

  const fetchSettingsData = async () => {
    let url = `https://localhost:7073/SystemSettings`;
    const res = await fetch(url, {
      mode: "cors",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      setCompanyName(data.companyName);
      setAddress(data.address);
      setPhone(data.phone);
      setHotline(data.hotline);
      setEmail(data.email);
      setTaxCode(data.taxCode);
      setBankName(data.bankName);
      setBankAccount(data.bankAccount);
      setBankAccountNumber(data.bankAccountNumber);
      setAppPassword(data.appPassword);
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.title,
      });
    }
  };

  const handleSaveClick = async (id) => {
    if (isAppPasswordValid && isPhoneValid && isHotlineValid) {
      let url = `https://localhost:7073/SystemSettings`;
      const res = await fetch(url, {
        mode: "cors",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "CompanyName": companyName,
          "Address": address,
          "Phone": phone,
          "Hotline": hotline,
          "TaxCode": taxCode,
          "Email": email,
          "BankAccount": bankAccount,
          "BankAccountNumber": bankAccountNumber,
          "BankName": bankName,
          "AppPassword": appPassword
        })
      });
      if (res.status === 200) {
        navigate("/settings");
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.title,
        });
      }
    }
  };

  const handleCancelClick = () => {
    navigate("/settings");
  }

  const handleCompanyNameChange = e => {
    setCompanyName(e.target.value);
  }

  const handleAddressChange = e => {
    setAddress(e.target.value);
  }

  const handlePhoneChange = e => {
    const phoneRegex = /^(09|03|07|08|05)+([0-9]{7,8})\b$/;
    if (!phoneRegex.test(e.target.value) || e.target.value.length > 11 || e.target.value.length < 10) {
      setIsPhoneValid(false);
    } else {
      setIsPhoneValid(true);
    }
    setPhone(e.target.value);
  }

  const handleHotlineChange = e => {
    const phoneRegex = /^(09|03|07|08|05)+([0-9]{7,8})\b$/;
    if (!phoneRegex.test(e.target.value) || e.target.value.length > 11 || e.target.value.length < 10) {
      setIsHotlineValid(false);
    } else {
      setIsHotlineValid(true);
    }
    setHotline(e.target.value);
  }

  const handleTaxCodeChange = e => {
    setTaxCode(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handleBankAccountChange = e => {
    setBankAccount(e.target.value);
  }

  const handleBankAccountNumberChange = e => {
    setBankAccountNumber(e.target.value);
  }

  const handleBankNameChange = e => {
    setBankName(e.target.value);
  }

  const handleAppPasswordChange = e => {
    const strings = (e.target.value.trim()).split(" ");
    if (strings.length !== 4) {
      setIsAppPasswordValid(false);
      setAppPassword(e.target.value);
    } else {
      for (let i = 0; i < 4; i++) {
        if (strings[i].length !== 4) {
          setIsAppPasswordValid(false);
          setAppPassword(e.target.value);
          return;
        }
      }
      setIsAppPasswordValid(true);
      setAppPassword(e.target.value);
    }
  }

  useEffect(() => {
    fetchSettingsData();
  }, []);

  return (
    <div className="system-settings">
      <div className="intro-y">
        <h2>
          Edit System Settings
        </h2>
        <div>
          <button type="button" className="btn btn-secondary box" onClick={handleCancelClick}> Cancel </button>
          <button type="button" className="btn btn-primary box" onClick={handleSaveClick}> Save </button>
        </div>
      </div>
      <div className="pos intro-y">
        <div className="intro-y">
          <div className="post intro-y box">
            <div className="post__content tab-content">
              <div id="content" className="tab-pane active" role="tabpanel" aria-labelledby="content-tab">
                <div className="dark:border-darkmode-400">
                  <div className="dark:border-darkmode-400">
                    <Icon icon="lucide:chevron-down" className="icon" /> Company Information </div>
                  <div>
                    <div className="editor">
                      <input type="text" className="intro-y form-control box" placeholder="Type company name..."
                        value={companyName} onChange={handleCompanyNameChange} required />
                      <input type="text" className="intro-y form-control box" placeholder="Type address..."
                        value={address} onChange={handleAddressChange} required maxLength={255} />
                      <input type="number" className="intro-y form-control box pr-10" placeholder="Type phone number..."
                        value={phone} onChange={handlePhoneChange} required maxLength={20} />
                      <span style={{ color: "red", display: isPhoneValid ? "none" : "block" }}>Invalid Vietnamese phone number!</span>
                      <input type="number" className="intro-y form-control box pr-10" placeholder="Type hotline..."
                        value={hotline} onChange={handleHotlineChange} required maxLength={20} />
                      <span style={{ color: "red", display: isHotlineValid ? "none" : "block" }}>Invalid Vietnamese phone number!</span>
                      <input type="email" className="intro-y form-control box pr-10" placeholder="Type email..."
                        value={email} onChange={handleEmailChange} required maxLength={50} />
                      <input type="text" className="intro-y form-control box pr-10" placeholder="Type tax code..."
                        value={taxCode} onChange={handleTaxCodeChange} required maxLength={50} />
                    </div>
                  </div>
                </div>
                <div className="dark:border-darkmode-400">
                  <div className="dark:border-darkmode-400"> <Icon icon="lucide:chevron-down" className="icon" /> Payment Information </div>
                  <div>
                    <div>
                      <input type="text" className="intro-y form-control box pr-10" placeholder="Type bank name..."
                        value={bankName} onChange={handleBankNameChange} required maxLength={250} />
                      <input type="text" className="intro-y form-control box pr-10" placeholder="Type bank account..."
                        value={bankAccount} onChange={handleBankAccountChange} required maxLength={150} />
                      <input type="text" className="intro-y form-control box pr-10" placeholder="Type bank account number..."
                        value={bankAccountNumber} onChange={handleBankAccountNumberChange} required maxLength={100} />
                    </div>
                  </div>
                </div>
                <div className="dark:border-darkmode-400">
                  <div className="dark:border-darkmode-400"> <Icon icon="lucide:chevron-down" className="icon" /> Gmail </div>
                  <div>
                    <div>
                      <input type="text" className="intro-y form-control box pr-10" placeholder="Type app password..."
                        value={appPassword} onChange={handleAppPasswordChange} required />
                      <span style={{ color: "red", display: isAppPasswordValid ? "none" : "block" }}>Invalid app password!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
