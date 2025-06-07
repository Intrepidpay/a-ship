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
      };

      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Only load if translation cookie doesn't exist
    if (!document.cookie.includes('googtrans=')) {
      loadGoogleTranslate();
    }

    // Hide Google Translate banner
    const hideBanner = () => {
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) {
        banner.style.display = 'none';
        document.body.style.top = '0';
      }
    };

    // Initial hide attempt
    hideBanner();
    
    // Set interval to keep hiding it
    const bannerInterval = setInterval(hideBanner, 1000);
    
    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
      clearInterval(bannerInterval);
    };
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslate;
