import React from 'react';
import { useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const { delayProbability, pricingPrediction } = location.state || {};

  return (
    <div className="results">
      <h2>Flight Prediction Results</h2>
      <div className="result-item">
        <h3>Delay Probability</h3>
        <p>{delayProbability ? `${delayProbability}` : 'Data not available'}</p>
      </div>
      <div className="result-item">
        <h3>Pricing Prediction</h3>
        <p>{pricingPrediction ? `$${pricingPrediction.toFixed(2)}` : 'Data not available'}</p>
      </div>
    </div>
  );
};

export default Results;
