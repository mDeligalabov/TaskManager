import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);
            const response = await fetch("http://localhost:8000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.detail || "Login failed. Please try again.");
                setLoading(false);
                return;
            }
            const data = await response.json();
            // Assuming the API returns an access_token
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                navigate("/home");
            } else {
                setError("Invalid response from server.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark p-4">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <div className="bg-secondary bg-opacity-75 rounded p-4 shadow">
                    <h1 className="text-white text-center fw-bold mb-4">Welcome Back</h1>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="username" className="text-light fw-medium">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="form-control bg-dark text-white border-secondary"
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="password" className="text-light fw-medium">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="form-control bg-dark text-white border-secondary"
                                disabled={loading}
                            />
                        </div>
                        {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                        <button 
                            type="submit" 
                            className={`btn w-100 ${loading ? 'btn-secondary' : 'btn-primary'}`}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    <div className="text-center mt-4 pt-3 border-top border-secondary">
                        <p className="text-light mb-0">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary text-decoration-none fw-medium">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 