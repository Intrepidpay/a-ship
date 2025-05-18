import { useEffect, useState } from 'react';
import './Loader.css';

const Loader = () => {
  // eslint-disable-next-line no-unused-vars
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="logo-loader">
          <span>Ajet</span>
          <span>Ship</span>
        </div>
        <div className="progress-bar-container">
          <div className="ship-animation">
            <img 
              src={`${process.env.PUBLIC_URL}/images/ship.png`} 
              alt="" 
              className="ship" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;