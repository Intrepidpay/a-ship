// Translation cache implementation built into the service class TranslationCache { constructor() { this.cache = new Map(); this.restore(); }

getKey(text, targetLang) { return ${targetLang}:${text}; }

get(text, targetLang) { const key = this.getKey(text, targetLang); return this.cache.get(key); }

set(text, targetLang, translation) { const key = this.getKey(text, targetLang); this.cache.set(key, translation); this.persist(); }

persist() { try { const cacheArray = Array.from(this.cache.entries()); localStorage.setItem('translationCache', JSON.stringify(cacheArray)); } catch (error) { console.error('Cache persistence error:', error); } }

restore() { try { const cacheData = localStorage.getItem('translationCache'); if (cacheData) { const cacheArray = JSON.parse(cacheData); this.cache = new Map(cacheArray); } } catch (error) { console.error('Cache restoration error:', error); } } }

const translationCache = new TranslationCache();

const API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'; // Example endpoint const API_KEY = 'sk-eed0db1fdf0247b588201374c9396728';

export const translateText = async (text, targetLang) => { if (!text.trim()) return text;

const cached = translationCache.get(text, targetLang); if (cached) return cached;

try { const response = await fetch(API_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': Bearer ${API_KEY} }, body: JSON.stringify({ model: 'deepseek-chat', messages: [ { role: 'system', content: Translate this to ${targetLang} }, { role: 'user', content: text } ] }) });

const data = await response.json();
const translation = data.choices?.[0]?.message?.content?.trim() || text;

translationCache.set(text, targetLang, translation);
return translation;

} catch (error) { console.error('DeepSeek translation error:', error); return text; } };

export const translatePage = async (targetLang) => { localStorage.setItem('selectedLanguage', targetLang); document.documentElement.lang = targetLang;

const elements = Array.from(document.querySelectorAll('body *')) .filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && !el.classList.contains('no-translate') && el.textContent.trim() !== '' );

const translationPromises = elements.map(async element => { const text = element.textContent.trim(); try { const translation = await translateText(text, targetLang); element.textContent = translation; } catch (error) { console.error('Element translation error:', error); } });

await Promise.all(translationPromises); };

export const applySavedLanguage = async () => { const savedLang = localStorage.getItem('selectedLanguage'); if (savedLang && savedLang !== 'en') { try { await translatePage(savedLang); } catch (error) { console.error('Error applying saved language:', error); } return savedLang; } return 'en'; };

// Periodically update cache every 30 seconds setInterval(async () => { const lang = localStorage.getItem('selectedLanguage') || 'en'; if (lang === 'en') return; await translatePage(lang); }, 30000);

