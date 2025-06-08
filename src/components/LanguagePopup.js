import React, { useState, useEffect, useRef } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null
  });
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Check URL for translation parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('translated')) {
      localStorage.setItem('langPopupDismissed', 'true');
    }

    const detectLanguage = async () => {
      if (localStorage.getItem('langPopupDismissed')) return;

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
        timeoutRef.current = setTimeout(() => {
          setState({ showPopup: true, lang: userLang });
        }, 5000);
      }
    };

    detectLanguage();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleResponse = (accept) => {
    localStorage.setItem('langPopupDismissed', 'true');
    
    if (accept && state.lang) {
      const googleTranslateElement = document.querySelector('.goog-te-combo');
      if (googleTranslateElement) {
        googleTranslateElement.value = state.lang;
        googleTranslateElement.dispatchEvent(new Event('change'));
      } else {
        // Add 'translated' parameter to URL
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('translated', 'true');
        
        window.location.href = `https://translate.google.com/translate?sl=auto&tl=${state.lang}&u=${encodeURIComponent(currentUrl.toString())}`;
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
