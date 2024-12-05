// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link here

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // backend endpoint
            
            alert('Login successful!');
            navigate("/email")
        } 
        catch (error) {
            alert('Error logging in');
        }
    };

  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
            <button type="submit">Login</button>
        </form>
        <p>
            Don't have an account? <Link to="/">Sign Up</Link>
        </p>
    </div>
  );
}

export default Login;
