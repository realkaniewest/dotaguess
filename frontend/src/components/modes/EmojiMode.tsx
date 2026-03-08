'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';
import { useGameHero } from '@/hooks/useGameHero';
import HeroSearch from '@/components/HeroSearch';
import HeroReveal from '@/components/HeroReveal';
import ShareButton from '@/components/ShareButton';

const MAX_ATTEMPTS = 5;

const HERO_EMOJIS: Record<string, { emojis: string[]; hint: string }> = {
  antimage: { emojis: ['🗡️', '🚫', '✨'], hint: 'Воин против магии' },
  axe: { emojis: ['🪓', '💪', '🔴'], hint: 'Красный воин с огромным топором' },
  crystal_maiden: { emojis: ['❄️', '🌨️', '👩'], hint: 'Ледяная королева севера' },
  invoker: { emojis: ['🔮', '⚡', '🌀'], hint: 'Мастер 10 заклинаний' },
  pudge: { emojis: ['🪝', '🧟', '🍖'], hint: 'Мясник' },
  phantom_assassin: { emojis: ['🌙', '⚔️', '💀'], hint: 'Убийца благословлённая луной' },
  earthshaker: { emojis: ['🌍', '💥', '🔨'], hint: 'Земля дрожит под ногами' },
  drow_ranger: { emojis: ['🏹', '❄️', '🎯'], hint: 'Ледяной лучник-следопыт' },
  juggernaut: { emojis: ['🗡️', '🌀', '⚔️'], hint: 'Мастер вращающегося клинка' },
  lion: { emojis: ['🦁', '🎯', '☠️'], hint: 'Палец смерти' },
  lina: { emojis: ['🔥', '⚡', '👩‍🦰'], hint: 'Огонь и молния' },
  slark: { emojis: ['🐟', '🌙', '💨'], hint: 'Рыба в тени' },
  sniper: { emojis: ['🎯', '🔫', '👓'], hint: 'Меткий стрелок на дальней дистанции' },
  storm_spirit: { emojis: ['⚡', '💨', '🌩️'], hint: 'Шар молнии' },
  ursa: { emojis: ['🐻', '🐾', '💢'], hint: 'Злой медведь' },
  windrunner: { emojis: ['💨', '🏹', '🎯'], hint: 'Стремительный лучник ветра' },
  shadow_fiend: { emojis: ['👻', '🌑', '⚫'], hint: 'Собиратель душ' },
};

const DEFAULT_EMOJIS = { emojis: ['⚔️', '🛡️', '🎮'], hint: 'Могучий герой Dota 2' };

export default function EmojiMode() {
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

  const heroSlug = currentHero?.name.replace('npc_dota_hero_', '') || '';
  const emojiData = HERO_EMOJIS[heroSlug] || DEFAULT_EMOJIS;
  const guessedIds = guesses.map(g => g.hero.id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gold-text">Режим эмодзи</h2>
        <p className="text-gray-400 mt-1">Угадай героя по эмодзи-подсказкам</p>
      </div>

      <div className="text-center panel p-8 glow-border">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }} className="text-6xl tracking-widest mb-4">
          {emojiData.emojis.join(' ')}
        </motion.div>
        {guesses.length > 0 && !won && (
          <p className="text-gray-400 text-sm italic">"{emojiData.hint}"</p>
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

      {(won || lost) && currentHero && (
        <div className="space-y-4">
          <HeroReveal hero={currentHero} won={won} attempts={guesses.length} />
          <div className="flex justify-center gap-3">
            <ShareButton text={`DotaGuess Эмодзи ${emojiData.emojis.join('')}\n${won ? `${guesses.length}/${MAX_ATTEMPTS}` : 'X'}`} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
