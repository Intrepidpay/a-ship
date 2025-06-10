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

    const commonPhrases = [
      'Home', 'About', 'Contact', 'Services', 'Products',
      'Welcome', 'Login', 'Sign Up', 'Search', 'Read More',
      'Submit', 'Loading...', 'Please wait', 'Error', 'Success',
      'Add to cart', 'Checkout', 'Price', 'Quantity', 'Total',
      'Yes', 'No', 'Accept', 'Decline', 'Cookies', 'Privacy Policy',
      'Terms of Service', 'Continue', 'Back', 'Next', 'Previous'
    ];

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
    const API_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Google API error ${response.status}`);
    }

    const data = await response.json();
    
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

// Enhanced node filtering for complete coverage
const shouldTranslateNode = (node) => {
  if (node.parentNode.tagName === 'SCRIPT' || 
      node.parentNode.tagName === 'STYLE' ||
      node.parentNode.tagName === 'TEXTAREA') {
    return NodeFilter.FILTER_REJECT;
  }
  
  if (node.parentElement.closest('.no-translate')) {
    return NodeFilter.FILTER_REJECT;
  }
  
  if (node.parentElement.closest('code') || node.parentElement.closest('pre')) {
    return NodeFilter.FILTER_REJECT;
  }
  
  return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
};

// Enhanced translation engine for full coverage
export const translatePage = async (targetLang) => {
  // Removed: if (document.documentElement.lang === targetLang) return;
  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;

  const bodyWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    { acceptNode: shouldTranslateNode }
  );
  
  const bodyTextNodes = [];
  while (bodyWalker.nextNode()) {
    bodyTextNodes.push(bodyWalker.currentNode);
  }

  const headWalker = document.createTreeWalker(
    document.head,
    NodeFilter.SHOW_TEXT,
    { acceptNode: shouldTranslateNode }
  );
  
  const headTextNodes = [];
  while (headWalker.nextNode()) {
    headTextNodes.push(headWalker.currentNode);
  }

  const allTextNodes = [...bodyTextNodes, ...headTextNodes];
  const BATCH_SIZE = 25;
  const batches = Math.ceil(allTextNodes.length / BATCH_SIZE);
  
  for (let i = 0; i < batches; i++) {
    const start = i * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const batchNodes = allTextNodes.slice(start, end);

    await Promise.all(batchNodes.map(node => {
      return new Promise(async (resolve) => {
        const originalText = node.textContent;
        if (originalText.trim() && !node.parentElement.closest('.no-translate')) {
          const translation = await translateText(originalText, targetLang);
          if (translation && translation !== originalText) {
            node.textContent = translation;
          }
        }
        resolve();
      });
    }));
  }

  const title = document.querySelector('title');
  if (title && !title.classList.contains('no-translate')) {
    const translatedTitle = await translateText(title.textContent, targetLang);
    if (translatedTitle && translatedTitle !== title.textContent) {
      title.textContent = translatedTitle;
    }
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && !metaDescription.classList.contains('no-translate')) {
    const translatedDescription = await translateText(metaDescription.content, targetLang);
    if (translatedDescription && translatedDescription !== metaDescription.content) {
      metaDescription.content = translatedDescription;
    }
  }

  const inputElements = document.querySelectorAll('input[placeholder]:not(.no-translate)');
  for (const input of inputElements) {
    const translatedPlaceholder = await translateText(input.placeholder, targetLang);
    if (translatedPlaceholder && translatedPlaceholder !== input.placeholder) {
      input.placeholder = translatedPlaceholder;
    }
  }

  const imgElements = document.querySelectorAll('img[alt]:not(.no-translate)');
  for (const img of imgElements) {
    const translatedAlt = await translateText(img.alt, targetLang);
    if (translatedAlt && translatedAlt !== img.alt) {
      img.alt = translatedAlt;
    }
  }

  const ariaElements = document.querySelectorAll('[aria-label]:not(.no-translate)');
  for (const element of ariaElements) {
    const translatedAriaLabel = await translateText(element.getAttribute('aria-label'), targetLang);
    if (translatedAriaLabel && translatedAriaLabel !== element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', translatedAriaLabel);
    }
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
