// Cache for translations
const translationCache = new Map();
let observerInstance = null;

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
      // Only update if translation is different
      if (translatedTexts[index] && translatedTexts[index] !== node.nodeValue) {
        node.nodeValue = translatedTexts[index];
      }
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
    translationThrottle = setTimeout(async () => {
      const elementsToTranslate = new Set();

      mutations.forEach((mutation) => {
        // Handle added nodes
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              elementsToTranslate.add(node);
            }
          });
        }

        // Handle visibility changes (like reveal animations)
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'class' || mutation.attributeName === 'style')
        ) {
          if (isVisible(mutation.target)) {
            elementsToTranslate.add(mutation.target);
          }
        }
      });

      // Also check for reveal animations that might not trigger mutations
      document.querySelectorAll('.reveal, .reveal-active, .in-view, .tracking-reveal').forEach((element) => {
        if (isVisible(element) && !elementsToTranslate.has(element)) {
          elementsToTranslate.add(element);
        }
      });

      // Translate all collected elements
      for (const element of elementsToTranslate) {
        if (isVisible(element)) {
          await translateVisibleTextNodes(element, targetLang)
            .catch(error => console.error('Error translating element:', error));
        }
      }

      // Translate tracking result elements
      await translateTrackingResultsInDOM(targetLang);

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
 * Improved visibility check with reveal animation support.
 */
const isVisible = (element) => {
  if (!element || !(element instanceof Element)) return false;

  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') {
    return false;
  }

  if (
    element.classList.contains('reveal') ||
    element.classList.contains('reveal-active') ||
    element.classList.contains('in-view') ||
    element.classList.contains('tracking-reveal')
  ) {
    return true;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

/**
 * Periodically check for reveal elements that need translation.
 */
setInterval(() => {
  const lang = localStorage.getItem('selectedLanguage') || 'en';
  if (lang === 'en') return;

  document.querySelectorAll('.reveal, .reveal-active, .in-view, .tracking-reveal').forEach(async (element) => {
    if (isVisible(element)) {
      await translateVisibleTextNodes(element, lang);
    }
  });
}, 3000);

/**
 * Translates tracking result elements in the DOM automatically.
 */
const translateTrackingResultsInDOM = async (targetLang) => {
  if (!targetLang || targetLang === 'en') return;

  try {
    const trackingElements = document.querySelectorAll('.tracking-result');

    for (const element of trackingElements) {
      if (!isVisible(element)) continue;

      const statusElement = element.querySelector('.status');
      const recipientElement = element.querySelector('.recipient');
      const historyElements = element.querySelectorAll('.history-item');

      if (statusElement && statusElement.textContent) {
        const translatedStatus = await translateText(statusElement.textContent, targetLang);
        statusElement.textContent = translatedStatus;
      }

      if (recipientElement && recipientElement.textContent) {
        const translatedRecipient = await translateText(recipientElement.textContent, targetLang);
        recipientElement.textContent = translatedRecipient;
      }

      for (const item of historyElements) {
        const status = item.querySelector('.status');
        const location = item.querySelector('.location');
        const description = item.querySelector('.description');

        if (status && status.textContent) {
          const translatedStatus = await translateText(status.textContent, targetLang);
          status.textContent = translatedStatus;
        }

        if (location && location.textContent) {
          const translatedLocation = await translateText(location.textContent, targetLang);
          location.textContent = translatedLocation;
        }

        if (description && description.textContent) {
          const translatedDescription = await translateText(description.textContent, targetLang);
          description.textContent = translatedDescription;
        }
      }
    }
  } catch (error) {
    console.error('Error translating tracking results:', error);
  }
};
