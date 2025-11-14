import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <Link to="/dashboard">Home</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/">Logout</Link>
        </div>
    );
}