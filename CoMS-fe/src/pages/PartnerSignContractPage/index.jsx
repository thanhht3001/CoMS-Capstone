import { useEffect } from 'react'
import Header from '../../components/Header';
import PartnerSidebar from '../../components/PartnerSidebar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import List from './components/List';
import './css/style.css';

function SignContracts() {
    const navigate = useNavigate();

    useEffect(() => {
    }, [])

    return (
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
    )
}

export default SignContracts;