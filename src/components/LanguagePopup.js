import React, { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null
  });

  useEffect(() => {
    const detectLanguage = async () => {
      // Check if user already dismissed popup
      if (localStorage.getItem('langPopupDismissed')) return; // Added line 1

      // Your existing detection logic...
      const browserLang = navigator.languages.find(lang => 
        Object.keys(POPUP_TEXTS).includes(lang.split('-')[0])
      )?.split('-')[0];

      let ipLang = null;
      try {
        const response = await fetch('https://ipapi.co/json/');
        const { country } = await response.json();
        ipLang = COUNTRY_TO_LANG[country];
      } catch (error) {
        console.log('IP detection failed, using browser lang');
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
    // Remember user dismissed popup
    localStorage.setItem('langPopupDismissed', 'true'); // Added line 2
    
    if (accept && state.lang) {
      // Directly trigger Google Translate
      const googleTranslateElement = document.querySelector('.goog-te-combo');
      if (googleTranslateElement) {
        googleTranslateElement.value = state.lang;
        googleTranslateElement.dispatchEvent(new Event('change'));
      } else {
        // Fallback: Redirect to Google Translate version
        window.location.href = `https://translate.google.com/translate?sl=auto&tl=${state.lang}&u=${encodeURIComponent(window.location.href)}`;
      }
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
