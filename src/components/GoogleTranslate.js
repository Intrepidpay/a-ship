useEffect(() => {
  // 1. Load Google Translate Script
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);

  // 2. Initialize with DOM Mutation Observer
  window.googleTranslateElementInit = () => {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,ru,fr,es,de,it,zh-CN,ja', // Add more as needed
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');

    // 3. Nuclear DOM Cleaner - Runs every 100ms to nuke Google's elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.goog-te-banner-frame, .skiptranslate')
        .forEach(el => el.style.display = 'none');
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  return () => {
    document.body.removeChild(script);
    delete window.googleTranslateElementInit;
  };
}, []);
