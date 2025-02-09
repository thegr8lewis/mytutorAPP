import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

// Import components (ensure paths are correct)
import Home from '/src/components/home';
import Signup from '/src/auth/signup';
import Login from '/src/auth/login';
import TutorDash from '/src/components/tutordash';
import StudentDash from '/src/components/studentdash';

const App = () => {
  return (
    <Router>
      <div>
        {/* Toast notifications will appear here */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Routes for different pages */}
        <Routes>
          {/* Home route */}
          <Route path="/" element={<Home />} />
          
          {/* Authentication routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard routes */}
          <Route path="/tutordash" element={<TutorDash />} />
          <Route path="/tutordash/:id" element={<TutorDash />} />
          <Route path="/studentdash" element={<StudentDash />} />
          <Route path="/studentdash/:id" element={<StudentDash />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
