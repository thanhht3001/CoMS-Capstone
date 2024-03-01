import { useState, useEffect } from 'react'
import Header from '../../components/Header';
import Home from './components/Home';
import Sidebar from '../../components/Sidebar';
import Mode from './components/Mode';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/style.css';

function HomePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    const authen = () => {
        if(token === null){
            navigate('/');
        }
    }

    useEffect(() => {
        // if (localStorage) {
        //     if (localStorage.getItem("Token") !== null || localStorage.getItem("Token") !== "" || localStorage.getItem("Token") !== undefined) {
        //         navigate('/');
        //     } 
        // }
        authen();
    }, [])

    return token !== null ? (
        <div className='home'>
            <div className='home-body'>
                <div className='home-content'>
                    <Sidebar />
                    <div className='content'>
                        <Header />
                        <Home />
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default HomePage;