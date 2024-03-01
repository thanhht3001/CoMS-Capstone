import { useEffect } from "react";
import Header from "../../components/Header";
import AdminSidebar from "../../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Edit from "./components/Edit";
import "./css/style.css";

function EditUser() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage) {
      var token = localStorage.getItem("Token");
      if (token) {
        token = token.replace("Bearer ", "");
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (userRole !== "Admin") {
          alert("You do not have permission to access this page. Redirecting to the login page.");
          navigate("/login");
        }
      } else {
        alert("You do not have permission to access this page. Redirecting to the login page.");
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <div className="home">
      <div className="home-body">
        <div className="home-content">
          <AdminSidebar />
          <div className="content">
            <Header />
            <Edit />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
