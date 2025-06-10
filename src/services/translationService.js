// Direct translation without caching
const translateText = async (text, targetLang) => {
  if (!text.trim() || targetLang === 'en') return text;

  const API_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    // Optional: Add a 5-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);

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
    console.error('Translation error:', error.message);
    return text;
  }
};

// Enhanced node filtering for complete coverage
const shouldTranslateNode = (node) => {
  if (!node?.parentNode || !node.parentElement) return NodeFilter.FILTER_REJECT;

  const tagName = node.parentNode.tagName?.toUpperCase();

  if (
    ['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'OPTION'].includes(tagName) ||
    node.parentElement.closest('.no-translate') ||
    node.parentElement.closest('code') ||
    node.parentElement.closest('pre') ||
    node.parentElement.closest('svg') ||
    node.parentElement.closest('canvas') ||
    node.parentElement.closest('iframe') ||
    node.parentElement.closest('video') ||
    node.parentElement.closest('audio')
  ) {
    return NodeFilter.FILTER_REJECT;
  }

  return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
};

// Enhanced translation engine for full coverage
export const translatePage = async (targetLang) => {
  if (document.documentElement.lang === targetLang) return;

  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;

  const walker = document.createTreeWalker(
    document.documentElement,
    NodeFilter.SHOW_TEXT,
    { acceptNode: shouldTranslateNode }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const BATCH_SIZE = 15;
  const CONCURRENCY_LIMIT = 5;

  const batchTranslate = async (nodesBatch) => {
    await Promise.all(
      nodesBatch.map(async (node) => {
        const originalText = node.textContent.trim();
        if (originalText) {
          try {
            const translation = await translateText(originalText, targetLang);
            if (translation && translation !== originalText) {
              node.textContent = translation;
            }
          } catch (error) {
            console.error('Node translation error:', error.message);
          }
        }
      })
    );
  };

  for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
    const batch = textNodes.slice(i, i + BATCH_SIZE);
    const chunks = [];

    // split batch into chunks of concurrency limit
    for (let j = 0; j < batch.length; j += CONCURRENCY_LIMIT) {
      chunks.push(batch.slice(j, j + CONCURRENCY_LIMIT));
    }

    for (const chunk of chunks) {
      await batchTranslate(chunk);
    }
  }

  // Special handling for <title>
  const title = document.querySelector('title');
  if (title && !title.classList.contains('no-translate')) {
    try {
      const translatedTitle = await translateText(title.textContent, targetLang);
      if (translatedTitle && translatedTitle !== title.textContent) {
        title.textContent = translatedTitle;
      }
    } catch (error) {
      console.error('Title translation error:', error.message);
    }
  }

  // Special handling for meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && !metaDescription.classList.contains('no-translate')) {
    try {
      const translatedDescription = await translateText(metaDescription.content, targetLang);
      if (translatedDescription && translatedDescription !== metaDescription.content) {
        metaDescription.content = translatedDescription;
      }
    } catch (error) {
      console.error('Meta description translation error:', error.message);
    }
  }

  // Special handling for input placeholders
  const inputElements = document.querySelectorAll('input[placeholder]:not(.no-translate)');
  for (const input of inputElements) {
    try {
      const translatedPlaceholder = await translateText(input.placeholder, targetLang);
      if (translatedPlaceholder && translatedPlaceholder !== input.placeholder) {
        input.placeholder = translatedPlaceholder;
      }
    } catch (error) {
      console.error('Input placeholder translation error:', error.message);
    }
  }

  // Special handling for img alt
  const imgElements = document.querySelectorAll('img[alt]:not(.no-translate)');
  for (const img of imgElements) {
    try {
      const translatedAlt = await translateText(img.alt, targetLang);
      if (translatedAlt && translatedAlt !== img.alt) {
        img.alt = translatedAlt;
      }
    } catch (error) {
      console.error('Image alt translation error:', error.message);
    }
  }

  // Special handling for aria-label
  const ariaElements = document.querySelectorAll('[aria-label]:not(.no-translate)');
  for (const element of ariaElements) {
    try {
      const translatedAriaLabel = await translateText(element.getAttribute('aria-label'), targetLang);
      if (translatedAriaLabel && translatedAriaLabel !== element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', translatedAriaLabel);
      }
    } catch (error) {
      console.error('Aria-label translation error:', error.message);
    }
  }
};

export const applySavedLanguage = async (lang) => {
  try {
    await translatePage(lang);
    return lang;
  } catch (error) {
    console.error('Error applying saved language:', error.message);
    return 'en';
  }
};
