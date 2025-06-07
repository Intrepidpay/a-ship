export const COUNTRY_TO_LANG = {
  // Europe
  RU: "ru", FR: "fr", ES: "es", DE: "de", IT: "it", PT: "pt", NL: "nl",
  // Asia
  CN: "zh-CN", JP: "ja", KR: "ko", IN: "hi", TH: "th", VN: "vi",
  // Americas
  US: "en", CA: "en", MX: "es", BR: "pt",
  // Middle East
  SA: "ar", AE: "ar", TR: "tr",
  // Default
  GB: "en", AU: "en", NZ: "en"
};

export const POPUP_TEXTS = {
  ru: "Хотите переключить язык на русский?",
  fr: "Voulez-vous changer la langue en français ?",
  es: "¿Desea cambiar el idioma a español?",
  de: "Möchten Sie die Sprache auf Deutsch ändern?",
  it: "Vuoi cambiare la lingua in italiano?",
  pt: "Deseja alterar o idioma para português?",
  nl: "Wilt u de taal veranderen in het Nederlands?",
  "zh-CN": "您想将语言切换为中文吗？",
  ja: "日本語に切り替えますか？",
  ko: "한국어로 전환하시겠습니까?",
  hi: "क्या आप हिंदी में भाषा बदलना चाहेंगे?",
  th: "คุณต้องการเปลี่ยนภาษาเป็นไทยหรือไม่?",
  vi: "Bạn có muốn chuyển sang tiếng Việt không?",
  ar: "هل تريد التغيير إلى اللغة العربية؟",
  tr: "Dili Türkçe olarak değiştirmek ister misiniz?",
  en: "Would you like to switch the language?"
};

export const GOOGLE_TRANSLATE_CONFIG = {
  pageLanguage: "en",
  includedLanguages: Object.keys(POPUP_TEXTS).join(','),
  layout: "SIMPLE",
  autoDisplay: false
};
