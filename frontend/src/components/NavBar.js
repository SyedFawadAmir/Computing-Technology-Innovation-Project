import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/Logo.png" alt="Flight Network Logo" />
        <div className="navbar-text">Flight Network</div>
      </div>
      <div className="navbar-links">
        <Link to="/" className="navbar-button">Home</Link>
        <Link to="/about" className="navbar-button">About Us</Link>
      </div>
    </nav>
  );
};

export default NavBar;
