import { useState, useEffect } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';

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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const { country } = await response.json();
        console.log("Detected country:", country); // Debug log
        
        const userLang = COUNTRY_TO_LANG[country];
        console.log("Mapped language:", userLang); // Debug log

        if (userLang && userLang !== "en") {
          console.log("Showing popup for language:", userLang); // Debug log
          setState({ showPopup: true, lang: userLang, isLoading: false });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Language detection failed:", error);
        // TEST: Force show popup if API fails (remove in production)
        setState({ showPopup: true, lang: "es", isLoading: false });
      }
    };

    checkUserLanguage();
  }, []);

  const handleClose = () => {
    setState(prev => ({ ...prev, showPopup: false }));
    localStorage.setItem('languagePopupShown', 'true');
  };

  const handleAccept = () => {
    try {
      // Wait for Google Translate to load
      const checkTranslate = setInterval(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select && state.lang) {
          select.value = state.lang;
          select.dispatchEvent(new Event('change'));
          clearInterval(checkTranslate);
        }
      }, 100);
    } catch (error) {
      console.error("Language change failed:", error);
    }
    handleClose();
  };

  // TEMPORARY: Force show for testing (remove in production)
  // if (true) return (
  //   <div className="language-popup-overlay" style={{ display: 'flex' }}>
  //     <div className="language-popup-container">
  //       <h3>TEST MODE - Language Suggestion</h3>
  //       <p>Popup forced to show for debugging</p>
  //       <div className="language-popup-buttons">
  //         <button className="btn-accept" onClick={handleAccept}>
  //           Yes
  //         </button>
  //         <button className="btn-decline" onClick={handleClose}>
  //           No
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  if (state.isLoading || !state.showPopup || !state.lang) return null;

  return (
    <div className="language-popup-overlay" style={{ display: state.showPopup ? 'flex' : 'none' }}>
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
