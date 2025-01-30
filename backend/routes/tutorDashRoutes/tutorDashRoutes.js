// routes/tutorRoutes/tutorRoutes.js
const express = require('express');
const Tutor = require('../../models/tutor');  // Import the Tutor model
const { authenticateToken } = require('../../middleware/authMiddleware');  // Assuming you have JWT token authentication middleware
const router = express.Router();

// ✅ Register Tutor (with user_id from the authentication process)
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const { full_name, age, sex, location, qualifications, subjects_offered } = req.body;
        const user_id = req.user.id;  // Assuming user_id comes from the JWT token
        
        // Check if tutor already exists for the user
        const existingTutor = await Tutor.findOne({ where: { user_id } });
        if (existingTutor) {
            return res.status(400).json({ message: 'Tutor profile already exists' });
        }

        // Create new tutor profile
        const newTutor = await Tutor.create({
            user_id,
            full_name,
            age,
            sex,
            location,
            qualifications,
            subjects_offered
        });

        res.status(201).json({ message: 'Tutor registered successfully', tutor: newTutor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Tutor Profile
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;  // Tutor ID
        const tutor = await Tutor.findOne({ where: { tutor_id: id } });

        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        res.json(tutor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update Tutor Profile
router.put('/update/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, age, sex, location, qualifications, subjects_offered } = req.body;

        // Check if tutor exists
        const tutor = await Tutor.findOne({ where: { tutor_id: id } });
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // Update tutor profile
        tutor.full_name = full_name || tutor.full_name;
        tutor.age = age || tutor.age;
        tutor.sex = sex || tutor.sex;
        tutor.location = location || tutor.location;
        tutor.qualifications = qualifications || tutor.qualifications;
        tutor.subjects_offered = subjects_offered || tutor.subjects_offered;

        await tutor.save();
        res.json({ message: 'Tutor profile updated successfully', tutor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
