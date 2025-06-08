import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    const loadGoogleTranslate = () => {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ru,fr,es,de,it,zh-CN,ja',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
        
        // Start banner removal process
        let attempts = 0;
        const removeBanners = () => {
          const banners = [
            '.goog-te-banner-frame',
            '.goog-te-spinner-pos',
            '.goog-te-ftab',
            '.goog-te-gadget-simple',
            '.skiptranslate'
          ];
          
          banners.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              el.style.height = '0';
            }
          });
          
          attempts++;
          if (attempts < 10) {
            setTimeout(removeBanners, 500);
          }
        };
        
        removeBanners();
      };

      if (!document.querySelector('script[src*="translate.google.com"]')) {
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

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslate;
