'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';
import { useGameHero } from '@/hooks/useGameHero';
import HeroSearch from '@/components/HeroSearch';
import HeroReveal from '@/components/HeroReveal';
import ShareButton from '@/components/ShareButton';

const MAX_ATTEMPTS = 6;

export default function SilhouetteMode() {
  const { heroes } = useHeroes();
  const { hero: currentHero, nextHero, playCount } = useGameHero();
  const [guesses, setGuesses] = useState<{ hero: Hero; correct: boolean }[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    setGuesses([]);
    setWon(false);
    setLost(false);
  }, [playCount, currentHero?.id]);

  function handleGuess(hero: Hero) {
    if (!currentHero || won || lost) return;
    const isCorrect = hero.id === currentHero.id;
    const newGuesses = [...guesses, { hero, correct: isCorrect }];
    setGuesses(newGuesses);
    if (isCorrect) setWon(true);
    else if (newGuesses.length >= MAX_ATTEMPTS) setLost(true);
  }

  const heroName = currentHero?.name.replace('npc_dota_hero_', '') || '';
  const guessedIds = guesses.map(g => g.hero.id);
  const wrongCount = guesses.filter(g => !g.correct).length;

  // Прогрессивное размытие: начинаем с 18px, убираем 4px за каждую ошибку
  const blurPx = Math.max(0, 18 - wrongCount * 4);
  const silhouetteStyle = (won || lost)
    ? {}
    : {
        filter: `blur(${blurPx}px) saturate(0) brightness(0.55) contrast(1.8)`,
        transition: 'filter 0.6s ease',
      };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gold-text">Режим силуэта</h2>
        <p className="text-gray-400 mt-1">
          {!won && !lost ? `Размытие снижается с каждой попыткой (${blurPx > 0 ? blurPx + 'px' : 'снято'})` : 'Угадай героя по его силуэту'}
        </p>
      </div>

      {/* Изображение */}
      <div className="flex justify-center">
        {currentHero ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-dota-border w-full max-w-[340px] aspect-video">
            <motion.img
              key={`${currentHero.id}-${won || lost ? 'reveal' : 'hidden'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName}.png`}
              alt="Силуэт героя"
              className="w-full h-full object-cover"
              style={silhouetteStyle}
            />
          </div>
        ) : (
          <div className="w-full max-w-[340px] aspect-video bg-dota-panel border-2 border-dota-border rounded-xl animate-pulse" />
        )}
      </div>

      {/* Прогресс */}
      <div className="flex gap-1 justify-center">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <div key={i} className={`h-2 w-6 rounded-full transition-colors ${
            i < guesses.length ? (guesses[i].correct ? 'bg-dota-green' : 'bg-gray-600') : 'bg-dota-border'
          }`} />
        ))}
      </div>

      {!won && !lost && (
        <>
          <p className="text-center text-gray-400 text-sm">Осталось попыток: {MAX_ATTEMPTS - guesses.length}</p>
          <HeroSearch heroes={heroes} onGuess={handleGuess} guessedIds={guessedIds} placeholder="Введи имя героя..." />
        </>
      )}

      {guesses.length > 0 && (
        <div className="space-y-1">
          {guesses.map(({ hero, correct }, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl panel">
              <span>{correct ? '✅' : '❌'}</span>
              <span className="text-sm text-white">{hero.localized_name}</span>
            </motion.div>
          ))}
        </div>
      )}

      {(won || lost) && currentHero && (
        <div className="space-y-4">
          <HeroReveal hero={currentHero} won={won} attempts={guesses.length} />
          <div className="flex justify-center gap-3">
            <ShareButton text={`DotaGuess Силуэт\n${won ? `${guesses.length}/${MAX_ATTEMPTS}` : 'X'}`} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
