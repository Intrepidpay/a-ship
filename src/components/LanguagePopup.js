import React, { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css';

const LanguagePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [detectedLang, setDetectedLang] = useState(null);

  useEffect(() => {
    const detectLanguage = async () => {
      // 1. Check browser language
      const browserLang = navigator.language?.split('-')[0] || 
                         navigator.languages?.[0]?.split('-')[0];
      
      // 2. Fallback to IP detection
      let ipLang = null;
      try {
        const response = await fetch('https://ipapi.co/json/');
        const { country } = await response.json();
        ipLang = COUNTRY_TO_LANG[country];
      } catch (error) {
        console.log('IP detection failed');
      }

      // 3. Determine language to use
      const userLang = (POPUP_TEXTS[browserLang] && browserLang !== 'en') ? browserLang : 
                      (ipLang && ipLang !== 'en') ? ipLang : null;

      if (userLang) {
        setTimeout(() => {
          setDetectedLang(userLang);
          setShowPopup(true);
        }, 5000);
      }
    };

    detectLanguage();
  }, []);

  const handleResponse = (accept) => {
    if (accept && detectedLang) {
      // Use Google's API directly if available
      if (window.google && window.google.translate) {
        const translateInstance = new window.google.translate.TranslateElement();
        translateInstance.selectLanguage(detectedLang);
      } else {
        // Fallback to DOM method
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = detectedLang;
          select.dispatchEvent(new Event('change'));
        }
      }
    }
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        <h3>{POPUP_TEXTS[detectedLang]}</h3>
        <div className="language-popup-buttons">
          <button onClick={() => handleResponse(true)}>
            {detectedLang === 'ru' ? 'Да' : 'Yes'}
          </button>
          <button onClick={() => handleResponse(false)}>
            {detectedLang === 'ru' ? 'Нет' : 'No'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
