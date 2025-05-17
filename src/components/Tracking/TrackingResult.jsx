import React, { forwardRef, useEffect } from 'react';
import LeafletMap from './LeafletMap';
import './TrackingResult.css';

const TrackingResult = forwardRef(({ trackingInfo, onClose }, ref) => {
  const locations = trackingInfo?.history?.map(event => ({
    location: event.location,
    status: event.status,
    timestamp: event.timestamp,
    city: event.location.split(',')[0],
    date: new Date(event.timestamp).toLocaleDateString(),
    coordinates: Array.isArray(event.coordinates) ? 
      event.coordinates : 
      [event.coordinates?.lat || 0, event.coordinates?.lng || 0]
  })) || [];

  useEffect(() => {
    if (trackingInfo && ref.current) {
      const element = ref.current;
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = 55;
      
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });

      // ONLY ADDED THESE 2 LINES FOR KEYBOARD SCROLL
      element.setAttribute('tabindex', '-1');
      element.focus({ preventScroll: true });
    }
  }, [trackingInfo, ref]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="premium-tracking-result" ref={ref}>
      {/* ALL YOUR EXISTING JSX BELOW - COMPLETELY UNCHANGED */}
      <div className="result-header">
        <div className="header-content">
          <div className="tracking-meta">
            <h3>Shipment #{trackingInfo?.trackingNumber || 'N/A'}</h3>
            <div className="meta-row">
              <span className="meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {trackingInfo?.recipient || 'Recipient not specified'}
              </span>
              <span className="meta-divider">|</span>
              <span className="meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24">
                  <path d="M12 2L4 7v10l8 5 8-5V7L12 2zm0 2.8L18 7l-6 3.2L6 7l6-3.2zM6 17v-7.5l6 3.2 6-3.2V17l-6 3.2L6 17z"/>
                </svg>
                {trackingInfo?.packageType || 'Boxed Parcel'}
              </span>
              <span className="meta-divider">|</span>
              <span className="meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24">
                  <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 4h-1c0-2.8-2.2-5-5-5S7 4.2 7 7H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
                </svg>
                {trackingInfo?.weight || 'N/A'}
              </span>
            </div>
          </div>
          <span className={`status-badge ${(trackingInfo?.status || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}>
            {trackingInfo?.status || 'Unknown'}
          </span>
        </div>
        <button 
          onClick={handleClose}
          className="close-result-button"
          aria-label="Close tracking results"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div className="map-section">
        <LeafletMap 
          locations={locations} 
          progress={trackingInfo?.progress || 0} 
        />
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
            </svg>
          </div>
          <h4>Estimated Delivery</h4>
          <p>
            {trackingInfo?.estimatedDelivery ? 
              new Date(trackingInfo.estimatedDelivery).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              }) : 
              'Calculating...'}
          </p>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <h4>Current Location</h4>
          <p>
            {locations.length > 0 ? 
              locations[locations.length - 1].location.split(',')[0] : 
              'In transit'}
          </p>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 7v5l3 3"/>
            </svg>
          </div>
          <h4>Progress</h4>
          <div className="progress-container">
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${trackingInfo?.progress || 0}%` }}
              ></div>
            </div>
            <span className="progress-text">{trackingInfo?.progress || 0}%</span>
          </div>
        </div>
      </div>

      {trackingInfo?.history?.length > 0 && (
        <div className="timeline-section">
          <h4 className="section-title">Shipment Journey</h4>
          <div className="premium-timeline">
            {trackingInfo.history.map((event, index) => (
              <div key={index} className={`timeline-item ${index === 0 ? 'first' : ''} ${index === trackingInfo.history.length - 1 ? 'last' : ''}`}>
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  {index !== trackingInfo.history.length - 1 && (
                    <div className="marker-line"></div>
                  )}
                </div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    {new Date(event.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="timeline-event">
                    <span className="event-location">{event.location}</span>
                    <span className={`event-status ${event.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {event.status}
                    </span>
                  </div>
                  {event.description && (
                    <div className="event-description">{event.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

TrackingResult.displayName = 'TrackingResult';
export default TrackingResult;