// translationService.js class TranslationCache { constructor() { this.cache = new Map(); this.restore(); }

getKey(text, targetLang) { return ${targetLang}:${text}; }

get(text, targetLang) { const key = this.getKey(text, targetLang); return this.cache.get(key); }

set(text, targetLang, translation) { const key = this.getKey(text, targetLang); this.cache.set(key, translation); this.persist(); }

persist() { try { const cacheArray = Array.from(this.cache.entries()); localStorage.setItem('translationCache', JSON.stringify(cacheArray)); } catch (err) { console.error('Failed to persist translation cache:', err); } }

restore() { try { const data = localStorage.getItem('translationCache'); if (data) { this.cache = new Map(JSON.parse(data)); } } catch (err) { console.error('Failed to restore translation cache:', err); } } }

const translationCache = new TranslationCache(); const DEEPSEEK_API_KEY = 'sk-eed0db1fdf0247b588201374c9396728'; const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const translateTextWithCache = async (text, targetLang) => { if (!text.trim()) return text;

const cached = translationCache.get(text, targetLang); if (cached) return cached;

try { const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': Bearer ${DEEPSEEK_API_KEY}, }, body: JSON.stringify({ model: 'deepseek-chat', messages: [ { role: 'system', content: 'You are a translation assistant.' }, { role: 'user', content: Translate to ${targetLang}: \"${text}\" } ] }) });

const data = await response.json();
const translated = data.choices?.[0]?.message?.content?.trim() || text;

translationCache.set(text, targetLang, translated);
return translated;

} catch (error) { console.error('Translation failed. Using original text.', error); return text; } };

export const applyCachedTranslation = async (targetLang) => { const elements = Array.from(document.querySelectorAll('body *')).filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && !el.classList.contains('no-translate') && el.textContent.trim() !== '' );

for (const el of elements) { const text = el.textContent.trim(); const translated = translationCache.get(text, targetLang); if (translated && translated !== text) { el.textContent = translated; } } };

export const initializeTranslationObserver = (targetLang) => { const observer = new MutationObserver(async () => { await refreshTranslationCache(targetLang); });

observer.observe(document.body, { childList: true, subtree: true, characterData: true });

setInterval(() => { refreshTranslationCache(targetLang); }, 30000); };

const refreshTranslationCache = async (targetLang) => { const elements = Array.from(document.querySelectorAll('body *')).filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && !el.classList.contains('no-translate') && el.textContent.trim() !== '' );

for (const el of elements) { const text = el.textContent.trim(); const cached = translationCache.get(text, targetLang); if (!cached) { await translateTextWithCache(text, targetLang); } } };

                                                                                                                                                                                   
