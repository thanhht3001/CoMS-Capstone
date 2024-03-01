import { useEffect } from 'react';
import SaleManagerSidebar from '../../components/SaleManagerSidebar';
import './css/style.css';
import Header from '../../components/Header';
import Contract from './components/LiquidationRecord';
import Comment from './components/Comment';
import Attachment from './components/Attachment';
import Export from './components/Export';
import Sidebar from '../../components/Sidebar';


function ContractDetails() {
    useEffect(() => {

    }, []);

    return (

        <div className='contract-detail'>
            <div className='home-body'>
                <div className='home-content'>
                    <header className='header'>
                        <Sidebar />
                    </header>
                    <div className='content'>
                        <Header />
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 9 }}>
                                <Contract />
                            </div>
                            <div style={{ flex: 3 }}>
                                {/* <Export/> */}
                                {/*  <Attachment />*/}
                            </div>
                        </div>
                        <div>
                            {/* <Comment /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ContractDetails;