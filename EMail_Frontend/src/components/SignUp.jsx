// SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link here
import axios from 'axios';


function SignUp() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    
    const [errorMessage, setErrorMessage] = useState('')

    //Email validation regex
    const emailValidator = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        
        setErrorMessage(''); // Reset error message

        // Email validation
        if (!emailValidator(userName)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        // Password validation (minimum length 6 characters)
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        try {
            // send to backend email and password and await a response
            console.log(userName);
            const response = await axios.post('http://localhost:8080/api/signup',null,{
                params: {
                email: userName,
                password: password,
                }
            });

            alert('Sign-up successful!');
            navigate("/")
        } 
        catch (error) {
            if (!error.response) {
                // Network error (no response received)
                console.error('Network error:', error.message);
                alert('Network error');
            } else if (error.response.status === 500) {
                // Backend error with status code 500
                console.error('Error from backend:', error.response.data);
                alert('Signup failed: Email already exists');
            } else {
                // Other errors (e.g., 400, 401, etc.)
                console.error('Other error:', error.response.data);
                alert('Error: ' + (error.response.data?.message || error.message));
            }
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
                {errorMessage && <div style={{ color: 'red' , textAlign: 'center' }}>{errorMessage}</div>}

                    
            </form>

            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>

        </div>

    );
}

export default SignUp;
