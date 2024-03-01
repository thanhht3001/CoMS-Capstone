import './css/style.css';
import Header from '../../components/Header';
import Contract from './components/Contract';
import Attachment from './components/Attachment';
import Sidebar from '../../components/Sidebar';


function SignContractAnnexDetails() {

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
                                {/* <Sign/> */}
                                <Attachment />
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
export default SignContractAnnexDetails;