import React, { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null,
    isLoading: true
  });

  useEffect(() => {
    const detectLanguage = async () => {
      if (localStorage.getItem('languagePopupShown')) {
        return setState(prev => ({ ...prev, isLoading: false }));
      }

      try {
        // Check browser language first
        const browserLang = navigator.languages.find(lang => 
          Object.keys(POPUP_TEXTS).includes(lang.split('-')[0])
        )?.split('-')[0];

        // Fallback to IP detection
        const { country } = await fetch('https://ipapi.co/json/').then(res => res.json());
        const ipLang = COUNTRY_TO_LANG[country];

        const userLang = browserLang || ipLang;

        if (userLang && userLang !== 'en') {
          setState({ showPopup: true, lang: userLang, isLoading: false });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Language detection failed:', error);
        setState(prev => ({ ...prev, isLoading: false }));
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
    localStorage.setItem('languagePopupShown', 'true');
  };

  if (state.isLoading || !state.showPopup) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        <h3>Language Suggestion</h3>
        <p>{POPUP_TEXTS[state.lang]}</p>
        <div className="language-popup-buttons">
          <button className="btn-accept" onClick={() => handleResponse(true)}>
            {state.lang === 'ru' ? 'Да' : 'Yes'}
          </button>
          <button className="btn-decline" onClick={() => handleResponse(false)}>
            {state.lang === 'ru' ? 'Нет' : 'No'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
