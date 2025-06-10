/**
 * Applies the saved language to the entire page.
 */
export const applySavedLanguage = async (langCode) => {
  if (!langCode || langCode === 'en') return;
  await translatePage(langCode);
  observeDOMChanges(langCode); // Start observing after initial translation
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
        if (
          parent.nodeName === 'SCRIPT' ||
          parent.nodeName === 'STYLE' ||
          parent.nodeName === 'NOSCRIPT'
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!isVisible(parent)) {
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

  // Batch translate in groups of 5–10 nodes (adjust as needed for API limits)
  const batchSize = 10;
  for (let i = 0; i < textNodes.length; i += batchSize) {
    const batch = textNodes.slice(i, i + batchSize);
    const texts = batch.map((node) => node.nodeValue);
    const translatedTexts = await translateTextBatch(texts, targetLang);
    batch.forEach((node, index) => {
      node.nodeValue = translatedTexts[index] || node.nodeValue;
    });
  }
};

/**
 * Uses Google Translate API to translate a single text.
 */
export const translateText = async (text, targetLang) => {
  if (!text || targetLang === 'en') return text;

  try {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Translation API error: ${response.status}`);
      return text;
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]) {
      return data[0].map((segment) => segment[0]).join('');
    }

    return text;
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
    const promises = texts.map((text) => translateText(text, targetLang));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
};

/**
 * Observe dynamic DOM changes and translate new visible content automatically.
 */
const observeDOMChanges = (targetLang) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(async (node) => {
          if (node.nodeType === Node.ELEMENT_NODE && isVisible(node)) {
            await translateVisibleTextNodes(node, targetLang);
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

/**
 * Determines if an element is visible.
 */
const isVisible = (element) => {
  return (
    element.offsetParent !== null ||
    (element instanceof SVGElement && element.getBBox().width > 0)
  );
};
