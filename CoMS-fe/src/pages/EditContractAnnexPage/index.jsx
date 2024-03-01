import { useEffect } from 'react'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/style.css';
import EditContract from './components/EditContract';

function EditContractAnnex() {


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
        <div className='edit-contractannex-home'>
            <div className='home-body'>
                <div className='home-content'>
                    <Sidebar />
                    <div className='content'>
                        <Header />
                        <EditContract /> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditContractAnnex;