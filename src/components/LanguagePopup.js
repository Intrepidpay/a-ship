import React, { useState, useEffect } from 'react';
import { 
  COUNTRY_TO_LANG, 
  POPUP_TEXTS, 
  SELECT_BUTTON_TEXTS, 
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES
} from './constants';
import { applySavedLanguage } from '../services/translationService';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    userLang: 'en',
    stage: 'initial' // 'initial' or 'language-selection'
  });

  useEffect(() => {
    const initialize = async () => {
      const savedLang = await applySavedLanguage();
      const showPopup = !savedLang || savedLang === 'en';
      
      // Only show popup if no language is selected
      if (showPopup) {
        const detectLanguage = async () => {
          const browserLang = navigator.languages.find(lang => 
            SUPPORTED_LANGUAGES.includes(lang.split('-')[0])
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
                          (ipLang && ipLang !== 'en') ? ipLang : 'en';

          setTimeout(() => {
            setState(prev => ({ 
              ...prev, 
              showPopup: true, 
              userLang: SUPPORTED_LANGUAGES.includes(userLang) ? userLang : 'en'
            }));
          }, 3000);
        };

        detectLanguage();
      }
    };

    initialize();
  }, []);

  const handleOpenLanguageSelection = () => {
    setState(prev => ({ ...prev, stage: 'language-selection' }));
  };

  const handleLanguageSelect = async (langCode) => {
    setState(prev => ({ ...prev, showPopup: false }));
    localStorage.setItem('selectedLanguage', langCode);
    
    if (langCode !== 'en') {
      // Show loading indicator
      document.body.classList.add('translating');
      
      try {
        await translatePage(langCode);
      } finally {
        document.body.classList.remove('translating');
      }
    }
  };

  if (!state.showPopup) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        {state.stage === 'initial' ? (
          <>
            <h3>{POPUP_TEXTS[state.userLang]}</h3>
            <div className="language-popup-buttons">
              <button 
                className="select-button"
                onClick={handleOpenLanguageSelection}
              >
                {SELECT_BUTTON_TEXTS[state.userLang]}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>{POPUP_TEXTS[state.userLang]}</h3>
            <div className="language-list">
              {SUPPORTED_LANGUAGES.map(langCode => (
                <button
                  key={langCode}
                  className="language-option"
                  onClick={() => handleLanguageSelect(langCode)}
                >
                  {LANGUAGE_NAMES[langCode]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguagePopup;
