import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import List from './components/List';
import './css/style.css';

function SignContractAnnexes() {

    return (
        <div className='home'>
            <div className='home-body'>
                <div className='home-content'>
                    <Sidebar />
                    <div className='content'>
                        <Header />
                        <List />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignContractAnnexes;