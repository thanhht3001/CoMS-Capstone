import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import GeneralReport from './component/GeneralReport';
import ListContract from './component/ListContract';
import './css/style.css';

function ContractStatistic() {

    return (
        <div className='create-contract-home'>
            <div className='home-body'>
                <div className='home-content'>
                    <Sidebar />
                    <div className='content'>
                        <Header />
                        <GeneralReport/>
                        <ListContract/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContractStatistic;