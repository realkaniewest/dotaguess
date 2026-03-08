'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero, GuessHint } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';
import { useGameHero } from '@/hooks/useGameHero';
import HeroSearch from '@/components/HeroSearch';
import GuessRow from '@/components/GuessRow';
import HeroReveal from '@/components/HeroReveal';
import ShareButton from '@/components/ShareButton';
import { generateShareText } from '@/utils/storage';

const MAX_ATTEMPTS = 8;

export default function HeroGuessMode() {
  const { heroes } = useHeroes();
  const { hero: currentHero, nextHero, playCount } = useGameHero();
  const [guesses, setGuesses] = useState<GuessHint[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string>('');

  useEffect(() => {
    setGuesses([]);
    setWon(false);
    setLost(false);
    setHint('');
  }, [playCount, currentHero?.id]);

  function buildHint(guessed: Hero, target: Hero): GuessHint {
    const compareRoles = (a: string[], b: string[]) => {
      const common = a.filter(r => b.includes(r));
      if (common.length === b.length && common.length === a.length) return 'correct' as const;
      if (common.length > 0) return 'partial' as const;
      return 'wrong' as const;
    };
    return {
      heroId: guessed.id,
      name: guessed.localized_name,
      slug: guessed.slug,
      correct: guessed.id === target.id,
      hints: {
        primary_attr: { value: guessed.primary_attr, status: guessed.primary_attr === target.primary_attr ? 'correct' : 'wrong' },
        attack_type: { value: guessed.attack_type, status: guessed.attack_type === target.attack_type ? 'correct' : 'wrong' },
        roles: { value: guessed.roles, status: compareRoles(guessed.roles, target.roles) },
        legs: { value: guessed.legs, status: guessed.legs === target.legs ? 'correct' : Math.abs(guessed.legs - target.legs) <= 2 ? 'partial' : 'wrong' },
      },
    };
  }

  async function handleGuess(hero: Hero) {
    if (!currentHero || won || lost || loading) return;
    if (guesses.some(g => g.heroId === hero.id)) {
      setHint('Этот герой уже был угадан!');
      setTimeout(() => setHint(''), 2000);
      return;
    }
    setLoading(true);
    const result = buildHint(hero, currentHero);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    if (result.correct) setWon(true);
    else if (newGuesses.length >= MAX_ATTEMPTS) setLost(true);
    setLoading(false);
  }

  const guessedIds = guesses.map(g => g.heroId);
  const shareEmojis = guesses.map(g => {
    if (g.correct) return '🟩';
    return Object.values(g.hints).some(h => h.status === 'partial') ? '🟨' : '⬛';
  });
  const shareText = generateShareText('Классика', shareEmojis, won);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold gold-text">Классический режим</h2>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Угадай героя Dota 2 — осталось попыток: {MAX_ATTEMPTS - guesses.length}</p>
      </div>

      <div className="flex gap-1 justify-center">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <div key={i} className={`h-2 w-6 rounded-full transition-colors ${
            i < guesses.length
              ? guesses[i].correct ? 'bg-dota-green'
                : Object.values(guesses[i].hints).some(h => h.status === 'partial') ? 'bg-dota-yellow'
                : 'bg-gray-600'
              : 'bg-dota-border'
          }`} />
        ))}
      </div>

      <AnimatePresence>
        {hint && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center text-dota-yellow text-sm">{hint}</motion.div>
        )}
      </AnimatePresence>

      {!won && !lost && (
        <HeroSearch heroes={heroes} onGuess={handleGuess} disabled={loading || won || lost} guessedIds={guessedIds} placeholder="Введи имя героя..." />
      )}

      {guesses.length > 0 && (
        <div className="flex gap-1 sm:gap-2 text-[9px] sm:text-xs text-gray-500 px-1">
          <div className="w-14 sm:w-20 shrink-0 text-center">Герой</div>
          <div className="flex-1 text-center">Атрибут</div>
          <div className="flex-1 text-center">Атака</div>
          <div className="flex-1 text-center">Роли</div>
          <div className="flex-1 text-center">Ноги</div>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {guesses.map((guess, i) => (
            <GuessRow key={`${guess.heroId}-${i}`} guess={guess} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {(won || lost) && currentHero && (
        <div className="space-y-4">
          <HeroReveal hero={currentHero} won={won} attempts={guesses.length} />
          <div className="flex justify-center gap-3">
            <ShareButton text={shareText} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
