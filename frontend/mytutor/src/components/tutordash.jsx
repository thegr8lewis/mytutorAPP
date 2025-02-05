import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// API utility function
const api = axios.create({
    baseURL: 'http://localhost:4000/api/mytutor/tutor',  // Replace with your actual API URL
});

// Set the auth token in the headers
const setAuthHeader = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Tutor Dashboard Component
const TutorDashboard = () => {
    const { id } = useParams();  // Get tutor ID from URL
    const navigate = useNavigate();  // Use navigate for redirection
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        sex: '',
        location: '',
        qualifications: '',
        subjects_offered: '',
    });
    const [error, setError] = useState('');
    const [mode, setMode] = useState('view');  // 'view', 'update', 'register' mode
    const [tutor, setTutor] = useState(null);

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle submit for registration, update, or other actions
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
                // Register Tutor
                response = await api.post('/register', formData);
                alert('Tutor registered successfully');
                setMode('view');
                navigate(`/tutor/${response.data.tutor.tutor_id}`);
            } else if (mode === 'update') {
                // Update Tutor Profile
                response = await api.put(`/update/${id}`, formData);
                alert('Tutor profile updated successfully');
                setMode('view');
                setTutor(response.data.tutor);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    // Fetch tutor profile data when in 'view' or 'update' mode
    useEffect(() => {
        const token = localStorage.getItem('token');  // Fetch token from localStorage
        if (!token) {
            setError('Authentication required');
            return;
        }

        setAuthHeader(token);  // Set the token in the header for subsequent API requests

        if (!id) {
            setError('Tutor ID is missing');
            return;
        }

        if (mode === 'view' || mode === 'update') {
            const fetchTutorProfile = async () => {
                try {
                    const response = await api.get(`/${id}`);
                    setTutor(response.data);
                    setFormData({
                        full_name: response.data.full_name,
                        age: response.data.age,
                        sex: response.data.sex,
                        location: response.data.location,
                        qualifications: response.data.qualifications,
                        subjects_offered: response.data.subjects_offered,
                    });
                } catch (err) {
                    setError(err.response?.data?.message || 'Error fetching tutor profile');
                }
            };

            fetchTutorProfile();
        }
    }, [mode, id]);

    // Render Register Form
    const renderRegisterForm = () => (
        <div>
            <h2>Register as a Tutor</h2>
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
                <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="Qualifications"
                    required
                />
                <textarea
                    name="subjects_offered"
                    value={formData.subjects_offered}
                    onChange={handleChange}
                    placeholder="Subjects Offered"
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );

    // Render Profile View
    const renderProfileView = () => (
        <div>
            <h2>Tutor Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {tutor ? (
                <div>
                    <p>Name: {tutor.full_name}</p>
                    <p>Age: {tutor.age}</p>
                    <p>Sex: {tutor.sex}</p>
                    <p>Location: {tutor.location}</p>
                    <p>Qualifications: {tutor.qualifications}</p>
                    <p>Subjects Offered: {tutor.subjects_offered}</p>
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
            <h2>Update Tutor Profile</h2>
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
                <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="Qualifications"
                />
                <textarea
                    name="subjects_offered"
                    value={formData.subjects_offered}
                    onChange={handleChange}
                    placeholder="Subjects Offered"
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

export default TutorDashboard;
