import { useState, useRef, useEffect } from 'react';
import { trackingService } from '../../services/trackingService';
import './Tracking.css';

const TrackingForm = ({ onTrack }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const originalFontSize = useRef(null);

  // iOS zoom prevention
  useEffect(() => {
    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (!isIOS || !inputRef.current) return;
    
    const input = inputRef.current;
    
    const handleFocus = () => {
      // Save original font size
      if (!originalFontSize.current) {
        originalFontSize.current = window.getComputedStyle(input).fontSize;
      }
      // Set to 16px to prevent iOS zoom
      input.style.fontSize = '16px';
    };
    
    const handleBlur = () => {
      // Restore original font size
      if (originalFontSize.current) {
        input.style.fontSize = originalFontSize.current;
      }
    };
    
    // Add event listeners
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    
    // Cleanup function
    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Existing error timeout logic
  useEffect(() => {
    let timeoutId;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 5000); 
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [error]);

  // Existing submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      inputRef.current.focus();
      return;
    }

    setIsLoading(true);
    try {
      const result = await trackingService.validateTrackingNumber(trackingNumber);
      onTrack(result);
      setTrackingNumber('');
    } catch (err) {
      setError(err.message || 'Failed to track package');
      onTrack(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tracking-form-container">
      <form onSubmit={handleSubmit} className="premium-tracking-form">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className={`premium-inputt ${error ? 'error' : ''}`}
            aria-label="Tracking number"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className={`premium-track-button ${isLoading ? 'loading' : ''}`}
            aria-label="Track package"
          >
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              <>
                <span>Track</span>
                <svg className="track-icon" viewBox="0 0 24 24">
                  <path d="M5,12H19M19,12L12,5M19,12L12,19" />
                </svg>
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="premium-error-messag">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default TrackingForm;
