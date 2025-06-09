// Translation cache implementation
class TranslationCache {
  constructor() {
    this.cache = new Map();
    this.restore();
  }

  getKey(text, targetLang) {
    return `${targetLang}:${text}`;
  }

  get(text, targetLang) {
    const key = this.getKey(text, targetLang);
    return this.cache.get(key);
  }

  set(text, targetLang, translation) {
    const key = this.getKey(text, targetLang);
    this.cache.set(key, translation);
    this.persist();
  }

  persist() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      localStorage.setItem('translationCache', JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Cache persistence error:', error);
    }
  }

  restore() {
    try {
      const cacheData = localStorage.getItem('translationCache');
      if (cacheData) {
        const cacheArray = JSON.parse(cacheData);
        this.cache = new Map(cacheArray);
      }
    } catch (error) {
      console.error('Cache restoration error:', error);
    }
  }
}

const translationCache = new TranslationCache();

// DeepSeek API configuration
const DEEPSEEK_API_KEY = "sk-eed0db1fdf0247b588201374c9396728"; // Get from https://platform.deepseek.com/
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

// Track usage in localStorage
const trackUsage = (characters) => {
  const today = new Date().toISOString().split('T')[0];
  const usage = JSON.parse(localStorage.getItem('translationUsage') || '{}');
  
  if (!usage[today]) {
    usage[today] = { characters: 0, date: today };
  }
  
  usage[today].characters += characters;
  localStorage.setItem('translationUsage', JSON.stringify(usage));
};

export const translateText = async (text, targetLang) => {
  if (!text.trim()) return text;
  
  // Check cache first
  const cached = translationCache.get(text, targetLang);
  if (cached) return cached;
  
  try {
    // Check usage before making API call
    const usage = JSON.parse(localStorage.getItem('translationUsage') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const todayUsage = usage[today]?.characters || 0;
    
    if (todayUsage > 900000) { // 900k of 1M free limit
      console.warn('Approaching DeepSeek free limit');
      return text; // Fallback to original text
    }
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text to ${targetLang} without adding any extra content. Preserve all formatting, special characters, and placeholders.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    const translation = data.choices[0].message.content;
    
    // Track usage
    trackUsage(text.length);
    
    // Cache the result
    translationCache.set(text, targetLang, translation);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Translate all text content on the page
export const translatePage = async (targetLang) => {
  // Store selected language
  localStorage.setItem('selectedLanguage', targetLang);
  document.documentElement.lang = targetLang;
  
  // Get all text nodes in the document
  const textNodes = getTextNodes(document.body);
  
  // Filter out nodes that should not be translated
  const translatableNodes = textNodes.filter(node => {
    const parentElement = node.parentElement;
    
    // Skip nodes inside elements with 'no-translate' class
    if (parentElement.classList.contains('no-translate')) return false;
    
    // Skip script, style, and code elements
    if (['SCRIPT', 'STYLE', 'CODE'].includes(parentElement.tagName)) return false;
    
    // Skip empty text nodes
    return node.textContent.trim() !== '';
  });
  
  // Group text by parent element to reduce API calls
  const textGroups = groupTextByParent(translatableNodes);
  
  // Translate each group
  for (const group of textGroups) {
    const originalText = group.text;
    try {
      const translation = await translateText(originalText, targetLang);
      
      // Create a new text node with the translated text
      const newNode = document.createTextNode(translation);
      
      // Replace the original text node
      group.nodes[0].parentNode.replaceChild(newNode, group.nodes[0]);
      
      // Remove the other nodes in this group since we've replaced the parent's content
      for (let i = 1; i < group.nodes.length; i++) {
        group.nodes[i].parentNode.removeChild(group.nodes[i]);
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  }
};

// Get all text nodes in an element
const getTextNodes = (element) => {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }
  
  return textNodes;
};

// Group adjacent text nodes by their parent element
const groupTextByParent = (nodes) => {
  const groups = [];
  let currentParent = null;
  let currentGroup = null;
  
  for (const node of nodes) {
    if (node.parentElement !== currentParent) {
      currentParent = node.parentElement;
      currentGroup = {
        parent: currentParent,
        text: '',
        nodes: []
      };
      groups.push(currentGroup);
    }
    
    currentGroup.text += node.textContent;
    currentGroup.nodes.push(node);
  }
  
  return groups;
};

// Apply saved language on page load
export const applySavedLanguage = async () => {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && savedLang !== 'en') {
    try {
      await translatePage(savedLang);
    } catch (error) {
      console.error('Error applying saved language:', error);
    }
    return savedLang;
  }
  return 'en';
};
