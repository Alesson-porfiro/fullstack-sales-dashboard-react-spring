import { FaBell, FaUserCircle } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <h2>Dashboard</h2>
      <div className="header-right">
        <FaBell className="icon" />
        <FaUserCircle className="icon" />
      </div>
    </header>
  );
}

export default Header;
