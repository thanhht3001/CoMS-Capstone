import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { BsFillShieldLockFill, BsFillEyeFill, BsFillEyeSlashFill, BsShieldFillCheck } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import Swal from 'sweetalert2';
import './css/style.css';
import { jwtDecode } from "jwt-decode";
import contractManagementImg from '../../assets/img/contractmanagementlogo.png';
import logoImg from '../../assets/img/hisoftlogo.jpg';

function PartnerCode() {
    const [code, setCode] = useState('');
    const [token, setToken] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [availableCode, setAvailableCode] = useState('');
    const [visible, setVisible] = useState(true);
    const [visible2, setVisible2] = useState(true);
    const [isFetched, setIsFetched] = useState(false);
    const navigate = useNavigate();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const fetchPartnerData = async (e) => {
        e.preventDefault();
        let url = `https://localhost:7073/auth/enter-code?code=${code}`;
        const res = await fetch(url, { mode: 'cors', method: 'POST', headers: headers });
        if (res.status === 200) {
            const data = await res.json();
            const tokenData = data.token;
            const res2 = await fetch(`https://localhost:7073/auth/email-confirm?partnerId=${jwtDecode(tokenData).Id}`, { mode: 'cors', method: 'GET', headers: headers });
            if (res2.status === 200) {
                const data2 = await res2.text();
                Swal.fire({
                    icon: 'info',
                    title: 'Email Confirmation',
                    text: "To secure the system, we will provide you with a confirmation code. Please check your email and come back later!"
                })
                setAvailableCode(data2);
                setToken(tokenData);
                setIsFetched(true);
            }
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    };

    const handleCodeChange = event => {
        setCode(event.target.value);
    }

    const handleConfirmationCodeChange = event => {
        setConfirmCode(event.target.value);
    }

    const handleConfirmCodeClick = async (e) => {
        e.preventDefault();
        if (confirmCode === availableCode) {
            localStorage.setItem("Token", token);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Welcome To Coms!',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/partner-waiting-contract');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Your confirmation code is incorrect!"
            })
        }
    };

    useEffect(() => {
        if (localStorage) {
            localStorage.removeItem("Token");
        }
    }, [])

    return (
        <div className="loginPage flex">
            <div className="container flex">
                <div className="imgDiv">
                    <img className="contractImg" src={contractManagementImg} alt='/' />
                    <div className="overlayDiv"></div>
                    <div className="textDiv">
                        <h2 className="title">
                            Hisoft Contract Management System
                        </h2>
                    </div>
                    <div className="footerDiv">
                        <span className='text'>If you already have an account on this website, please sign in!</span>
                        <Link to="/login">
                            <button className='btn'>Sign in</button>
                        </Link>
                    </div>
                </div>
                <div style={{ display: isFetched ? "none" : "block" }} className="formDiv">
                    <div className="headerDiv">
                        <img className='logo' src={logoImg} alt='Hisoft Logo' />
                        <BsShieldFillCheck className="icon" />
                        <h3 className='welcome'>Enter Your Code!</h3>
                    </div>
                    <form onSubmit={fetchPartnerData} className='form grid'>
                        <div className="inputDiv">
                            <label className="label" htmlFor='password'>Partner Code</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon' />
                                <input className="inputData" type={visible ? "text" : "password"} id='password'
                                    placeholder='Enter code...' value={code} onChange={handleCodeChange} required />
                                <div className="toggle" onClick={() => setVisible(!visible)}>{visible ? <BsFillEyeFill className='icon' /> : <BsFillEyeSlashFill className='icon' />}</div>
                            </div>
                        </div>
                        <button className="btn" type="submit">
                            <span>Confirm</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>
                    </form>
                </div>
                <div style={{ display: isFetched ? "block" : "none" }} className="formDiv">
                    <div className="headerDiv">
                        <img className='logo' src={logoImg} alt='Hisoft Logo' />
                        <BsShieldFillCheck className="icon" />
                        <h3 className='welcome'>Email Confirm!</h3>
                    </div>
                    <form onSubmit={handleConfirmCodeClick} className='form grid'>
                        <div className="inputDiv">
                            <label className="label" htmlFor='password'>Confirmation Code</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon' />
                                <input className="inputData" type={visible2 ? "text" : "password"} id='password'
                                    placeholder='Enter confirmation code...' value={confirmCode} onChange={handleConfirmationCodeChange} required />
                                <div className="toggle" onClick={() => setVisible2(!visible2)}>{visible2 ? <BsFillEyeFill className='icon' /> : <BsFillEyeSlashFill className='icon' />}</div>
                            </div>
                        </div>
                        <button className="btn" type="submit">
                            <span>Confirm</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PartnerCode;