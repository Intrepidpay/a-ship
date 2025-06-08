import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Mutation Observer to hide banners in real-time
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const banners = [
          '.goog-te-banner-frame',
          '.goog-te-spinner-pos',
          '.goog-te-ftab',
          '.goog-te-gadget-simple',
          '.skiptranslate',
          '.goog-tooltip',
          '.goog-te-combo'
        ];
        
        banners.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.height = '0';
            el.style.width = '0';
            el.style.overflow = 'hidden';
          });
        });
      });
    });

    // Start observing the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    const loadGoogleTranslate = () => {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ru,fr,es,de,it,zh-CN,ja',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      };

      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadGoogleTranslate();

    // Cleanup function
    return () => {
      observer.disconnect();
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslate;
