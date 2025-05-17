import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TrackingForm from '../components/Tracking/TrackingForm';
import TrackingResult from '../components/Tracking/TrackingResult';
import './Home.css';

const Home = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const resultRef = useRef(null);

  const handleTrack = (trackingResult) => {
    setTrackingInfo(trackingResult);
  };

  const handleCloseResults = () => {
    setTrackingInfo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Ajet Shipping & Logistics Solutions</h1>
          <p>Track shipments worldwide</p>
          <TrackingForm onTrack={handleTrack} />
        </div>
      </section>

      {trackingInfo && (
        <TrackingResult 
          trackingInfo={trackingInfo} 
          onClose={handleCloseResults}
          ref={resultRef}
        />
      )}

<section className="services-section">
      <div className="container">
        <h2>Our Services</h2>
        <div className="services-grid">
          {/* Express Shipping */}
          <Link to="/services#express" className="service-card">
            <div className="service-icon">
              <div className="placeholder-icon express">
                <img 
                  src={require('../assets/services/express-shipping.png')} 
                  alt="Express shipping icon"
                  className="service-image"
                />
              </div>
            </div>
            <h3>Express Shipping</h3>
            <p>Guaranteed three days delivery for urgent shipments worldwide</p>
            <div className="service-cta">Learn More →</div>
          </Link>

          {/* Refrigerated Logistics */}
          <Link to="/services#refrigerated" className="service-card">
            <div className="service-icon">
              <div className="placeholder-icon refrigerated">
                <img 
                  src={require('../assets/services/express-truck.png')} 
                  alt="Refrigerated truck icon"
                  className="service-truck"
                />
              </div>
            </div>
            <h3>Refrigerated Logistics</h3>
            <p>Temperature-controlled transport for sensitive goods</p>
            <div className="service-cta">Learn More →</div>
          </Link>

          {/* Customs Clearance */}
          <Link to="/services#customs" className="service-card">
            <div className="service-icon">
              <div className="placeholder-icon customs">
                <img 
                  src={require('../assets/services/express-cop.png')} 
                  alt="Customs protection icon"
                  className="service-cop"
                />
              </div>
            </div>
            <h3>Customs Clearance</h3>
            <p>Expert handling of all international customs documentation</p>
            <div className="service-cta">Learn More →</div>
          </Link>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Home;
