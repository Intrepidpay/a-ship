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
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE // Fixed layout reference
            },
            "google_translate_element" // Fixed ID to match standard
          );
          
          // Add a small delay to ensure elements are created
          setTimeout(() => {
            const banner = document.querySelector('.goog-te-banner-frame');
            if (banner) {
              banner.style.display = 'none';
              banner.style.visibility = 'hidden';
            }
          }, 500);
        } catch (error) {
          console.error("Google Translate initialization failed:", error);
        }
      };

      loadGoogleTranslateScript();
    };

    const loadGoogleTranslateScript = () => {
      if (!window.google || !window.google.translate) {
        const script = document.createElement("script");
        script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
        script.async = true;
        script.onerror = () => console.error("Failed to load Google Translate script");
        document.body.appendChild(script);
      } else if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
    };

    initializeTranslate();

    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslate;
