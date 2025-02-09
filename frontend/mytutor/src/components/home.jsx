import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '/src/assets/home.json'; // Download from the link and place in src
import './home.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar fixed-top">
      <div className="logo">Student-Tutor Portal</div>
      <div className="nav-buttons">
        <button className="login-button" onClick={() => navigate('/login')}>Login</button>
        <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </nav>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="content">
        <div className="text">
          <h5>⭐ 5 Stars</h5>
          <p>Read Our <a href="#">Success Stories</a></p>
          <h1>Find Your Perfect Learning Platform</h1>
          <p>
            Our mission is to help people find the best courses online and learn 
            from experts anytime, anywhere.
          </p>
          <div className="buttons">
            <button className="btn-primary" onClick={handleSignupClick}>Get Started →</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="animation">
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;