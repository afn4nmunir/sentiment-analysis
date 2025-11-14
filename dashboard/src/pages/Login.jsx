import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    
    function handleLogin(e) {
        e.preventDefault();
        navigate("/dashboard");
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input placeholder="Username" required /><br /><br />
                <input placeholder="Password" type="password" required /><br /><br />
                <button>Login</button>
            </form>
        </div>
    );
}