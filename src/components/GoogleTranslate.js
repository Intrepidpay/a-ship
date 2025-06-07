import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    const loadGoogleTranslate = () => {
      // Don't load if user prefers English
      if (navigator.language.startsWith('en')) return;

      window.googleTranslateElementInit = () => {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,ru,fr,es,de,it,zh-CN,ja',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: true // Let Google show it for non-English users
            },
            'google_translate_element'
          );
        } catch (error) {
          console.error('Google Translate init error:', error);
        }
      };

      if (!window.google || !window.google.translate) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadGoogleTranslate();

    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;
