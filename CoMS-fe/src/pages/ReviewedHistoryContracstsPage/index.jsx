import { useEffect } from 'react'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import List from './components/List';
import './css/style.css';

function ReviewedHistoryContracts() {
    const navigate = useNavigate();

    useEffect(() => {
        // if (localStorage) {
        //     var token = localStorage.getItem('Token');
        //     if (token === null) {
        //         navigate('/');
        //     } else {
        //         if (jwtDecode(token).Role !== 'Staff') {
        //             navigate('/');
        //         }
        //     }
        // }
    }, [])

    return (
        <div className='home'>
            <div className='home-body'>
                <div className='home-content'>
                    <Sidebar />
                    <div className='content'>
                        <Header />
                        <List />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewedHistoryContracts;