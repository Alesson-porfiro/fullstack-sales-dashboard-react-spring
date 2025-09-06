import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../pages//ThemeContext";
import { FaHome, FaUsers, FaCog, FaMoon, FaSun } from "react-icons/fa";

function Sidebar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="sidebar">
      <h2>MyDashboard</h2>
      <ul>
        <li><Link to="/dashboard"><FaHome /> Home</Link></li>
        <li><Link to="/dashboard/users"><FaUsers /> Users</Link></li>
        <li><Link to="/dashboard/settings"><FaCog /> Settings</Link></li>
      </ul>

      <button className="theme-btn" onClick={toggleTheme}>
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>
    </div>
  );
}

export default Sidebar;
