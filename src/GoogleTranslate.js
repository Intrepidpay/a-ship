import { useEffect } from "react";
import { GOOGLE_TRANSLATE_CONFIG } from "./constants";

const GoogleTranslate = () => {
  useEffect(() => {
    const initializeTranslate = () => {
      window.googleTranslateElementInit = () => {
        try {
          new window.google.translate.TranslateElement(
            {
              ...GOOGLE_TRANSLATE_CONFIG,
              layout: window.google.translate.TranslateElement.InlineLayout[GOOGLE_TRANSLATE_CONFIG.layout]
            },
            "google_translate_element"
          );
        } catch (error) {
          console.error("Google Translate initialization failed:", error);
        }
      };

      loadGoogleTranslateScript();
    };

    const loadGoogleTranslateScript = () => {
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement("script");
        script.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
        script.async = true;
        script.onerror = () => console.error("Failed to load Google Translate script");
        document.body.appendChild(script);
      }
    };

    initializeTranslate();

    return () => {
      // Cleanup function
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" className="google-translate-element" />;
};

export default GoogleTranslate;