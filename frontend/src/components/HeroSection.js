// src/components/HeroSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/flight-form'); // Navigates to the Flight Form page
  };

  return (
    <section className="hero">
      <div className="hero-top-text">
        <h1>Your Flight, Perfectly Timed and Priced, Get Real-Time Insights on Fares and Delay Risks</h1>
      </div>
      <img
        className="hero-image"
        src={`${process.env.PUBLIC_URL}/airplane.png`}
        alt="Airplane"
      />
      <div className="hero-bottom-text">
        <p>
          Welcome to Flight Network, your go-to platform for smarter travel planning. Our application provides
          accurate, real-time insights into flight pricing and delay probabilities, helping you make informed
          decisions with ease. Simply enter your travel details, and we'll analyze up-to-date airline, route,
          and timing data to provide the best fare predictions and potential delays for your journey. Say goodbye
          to surprises and hello to seamless travel planning — with Flight Network, you're always one step ahead.
        </p>
        <button className="search-button" onClick={handleSearchClick}>
          Search Your Flight
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
