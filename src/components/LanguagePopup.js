import { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null,
    isLoading: true
  });

  useEffect(() => {
    // TEST MODE - FORCE SPANISH (remove in production)
    if (true) {
      setState({ showPopup: true, lang: "es", isLoading: false });
      return;
    }

    // Original geolocation check
    if (localStorage.getItem('languagePopupShown')) return;
    
    fetch("https://ipinfo.io/json?token=YOUR_TOKEN")
      .then(res => res.json())
      .then(data => {
        const userLang = COUNTRY_TO_LANG[data.country];
        if (userLang && userLang !== "en") {
          setState({ showPopup: true, lang: userLang, isLoading: false });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleClose = () => {
    setState(prev => ({ ...prev, showPopup: false }));
    localStorage.setItem('languagePopupShown', 'true');
  };

  if (!state.showPopup || !state.lang) return null;

  return (
    <div className="language-popup-overlay" style={{ display: 'flex' }}>
      <div className="language-popup-container">
        <h3>Language Suggestion</h3>
        <p>{POPUP_TEXTS[state.lang]}</p>
        <div className="language-popup-buttons">
          <button onClick={() => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
              select.value = state.lang;
              select.dispatchEvent(new Event('change'));
            }
            handleClose();
          }}>Yes</button>
          <button onClick={handleClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
