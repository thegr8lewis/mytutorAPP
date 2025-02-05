import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Welcome to Student-Tutor Portal</h1>
      <div className="buttons">
        <button onClick={handleSignupClick}>Signup</button>
        <button onClick={handleLoginClick}>Login</button>
      </div>
    </div>
  );
};

export default HomePage;
