import React, { useState, useEffect } from 'react';
import { 
  POPUP_TEXTS, 
  SELECT_BUTTON_TEXTS, 
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES
} from './constants';
import { applySavedLanguage, translatePage } from '../services/translationService';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    userLang: 'en',
    stage: 'initial'
  });

  useEffect(() => {
    const initialize = async () => {
      // Check if we've shown the popup before
      const hasShownPopup = localStorage.getItem('hasShownPopup') === 'true';
      const savedLang = await applySavedLanguage();
      
      // Only show popup if we haven't shown it before
      if (!hasShownPopup) {
        setTimeout(() => {
          setState({ 
            showPopup: true, 
            userLang: savedLang || 'en',
            stage: 'initial'
          });
        }, 3000);
      }
    };

    initialize();
  }, []);

  const handleOpenLanguageSelection = () => {
    setState(prev => ({ ...prev, stage: 'language-selection' }));
  };

  const handleLanguageSelect = async (langCode) => {
    setState(prev => ({ ...prev, showPopup: false }));
    
    // Mark that we've shown the popup
    localStorage.setItem('hasShownPopup', 'true');
    localStorage.setItem('selectedLanguage', langCode);
    
    // Translate immediately
    document.body.classList.add('translating');
    await translatePage(langCode);
    document.body.classList.remove('translating');
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
