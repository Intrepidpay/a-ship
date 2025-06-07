import React, { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null
  });

  useEffect(() => {
    // Check if translation is already active
    const isAlreadyTranslated = () => {
      return document.cookie.includes('googtrans=') || 
             document.querySelector('.goog-te-combo')?.value !== 'en';
    };

    const detectLanguage = async () => {
      // Don't show if already translated
      if (isAlreadyTranslated()) return;

      const browserLang = navigator.languages.find(lang => 
        Object.keys(POPUP_TEXTS).includes(lang.split('-')[0])
      )?.split('-')[0];

      let ipLang = null;
      try {
        const response = await fetch('https://ipapi.co/json/');
        const { country } = await response.json();
        ipLang = COUNTRY_TO_LANG[country];
      } catch (error) {
        console.log('IP detection failed');
      }

      const userLang = (browserLang && browserLang !== 'en') ? browserLang : 
                      (ipLang && ipLang !== 'en') ? ipLang : null;

      if (userLang) {
        setTimeout(() => {
          setState({ showPopup: true, lang: userLang });
        }, 5000);
      }
    };

    detectLanguage();
  }, []);

  const handleResponse = (accept) => {
    if (accept && state.lang) {
      // Set translation cookie and refresh
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `googtrans=/en/${state.lang}; expires=${expiryDate.toUTCString()}; path=/`;
      
      // Remove Google Translate banner
      const removeBanner = () => {
        const banners = document.querySelectorAll('.goog-te-banner-frame');
        banners.forEach(banner => banner.style.display = 'none');
        document.body.style.top = '0';
      };

      // Refresh and check for banner
      window.location.reload();
      setTimeout(removeBanner, 1000);
    }
    setState(prev => ({ ...prev, showPopup: false }));
  };

  if (!state.showPopup) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        <h3>{POPUP_TEXTS[state.lang]}</h3>
        <div className="language-popup-buttons">
          <button onClick={() => handleResponse(true)}>
            {state.lang === 'ru' ? 'Да' : 'Yes'}
          </button>
          <button onClick={() => handleResponse(false)}>
            {state.lang === 'ru' ? 'Нет' : 'No'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
