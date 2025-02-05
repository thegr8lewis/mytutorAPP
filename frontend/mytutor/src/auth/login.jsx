import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Declare navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
        const response = await fetch('http://localhost:4000/api/mytutor/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();
        console.log('Full response data:', data);  // Debugging

        if (!response.ok) {
            toast.error('Login failed, Invalid credentials');
            return;
        }

        // Check if response data contains the necessary information
        if (data && data.role) {
            toast.success('Login successful');
            // If the user is a tutor, check the tutor_id
            if (data.role === 'tutor' && data.tutor_id) {
                navigate(`/tutordash/${data.tutor_id}`);
            } else if (data.role === 'student') {
                navigate('/studentdash');
            } else {
                throw new Error('Invalid response format');
            }
        } else {
            throw new Error('Missing data in response');
        }
    } catch (error) {
        console.error('Error during login:', error);
        setErrorMessage('An error occurred during login.');
    }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
