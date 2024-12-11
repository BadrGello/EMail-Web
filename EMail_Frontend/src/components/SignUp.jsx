// SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link here
import axios from 'axios';

function SignUp() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // send to backend email and password and await a response
            const response = await axios.post('http://localhost:8080/api/signup', {
                email: userName,
                password: password,
            });

            alert('Sign-up successful!');
            navigate("/")
        } 
        catch (error) {
            console.error('Error signing up:', error.response?.data || error.message);
            alert('Error signing up: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='container'>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className='username'>
                    <label>Email</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div className='password'>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" id='submit-button'>Sign Up</button>
                    {/* Link to Login Page */}
                    
            </form>

            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>

        </div>

    );
}

export default SignUp;
