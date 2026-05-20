import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('gj_lang') || 'zh'; } catch { return 'zh'; }
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh';
      try { localStorage.setItem('gj_lang', next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key, ...args) => {
    const dict = translations[lang] || translations.zh;
    const val = dict[key] ?? translations.zh[key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
