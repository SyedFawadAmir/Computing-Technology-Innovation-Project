import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="connect">
        <h3>CONNECT</h3>
        <p>+6173647449595</p>
        <p>FlightNetwork@gmail.com</p>
        <p>Elgin Avenue, Glenferrie Road, 3122, VIC, AU</p>
      </div>
      <div className="newsletter">
        <h3>NEWSLETTER</h3>
        <input type="email" placeholder="Your Email" />
      </div>
    </footer>
  );
}

export default Footer;
