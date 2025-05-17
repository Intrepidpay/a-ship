import './Tracking.css';

const TrackingMap = ({ progress, locations = [] }) => {
  const activeIndex = Math.min(
    Math.floor((progress / 100) * (locations.length - 1)),
    locations.length - 1
  );

  return (
    <div className="tracking-map">
      <div className="map-container">
        <div className="route-path">
          {locations.map((location, index) => (
            <div 
              key={index}
              className={`route-point ${index <= activeIndex ? 'active' : ''}`}
              style={{ left: `${(index / (locations.length - 1)) * 100}%` }}
            >
              {index === activeIndex && (
                <div className="package-marker">
                  <div className="pulse-effect"></div>
                </div>
              )}
              <div className="location-label">
                {location.city}
                <span className="location-date">{location.date}</span>
              </div>
            </div>
          ))}
          <div className="route-line"></div>
        </div>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TrackingMap;