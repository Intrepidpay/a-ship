import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Initialize Zoho with proper window reference
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || { 
      ready: function() {
        window.$zoho.salesiq.floatbutton.visible('hide');
        setTimeout(() => {
          window.$zoho.salesiq.floatbutton.visible('show');
        }, 2000);
      }
    };

    // Load script dynamically
    const script = document.createElement('script');
    script.id = 'zsiqscript';
    script.src = 'https://salesiq.zohopublic.com/widget?wc=siq10c960751548cac5f4528c37081e5b2ed1e99f0086f8b5b2cb905be119d083ee';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <MdEmail className="icon" />
              <a href="mailto:support@swiftship.com">support@swiftship.com</a>
            </li>
            <li>
              <MdLocationOn className="icon" />
              No.3/1, 34149, Bakırköy/İstanbul
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
  <li><Link to="/admin">Login</Link></li>
  <li><Link to="/shipping">Shipping</Link></li>
  <li><Link to="/support">Support</Link></li>
  <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="https://ajet.com/en">Parent Company</a></li>
            <li><Link to="/services#terms">Terms of Service</Link></li>
            <li><Link to="/services#shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/services#privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://x.com/AJET_TR"><FaTwitter /></a>
            <a href="https://www.instagram.com/ajet/"><FaInstagram /></a>
            <a href="https://www.linkedin.com/company/a-jet/"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {currentYear} AJet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;