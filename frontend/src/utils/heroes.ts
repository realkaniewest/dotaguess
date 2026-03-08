export interface Hero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: 'str' | 'agi' | 'int' | 'all';
  attack_type: 'Melee' | 'Ranged';
  roles: string[];
  legs: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  move_speed: number;
  attack_range: number;
  base_attack_min: number;
  base_attack_max: number;
  slug: string;
  icon: string;
  silhouette: string;
}

export interface GuessHint {
  heroId: number;
  name: string;
  slug: string;
  correct: boolean;
  hints: {
    primary_attr: { value: string; status: 'correct' | 'partial' | 'wrong' };
    attack_type: { value: string; status: 'correct' | 'partial' | 'wrong' };
    roles: { value: string[]; status: 'correct' | 'partial' | 'wrong' };
    legs: { value: number; status: 'correct' | 'partial' | 'wrong' };
  };
}

export const ATTR_LABELS: Record<string, string> = {
  str: 'Сила',
  agi: 'Ловкость',
  int: 'Интеллект',
  all: 'Универсальный',
};

export const ATTR_COLORS: Record<string, string> = {
  str: '#e74c3c',
  agi: '#2ecc71',
  int: '#3498db',
  all: '#9b59b6',
};

export function getDailyHero(heroes: Hero[]): Hero {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % heroes.length;
  return heroes[index];
}

export function getHeroPortraitUrl(hero: Hero): string {
  const heroName = hero.name.replace('npc_dota_hero_', '');
  return `/heroes/${hero.slug}.png`;
}

export function getSilhouetteUrl(hero: Hero): string {
  return `/silhouettes/${hero.slug}.png`;
}

export function getCdnPortrait(hero: Hero): string {
  const heroName = hero.name.replace('npc_dota_hero_', '');
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName}.png`;
}

export const EMOJI_MODES: Record<string, string[]> = {
  antimage: ['🗡️', '💨', '🚫'],
  axe: ['🪓', '💪', '🔴'],
  crystal_maiden: ['❄️', '🌊', '🔵'],
  invoker: ['🔮', '⚡', '🌀'],
  pudge: ['🪝', '🧟', '🍖'],
  phantom_assassin: ['🌙', '⚔️', '💀'],
  earthshaker: ['🌍', '💥', '🔨'],
  drow_ranger: ['🏹', '❄️', '🎯'],
};

export const LORE_SNIPPETS: Record<string, string> = {
  antimage: 'A wandering monk who devoted his life to fighting magic. His past is a mystery.',
  axe: 'A former soldier of the Red Mist, now a mighty warrior who brings chaos to battle.',
  crystal_maiden: 'A young mage who controls ice and cold, exiled from her homeland.',
  invoker: 'An ancient archmage who mastered ten fundamental forces of magic.',
  pudge: 'A rotting ghoul who wanders the battlefields, adding flesh to his gruesome form.',
};
