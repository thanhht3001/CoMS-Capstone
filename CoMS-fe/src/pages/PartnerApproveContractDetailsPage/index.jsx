import { useEffect } from 'react';
import SaleManagerSidebar from '../../components/SaleManagerSidebar';
import './css/style.css';
import Header from '../../components/Header';
import Contract from './components/Contract';
import Comment from './components/Comment';
import Attachment from './components/Attachment';
import Export from './components/Export';
import PartnerSidebar from '../../components/PartnerSidebar';


function PartnerApproveContractDetails() {
    useEffect(() => {

    }, []);

    return (

        <div className='contract-detail'>
            <div className='home-body'>
                <div className='home-content'>
                    <header className='header'>
                        <PartnerSidebar />
                    </header>
                    <div className='content'>
                        <Header />
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 9 }}>
                                <Contract />
                            </div>
                            <div style={{ flex: 3 }}>
                                <Export/>
                                <Attachment />
                            </div>
                        </div>
                        {/* <div>
                            <Comment />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PartnerApproveContractDetails;