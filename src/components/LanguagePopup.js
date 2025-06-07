// LanguagePopup.js
import { useEffect, useState } from "react";

const countryToLang = {
  FR: "fr",
  ES: "es",
  DE: "de",
  IT: "it",
  CN: "zh-CN",
  JP: "ja",
  RU: "ru",
};

const popupTexts = {
  fr: "Voulez-vous changer la langue en français ?",
  es: "¿Desea cambiar el idioma a español?",
  de: "Möchten Sie die Sprache auf Deutsch ändern?",
  it: "Vuoi cambiare la lingua in italiano?",
  "zh-CN": "您想将语言切换为中文吗？",
  ja: "日本語に切り替えますか？",
  ru: "Хотите переключить язык на русский?",
  en: "Would you like to switch the language to your local language?",
};

const LanguagePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [userLang, setUserLang] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("langPopupShown")) return; // one time only

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const lang = countryToLang[data.country];
        if (lang) {
          setUserLang(lang);
          setShowPopup(true);
        }
      })
      .catch(() => {
        // fail silently, no popup
      });
  }, []);

  const handleYes = () => {
    setShowPopup(false);
    localStorage.setItem("langPopupShown", "true");
    // Trigger Google Translate language switch
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = userLang;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 500);
  };

  const handleNo = () => {
    setShowPopup(false);
    localStorage.setItem("langPopupShown", "true");
  };

  if (!showPopup || !userLang) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        zIndex: 1000,
        maxWidth: "300px",
        textAlign: "center",
      }}
    >
      <p>{popupTexts[userLang] || popupTexts.en}</p>
      <button onClick={handleYes} style={{ marginRight: "10px" }}>
        Yes
      </button>
      <button onClick={handleNo}>No</button>
    </div>
  );
};

export default LanguagePopup;
