import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FlightForm from './components/FlightForm';
import Results from './components/Results';

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
    <Router>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/flight-form" element={<FlightForm />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
