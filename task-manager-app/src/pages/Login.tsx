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

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            padding: '20px'
        },
        formContainer: {
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid #404040'
        },
        title: {
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '32px',
            textAlign: 'center' as const
        },
        form: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '20px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px'
        },
        label: {
            color: '#e0e0e0',
            fontSize: '14px',
            fontWeight: '500'
        },
        input: {
            padding: '12px 16px',
            backgroundColor: '#404040',
            border: '1px solid #555555',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            outline: 'none'
        },
        inputFocus: {
            borderColor: '#007acc',
            boxShadow: '0 0 0 2px rgba(0, 122, 204, 0.2)'
        },
        button: {
            padding: '14px 20px',
            backgroundColor: '#007acc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '8px'
        },
        buttonHover: {
            backgroundColor: '#005a9e'
        },
        buttonDisabled: {
            backgroundColor: '#555555',
            cursor: 'not-allowed'
        },
        error: {
            color: '#ff6b6b',
            fontSize: '14px',
            textAlign: 'center' as const,
            padding: '8px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(255, 107, 107, 0.3)'
        },
        linkContainer: {
            textAlign: 'center' as const,
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #404040'
        },
        link: {
            color: '#007acc',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s ease'
        },
        linkHover: {
            color: '#005a9e'
        },
        linkText: {
            color: '#b0b0b0',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1 style={styles.title}>Welcome Back</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={styles.input}
                            disabled={loading}
                            onFocus={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = styles.inputFocus.borderColor;
                                (e.target as HTMLInputElement).style.boxShadow = styles.inputFocus.boxShadow;
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = '#555555';
                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={styles.input}
                            disabled={loading}
                            onFocus={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = styles.inputFocus.borderColor;
                                (e.target as HTMLInputElement).style.boxShadow = styles.inputFocus.boxShadow;
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = '#555555';
                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    {error && <div style={styles.error}>{error}</div>}
                    <button 
                        type="submit" 
                        style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                        disabled={loading}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
                            }
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <div style={styles.linkContainer}>
                    <p style={styles.linkText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link} onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = styles.linkHover.color;
                        }} onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = styles.link.color;
                        }}>
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 