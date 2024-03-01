import '../css/style.css';
import UserManagement from './AuditReport';

function AdminDashboard() {
    return (
        <div>
            <div className="main">
                {/*<!-- BEGIN: Weekly Top Products --> */}
                <UserManagement />
                {/* <!-- END: Weekly Top Products --> */}
            </div>
        </div>
    )
}

export default AdminDashboard;