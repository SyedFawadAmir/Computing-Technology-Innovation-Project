import React from 'react';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/Logo.png" alt="Flight Network Logo" />
        <div className="navbar-text">Flight Network</div>
      </div>
      <div className="navbar-links">
        <button className="navbar-button">Home</button>
        <button className="navbar-button">About Us</button>
        <button className="navbar-button">Video Presentation</button>
      </div>
    </nav>
  );
};

export default NavBar;
