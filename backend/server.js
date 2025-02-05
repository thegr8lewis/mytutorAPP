require('dotenv').config();
const express = require('express');
const sequelize = require('./database'); // Import Sequelize connection
const AuthRoutes = require('./routes/authRoutes/authRoutes');
const StudentDashRoutes = require('./routes/studentDashRoutes/studentDashRoutes');
const TutorDashRoutes = require('./routes/tutorDashRoutes/tutorDashRoutes');
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Path: ${req.path}, Method: ${req.method}`);
    next();
});

//enable CORS with specific origin
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));


// Routes
app.use('/api/mytutor/auth', AuthRoutes);
app.use('/api/mytutor/student', StudentDashRoutes);
app.use('/api/mytutor/tutor', TutorDashRoutes);

// Sync Database and Start Server
sequelize.sync() // Sync models with DB
    .then(() => {
        console.log('✅ Database & Tables Created');
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('❌ Error syncing database:', err));
