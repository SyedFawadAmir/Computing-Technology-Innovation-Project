import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Flight Network</div>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#video">Video Presentation</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
