// src/App.js
import React, { useState } from 'react';
import FlightForm from './components/FlightForm';
import HeroSection from './components/HeroSection';
import Navbar from './components/NavBar';

const PAGES = {
  HOME: 'home',
  ABOUT: 'about'
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.HOME:
        return <FlightForm />;
      case PAGES.ABOUT:
        return <HeroSection setCurrentPage={setCurrentPage} />; // Pass setCurrentPage here
      default:
        return <FlightForm />;
    }
  };

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
