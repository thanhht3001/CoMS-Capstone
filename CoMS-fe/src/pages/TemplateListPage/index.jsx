import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SaleManagerSidebar from '../../components/SaleManagerSidebar';
import './css/style.css';
import Header from '../../components/Header';
import List from './components/List';

function TemplateList() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("Token");
    // let showPopup = (location.state.showPopup === null) ? false : location.state.showPopup;

    const authen = () => {
        if (token === null) {
            navigate('/');
        }
    }

    useEffect(() => {
        authen();
    }, []);

    return token !== null ? (
        <div className='sale-manager-home'>
            <div className='home-body'>
                <div className='home-content'>
                    <SaleManagerSidebar />
                    <div className='content'>
                        <Header />
                        <List />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
export default TemplateList;