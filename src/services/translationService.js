// Replace with your actual Hugging Face API key
const HUGGINGFACE_API_KEY = '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';

// Map of target languages to Hugging Face models
const HF_MODEL_MAP = {
  fr: 'Helsinki-NLP/opus-mt-en-fr',
  es: 'Helsinki-NLP/opus-mt-en-es',
  de: 'Helsinki-NLP/opus-mt-en-de',
  ru: 'Helsinki-NLP/opus-mt-en-ru',
  ja: 'Helsinki-NLP/opus-mt-en-ja'
};

export const translateText = async (text, targetLang) => {
  if (!text.trim()) return text;

  const failKey = `${targetLang}:${text}`;
  if (failedTranslations.has(failKey)) return text;

  const cached = translationCache.get(text, targetLang);
  if (cached && cached !== text) return cached;

  try {
    const model = HF_MODEL_MAP[targetLang];
    if (!model) {
      throw new Error(`No translation model found for language: ${targetLang}`);
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const translation = data[0]?.translation_text || text;

    translationCache.set(text, targetLang, translation);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    failedTranslations.add(failKey);
    return text;
  }
};
