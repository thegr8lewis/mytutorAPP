import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        const userData = { username, email, password, role };
        
        console.log('User Data:', userData);

        try {
            const response = await fetch('http://localhost:4000/api/mytutor/auth/register', { // Ensure this matches backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
            
                localStorage.setItem('token', data.token);


                // Assuming `response.data.tutorID` contains the actual tutor ID
                navigate(role === 'tutor' ? `/tutordash/${data.tutor_id}` : '/studentdash');

            } else {
                if (data.message === 'User already exists') {
                    alert('The email is already registered. Please use a different email.');
                } else {
                    alert(data.error || 'Signup failed!');
                }
            }
            
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup!');
        }
    };

    return (
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
    );
};

export default Signup;
