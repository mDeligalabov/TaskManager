import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/users/register", { name, email, password });
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Network error. Please try again later.");
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
                    <h1 className="text-white text-center fw-bold mb-4">Create Account</h1>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="name" className="text-light fw-medium">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="form-control bg-dark text-white border-secondary"
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="email" className="text-light fw-medium">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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
                        {success && <div className="alert alert-success text-center" role="alert">{success}</div>}
                        <button 
                            type="submit" 
                            className={`btn w-100 ${loading ? 'btn-secondary' : 'btn-primary'}`}
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>
                    <div className="text-center mt-4 pt-3 border-top border-secondary">
                        <p className="text-light mb-0">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary text-decoration-none fw-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 