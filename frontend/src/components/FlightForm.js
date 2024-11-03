import React, { useState } from 'react';
import '../styles/FlightForm.css';

const FlightForm = ({ onSubmit }) => {
  const [airline, setAirline] = useState('');
  const [departurePort, setDeparturePort] = useState('');
  const [arrivalPort, setArrivalPort] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [warnings, setWarnings] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showAirlineSuggestions, setShowAirlineSuggestions] = useState(false);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);

  const airlines = [
    'Qantas', 'QantasLink', 'Regional Express', 'Skywest', 'Virgin Australia', 'Jetstar',
    'Macair', 'Ozjet', 'MacAir', 'Tigerair Australia', 'Virgin Australia - ATR/F100 Operations',
    'Virgin Australia Regional Airlines', 'Rex Airlines', 'virgin Australia', 'Skytrans', 'Bonza'
  ];

  const ports = ['Adelaide', 'Albury', 'Alice Springs', 'Brisbane', 'Broome', 'Burnie', 'Cairns', 
    'Canberra', 'Coffs Harbour', 'Darwin', 'Devonport', 'Dubbo', 'Gold Coast', 
    'Hobart', 'Kalgoorlie', 'Launceston', 'Mackay', 'Melbourne', 'Mildura', 'Perth', 
    'Rockhampton', 'Sunshine Coast', 'Sydney', 'Townsville', 'Wagga Wagga', 
    'Proserpine', 'Newcastle', 'Ballina', 'Karratha', 'Hamilton Island', 'Hervey Bay', 
    'Port Hedland', 'Port Lincoln', 'Port Macquarie', 'Newman', 'Ayers Rock', 
    'Gladstone', 'Geraldton', 'Emerald', 'Mount Isa', 'Bundaberg', 'Moranbah', 
    'Armidale', 'Tamworth'];

  const filteredAirlines = airlines.filter(a => 
    a.toLowerCase().includes(airline.toLowerCase())
  );

  const filteredDeparturePorts = ports.filter(port => 
    port.toLowerCase().includes(departurePort.toLowerCase())
  );

  const filteredArrivalPorts = ports.filter(port => 
    port.toLowerCase().includes(arrivalPort.toLowerCase())
  );

  const handleAirlineInputChange = (e) => {
    setAirline(e.target.value);
    setShowAirlineSuggestions(e.target.value.length > 0);
    setWarnings(prevWarnings => ({ ...prevWarnings, airline: '' }));
  };

  const selectAirline = (airline) => {
    setAirline(airline);
    setShowAirlineSuggestions(false);
  };

  const handleDepartureInputChange = (e) => {
    setDeparturePort(e.target.value);
    setShowDepartureSuggestions(e.target.value.length > 0);
    setWarnings(prevWarnings => ({ ...prevWarnings, departurePort: '' }));
  };

  const handleArrivalInputChange = (e) => {
    setArrivalPort(e.target.value);
    setShowArrivalSuggestions(e.target.value.length > 0);
    setWarnings(prevWarnings => ({ ...prevWarnings, arrivalPort: '' }));
  };

  const selectDeparturePort = (port) => {
    setDeparturePort(port);
    setShowDepartureSuggestions(false);
  };

  const selectArrivalPort = (port) => {
    setArrivalPort(port);
    setShowArrivalSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWarnings({});
    setConfirmationMessage('');

    const newWarnings = {};
    
    // Check if airline is valid
    if (!airline) {
      newWarnings.airline = "Airline is required.";
    } else if (!airlines.includes(airline)) {
      newWarnings.airline = "Airline unsupported, try auto-fill options.";
    }

    // Check if departure port is valid
    if (!departurePort) {
      newWarnings.departurePort = "Departure Port is required.";
    } else if (!ports.includes(departurePort)) {
      newWarnings.departurePort = "Departure Port unsupported, try auto-fill options.";
    }

    // Check if arrival port is valid
    if (!arrivalPort) {
      newWarnings.arrivalPort = "Arrival Port is required.";
    } else if (!ports.includes(arrivalPort)) {
      newWarnings.arrivalPort = "Arrival Port unsupported, try auto-fill options.";
    }

    if (!travelDate) {
      newWarnings.travelDate = "Travel Date is required.";
    } else {
      const selectedDate = new Date(travelDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (selectedDate < currentDate) {
        newWarnings.travelDate = "Travel Date must be in the future.";
      }
    }

    setWarnings(newWarnings);

    if (Object.keys(newWarnings).length === 0) {
      onSubmit({ airline, departurePort, arrivalPort, travelDate });
      setConfirmationMessage("Flight details submitted successfully!");
      setAirline('');
      setDeparturePort('');
      setArrivalPort('');
      setTravelDate('');
      setShowAirlineSuggestions(false);
      setShowDepartureSuggestions(false);
      setShowArrivalSuggestions(false);
    }
  };

  return (
    <div className="flight-form">
      <h2>Flight Insightor</h2>
      {confirmationMessage && <p className="confirmation">{confirmationMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Airline</label>
          <input
            type="text"
            placeholder="Select Airline"
            value={airline}
            onFocus={() => setShowAirlineSuggestions(airline.length > 0)} 
            onBlur={() => setTimeout(() => setShowAirlineSuggestions(false), 100)} 
            onChange={handleAirlineInputChange}
          />
          {showAirlineSuggestions && filteredAirlines.length > 0 && (
            <ul className="suggestions">
              {filteredAirlines.map((airline, index) => (
                <li key={index} onClick={() => selectAirline(airline)}>
                  {airline}
                </li>
              ))}
            </ul>
          )}
          {warnings.airline && <p className="warning">{warnings.airline}</p>}
        </div>

        <div className="form-group">
          <label>Route</label>
          <input
            type="text"
            placeholder="Departure Port"
            value={departurePort}
            onFocus={() => setShowDepartureSuggestions(departurePort.length > 0)} 
            onBlur={() => setTimeout(() => setShowDepartureSuggestions(false), 100)}
            onChange={handleDepartureInputChange}
          />
          {showDepartureSuggestions && filteredDeparturePorts.length > 0 && (
            <ul className="suggestions">
              {filteredDeparturePorts.map((port, index) => (
                <li key={index} onClick={() => selectDeparturePort(port)}>
                  {port}
                </li>
              ))}
            </ul>
          )}

          <input
            type="text"
            placeholder="Arrival Port"
            value={arrivalPort}
            onFocus={() => setShowArrivalSuggestions(arrivalPort.length > 0)} 
            onBlur={() => setTimeout(() => setShowArrivalSuggestions(false), 100)} 
            onChange={handleArrivalInputChange}
          />
          {showArrivalSuggestions && filteredArrivalPorts.length > 0 && (
            <ul className="suggestions">
              {filteredArrivalPorts.map((port, index) => (
                <li key={index} onClick={() => selectArrivalPort(port)}>
                  {port}
                </li>
              ))}
            </ul>
          )}
          {warnings.departurePort && <p className="warning">{warnings.departurePort}</p>}
          {warnings.arrivalPort && <p className="warning">{warnings.arrivalPort}</p>}
        </div>

        <div className="form-group">
          <label>Travel Time</label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => {
              setTravelDate(e.target.value);
              setWarnings(prevWarnings => ({ ...prevWarnings, travelDate: e.target.value ? '' : prevWarnings.travelDate }));
            }}
          />
          {warnings.travelDate && <p className="warning">{warnings.travelDate}</p>}
        </div>

        <button type="submit" className="btn">Predict</button>
      </form>
    </div>
  );
};

export default FlightForm;
