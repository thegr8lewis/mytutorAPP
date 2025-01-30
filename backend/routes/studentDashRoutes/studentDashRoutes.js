const express = require('express');
const Student = require('../../models/student');
const { authenticateToken } = require('../../middleware/authMiddleware');  // JWT token authentication middleware
const router = express.Router();

// ✅ Register Student (with user_id from the authentication process)
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const { full_name, age, sex, location } = req.body;
        const user_id = req.user.id;  // Assuming user_id comes from the JWT token
        
        // Check if student already exists for the user
        const existingStudent = await Student.findOne({ where: { user_id } });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student profile already exists' });
        }

        // Create new student profile
        const newStudent = await Student.create({
            user_id,
            full_name,
            age,
            sex,
            location
        });

        res.status(201).json({ message: 'Student registered successfully', student: newStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Student Profile by ID
router.get('/:student_id', authenticateToken, async (req, res) => {
    try {
        const { student_id } = req.params;  // Student ID
        const student = await Student.findOne({ where: { student_id } });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update Student Profile
router.put('/update/:student_id', authenticateToken, async (req, res) => {
    try {
        const { student_id } = req.params;
        const { full_name, age, sex, location } = req.body;

        // Check if student exists
        const student = await Student.findOne({ where: { student_id } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student profile
        student.full_name = full_name || student.full_name;
        student.age = age || student.age;
        student.sex = sex || student.sex;
        student.location = location || student.location;

        await student.save();
        res.json({ message: 'Student profile updated successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete Student Profile
router.delete('/delete/:student_id', authenticateToken, async (req, res) => {
    try {
        const { student_id } = req.params;

        // Find and delete student
        const deleted = await Student.destroy({ where: { student_id } });
        if (deleted === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
