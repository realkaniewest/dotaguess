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

const HERO_ITEMS: Record<string, string[]> = {
  antimage: ['Мanta Style', 'Abyssal Blade', 'Skull Basher', 'Battlefury', 'Butterfly'],
  axe: ['Blink Dagger', 'Vanguard', 'Blade Mail', 'Black King Bar', 'Crimson Guard'],
  crystal_maiden: ['Aether Lens', 'Glimmer Cape', 'Force Staff', "Aghanim's Scepter", 'Blink Dagger'],
  invoker: ["Aghanim's Scepter", 'Refresher Orb', 'Octarine Core', "Eul's Scepter", 'Blink Dagger'],
  pudge: ['Blink Dagger', "Aghanim's Scepter", 'Black King Bar', 'Bloodstone', 'Eternal Shroud'],
  phantom_assassin: ['Desolator', 'Abyssal Blade', 'Skull Basher', 'Black King Bar', 'Butterfly'],
  earthshaker: ['Blink Dagger', "Aghanim's Scepter", 'Echo Sabre', 'Black King Bar', "Shiva's Guard"],
  juggernaut: ["Aghanim's Scepter", 'Battle Fury', 'Manta Style', 'Butterfly', 'Abyssal Blade'],
  lion: ['Aether Lens', "Aghanim's Scepter", 'Glimmer Cape', 'Force Staff', 'Blink Dagger'],
  lina: ["Aghanim's Scepter", "Eul's Scepter", 'Dagon', 'Bloodstone', 'Octarine Core'],
  slark: ['Echo Sabre', 'Diffusal Blade', 'Manta Style', "Aghanim's Scepter", 'Black King Bar'],
  sniper: ['Daedalus', "Aghanim's Scepter", 'Monkey King Bar', 'Black King Bar', 'Hurricane Pike'],
  storm_spirit: ['Bloodstone', 'Scythe of Vyse', "Linken's Sphere", 'Kaya and Sange', 'Orchid Malevolence'],
};

const DEFAULT_ITEMS = ['Black King Bar', 'Blink Dagger', "Aghanim's Scepter", 'Power Treads', 'Town Portal Scroll'];

const ITEM_ICONS: Record<string, string> = {
  'Blink Dagger': '⚡',
  'Black King Bar': '👑',
  "Aghanim's Scepter": '🔮',
  'Manta Style': '🌀',
  'Butterfly': '🦋',
  'Desolator': '☠️',
  'Daedalus': '⚔️',
  'Bloodstone': '💎',
  'Refresher Orb': '🔄',
  'Battle Fury': '🔥',
};

export default function ItemMode() {
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
  const items = HERO_ITEMS[heroSlug] || DEFAULT_ITEMS;
  const visibleItems = items.slice(0, Math.min(2 + guesses.length, items.length));
  const guessedIds = guesses.map(g => g.hero.id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gold-text">Режим предметов</h2>
        <p className="text-gray-400 mt-1">Угадай героя по типичной сборке предметов</p>
      </div>

      <div className="panel p-6 glow-border max-w-sm mx-auto">
        <div className="text-dota-gold text-sm mb-4 text-center">🎒 Типичная сборка</div>
        <div className="space-y-2">
          {visibleItems.map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded">
              <span className="text-xl">{ITEM_ICONS[item] || '🗡️'}</span>
              <span className="text-white text-sm">{item}</span>
            </motion.div>
          ))}
        </div>
        {!won && !lost && visibleItems.length < items.length && (
          <p className="text-gray-600 text-xs text-center mt-3">Больше предметов с каждой неверной попыткой</p>
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
            <ShareButton text={`DotaGuess Предметы\n${won ? `${guesses.length}/${MAX_ATTEMPTS}` : 'X'}`} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
