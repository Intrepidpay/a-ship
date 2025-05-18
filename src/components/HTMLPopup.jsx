import React, { useState, useEffect, useRef } from 'react';
import './HTMLPopup.css';

const HTMLPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const iframeRef = useRef(null);

  // Handle scroll locking
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showPopup]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'CLOSE_POPUP') {
        setShowPopup(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <button 
        className="payment-button primary"
        onClick={() => setShowPopup(true)}
      >
      <img 
     src={`${process.env.PUBLIC_URL}/assets/visa.jpg`} 
      alt="Card" 
       />
        
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <iframe
              ref={iframeRef}
              src={`${process.env.PUBLIC_URL}/popup.html`}
              className="popup-iframe"
              title="Payment Popup"
              allow="payment"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HTMLPopup;