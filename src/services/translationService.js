/**
 * Applies the saved language to the entire page.
 */
export const applySavedLanguage = async (langCode) => {
  if (!langCode || langCode === 'en') return;
  await translatePage(langCode);
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
 * Recursively translates all text nodes in a given element.
 */
const translateTextNodes = async (rootElement, targetLang) => {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip text nodes inside script, style, and noscript elements
        const parent = node.parentNode;
        if (
          parent.nodeName === 'SCRIPT' ||
          parent.nodeName === 'STYLE' ||
          parent.nodeName === 'NOSCRIPT'
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip empty or whitespace-only text nodes
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

  for (const node of textNodes) {
    const translatedText = await translateText(node.nodeValue, targetLang);
    node.nodeValue = translatedText;
  }
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
