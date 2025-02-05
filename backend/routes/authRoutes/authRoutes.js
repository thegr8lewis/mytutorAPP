const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Tutor = require('../../models/tutor');
require('dotenv').config();

const router = express.Router();


// ✅ Register User
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

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

        // If the user is a tutor, create a corresponding tutor record
        if (role === 'tutor') {
            const tutor = await Tutor.create({
                user_id: newUser.user_id, // Link to the users table
                full_name: username, // Use the same name as the username
                age: null, // Default age (can be updated later)
                sex: null, // Default sex
                location: '', // Default location
                qualifications: '', // Default qualifications
                subjects_offered: '' // Default subjects
            });

            // Generate a JWT token for the tutor
            const token = jwt.sign(
                { user_id: newUser.user_id, role: newUser.role, tutor_id: tutor.tutor_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                message: 'User registered successfully',
                token, // Send token in the response
                tutor_id: tutor.tutor_id, // Send tutor_id for tutor users
            });
        } else {
            // Generate a JWT token for the student
            const token = jwt.sign(
                { user_id: newUser.user_id, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                message: 'User registered successfully',
                token, // Send token in the response
            });
        }

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
        const isMatch = await bcrypt.compare(password, user.password_hash); // Using password_hash field
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Using user_id as id

        // Default response data
        const responseData = {
            message: 'Login successful',
            role: user.role,
            token,
            // tutor_id: null  // Default to null
        };

        // If user is a tutor, fetch the tutor ID
        if (user.role === 'tutor') {
            const tutor = await Tutor.findOne({ where: { user_id: user.user_id } }); // Ensure user_id is used correctly
            console.log('Tutor Lookup Result:', tutor);  // Debugging log
            responseData.tutor_id = tutor ? tutor.tutor_id : null; // Use correct field
        }

        console.log('Response Data:', responseData);  // Debugging response before sending it
    
        res.json(responseData);
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// ✅ Get User Profile (Protected Route)
// router.get('/profile', async (req, res) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) return res.status(401).json({ message: 'Unauthorized' });

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password_hash'] } }); // Exclude password_hash

//         if (!user) return res.status(404).json({ message: 'User not found' });

//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;
