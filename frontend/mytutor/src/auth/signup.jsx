import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        const userData = { username, email, password, role };

        try {
            const response = await fetch('http://localhost:4000/api/mytutor/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                localStorage.setItem('token', data.token);
                navigate(role === 'tutor' ? `/tutordash/${data.tutor_id}` : '/studentdash');
            } else {
                if (data.message === 'User already exists') {
                   alert('The email is already registered. Please use a different email.');
               } else {
                   alert(data.error || 'Signup failed!');
               }
            }
            }
        catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup!');
        }
    };

    return (
        <div className="signup-container">
            <div className="welcome-section">
                <h1>Join<br />Us!</h1>
            </div>
            <div className="form-section">
                <h2>Signup</h2>
                <p>Create a new account</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                    </select>
                    <button type="submit">Sign Up</button>
                </form>
                <div className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </div>
            </div>
        </div>
    );
};

export default Signup;
