// translateText.js
export const translateText = async (text, targetLang) => {
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

    if (!translation) {
      throw new Error('No translation found in response');
    }

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Helper to determine if a text node should be translated
const shouldTranslateNode = (node) => {
  if (
    node.parentNode.tagName === 'SCRIPT' ||
    node.parentNode.tagName === 'STYLE' ||
    node.parentNode.tagName === 'TEXTAREA'
  ) {
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

// Translates the entire page
export const translatePage = async (targetLang) => {
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

// Applies the saved language from localStorage (or falls back to English)
export const applySavedLanguage = async (lang) => {
  try {
    await translatePage(lang);
    return lang;
  } catch (error) {
    console.error('Error applying saved language:', error);
    return 'en';
  }
};
