import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Dashboard = () => {
    const navigate = useNavigate();
    const handleLogout = async() => {
        try {
            await authService.logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.response?.data?.message || error.message);
        }
    };
    return (
        <div>
            <h1>
                <span> Welcom to the Dashboard </span>
            </h1>
            <button onClick={handleLogout}>logout</button>
        </div>
    );
};
export default Dashboard;