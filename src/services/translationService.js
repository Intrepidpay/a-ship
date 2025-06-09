// Translation cache implementation built into the service
class TranslationCache {
  constructor() {
    this.cache = new Map();
    this.restore();
  }

  getKey(text, targetLang) {
    return `${targetLang}:${text}`;
  }

  get(text, targetLang) {
    const key = this.getKey(text, targetLang);
    return this.cache.get(key);
  }

  set(text, targetLang, translation) {
    const key = this.getKey(text, targetLang);
    this.cache.set(key, translation);
    this.persist();
  }

  persist() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      localStorage.setItem('translationCache', JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Cache persistence error:', error);
    }
  }

  restore() {
    try {
      const cacheData = localStorage.getItem('translationCache');
      if (cacheData) {
        const cacheArray = JSON.parse(cacheData);
        this.cache = new Map(cacheArray);
      }
    } catch (error) {
      console.error('Cache restoration error:', error);
    }
  }
}

const translationCache = new TranslationCache();

const API_ENDPOINT = 'https://libretranslate.com/translate';

export const translateText = async (text, targetLang) => {
  if (!text.trim()) return text;

  // Check cache first
  const cached = translationCache.get(text, targetLang);
  if (cached) return cached;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LibreTranslate API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const translation = data.translatedText;

    // Cache the result
    translationCache.set(text, targetLang, translation);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Translate all text content on the page
export const translatePage = async (targetLang) => {
  // Store selected language
  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;

  // Get all elements with text content
  const elements = Array.from(document.querySelectorAll('body *'))
    .filter(el =>
      el.childNodes.length === 1 &&
      el.childNodes[0].nodeType === Node.TEXT_NODE &&
      !el.classList.contains('no-translate') &&
      el.textContent.trim() !== ''
    );

  // Batch translations for performance
  const translationPromises = elements.map(async element => {
    const text = element.textContent.trim();
    try {
      const translation = await translateText(text, targetLang);
      element.textContent = translation;
    } catch (error) {
      console.error('Element translation error:', error);
    }
  });

  await Promise.all(translationPromises);
};

// Apply saved language on page load
export const applySavedLanguage = async () => {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && savedLang !== 'en') {
    try {
      await translatePage(savedLang);
    } catch (error) {
      console.error('Error applying saved language:', error);
    }
    return savedLang;
  }
  return 'en';
};
