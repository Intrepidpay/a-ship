import React, { useState, useEffect } from 'react';
import { POPUP_TEXTS } from './constants'; // Removed unused COUNTRY_TO_LANG
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null,
    isLoading: true
  });

  useEffect(() => {
    const checkShouldShowPopup = () => {
      // Skip if already shown or English user
      if (localStorage.getItem('languagePopupShown') || navigator.language.startsWith('en')) {
        return setState(prev => ({ ...prev, isLoading: false }));
      }

      // Detect language from browser preferences
      const detectedLang = navigator.languages.find(lang => 
        Object.keys(POPUP_TEXTS).includes(lang.split('-')[0])
      )?.split('-')[0];

      if (detectedLang && detectedLang !== 'en') {
        setState({ showPopup: true, lang: detectedLang, isLoading: false });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkShouldShowPopup();
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
        <h3>{POPUP_TEXTS[state.lang]}</h3>
        <div className="language-popup-buttons">
          <button onClick={() => handleResponse(true)}>
            {state.lang === 'ru' ? 'Да' : 
             state.lang === 'zh-CN' ? '是' : 'Yes'}
          </button>
          <button onClick={() => handleResponse(false)}>
            {state.lang === 'ru' ? 'Нет' : 
             state.lang === 'zh-CN' ? '否' : 'No'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
