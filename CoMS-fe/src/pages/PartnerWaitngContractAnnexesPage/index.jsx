import { useEffect } from 'react'
import Header from '../../components/Header';
import PartnerSidebar from '../../components/PartnerSidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import List from './components/List';
import './css/style.css';

function PartnerWaitingContractAnnexes() {
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    const authen = () => {
        if(token === null){
            navigate('/');
        }
    }

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
        authen()
    }, [])

    return token !== null ? (
        <div className='home'>
            <div className='home-body'>
                <div className='home-content'>
                    <PartnerSidebar />
                    <div className='content'>
                        <Header />
                        <List />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default PartnerWaitingContractAnnexes;