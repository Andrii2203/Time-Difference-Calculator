import React, { useState } from 'react';
import './loginPage.css';

type LoginPageProps = {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login form submitted");

        const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        console.log("Received response from login API:", res.status);

        if (res.ok) {
            const data = await res.json();
            console.log("Login successful, received data:", data);
            localStorage.setItem("accessToken", data.accessToken);
            console.log("Access token stored in localStorage");
            onLoginSuccess();
            console.log("onLoginSuccess callback called");
        } else {
            const data = await res.json();
            console.log("Login failed, received error data:", data);
            setError(data.message || "Login failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <input
                type="text"
                placeholder='Username'
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    console.log("Username updated:", e.target.value);
                }}
                required
            />
            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    console.log("Password updated:", e.target.value);
                }}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;
