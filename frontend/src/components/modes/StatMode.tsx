'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero, ATTR_LABELS } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';
import { useGameHero } from '@/hooks/useGameHero';
import HeroSearch from '@/components/HeroSearch';
import HeroReveal from '@/components/HeroReveal';
import ShareButton from '@/components/ShareButton';

const MAX_ATTEMPTS = 5;

export default function StatMode() {
  const { heroes } = useHeroes();
  const { hero: currentHero, nextHero, playCount: playedCount } = useGameHero();
  const [guesses, setGuesses] = useState<{ hero: Hero; correct: boolean }[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    setGuesses([]);
    setWon(false);
    setLost(false);
  }, [playedCount, currentHero?.id]);

  function handleGuess(hero: Hero) {
    if (!currentHero || won || lost) return;
    const isCorrect = hero.id === currentHero.id;
    const newGuesses = [...guesses, { hero, correct: isCorrect }];
    setGuesses(newGuesses);
    if (isCorrect) setWon(true);
    else if (newGuesses.length >= MAX_ATTEMPTS) setLost(true);
  }

  const guessedIds = guesses.map(g => g.hero.id);
  if (!currentHero) return null;

  const statRows = [
    { label: 'Главный атрибут', value: ATTR_LABELS[currentHero.primary_attr] },
    { label: 'Тип атаки', value: currentHero.attack_type === 'Melee' ? 'Ближний' : 'Дальний' },
    { label: 'Скорость передвижения', value: currentHero.move_speed },
    { label: 'Базовая сила', value: currentHero.base_str },
    { label: 'Базовая ловкость', value: currentHero.base_agi },
    { label: 'Базовый интеллект', value: currentHero.base_int },
    { label: 'Дальность атаки', value: currentHero.attack_range },
  ];

  const visibleStats = statRows.slice(0, Math.min(2 + guesses.length, statRows.length));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gold-text">Режим статистики</h2>
        <p className="text-gray-400 mt-1">Угадай героя по его характеристикам</p>
      </div>

      <div className="panel p-4 max-w-xs mx-auto space-y-2">
        {visibleStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }} className="flex justify-between items-center border-b border-dota-border pb-2">
            <span className="text-gray-400 text-sm">{stat.label}</span>
            <span className="text-dota-gold font-bold">{stat.value}</span>
          </motion.div>
        ))}
        {visibleStats.length < statRows.length && !won && !lost && (
          <p className="text-gray-500 text-xs text-center pt-1">Больше характеристик с каждой неверной попыткой</p>
        )}
      </div>

      <div className="flex gap-1 justify-center">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <div key={i} className={`h-2 w-6 rounded-full ${
            i < guesses.length ? (guesses[i].correct ? 'bg-dota-green' : 'bg-gray-600') : 'bg-dota-border'
          }`} />
        ))}
      </div>

      {!won && !lost && (
        <HeroSearch heroes={heroes} onGuess={handleGuess} guessedIds={guessedIds} placeholder="Введи имя героя..." />
      )}

      {guesses.length > 0 && (
        <div className="space-y-1">
          {guesses.map(({ hero, correct }, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-4 py-2 rounded panel">
              <span>{correct ? '✅' : '❌'}</span>
              <span className="text-sm text-white">{hero.localized_name}</span>
            </motion.div>
          ))}
        </div>
      )}

      {(won || lost) && (
        <div className="space-y-4">
          <HeroReveal hero={currentHero} won={won} attempts={guesses.length} />
          <div className="flex justify-center gap-3">
            <ShareButton text={`DotaGuess Статистика\n${won ? `${guesses.length}/${MAX_ATTEMPTS}` : 'X'}`} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
