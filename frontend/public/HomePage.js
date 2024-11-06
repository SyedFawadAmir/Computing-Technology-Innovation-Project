import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FlightForm from '../components/FlightForm';
import PredictionResult from '../components/PredictionResult';
import DelayVisualization from '../components/DelayVisualization';

const HomePage = () => {
  const [prediction, setPrediction] = useState({ delayProbability: '', pricingPrediction: '' });

  const handlePredict = (data) => {
    // Replace with actual backend call
    fetch('/predict-delay/', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(result => setPrediction({ delayProbability: result.delay_probability, pricingPrediction: result.pricing_prediction }));
  };

  return (
    <>
      <Navbar />
      <HeroSection />
      <FlightForm onPredict={handlePredict} />
      {prediction.delayProbability && <PredictionResult {...prediction} />}
      <DelayVisualization data={[10, 20, 30, 40, 50]} />
    </>
  );
};

export default HomePage;
