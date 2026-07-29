import { Link, useNavigate } from "react-router-dom";

function Header({ onSignOut }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("fitness_user") || "{}");
    const logout = () => { localStorage.removeItem("fitness_token"); localStorage.removeItem("fitness_user"); onSignOut(); navigate("/auth"); };
    return (
        <header className="header">
            <Link className="brand" to="/">Fitness Buddy</Link>

            <nav>
                <Link to="/">Home</Link>
                <Link to="/history">History</Link>
                <span className="user-name">{user.name?.split(" ")[0]}</span>
                <button className="text-button" onClick={logout}>Sign out</button>
            </nav>
        </header>
    );
}

export default Header;
