import { useState } from 'react'
import Header from '../../components/Header';
import Home from './components/Home';
import SaleManagerSidebar from '../../components/SaleManagerSidebar';
import Mode from './components/Mode';
import './css/style.css';

function SaleManagerDashboardPage() {
    return (
        <div className='home'>
            <div className='home-body'>
                <div className='home-content'>
                    <SaleManagerSidebar />
                    <div className='content'>
                        <Header />
                        <Home />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SaleManagerDashboardPage;