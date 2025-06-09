import { SUPPORTED_LANGUAGES } from '../components/constants';

class TranslationCache {
  constructor() {
    this.cache = new Map();
    this.restore();
    this.preloaded = false;
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
      this.cache = new Map();
    }
  }

  preloadCommonTranslations(targetLang = 'en') {
    if (this.preloaded) return;

    const commonPhrases = [
      'Home', 'About', 'Contact', 'Services', 'Products',
      'Welcome', 'Login', 'Sign Up', 'Search', 'Read More'
    ];

    for (const phrase of commonPhrases) {
      for (const lang of SUPPORTED_LANGUAGES) {
        if (lang === 'en') continue;
        const key = this.getKey(phrase, lang);
        if (!this.cache.has(key)) {
          this.cache.set(key, phrase); // Placeholder
        }
      }
    }

    this.preloaded = true;
  }
}

const translationCache = new TranslationCache();
const LIBRETRANSLATE_API_URL = 'https://libretranslate.de/translate';
const failedTranslations = new Set();

export const translateText = async (text, targetLang) => {
  if (!text.trim()) return text;

  const failKey = `${targetLang}:${text}`;
  if (failedTranslations.has(failKey)) return text;

  const cached = translationCache.get(text, targetLang);
  if (cached && cached !== text) return cached;

  try {
    const response = await fetch(LIBRETRANSLATE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const translation = data.translatedText;

    translationCache.set(text, targetLang, translation);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    failedTranslations.add(failKey);
    return text;
  }
};

export const preloadCommonTranslations = async () => {
  translationCache.preloadCommonTranslations();
};

export const translatePage = async (targetLang) => {
  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;

  const highPriority = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'span', 'a', 'button'];
  const mediumPriority = ['div', 'section', 'article', 'main'];
  const lowPriority = ['footer', 'aside', 'blockquote'];

  await translateBySelectors(highPriority, targetLang);
  await translateBySelectors(mediumPriority, targetLang);
  await translateBySelectors(lowPriority, targetLang);
};

const translateBySelectors = async (selectors, targetLang) => {
  const selectorString = selectors.join(', ');
  const elements = document.querySelectorAll(selectorString);

  for (const element of elements) {
    if (element.classList.contains('no-translate')) continue;

    const text = element.textContent.trim();
    if (!text || text.length < 2 || element.children.length > 0) continue;

    try {
      const translation = await translateText(text, targetLang);
      if (translation && translation !== text) {
        element.textContent = translation;
      }
    } catch (error) {
      console.error('Element translation error:', error);
    }

    await new Promise(res => setTimeout(res, 50)); // avoid rate-limiting
  }
};

export const applySavedLanguage = async (lang) => {
  try {
    await translatePage(lang);
    return lang;
  } catch (error) {
    console.error('Error applying saved language:', error);
    return 'en';
  }
};
