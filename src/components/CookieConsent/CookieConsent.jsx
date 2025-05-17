import { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => setVisible(true), 1500); // Shows after 1.5s
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <p>We use cookies to enhance your experience. By continuing, you agree to our use of cookies.</p>
      <div className="cookie-buttons">
        <button onClick={acceptCookies} className="cookie-accept">
          Accept
        </button>
        <a href="/privacy#cookies" className="cookie-learn-more">
          Learn More
        </a>
      </div>
    </div>
  );
};

export default CookieConsent;