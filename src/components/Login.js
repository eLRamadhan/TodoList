// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('API_LOGIN_ENDPOINT', { username, password });
            const token = response.data.token;
            onLogin(token);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
