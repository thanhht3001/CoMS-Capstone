import { useEffect } from 'react'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/style.css';
import Contract from './components/Contract';

function CreateContract() {
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
    )
}

export default CreateContract;