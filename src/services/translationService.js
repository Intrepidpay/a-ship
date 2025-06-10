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
    await translateTextNodes(document.body, targetLang);

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
 * Recursively translates all text nodes in a given element using batching.
 */
const translateTextNodes = async (rootElement, targetLang) => {
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

  // Collect all text contents
  const texts = textNodes.map((node) => node.nodeValue);

  // Translate them in batch
  const translatedTexts = await translateTextBatch(texts, targetLang);

  // Update nodes
  textNodes.forEach((node, index) => {
    node.nodeValue = translatedTexts[index] || node.nodeValue;
  });
};

/**
 * Uses Google Translate API to translate a given text.
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
    const delimiter = '|||'; // Use a delimiter unlikely to occur naturally
    const joinedText = texts.join(delimiter);
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      joinedText
    )}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Translation API error: ${response.status}`);
      return texts;
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]) {
      const translatedJoinedText = data[0].map((segment) => segment[0]).join('');
      return translatedJoinedText.split(delimiter);
    }

    return texts;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
};

/**
 * Observe dynamic DOM changes and translate new content automatically.
 */
const observeDOMChanges = (targetLang) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(async (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            await translateTextNodes(node, targetLang);
          }
        });
      } else if (mutation.type === 'attributes') {
        if (mutation.target.nodeType === Node.ELEMENT_NODE) {
          translateTextNodes(mutation.target, targetLang);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};
