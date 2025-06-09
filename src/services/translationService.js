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

  preloadCommonTranslations() {
    if (this.preloaded) return;

    // Preload common UI phrases
    const commonPhrases = [
      'Home', 'About', 'Contact', 'Services', 'Products',
      'Welcome', 'Login', 'Sign Up', 'Search', 'Read More',
      'Submit', 'Loading...', 'Please wait', 'Error', 'Success',
      'Add to cart', 'Checkout', 'Price', 'Quantity', 'Total'
    ];

    // Cache placeholders - actual translations will be fetched when needed
    commonPhrases.forEach(phrase => {
      this.set(phrase, 'fr', phrase);
      this.set(phrase, 'es', phrase);
      this.set(phrase, 'ru', phrase);
      this.set(phrase, 'de', phrase);
      this.set(phrase, 'ja', phrase);
    });

    this.preloaded = true;
  }
}

const translationCache = new TranslationCache();
const failedTranslations = new Set();

export const translateText = async (text, targetLang) => {
  if (!text.trim() || targetLang === 'en') return text;

  const failKey = `${targetLang}:${text}`;
  if (failedTranslations.has(failKey)) return text;

  const cached = translationCache.get(text, targetLang);
  if (cached && cached !== text) return cached;

  try {
    // Google Translate proxy API
    const API_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Google API error ${response.status}`);
    }

    const data = await response.json();
    
    // Parse Google's response format
    let translation = '';
    if (Array.isArray(data) && data[0]) {
      data[0].forEach(segment => {
        if (segment[0]) {
          translation += segment[0];
        }
      });
    }
    
    if (!translation) {
      throw new Error('No translation found in response');
    }

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
  if (document.documentElement.lang === targetLang) return;
  
  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;
  
  // Create a tree walker to process all text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip if parent element has no-translate class
        if (node.parentElement.closest('.no-translate')) {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip empty text nodes
        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    },
    false
  );
  
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  
  // Translate in batches
  const BATCH_SIZE = 5;
  for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
    const batch = textNodes.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(node => {
      return new Promise(async (resolve) => {
        const originalText = node.textContent;
        const translation = await translateText(originalText, targetLang);
        if (translation && translation !== originalText) {
          node.textContent = translation;
        }
        resolve();
      });
    }));
    
    // Add slight delay between batches to avoid rate limiting
    await new Promise(res => setTimeout(res, 100));
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
