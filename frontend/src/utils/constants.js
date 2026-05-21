export const PLATFORMS = [
  { value: 'steam', label: 'Steam (PC)', iconType: 'pc' },
  { value: 'psn', label: 'PlayStation', iconType: 'console' },
  { value: 'xbox', label: 'Xbox', iconType: 'console' },
  { value: 'kakao', label: 'Kakao', iconType: 'pc' },
  { value: 'console', label: 'Console', iconType: 'console' },
  { value: 'stadia', label: 'Stadia', iconType: 'pc' },
];

export const PLATFORM_REGIONS = [
  { value: 'pc-as', label: 'PC - Asia' },
  { value: 'pc-eu', label: 'PC - Europe' },
  { value: 'pc-na', label: 'PC - North America' },
  { value: 'pc-oc', label: 'PC - Oceania' },
  { value: 'pc-ru', label: 'PC - Russia' },
  { value: 'pc-sa', label: 'PC - South America' },
  { value: 'pc-sea', label: 'PC - SEA' },
  { value: 'pc-kakao', label: 'PC - Kakao' },
  { value: 'xbox-as', label: 'Xbox - Asia' },
  { value: 'xbox-eu', label: 'Xbox - Europe' },
  { value: 'xbox-na', label: 'Xbox - North America' },
  { value: 'xbox-oc', label: 'Xbox - Oceania' },
  { value: 'xbox-sa', label: 'Xbox - South America' },
];

export const GAME_MODES = [
  { value: 'squad', label: '四排 Squad', labelKey: 'mode_squad' },
  { value: 'squad-fpp', label: '四排 FPP', labelKey: 'mode_squad_fpp' },
  { value: 'duo', label: '双排 Duo', labelKey: 'mode_duo' },
  { value: 'duo-fpp', label: '双排 FPP', labelKey: 'mode_duo_fpp' },
  { value: 'solo', label: '单排 Solo', labelKey: 'mode_solo' },
  { value: 'solo-fpp', label: '单排 FPP', labelKey: 'mode_solo_fpp' },
];

export const RANKED_TIERS = [
  { name: 'Bronze', color: '#CD7F32', bg: 'bg-amber-900' },
  { name: 'Silver', color: '#C0C0C0', bg: 'bg-gray-400' },
  { name: 'Gold', color: '#FFD700', bg: 'bg-yellow-500' },
  { name: 'Platinum', color: '#00B4D8', bg: 'bg-cyan-500' },
  { name: 'Diamond', color: '#B9F2FF', bg: 'bg-sky-300' },
  { name: 'Master', color: '#F5A623', bg: 'bg-pubg-orange' },
];

export const MAP_NAMES = {
  Baltic_Main: 'Erangel',
  Desert_Main: 'Miramar',
  Savage_Main: 'Sanhok',
  DihorOtok_Main: 'Vikendi',
  Summerland_Main: 'Karakin',
  Tiger_Main: 'Taego',
  Kiki_Main: 'Deston',
  Neon_Main: 'Rondo',
};

export const API_BASE = '/api';
