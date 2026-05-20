import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-pubg-border bg-pubg-dark mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="#0D0E12" stroke="#F5A623" strokeWidth="3"/>
              <path d="M14 26 C14 20 19 16 26 16 C31 16 35 18.5 36.5 22 L33 23.5 C32 21 29.5 19.5 26 19.5 C21 19.5 17.5 22.5 17.5 26 C17.5 29.5 21 32.5 26 32.5 C29 32.5 31.5 31.5 33 29.5 L33 27 L26 27 L26 24 L36.5 24 L36.5 31 C34.5 34 30.5 36 26 36 C19 36 14 31.5 14 26Z" fill="#F5A623"/>
              <path d="M40 16 L43.5 16 L43.5 38 C43.5 43 41 46 36.5 47 L35.5 43.8 C38 43 40 41 40 38 L40 16Z" fill="#F5A623"/>
            </svg>
            <div>
              <div className="font-black text-white text-sm tracking-wide">GJ <span className="text-pubg-orange">STATS</span></div>
              <div className="text-[10px] text-pubg-muted tracking-widest">by Guan Jing</div>
            </div>
          </div>
          <p className="text-xs text-pubg-muted text-center">
            {t('footer_unofficial')}{' '}
            <a href="https://developer.pubg.com" target="_blank" rel="noopener noreferrer" className="text-pubg-orange hover:underline">
              PUBG Developer API
            </a>
            {' '}{t('footer_trademark')}
          </p>
        </div>
      </div>
    </footer>
  );
}
