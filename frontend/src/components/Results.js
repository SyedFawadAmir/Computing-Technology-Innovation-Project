import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PriceBarChart from './PricingVisualization';
import DelayPredictionGauge from './DelayPredictionGauge'; // Import the gauge component
import '../styles/Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { delayProbability, pricingPrediction } = location.state || {};

  const [activeTab, setActiveTab] = useState('price');

  const handleBackClick = () => {
    navigate('/flight-form');
  };

  return (
    <div className="results">
      <div className="hero-top-text">
        <h1>Your Flight, Perfectly Timed and Priced: Get Real-Time Insights on Fares and Delay Risks</h1>
      </div>
      <div className="hero-image-container">
        <img className="hero-image" src="/airplane.png" alt="Airplane" />
      </div>
      <div className="results-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'price' ? 'active' : ''}`}
            onClick={() => setActiveTab('price')}
          >
            Price Prediction
          </button>
          <button
            className={`tab ${activeTab === 'delay' ? 'active' : ''}`}
            onClick={() => setActiveTab('delay')}
          >
            Delay Prediction
          </button>
        </div>

        {activeTab === 'price' ? (
          <div className="result-item">
            <div className="result-inline">
              <h2 className="result-label">Price Worth Calculation</h2>
              <p className="result-value">
                {pricingPrediction ? `Au$${pricingPrediction.toFixed(2)}` : 'Data not available'}
              </p>
            </div>
            
            <PriceBarChart price={pricingPrediction} />
          </div>
        ) : (
          <div className="result-item">
            <div className="result-inline">
              <h2 className="result-label">Flight Delay Prediction</h2>
              <p className="result-value">
                {delayProbability ? `${delayProbability}` : 'Data not available'}
              </p>
            </div>
            <h4>Predicted Delay Probability</h4>
            {delayProbability && (
              <DelayPredictionGauge percentage={parseFloat(delayProbability)} />
            )}
          </div>
        )}

        <button className="back-button" onClick={handleBackClick}>
          Back to Flight Insightor
        </button>
      </div>
    </div>
  );
};

export default Results;
