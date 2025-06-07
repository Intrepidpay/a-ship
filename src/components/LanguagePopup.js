import React, { useEffect, useState } from 'react';

const countryToLang = {
  RU: "ru",
  FR: "fr",
  ES: "es",
  DE: "de",
  IT: "it",
  CN: "zh-CN",
  JP: "ja",
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
};

const popupTexts = {
  ru: "Хотите переключить язык на русский?",
  fr: "Voulez-vous changer la langue en français ?",
  es: "¿Desea cambiar el idioma a español?",
  de: "Möchten Sie die Sprache auf Deutsch ändern?",
  it: "Vuoi cambiare la lingua in italiano?",
  "zh-CN": "您想将语言切换为中文吗？",
  ja: "日本語に切り替えますか？",
  en: "Would you like to switch the language to English?",
};

const LanguagePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [lang, setLang] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('languagePopupShown')) {
      console.log('Popup already shown, skipping.');
      return;
    }

    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        console.log("Geolocation data:", data);
        const country = data.country;
        const userLang = countryToLang[country];
        console.log("Detected country:", country, "Mapped language:", userLang);

        if (userLang && userLang !== "en") {
          setLang(userLang);
          setShowPopup(true);
        }
      })
      .catch(err => {
        console.error("Geolocation fetch error:", err);
      });
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem('languagePopupShown', 'true');
  };

  if (!showPopup || !lang) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '90%',
        textAlign: 'center',
      }}>
        <p>{popupTexts[lang]}</p>
        <button onClick={handleClose} style={{ marginRight: '10px' }}>Yes</button>
        <button onClick={handleClose}>No</button>
      </div>
    </div>
  );
};

export default LanguagePopup;
