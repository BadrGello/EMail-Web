// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link here
import axios from 'axios';
import { use } from 'react';

const EndPoints = {
    Base: "http://localhost:8080/api",
    Login: "http://localhost:8080/api/login",
};

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // send to backend email and password and await a response
            // Comment this if there's no connection to backend
             const response = await axios.post(EndPoints.Login,null, {
                params: {
                 email: userName,
                 password: password,
                }
             });

            alert('Login successful!');
            navigate('/home', {replace: true, state:{userName}})
        } 
        catch (error) {
            if (!error.response) {
                // Network error (no response received)
                console.error('Network error:', error.message);
                alert('Network error');
            } else if (error.response.status === 500) {
                // Backend error with status code 500
                console.error('Error from backend:', error.response.data);
                alert('Login failed: Incorrect email or password.');
            } else {
                // Other errors (e.g., 400, 401, etc.)
                console.error('Other error:', error.response.data);
                alert('Error: ' + (error.response.data?.message || error.message));
            }
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
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}

export default Login;
