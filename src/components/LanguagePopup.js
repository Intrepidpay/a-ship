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
    const detectLanguage = async () => {
      if (localStorage.getItem('languagePopupShown')) return;
      
      try {
        // 1. Check browser languages (priority)
        const browserLang = navigator.languages.find(lang => 
          Object.keys(POPUP_TEXTS).includes(lang.split('-')[0])
        );
        
        // 2. Fallback to IP detection
        const ipLang = await fetch("https://ipapi.co/json/")
          .then(res => res.json())
          .then(({ country }) => COUNTRY_TO_LANG[country]);
          
        // 3. Determine final language
        const userLang = browserLang?.split('-')[0] || ipLang;
        
        if (userLang && userLang !== "en") {
          setState({ showPopup: true, lang: userLang, isLoading: false });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Detection error:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    detectLanguage();
  }, []);

  const handleResponse = (accept) => {
    if (accept) {
      document.querySelectorAll('.goog-te-combo, .goog-te-menu-frame')
        .forEach(el => el.style.display = 'block');
      setTimeout(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = state.lang;
          select.dispatchEvent(new Event('change'));
        }
      }, 100);
    }
    setState(prev => ({ ...prev, showPopup: false }));
    localStorage.setItem('languagePopupShown', 'true');
  };

  if (state.isLoading || !state.showPopup) return null;

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-container">
        <h3>{POPUP_TEXTS.en.split('?')[0]} {POPUP_TEXTS[state.lang]?.split('?')[1] || '?'}</h3>
        <p>{POPUP_TEXTS[state.lang]}</p>
        <div className="language-popup-buttons">
          <button className="btn-accept" onClick={() => handleResponse(true)}>
            {state.lang === 'ru' ? 'Да' : state.lang === 'zh-CN' ? '是' : 'Yes'}
          </button>
          <button className="btn-decline" onClick={() => handleResponse(false)}>
            {state.lang === 'ru' ? 'Нет' : state.lang === 'zh-CN' ? '否' : 'No'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default LanguagePopup;
