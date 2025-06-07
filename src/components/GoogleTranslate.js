import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ru,fr,es,de,it,zh-CN,ja',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
      
      // Make the translate API accessible globally
      window.googleTranslateApi = {
        changeLanguage: (lang) => {
          const select = document.querySelector('.goog-te-combo');
          if (select) {
            select.value = lang;
            select.dispatchEvent(new Event('change'));
          }
        },
        isLoaded: true
      };
    };

    const loadGoogleTranslate = () => {
      // Check if script is already loaded
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Load immediately
    loadGoogleTranslate();

    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
      delete window.googleTranslateApi;
    };
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslate;
