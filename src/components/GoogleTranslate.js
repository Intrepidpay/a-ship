import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Load Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ru,fr,es,de,it,zh-CN,ja',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Translation handler
    const handleTranslation = (e) => {
      const lang = e.detail;
      
      const translate = () => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = lang;
          select.dispatchEvent(new Event('change'));
          
          // Hide banner
          const banner = document.querySelector('.goog-te-banner-frame');
          if (banner) banner.style.display = 'none';
        } else {
          setTimeout(translate, 100);
        }
      };
      
      translate();
    };

    // Listen for translation event
    window.addEventListener('translatePage', handleTranslation);

    return () => {
      // Cleanup
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
      window.removeEventListener('translatePage', handleTranslation);
    };
  }, []);

  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslate;
