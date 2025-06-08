export class TranslationCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 500; // Max cached translations
  }

  getKey(text, targetLang) {
    return `${targetLang}:${text}`;
  }

  get(text, targetLang) {
    const key = this.getKey(text, targetLang);
    return this.cache.get(key);
  }

  set(text, targetLang, translation) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry when cache is full
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    const key = this.getKey(text, targetLang);
    this.cache.set(key, translation);
  }

  // Save cache to localStorage
  persist() {
    const cacheArray = Array.from(this.cache.entries());
    localStorage.setItem('translationCache', JSON.stringify(cacheArray));
  }

  // Load cache from localStorage
  restore() {
    const cacheData = localStorage.getItem('translationCache');
    if (cacheData) {
      try {
        const cacheArray = JSON.parse(cacheData);
        this.cache = new Map(cacheArray);
      } catch (e) {
        console.error('Failed to restore translation cache', e);
      }
    }
  }
}

// Singleton cache instance
export const translationCache = new TranslationCache();
translationCache.restore();

// Periodically save cache to localStorage
setInterval(() => {
  translationCache.persist();
}, 30000); // Save every 30 seconds
