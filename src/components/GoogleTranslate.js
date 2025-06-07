import React, { useEffect } from 'react'; // Added missing React import

const GoogleTranslate = () => {
  useEffect(() => {
    // 1. Load Google Translate Script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // 2. Initialize with DOM Mutation Observer
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) { // Check if google is defined
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ru,fr,es,de,it,zh-CN,ja',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');

        // 3. DOM Cleaner
        const observer = new MutationObserver(() => {
          const elements = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
          elements.forEach(el => {
            el.style.display = 'none';
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslate;
