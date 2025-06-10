import React, { useState, useEffect } from 'react';
import { 
  POPUP_TEXTS, 
  SELECT_BUTTON_TEXTS, 
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  TRANSLATING_MESSAGE
} from './constants';
import { 
  translatePage // Only import translatePage
} from '../services/translationService';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    userLang: 'en',
    stage: 'initial',
    isTranslating: false
  });

  useEffect(() => {
    const getLangByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json');
        const data = await response.json();
        const ipLang = data.languages?.split(',')[0]?.slice(0, 2);
        return SUPPORTED_LANGUAGES.includes(ipLang) ? ipLang : 'en';
      } catch (err) {
        console.error('IP language detection failed:', err);
        return 'en';
      }
    };

    const initialize = async () => {
      const savedLang = localStorage.getItem('selectedLanguage');
      const hasShownPopup = localStorage.getItem('hasShownPopup') === 'true';

      let browserLang = navigator.language?.slice(0, 2) || 'en';
      if (!SUPPORTED_LANGUAGES.includes(browserLang)) {
        browserLang = await getLangByIP();
      }

      if (!hasShownPopup) {
        setTimeout(() => {
          setState({ 
            showPopup: true, 
            userLang: savedLang || browserLang,
            stage: 'initial',
            isTranslating: false
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
    setState(prev => ({ 
      ...prev, 
      isTranslating: true,
      userLang: langCode
    }));
    
    localStorage.setItem('hasShownPopup', 'true');
    localStorage.setItem('selectedLanguage', langCode);
    
    // Hide popup but keep translating overlay visible
    setState(prev => ({ ...prev, showPopup: false }));
    
    // Perform full page translation
    await translatePage(langCode);
    
    // Hide overlay after translation completes
    setState(prev => ({ ...prev, isTranslating: false }));
  };

  if (state.isTranslating) {
    return (
      <div className="global-translating-overlay">
        <div className="translating-message">
          {TRANSLATING_MESSAGE[state.userLang] || TRANSLATING_MESSAGE.en}
        </div>
      </div>
    );
  }

  if (!state.showPopup) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        {state.stage === 'initial' ? (
          <>
            <h3>{POPUP_TEXTS[state.userLang] || POPUP_TEXTS.en}</h3>
            <div className="language-popup-buttons">
              <button 
                className="select-button"
                onClick={handleOpenLanguageSelection}
                aria-label={SELECT_BUTTON_TEXTS[state.userLang] || SELECT_BUTTON_TEXTS.en}
              >
                {SELECT_BUTTON_TEXTS[state.userLang] || SELECT_BUTTON_TEXTS.en}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>{POPUP_TEXTS[state.userLang] || POPUP_TEXTS.en}</h3>
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
