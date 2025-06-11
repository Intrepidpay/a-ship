// Cache for translations
const translationCache = new Map();

/**
 * Applies the saved language to the entire page.
 */
export const applySavedLanguage = async (langCode) => {
  if (!langCode || langCode === 'en') return;
  await translatePage(langCode);
  observeDOMChanges(langCode);
};

/**
 * Translates the entire page by updating the document's lang attribute
 * and replacing all text nodes.
 */
export const translatePage = async (targetLang) => {
  if (!targetLang || targetLang === 'en') return;

  document.documentElement.lang = targetLang;

  try {
    await translateVisibleTextNodes(document.body, targetLang);

    // Translate the document title.
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.textContent) {
      const translatedTitle = await translateText(titleElement.textContent, targetLang);
      titleElement.textContent = translatedTitle;
    }
  } catch (error) {
    console.error('Translation error:', error);
  }
};

/**
 * Recursively translates visible text nodes in a given element, preserving HTML structure.
 */
const translateVisibleTextNodes = async (rootElement, targetLang) => {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentNode;
        
        // Skip if element has "no-translate" class
        if (parent.classList && parent.classList.contains('no-translate')) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip hidden elements
        if (!isVisible(parent)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip script/style/noscript and empty nodes
        if (
          parent.nodeName === 'SCRIPT' ||
          parent.nodeName === 'STYLE' ||
          parent.nodeName === 'NOSCRIPT' ||
          !node.nodeValue.trim()
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      },
    },
    false
  );

  const textNodes = [];
  let currentNode;
  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  // Batch translate in groups
  const batchSize = 15;
  for (let i = 0; i < textNodes.length; i += batchSize) {
    const batch = textNodes.slice(i, i + batchSize);
    const texts = batch.map(node => node.nodeValue);
    const translatedTexts = await translateTextBatch(texts, targetLang);
    
    batch.forEach((node, index) => {
      node.nodeValue = translatedTexts[index] || node.nodeValue;
    });
  }
};

/**
 * Uses Google Translate API to translate a single text with caching.
 */
export const translateText = async (text, targetLang) => {
  if (!text || targetLang === 'en') return text;

  // Check cache first
  const cacheKey = `${text}-${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Translation API error: ${response.status}`);
      return text;
    }

    const data = await response.json();
    let translated = text;

    if (Array.isArray(data) && data[0]) {
      translated = data[0].map(segment => segment[0]).join('');
    }

    // Cache result
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

/**
 * Uses Google Translate API to translate a batch of texts.
 */
const translateTextBatch = async (texts, targetLang) => {
  if (!texts.length || targetLang === 'en') return texts;

  try {
    const promises = texts.map(text => translateText(text, targetLang));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
};

// Throttle for DOM observation
let translationThrottle;
const THROTTLE_DELAY = 300;

/**
 * Observe dynamic DOM changes and translate new visible content automatically.
 */
const observeDOMChanges = (targetLang) => {
  const observer = new MutationObserver((mutations) => {
    clearTimeout(translationThrottle);
    translationThrottle = setTimeout(() => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(async (node) => {
            if (node.nodeType === Node.ELEMENT_NODE && isVisible(node)) {
              await translateVisibleTextNodes(node, targetLang);
            }
          });
        }
      });
    }, THROTTLE_DELAY);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
};

/**
 * Improved visibility check.
 */
const isVisible = (element) => {
  if (!element) return false;
  
  // Check computed style
  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none') {
    return false;
  }
  
  // Check bounding rectangle
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};
