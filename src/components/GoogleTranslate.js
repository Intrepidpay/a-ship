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
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false // We control visibility manually
            },
            "google_translate_element"
          );
          
          // Set up mutation observer to handle dynamic elements
          const observer = new MutationObserver(() => {
            document.querySelectorAll('.goog-te-banner-frame, .goog-te-menu-frame')
              .forEach(el => el.style.display = 'none');
          });
          observer.observe(document.body, { childList: true, subtree: true });
        } catch (error) {
          console.error("Google Translate initialization failed:", error);
        }
      };
      loadGoogleTranslateScript();
    };

    const loadGoogleTranslateScript = () => {
      if (!window.google?.translate) {
        const script = document.createElement("script");
        script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
        script.async = true;
        document.body.appendChild(script);
      }
    };

    initializeTranslate();
    return () => {
      document.querySelectorAll('script[src*="translate.google.com"]').forEach(s => s.remove());
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};
export default GoogleTranslate;
