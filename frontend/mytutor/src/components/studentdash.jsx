import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// API utility function
const api = axios.create({
    baseURL: 'http://localhost:4000/api/mytutor/student',  // Replace with your actual API URL
});

// Set the auth token in the headers
const setAuthHeader = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Student Dashboard Component
const StudentDashboard = () => {
    const { id } = useParams();  // Get student ID from URL
    const navigate = useNavigate();  // Use navigate for redirection
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        sex: '',
        location: '',
    });
    const [error, setError] = useState('');
    const [mode, setMode] = useState('view');  // 'view', 'update', 'register' mode
    const [student, setStudent] = useState(null);

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle submit for registration or update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');  // Get token from localStorage

        if (!token) {
            setError('Authentication required');
            return;
        }

        setAuthHeader(token);

        try {
            let response;
            if (mode === 'register') {
                // Register Student
                response = await api.post('/register', formData);
                alert('Student registered successfully');
                setMode('view');
                navigate(`/student/${response.data.student.student_id}`);
            } else if (mode === 'update') {
                // Update Student Profile
                response = await api.put(`/update/${id}`, formData);
                alert('Student profile updated successfully');
                setMode('view');
                setStudent(response.data.student);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    // Fetch student profile data when in 'view' or 'update' mode
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required');
            return;
        }

        setAuthHeader(token);

        if (!id) {
            setError('Student ID is missing');
            return;
        }

        if (mode === 'view' || mode === 'update') {
            const fetchStudentProfile = async () => {
                try {
                    const response = await api.get(`/${id}`);
                    setStudent(response.data);
                    setFormData({
                        full_name: response.data.full_name,
                        age: response.data.age,
                        sex: response.data.sex,
                        location: response.data.location,
                    });
                } catch (err) {
                    setError(err.response?.data?.message || 'Error fetching student profile');
                }
            };

            fetchStudentProfile();
        }
    }, [mode, id]);

    // Render Register Form
    const renderRegisterForm = () => (
        <div>
            <h2>Register as a Student</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                />
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    required
                />
                <input
                    type="text"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    placeholder="Sex"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );

    // Render Profile View
    const renderProfileView = () => (
        <div>
            <h2>Student Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {student ? (
                <div>
                    <p>Name: {student.full_name}</p>
                    <p>Age: {student.age}</p>
                    <p>Sex: {student.sex}</p>
                    <p>Location: {student.location}</p>
                    <button onClick={() => setMode('update')}>Edit Profile</button>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );

    // Render Profile Update Form
    const renderProfileUpdateForm = () => (
        <div>
            <h2>Update Student Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                />
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                />
                <input
                    type="text"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    placeholder="Sex"
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                />
                <button type="submit">Update</button>
            </form>
        </div>
    );

    // Render based on mode
    if (mode === 'register') {
        return renderRegisterForm();
    } else if (mode === 'view') {
        return renderProfileView();
    } else if (mode === 'update') {
        return renderProfileUpdateForm();
    }

    return null;
};

export default StudentDashboard;
