import { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';
import './translation.css'; // Ensure this import exists

const LanguagePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [lang, setLang] = useState(null);

  // 1. SIMPLE GEOLOCATION CHECK
  useEffect(() => {
    if (localStorage.getItem('languagePopupShown')) return;

    // TEST HARDCODED COUNTRY - Change to test different languages
    const testCountry = 'FR'; // Try ES, DE, CN etc
    
    const userLang = COUNTRY_TO_LANG[testCountry]; 
    if (userLang && userLang !== 'en') {
      setLang(userLang);
      setShowPopup(true);
    }
  }, []);

  // 2. RELIABLE LANGUAGE SWITCHING
  const handleAccept = () => {
    if (!lang) return;

    // Method 1: Use Google's native function
    if (window.google && window.google.translate) {
      const { TranslateElement } = window.google.translate;
      new TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'es,fr,de',
        autoDisplay: false
      }, 'google_translate_element');
      
      // Force language change
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    }

    // Method 2: Fallback using URL
    window.location.hash = `#googtrans(en|${lang})`;
    
    setShowPopup(false);
    localStorage.setItem('languagePopupShown', 'true');
  };

  if (!showPopup || !lang) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        <h3>Language Suggestion</h3>
        <p>{POPUP_TEXTS[lang]}</p>
        <div className="language-popup-buttons">
          <button 
            className="btn-accept" 
            onClick={handleAccept}
          >
            Yes
          </button>
          <button 
            className="btn-decline" 
            onClick={() => {
              setShowPopup(false);
              localStorage.setItem('languagePopupShown', 'true');
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
