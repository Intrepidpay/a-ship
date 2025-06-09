import React, { useState, useEffect } from 'react';
import { 
  POPUP_TEXTS, 
  SELECT_BUTTON_TEXTS, 
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES
} from './constants';
import { applySavedLanguage, translatePage } from '../services/translationService';
import './translation.css';

// Helper: get browser lang or fallback to 'en'
const getBrowserLanguage = () => {
  const navLang = (navigator.language || 'en').split('-')[0];
  return SUPPORTED_LANGUAGES.includes(navLang) ? navLang : 'en';
};

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    userLang: 'en',
    stage: 'initial'
  });

  useEffect(() => {
    const initialize = async () => {
      const hasShownPopup = localStorage.getItem('hasShownPopup') === 'true';
      const savedLang = await applySavedLanguage();

      // Determine initial language: saved > browser > default
      const userLang = savedLang || getBrowserLanguage();

      if (!hasShownPopup) {
        setTimeout(() => {
          setState({ 
            showPopup: true, 
            userLang,
            stage: 'initial'
          });
        }, 4000);
      } else {
        // If popup shown before, make sure page is translated
        if (savedLang && savedLang !== 'en') {
          await translatePage(savedLang);
        }
      }
    };

    initialize();
  }, []);

  const handleOpenLanguageSelection = () => {
    setState(prev => ({ ...prev, stage: 'language-selection' }));
  };

  const handleLanguageSelect = async (langCode) => {
    console.log('User selected language:', langCode);

    setState(prev => ({ ...prev, showPopup: false }));
    
    localStorage.setItem('hasShownPopup', 'true');
    localStorage.setItem('selectedLanguage', langCode);
    
    document.body.classList.add('translating');
    await translatePage(langCode);
    document.body.classList.remove('translating');
    
    // Update popup language for any future openings (if any)
    setState(prev => ({ ...prev, userLang: langCode }));
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
                aria-label={SELECT_BUTTON_TEXTS[state.userLang]}
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
                  aria-label={LANGUAGE_NAMES[langCode]}
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
