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
            // send to backend email and password and await a response
            
            alert('Login successful!');
            navigate('/home', {replace: true, state:{userName}})
        } 
        catch (error) {
            alert('Error logging in');
        }
    };

    return (
        <div className='container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
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
                <button type="submit" id='submit-button'>Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/">Sign Up</Link>
            </p>
        </div>
    );
}

export default Login;
