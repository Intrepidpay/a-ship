// GoogleTranslate.js
import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "fr,es,de,it,zh-CN,ja,ru", // your supported languages
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} />;
};

export default GoogleTranslate;
