import { useState } from 'react'
import Header from '../../components/Header';
import Home from './components/Home';
import Sidebar from '../../components/Sidebar';
import Mode from './components/Mode';
import './css/style.css';

function HomePage() {
    return (
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
    )
}

export default HomePage;