import { translationCache } from '../utils/cache';

const DEEPL_API_KEY = process.env.REACT_APP_DEEPL_API_KEY;
const API_ENDPOINT = 'https://api-free.deepl.com/v2/translate';

// Translate text using DeepL API
export const translateText = async (text, targetLang) => {
  if (!text.trim()) return text;
  
  // Check cache first
  const cached = translationCache.get(text, targetLang);
  if (cached) return cached;
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase(),
        preserve_formatting: true,
        formality: 'prefer_more',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }
    
    const data = await response.json();
    const translation = data.translations[0].text;
    
    // Cache the result
    translationCache.set(text, targetLang, translation);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on failure
  }
};

// Translate all translatable elements on the page
export const translatePage = async (targetLang) => {
  const elements = document.querySelectorAll('[data-translate="true"]');
  
  // Store translations in localStorage
  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;
  
  const translations = [];
  
  for (const element of elements) {
    const text = element.textContent.trim();
    if (text) {
      translations.push({
        element,
        text,
        promise: translateText(text, targetLang)
      });
    }
  }
  
  // Process translations as they complete
  for (const { element, promise } of translations) {
    element.textContent = await promise;
  }
};

// Apply saved language on page load
export const applySavedLanguage = async () => {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && savedLang !== 'en') {
    await translatePage(savedLang);
  }
  return savedLang || 'en';
};
