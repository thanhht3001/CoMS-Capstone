import { useEffect } from 'react';
import SaleManagerSidebar from '../../components/SaleManagerSidebar';
import './css/style.css';
import Header from '../../components/Header';
import Flow from './components/Flow';

function CreateFlow() {

    useEffect(() => {
    }, []);

    return (
        <div className='create-flow-home'>
            <div className='home-body'>
                <div className='home-content'>
                    <SaleManagerSidebar />
                    <div className='content'>
                        <Header />
                        <Flow />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateFlow;