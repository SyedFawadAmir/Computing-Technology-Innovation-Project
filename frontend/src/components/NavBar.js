// src/components/Navbar.js
import React from 'react';
import '../styles/NavBar.css';

function Navbar({ setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Flight Network</div>
      <ul className="navbar-links">
        <li>
          <a href="#" onClick={() => setCurrentPage('home')}>Home</a>
        </li>
        <li>
          <a href="#" onClick={() => setCurrentPage('about')}>About Us</a>
        </li>
        <li>
          <a href="https://www.youtube.com/your-video-link" target="_blank" rel="noopener noreferrer">
            Video Presentation
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
