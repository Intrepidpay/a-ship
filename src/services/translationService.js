// Cache for translations
const translationCache = new Map();
let observerInstance = null;
let currentLang = null;

// Manual overrides for problematic translations
const TRANSLATION_OVERRIDES = {
  'in transit': {
    ja: '輸送中',
    es: 'En tránsito',
    fr: 'En transit',
    de: 'Unterwegs',
    it: 'In transito',
    pt: 'Em trânsito'
  }
};

/**
 * Applies the saved language to the entire page.
 */
export const applySavedLanguage = async (langCode) => {
  if (!langCode || langCode === 'en') return;
  currentLang = langCode;
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
    if (titleElement && titleElement.textContent && !titleElement.closest('.no-translate')) {
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
  // Create a Set to track translated nodes in this batch
  const translatedNodes = new Set();
  
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
        
        // Skip script/style/noscript and empty nodes
        if (
          parent.nodeName === 'SCRIPT' ||
          parent.nodeName === 'STYLE' ||
          parent.nodeName === 'NOSCRIPT' ||
          !node.nodeValue.trim() ||
          translatedNodes.has(node)  // Skip already translated nodes
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
      // Only update if translation is different
      if (translatedTexts[index] && translatedTexts[index] !== node.nodeValue) {
        node.nodeValue = translatedTexts[index];
        // Mark as translated in this batch
        translatedNodes.add(node);
      }
    });
  }
};

/**
 * Uses Google Translate API to translate a single text with caching.
 */
export const translateText = async (text, targetLang) => {
  if (!text || targetLang === 'en') return text;

  // Check manual overrides first (case-insensitive)
  const normalizedText = text.trim().toLowerCase();
  if (TRANSLATION_OVERRIDES[normalizedText]?.[targetLang]) {
    return TRANSLATION_OVERRIDES[normalizedText][targetLang];
  }

  // Check cache first
  const cacheKey = `${text}-${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl, {
      headers: {'User-Agent': 'Mozilla/5.0'}
    });

    if (!response.ok) {
      console.error(`Translation API error: ${response.status}`);
      return text;
    }

    const data = await response.json();
    let translated = text;

    // Robust response parsing
    if (Array.isArray(data)) {
      // Handle different response structures
      if (Array.isArray(data[0])) {
        // Standard response structure
        translated = data[0].map(segment => 
          Array.isArray(segment) && segment[0] ? segment[0] : ''
        ).join('');
      } else if (data[0] && typeof data[0] === 'string') {
        // Alternate response structure
        translated = data[0];
      } else if (data[0] && Array.isArray(data[0]) && data[0][0] && Array.isArray(data[0][0])) {
        // Deeper nested structure
        translated = data[0][0].map(segment => segment[0]).join('');
      }
    }

    // Remove any bracketed text added by Google Translate
    translated = translated.replace(/\s*\([^)]*\)\s*/g, ' ').trim();

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
const THROTTLE_DELAY = 500;

/**
 * Observe dynamic DOM changes and translate new visible content automatically.
 */
const observeDOMChanges = (targetLang) => {
  // Disconnect existing observer if any
  if (observerInstance) {
    observerInstance.disconnect();
  }

  observerInstance = new MutationObserver((mutations) => {
    clearTimeout(translationThrottle);
    translationThrottle = setTimeout(() => {
      const elementsToTranslate = new Set();

      mutations.forEach((mutation) => {
        // Handle added nodes
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            // Handle elements directly
            if (node.nodeType === Node.ELEMENT_NODE && isVisible(node)) {
              elementsToTranslate.add(node);
            }
          });
        }
        
        // Handle visibility changes
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
          if (isVisible(mutation.target)) {
            elementsToTranslate.add(mutation.target);
          }
        }
      });

      // Add tracking elements specifically
      const trackingElements = document.querySelectorAll('.premium-tracking-result, .timeline-item, .timeline-content');
      trackingElements.forEach(el => {
        if (isVisible(el)) {
          elementsToTranslate.add(el);
        }
      });

      // Translate all collected elements
      elementsToTranslate.forEach((element) => {
        translateVisibleTextNodes(element, targetLang)
          .catch(error => console.error('Error translating element:', error));
      });
    }, THROTTLE_DELAY);
  });

  observerInstance.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
};

/**
 * Improved visibility check with tracking reveal support.
 */
const isVisible = (element) => {
  if (!element || !(element instanceof Element)) return false;
  
  // Check computed style
  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') {
    return false;
  }
  
  // Special case for tracking elements
  if (element.classList.contains('premium-tracking-result') || 
      element.classList.contains('timeline-item') || 
      element.classList.contains('timeline-content')) {
    return true;
  }
  
  // Check bounding rectangle
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

/**
 * Periodically check for tracking elements that need translation
 */
setInterval(() => {
  if (!currentLang || currentLang === 'en') return;
  
  // Look for tracking elements that might have been missed
  document.querySelectorAll('.premium-tracking-result, .timeline-item, .timeline-content').forEach(async (element) => {
    if (isVisible(element)) {
      await translateVisibleTextNodes(element, currentLang);
    }
  });
}, 3000); // Every 3 seconds
