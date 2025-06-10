export const applySavedLanguage = async (langCode) => {
  if (!langCode || langCode === 'en') return;
  await translatePage(langCode);
};

export const translatePage = async (targetLang) => {
  if (!targetLang || targetLang === 'en') return;

  document.documentElement.lang = targetLang;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  for (const node of textNodes) {
    const originalText = node.textContent.trim();
    if (!originalText) continue;

    const translatedText = await translateText(originalText, targetLang);
    node.textContent = translatedText;
  }

  // Also translate the document title
  const title = document.querySelector('title');
  if (title) {
    const translatedTitle = await translateText(title.textContent, targetLang);
    title.textContent = translatedTitle;
  }
};

export const translateText = async (text, targetLang) => {
  if (!text || targetLang === 'en') return text;

  try {
    const API_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.error(`Translation API error: ${response.status}`);
      return text;
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]) {
      return data[0].map(segment => segment[0]).join('');
    }

    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
