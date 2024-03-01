import { useEffect } from 'react'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/style.css';
import Contract from './components/Contract';

function PreviewContract() {
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    useEffect(() => {
        if (localStorage) {
            if (token === null) {
                navigate('/');
            } else {
                if (jwtDecode(token).role !== 'Staff' && jwtDecode(token).role !== 'Manager') {
                    navigate('/');
                }
            }
        }
    }, [])

    return token !== null ? (
        <div className='create-contract-home'>
            <div className='home-body'>
                <div className='home-content'>
                    <Sidebar />
                    <div className='content'>
                        <Header />
                        <Contract /> 
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default PreviewContract;