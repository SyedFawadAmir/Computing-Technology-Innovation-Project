import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <h2>Your Flight, Perfectly Timed and Priced</h2>
        <p>Get Real-Time Insights on Fares and Delay Risks</p>
      </div>
      <div className="hero-content">
        <p>
          Welcome to Flight Network, your go-to platform for smarter travel planning. Our application provides accurate, 
          real-time insights into flight pricing and delay probabilities, helping you make informed decisions with ease. 
          Simply enter your travel details, and we'll analyze up-to-date airline, route, and timing data to provide the 
          best fare predictions and potential delays for your journey. Say goodbye to surprises and hello to seamless 
          travel planning — with Flight Network, you're always one step ahead.
        </p>
        <button className="hero-button">Search Your Flight</button>
      </div>
    </section>
  );
}

export default HeroSection;
