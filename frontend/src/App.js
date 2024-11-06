import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FlightForm from './components/FlightForm';
import AboutPage from './components/AboutPage';
import Results from './components/Results'; // Ensure this path is correct
import PricingVisualization from './components/PricingVisualization'; // Ensure this path is correct

function App() {
  return (
    <Router>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/flight-form" element={<FlightForm />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/results" element={<Results />} />
          <Route path="/pricing-visualization" element={<PricingVisualization />} />
          {/* Add other routes as needed */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
