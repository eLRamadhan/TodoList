import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TodoList from './components/TodoList';

const App = () => {
    const [token, setToken] = useState(null);

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);


    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/todo" /> : <Login onLogin={handleLogin} />} />
                <Route path="/todo" element={token ? <TodoList /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
