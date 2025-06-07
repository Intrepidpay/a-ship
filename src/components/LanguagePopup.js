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
      // 1. Check browser languages first
      const browserLang = navigator.languages.find(lang => 
        Object.keys(POPUP_TEXTS).includes(lang.split('-')[0])
      )?.split('-')[0];

      // 2. Get IP-based language (fallback)
      let ipLang = null;
      try {
        const response = await fetch('https://ipapi.co/json/');
        const { country } = await response.json();
        ipLang = COUNTRY_TO_LANG[country];
      } catch (error) {
        console.log('IP detection failed, using browser lang');
      }

      // 3. Determine final language (priority to browser lang)
      const userLang = (browserLang && browserLang !== 'en') ? browserLang : 
                      (ipLang && ipLang !== 'en') ? ipLang : null;

      // 4. Show popup after delay if non-English detected
      if (userLang) {
        setTimeout(() => {
          setState({ showPopup: true, lang: userLang });
        }, 25000); // 25 second delay
      }
    };

    detectLanguage();
  }, []);

  const handleResponse = (accept) => {
    if (accept && state.lang) {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = state.lang;
        select.dispatchEvent(new Event('change'));
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
