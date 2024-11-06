import React from 'react';
import '../styles/AboutPage.css'; // Make sure to create and style this CSS file

const About = () => {
  return (
    <div className="about-page">
      <h1>About Our Project</h1>
      <p>
        Welcome to <strong>Flight Network</strong> – a comprehensive tool designed to provide real-time insights into flight pricing and delay predictions. Our project aims to make flight planning simpler and more informed by using the power of modern technology.
      </p>
      <p>
        This project leverages machine learning models that analyze historical flight data to predict potential delays and pricing trends. By inputting essential travel details, users can receive predictions on:
      </p>
      <ul>
        <li><strong>Flight Pricing:</strong> Get an estimate of expected ticket prices based on the selected route and date.</li>
        <li><strong>Delay Probability:</strong> Understand the likelihood of delays for a given flight route and time frame.</li>
      </ul>
      <p>
        The user-friendly interface is designed to help users navigate easily, whether they are frequent travelers, travel agents, or aviation enthusiasts.
      </p>
      <p>
        Our project combines data science, web development, and AI modeling to create a robust and reliable platform that enhances the flight planning experience.
      </p>
      <h2>Technologies Used</h2>
      <ul>
        <li><strong>React.js:</strong> For building an interactive and responsive user interface.</li>
        <li><strong>FastAPI:</strong> For developing the backend REST API that communicates with the machine learning models.</li>
        <li><strong>D3.js & Chart.js:</strong> For visualizing prediction results in an insightful manner.</li>
        <li><strong>Machine Learning:</strong> Trained models for flight delay and pricing predictions.</li>
      </ul>
      <p>
        Thank you for exploring <strong>Flight Network</strong>. We hope our project helps make your travel planning more efficient and stress-free.
      </p>
    </div>
  );
};

export default About;
