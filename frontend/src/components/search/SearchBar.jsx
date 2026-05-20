import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, X } from 'lucide-react';
import { PLATFORMS } from '../../utils/constants';
import { useRecentSearches } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SearchBar({ compact = false, large = false, onSearch }) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('steam');
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const { searches, addSearch, removeSearch } = useRecentSearches();
  const { t } = useLanguage();
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addSearch(trimmed, platform);
    setShowHistory(false);
    navigate(`/player/${platform}/${encodeURIComponent(trimmed)}`);
    onSearch?.();
  };

  const selectHistory = (item) => {
    setName(item.name);
    setPlatform(item.platform);
    setShowHistory(false);
    addSearch(item.name, item.platform);
    navigate(`/player/${item.platform}/${encodeURIComponent(item.name)}`);
    onSearch?.();
  };

  const filteredHistory = name
    ? searches.filter((s) => s.name.toLowerCase().includes(name.toLowerCase()))
    : searches;

  if (compact) {
    return (
      <div ref={wrapperRef} className="relative">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-pubg-card border border-pubg-border rounded-lg overflow-hidden focus-within:border-pubg-orange transition-colors">
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}
              className="bg-transparent text-gray-300 text-sm px-2 py-2 outline-none border-r border-pubg-border shrink-0">
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value} className="bg-pubg-dark">{p.label}</option>
              ))}
            </select>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              onFocus={() => setShowHistory(true)}
              placeholder={t('search_placeholder_compact')}
              className="flex-1 bg-transparent text-sm text-white placeholder-pubg-muted px-3 py-2 outline-none min-w-0" />
            <button type="submit" className="px-3 py-2 text-pubg-orange hover:text-amber-400 transition-colors">
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* History dropdown */}
        {showHistory && filteredHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-pubg-card border border-pubg-border rounded-xl shadow-xl z-50 overflow-hidden">
            {filteredHistory.slice(0, 6).map((item) => (
              <div key={`${item.platform}-${item.name}`}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-pubg-border/50 cursor-pointer transition-colors group">
                <Clock size={13} className="text-pubg-muted shrink-0" />
                <button onClick={() => selectHistory(item)} className="flex-1 text-left text-sm text-gray-300 hover:text-white">
                  {item.name}
                  <span className="ml-2 text-xs text-pubg-muted">{item.platform}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); removeSearch(item.name, item.platform); }}
                  className="text-pubg-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-0.5">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`flex flex-col sm:flex-row gap-3 ${large ? 'max-w-2xl mx-auto' : ''}`}>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}
            className="bg-pubg-card border border-pubg-border text-gray-300 rounded-xl px-4 py-3 outline-none focus:border-pubg-orange transition-colors sm:w-44 text-sm">
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value} className="bg-pubg-dark">{p.icon} {p.label}</option>
            ))}
          </select>
          <div className="flex-1 flex items-center bg-pubg-card border border-pubg-border rounded-xl overflow-hidden focus-within:border-pubg-orange transition-colors">
            <Search size={18} className="ml-4 text-pubg-muted shrink-0" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              onFocus={() => setShowHistory(true)}
              placeholder={t('search_placeholder_large')}
              className="flex-1 bg-transparent text-white placeholder-pubg-muted px-3 py-3 outline-none text-sm sm:text-base" />
          </div>
          <button type="submit" className="btn-primary flex items-center justify-center gap-2 sm:w-auto">
            <Search size={16} />{t('search_button')}
          </button>
        </div>
      </form>

      {/* History dropdown (large mode) */}
      {showHistory && filteredHistory.length > 0 && (
        <div className={`absolute top-full mt-2 bg-pubg-card border border-pubg-border rounded-xl shadow-2xl z-50 overflow-hidden ${large ? 'max-w-2xl left-0 right-0 mx-auto' : 'left-0 right-0'}`}>
          <div className="px-3 py-2 border-b border-pubg-border/50 flex items-center justify-between">
            <span className="text-xs text-pubg-muted">{t('search_recent')}</span>
          </div>
          {filteredHistory.slice(0, 8).map((item) => (
            <div key={`${item.platform}-${item.name}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-pubg-border/30 cursor-pointer transition-colors group">
              <Clock size={14} className="text-pubg-muted shrink-0" />
              <button onClick={() => selectHistory(item)} className="flex-1 text-left flex items-center gap-2">
                <span className="text-white text-sm">{item.name}</span>
                <span className="text-xs text-pubg-muted px-1.5 py-0.5 bg-pubg-border rounded">{item.platform}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); removeSearch(item.name, item.platform); }}
                className="text-pubg-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
