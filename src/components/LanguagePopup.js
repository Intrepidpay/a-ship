import { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null,
    isLoading: true
  });

  useEffect(() => {
    const checkUserLanguage = async () => {
      if (localStorage.getItem('languagePopupShown')) {
        return setState(prev => ({ ...prev, isLoading: false }));
      }

      try {
        const response = await fetch("https://ipapi.co/json/");
        const { country } = await response.json();
        const userLang = COUNTRY_TO_LANG[country];

        if (userLang && userLang !== "en") {
          setState({ showPopup: true, lang: userLang, isLoading: false });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Language detection failed:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkUserLanguage();
  }, []);

  const handleClose = () => {
    setState(prev => ({ ...prev, showPopup: false }));
    localStorage.setItem('languagePopupShown', 'true');
  };

  const handleAccept = () => {
    const changeLanguage = () => {
      const select = document.querySelector('.goog-te-combo');
      if (select && state.lang) {
        select.value = state.lang;
        select.dispatchEvent(new Event('change'));
        handleClose();
      } else {
        // If select not found, try again after a delay
        setTimeout(changeLanguage, 300);
      }
    };
    
    changeLanguage();
  };

  if (state.isLoading || !state.showPopup || !state.lang) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        <h3>Language Suggestion</h3>
        <p>{POPUP_TEXTS[state.lang]}</p>
        <div className="language-popup-buttons">
          <button className="btn-accept" onClick={handleAccept}>
            Yes
          </button>
          <button className="btn-decline" onClick={handleClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
