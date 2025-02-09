const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Tutor = require('../../models/tutor');
const Student = require('../../models/student');
require('dotenv').config();

const router = express.Router();

// ✅ Register User
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate role
        if (!['tutor', 'student'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword, // Using password_hash field
            role
        });

        let token;
        let responseData = { message: 'User registered successfully' };

        if (role === 'tutor') {
            // Create tutor record
            const tutor = await Tutor.create({
                user_id: newUser.user_id,
                full_name: username,
                age: null,
                sex: null,
                location: '',
                qualifications: '',
                subjects_offered: ''
            });

            token = jwt.sign(
                { user_id: newUser.user_id, role: newUser.role, tutor_id: tutor.tutor_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            responseData.token = token;
            responseData.tutor_id = tutor.tutor_id;
        } else if (role === 'student') {
            // Create student record
            const student = await Student.create({
                user_id: newUser.user_id,
                full_name: username,
                age: null,
                sex: null,
                location: ''
            });

            token = jwt.sign(
                { user_id: newUser.user_id, role: newUser.role, student_id: student.student_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            responseData.token = token;
            responseData.student_id = student.student_id;
        }

        return res.status(201).json(responseData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        let payload = { user_id: user.user_id, role: user.role };
        let responseData = { message: 'Login successful', role: user.role };

        if (user.role === 'tutor') {
            const tutor = await Tutor.findOne({ where: { user_id: user.user_id } });
            payload.tutor_id = tutor ? tutor.tutor_id : null;
            responseData.tutor_id = tutor ? tutor.tutor_id : null;
        } else if (user.role === 'student') {
            const student = await Student.findOne({ where: { user_id: user.user_id } });
            payload.student_id = student ? student.student_id : null;
            responseData.student_id = student ? student.student_id : null;
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        responseData.token = token;

        res.json(responseData);
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
