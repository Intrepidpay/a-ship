// Direct translation without caching
const translateText = async (text, targetLang) => {
  if (!text.trim() || targetLang === 'en') return text;

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

    return translation || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Enhanced node filtering for complete coverage
const shouldTranslateNode = (node) => {
  // Skip script/style elements and textareas
  if (node.parentNode.tagName === 'SCRIPT' || 
      node.parentNode.tagName === 'STYLE' ||
      node.parentNode.tagName === 'TEXTAREA') {
    return NodeFilter.FILTER_REJECT;
  }

  // Skip translation for elements with no-translate class
  if (node.parentElement.closest('.no-translate')) {
    return NodeFilter.FILTER_REJECT;
  }

  // Skip translation for code blocks
  if (node.parentElement.closest('code') || node.parentElement.closest('pre')) {
    return NodeFilter.FILTER_REJECT;
  }

  // Translate if there is actual text
  return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
};

// Enhanced translation engine for full coverage
export const translatePage = async (targetLang) => {
  if (document.documentElement.lang === targetLang) return;

  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;

  // Create optimized tree walker for the entire document
  const walker = document.createTreeWalker(
    document.documentElement,
    NodeFilter.SHOW_TEXT,
    { acceptNode: shouldTranslateNode }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  // Batch processing for performance
  const BATCH_SIZE = 20;
  const batches = Math.ceil(textNodes.length / BATCH_SIZE);

  for (let i = 0; i < batches; i++) {
    const start = i * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const batchNodes = textNodes.slice(start, end);

    await Promise.all(
      batchNodes.map(async (node) => {
        const originalText = node.textContent;

        if (originalText.trim()) {
          const translation = await translateText(originalText, targetLang);
          if (translation && translation !== originalText) {
            node.textContent = translation;
          }
        }
      })
    );
  }

  // Special handling for title tag
  const title = document.querySelector('title');
  if (title && !title.classList.contains('no-translate')) {
    const translatedTitle = await translateText(title.textContent, targetLang);
    if (translatedTitle && translatedTitle !== title.textContent) {
      title.textContent = translatedTitle;
    }
  }

  // Special handling for meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && !metaDescription.classList.contains('no-translate')) {
    const translatedDescription = await translateText(metaDescription.content, targetLang);
    if (translatedDescription && translatedDescription !== metaDescription.content) {
      metaDescription.content = translatedDescription;
    }
  }

  // Special handling for input placeholders
  const inputElements = document.querySelectorAll('input[placeholder]:not(.no-translate)');
  for (const input of inputElements) {
    const translatedPlaceholder = await translateText(input.placeholder, targetLang);
    if (translatedPlaceholder && translatedPlaceholder !== input.placeholder) {
      input.placeholder = translatedPlaceholder;
    }
  }

  // Special handling for alt text
  const imgElements = document.querySelectorAll('img[alt]:not(.no-translate)');
  for (const img of imgElements) {
    const translatedAlt = await translateText(img.alt, targetLang);
    if (translatedAlt && translatedAlt !== img.alt) {
      img.alt = translatedAlt;
    }
  }

  // Special handling for aria labels
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
