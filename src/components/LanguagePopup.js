import { useState, useEffect, useRef } from 'react';
import { COUNTRY_TO_LANG, POPUP_TEXTS } from './constants';

const LanguagePopup = () => {
  const [state, setState] = useState({
    showPopup: false,
    lang: null,
    isLoading: true
  });
  const translateInterval = useRef(null);

  useEffect(() => {
    const checkUserLanguage = async () => {
      // Skip if already shown or testing locally
      if (localStorage.getItem('languagePopupShown') || process.env.NODE_ENV === 'development') {
        return setState(prev => ({ ...prev, isLoading: false }));
      }

      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const { country } = await response.json();
        const userLang = COUNTRY_TO_LANG[country];

        if (userLang && userLang !== "en") {
          setState({ showPopup: true, lang: userLang, isLoading: false });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Language detection failed - falling back to manual trigger:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkUserLanguage();

    return () => {
      // Cleanup interval on unmount
      if (translateInterval.current) clearInterval(translateInterval.current);
    };
  }, []);

  const handleClose = () => {
    setState(prev => ({ ...prev, showPopup: false }));
    localStorage.setItem('languagePopupShown', 'true');
  };

  const handleAccept = () => {
    translateInterval.current = setInterval(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select && state.lang) {
        select.value = state.lang;
        
        // Create and dispatch both change and input events for maximum compatibility
        const events = ['change', 'input'];
        events.forEach(eventType => {
          select.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
        
        clearInterval(translateInterval.current);
        translateInterval.current = null;
      }
    }, 200); // Check every 200ms

    // Fallback timeout
    setTimeout(() => {
      if (translateInterval.current) {
        clearInterval(translateInterval.current);
        console.warn("Google Translate dropdown not found after 5 seconds");
      }
    }, 5000);

    handleClose();
  };

  /* Testing Mode - Uncomment to force popup */
  // if (process.env.NODE_ENV === 'development') {
  //   return (
  //     <div className="language-popup-overlay" style={{ display: 'flex' }}>
  //       <div className="language-popup-container">
  //         <h3>DEV MODE: Language Suggestion</h3>
  //         <p>Current language: {state.lang || 'en'}</p>
  //         <div className="language-popup-buttons">
  //           <button className="btn-accept" onClick={handleAccept}>
  //             Simulate Accept ({state.lang || 'es'})
  //           </button>
  //           <button className="btn-decline" onClick={handleClose}>
  //             No
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (state.isLoading || !state.showPopup || !state.lang) return null;

  return (
    <div className="language-popup-overlay" style={{ display: 'flex' }}>
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
