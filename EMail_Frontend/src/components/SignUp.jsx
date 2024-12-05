// SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link here

function SignUp() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //backend endpoint
            
            alert('Sign-up successful!');
            navigate("/login")
        } 
        catch (error) {
            alert('Error signing up');
        }
    };

return (
    <div>
    <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>
            {/* Link to Login Page */}
            
    </form>

    <p>
        Already have an account? <Link to="/login">Login</Link>
    </p>

    <p>
        Go View EMail Page <Link to="/email">EMail Page</Link>
    </p>
        
    </div>

);
}

export default SignUp;
