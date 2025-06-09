import { SUPPORTED_LANGUAGES } from '../components/constants';

// Changed to multilingual model
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/m2m100_418M';
const HUGGINGFACE_API_KEY = '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';

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
    // Simplified preloading
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
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          src_lang: "en",
          tgt_lang: targetLang
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const translation = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : text;

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
    
    // Add slight delay between batches
    await new Promise(res => setTimeout(res, 50));
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
