import type { FormEvent } from "react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(username, password);

            navigate("/", {
                replace: true,
            });
        } catch (err: unknown) {
            console.error("Superset login failed:", err);

            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || "Invalid username or password"
                : "Invalid username or password";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper">
            <div className="flex items-center justify-center h-screen">
                <div
                    className="d-card max-w-100 w-full"
                    style={{
                        padding: '24px 20px'
                    }}
                >
                    <h1
                        style={{
                            color: "var(--ink)",
                            textAlign: "center",
                            marginBottom: "24px",
                        }}
                    >
                        Sign in with your Superset account.
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                htmlFor="username"
                                style={{
                                    display: "block",
                                    marginBottom: "6px",
                                    color: "var(--ink)",
                                    fontWeight: 500,
                                }}
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                required
                                autoComplete="username"
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "10px 12px",
                                    border: "1px solid #ccc",
                                    color: "#fff",
                                    fontSize: "14px",
                                    borderRadius: "6px",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label
                                htmlFor="password"
                                style={{
                                    display: "block",
                                    marginBottom: "6px",
                                    color: "var(--ink)",
                                    fontWeight: 500,
                                }}
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                autoComplete="current-password"
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "10px 12px",
                                    fontSize: "14px",
                                    border: "1px solid #ccc",
                                    color: "#fff",
                                    borderRadius: "6px",
                                }}
                            />
                        </div>

                        {error && (
                            <div
                                style={{
                                    marginBottom: "16px",
                                    padding: "10px 12px",
                                    background: "#fff0f0",
                                    color: "#c00",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "11px 16px",
                                border: "none",
                                borderRadius: "6px",
                                background: "#1677ff",
                                color: "#fff",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: loading ? 0.7 : 1,
                                fontSize: "15px",
                                fontWeight: 500,
                            }}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}