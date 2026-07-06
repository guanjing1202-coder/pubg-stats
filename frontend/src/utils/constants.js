export const PLATFORMS = [
  { value: 'steam', labelKey: 'platform_steam', iconType: 'pc' },
  { value: 'psn', labelKey: 'platform_psn', iconType: 'console' },
  { value: 'xbox', labelKey: 'platform_xbox', iconType: 'console' },
  { value: 'kakao', labelKey: 'platform_kakao', iconType: 'pc' },
  { value: 'console', labelKey: 'platform_console', iconType: 'console' },
  { value: 'stadia', labelKey: 'platform_stadia', iconType: 'pc' },
];

export const PLATFORM_REGIONS = [
  { value: 'pc-as', labelKey: 'region_pc_as' },
  { value: 'pc-eu', labelKey: 'region_pc_eu' },
  { value: 'pc-na', labelKey: 'region_pc_na' },
  { value: 'pc-oc', labelKey: 'region_pc_oc' },
  { value: 'pc-ru', labelKey: 'region_pc_ru' },
  { value: 'pc-sa', labelKey: 'region_pc_sa' },
  { value: 'pc-sea', labelKey: 'region_pc_sea' },
  { value: 'pc-kakao', labelKey: 'region_pc_kakao' },
  { value: 'xbox-as', labelKey: 'region_xbox_as' },
  { value: 'xbox-eu', labelKey: 'region_xbox_eu' },
  { value: 'xbox-na', labelKey: 'region_xbox_na' },
  { value: 'xbox-oc', labelKey: 'region_xbox_oc' },
  { value: 'xbox-sa', labelKey: 'region_xbox_sa' },
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
