const STORAGE_KEY = 'dotaguess_stats';
const GUESSES_KEY = 'dotaguess_guesses';
const STREAK_KEY = 'dotaguess_streak';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
  lastPlayedDate: string;
}

export interface DailyGuesses {
  date: string;
  modeGuesses: Record<string, string[]>;
  modeWon: Record<string, boolean>;
  modeAttempts: Record<string, number>;
}

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
  lastPlayedDate: '',
};

export function getStats(): GameStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function updateStats(won: boolean, attempts: number): void {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];

  if (stats.lastPlayedDate === today) return;

  stats.gamesPlayed++;
  stats.lastPlayedDate = today;

  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.guessDistribution[attempts] = (stats.guessDistribution[attempts] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  saveStats(stats);
}

export function getDailyGuesses(): DailyGuesses {
  if (typeof window === 'undefined') return { date: '', modeGuesses: {}, modeWon: {}, modeAttempts: {} };
  const today = new Date().toISOString().split('T')[0];
  try {
    const data = localStorage.getItem(GUESSES_KEY);
    const parsed = data ? JSON.parse(data) : null;
    if (parsed?.date === today) return parsed;
    return { date: today, modeGuesses: {}, modeWon: {}, modeAttempts: {} };
  } catch {
    return { date: today, modeGuesses: {}, modeWon: {}, modeAttempts: {} };
  }
}

export function saveDailyGuesses(guesses: DailyGuesses): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUESSES_KEY, JSON.stringify(guesses));
}

export function generateShareText(mode: string, guesses: string[], won: boolean): string {
  const today = new Date().toISOString().split('T')[0];
  const statusEmojis = guesses.map(g => {
    if (g === 'correct') return '🟩';
    if (g === 'partial') return '🟨';
    return '⬛';
  });
  const result = won ? `${guesses.length}/8` : 'X/8';
  return `DotaGuess ${mode} ${today}\n${result}\n\n${statusEmojis.join('')}\n\nhttps://dotaguess.vercel.app`;
}
