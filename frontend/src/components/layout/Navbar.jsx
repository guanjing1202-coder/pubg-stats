import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Trophy, Activity } from 'lucide-react';
import SearchBar from '../search/SearchBar';
import { useLanguage } from '../../contexts/LanguageContext';

function GJLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="#0D0E12" stroke="#F5A623" strokeWidth="2.5"/>
      <polygon points="32,10 53,21.5 53,44.5 32,56 11,44.5 11,21.5" fill="none" stroke="#F5A623" strokeWidth="0.8" strokeOpacity="0.3"/>
      <path d="M14 26 C14 20 19 16 26 16 C31 16 35 18.5 36.5 22 L33 23.5 C32 21 29.5 19.5 26 19.5 C21 19.5 17.5 22.5 17.5 26 C17.5 29.5 21 32.5 26 32.5 C29 32.5 31.5 31.5 33 29.5 L33 27 L26 27 L26 24 L36.5 24 L36.5 31 C34.5 34 30.5 36 26 36 C19 36 14 31.5 14 26Z" fill="#F5A623"/>
      <path d="M40 16 L43.5 16 L43.5 38 C43.5 43 41 46 36.5 47 L35.5 43.8 C38 43 40 41 40 38 L40 16Z" fill="#F5A623"/>
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-pubg-dark/95 backdrop-blur-sm border-b border-pubg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <GJLogo size={34} />
          <div className="hidden sm:block">
            <div className="font-black text-white text-base leading-none tracking-wide">
              GJ <span className="text-pubg-orange">STATS</span>
            </div>
            <div className="text-[10px] text-pubg-muted tracking-widest leading-none mt-0.5">{t('navbar_brand_subtitle')}</div>
          </div>
        </Link>

        {/* Desktop search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <SearchBar compact />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-pubg-card transition-colors">
            <Activity size={15} />{t('nav_stats')}
          </Link>
          <Link to="/leaderboard" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-pubg-card transition-colors">
            <Trophy size={15} />{t('nav_leaderboard')}
          </Link>
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="ml-1 px-3 py-1.5 rounded-lg border border-pubg-border text-xs font-semibold text-gray-400 hover:text-white hover:border-pubg-orange/50 transition-all bg-pubg-card/50"
            title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded border border-pubg-border text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-400 hover:text-white">
            <Search size={20} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-400 hover:text-white">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 border-b border-pubg-border">
          <SearchBar compact onSearch={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-pubg-border bg-pubg-dark">
          <nav className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-pubg-card rounded-lg">
              <Activity size={16} /> {t('nav_stats')}
            </Link>
            <Link to="/leaderboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-pubg-card rounded-lg">
              <Trophy size={16} /> {t('nav_leaderboard')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
