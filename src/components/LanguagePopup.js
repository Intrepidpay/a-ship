import React, { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null
  });

  useEffect(() => {
    // Check if we should show the popup
    const shouldShowPopup = () => {
      // Don't show if user already dismissed or accepted
      if (localStorage.getItem('langPopupDismissed')) return false;
      
      // Don't show if already translated
      if (document.querySelector('.goog-te-combo')?.value !== 'en') return false;
      
      return true;
    };

    const detectLanguage = async () => {
      // Don't show if we shouldn't
      if (!shouldShowPopup()) return;

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
    // Remember user's choice
    localStorage.setItem('langPopupDismissed', 'true');
    
    if (accept && state.lang) {
      // Directly trigger Google Translate
      const tryTranslation = () => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = state.lang;
          select.dispatchEvent(new Event('change'));
          
          // Hide Google banner after translation
          setTimeout(() => {
            const banner = document.querySelector('.goog-te-banner-frame');
            if (banner) banner.style.display = 'none';
            document.body.style.top = '0';
          }, 1000);
        } else {
          // Keep trying until translator is ready
          setTimeout(tryTranslation, 100);
        }
      };
      tryTranslation();
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
