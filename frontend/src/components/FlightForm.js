import React, { useState } from 'react';
import './FlightForm.css';

const FlightForm = ({ onSubmit }) => {
  const [airline, setAirline] = useState('');
  const [departurePort, setDeparturePort] = useState('');
  const [arrivalPort, setArrivalPort] = useState('');
  const [travelDate, setTravelDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ airline, departurePort, arrivalPort, travelDate });
  };

  return (
    <div className="flight-form">
      <h2>Flight Insightor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Airline</label>
          <select value={airline} onChange={(e) => setAirline(e.target.value)}>
            <option value="">Select Airline</option>
            <option value="Qantas">Qantas</option>
            <option value="Virgin Australia">Virgin Australia</option>
            <option value="Jetstar">Jetstar</option>
            <option value="Regional Express">Regional Express</option>
          </select>
        </div>

        <div className="form-group">
          <label>Route</label>
          <input
            type="text"
            placeholder="Departure Port"
            value={departurePort}
            onChange={(e) => setDeparturePort(e.target.value)}
          />
          <input
            type="text"
            placeholder="Arrival Port"
            value={arrivalPort}
            onChange={(e) => setArrivalPort(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Travel Time</label>
          <input
            type="date"
            placeholder="DD/MM/YYYY"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">Predict</button>
      </form>
    </div>
  );
};

export default FlightForm;
