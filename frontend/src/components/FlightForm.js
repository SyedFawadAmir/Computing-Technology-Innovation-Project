import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FlightForm.css';

const FlightForm = () => {
  const [formState, setFormState] = useState({
    airline: '',
    departurePort: '',
    arrivalPort: '',
    travelTime: ''
  });
  
  const [expandedSections, setExpandedSections] = useState({
    airline: true,
    route: true,
    travelTime: true
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };

  const handleToggle = (section) => {
    setExpandedSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const delayResponse = await axios.post('http://localhost:8000/predict-delay/', {
        airline: formState.airline,
        departure_port: formState.departurePort,
        arrival_port: formState.arrivalPort,
        date: formState.travelTime
      });

      const pricingResponse = await axios.post('http://localhost:8000/predict-pricing/', {
        airline: formState.airline,
        departure_port: formState.departurePort,
        arrival_port: formState.arrivalPort,
        date: formState.travelTime
      });

      navigate('/results', {
        state: {
          delayProbability: delayResponse.data.delay_probability,
          pricingPrediction: pricingResponse.data.pricing_prediction
        }
      });
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const handleClear = () => {
    setFormState({
      airline: '',
      departurePort: '',
      arrivalPort: '',
      travelTime: ''
    });
  };

  return (
    <div className="flight-form">
      <div className="hero-top-text">
        <h1>Your Flight, Perfectly Timed and Priced, Get Real-Time Insights on Fares and Delay Risks</h1>
      </div>
      <div className="hero-image-container">
        <img className="hero-image" src="/airplane.png" alt="Airplane" />
      </div>
      <div className="form-container">
        <h2>FLIGHT INSIGHTOR</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label>Airline</label>
            <div className={`arrow-icon ${expandedSections.airline ? 'expanded' : ''}`} onClick={() => handleToggle('airline')} />
            {expandedSections.airline && (
              <div className="form-group">
                <input
                  type="text"
                  id="airline"
                  placeholder="Eg: Qantas"
                  value={formState.airline}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="form-section">
            <label>Route</label>
            <div className={`arrow-icon ${expandedSections.route ? 'expanded' : ''}`} onClick={() => handleToggle('route')} />
            {expandedSections.route && (
              <>
                <div className="form-group">
                  <label htmlFor="departurePort">Departure Port</label>
                  <input
                    type="text"
                    id="departurePort"
                    placeholder="Eg: Melbourne"
                    value={formState.departurePort}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="arrivalPort">Arrival Port</label>
                  <input
                    type="text"
                    id="arrivalPort"
                    placeholder="Eg: Sydney"
                    value={formState.arrivalPort}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-section">
            <label>Travel Time</label>
            <div className={`arrow-icon ${expandedSections.travelTime ? 'expanded' : ''}`} onClick={() => handleToggle('travelTime')} />
            {expandedSections.travelTime && (
              <div className="form-group">
                <input
                  type="date"
                  id="travelTime"
                  value={formState.travelTime}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button type="button" className="clear-button" onClick={handleClear}>
              Clear
            </button>
            <button type="submit" className="predict-button">
              Predict
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightForm;
