// translationService.js
export const applySavedLanguage = async (langCode) => {
  if (!langCode || langCode === 'en') return;
  await applyLanguage(langCode);
};

export const applyLanguage = async (targetLang) => {
  if (!targetLang || targetLang === 'en') return;

  document.documentElement.lang = targetLang;

  injectGoogleTranslate(targetLang);
};

const injectGoogleTranslate = (targetLang) => {
  // Remove any existing Google Translate script
  const existingScript = document.getElementById('google-translate-script');
  if (existingScript) {
    existingScript.remove();
  }

  // Remove any previous translate elements
  const existingTranslateElement = document.getElementById('google_translate_element');
  if (existingTranslateElement) {
    existingTranslateElement.innerHTML = '';
  } else {
    // Create container if it doesn't exist
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none'; // Hide the widget UI
    document.body.appendChild(container);
  }

  // Define the Google Translate callback
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: targetLang,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      'google_translate_element'
    );
  };

  // Inject Google Translate script
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
  document.head.appendChild(script);
};
