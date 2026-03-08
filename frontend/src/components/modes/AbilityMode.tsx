'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';
import { useGameHero } from '@/hooks/useGameHero';
import HeroSearch from '@/components/HeroSearch';
import HeroReveal from '@/components/HeroReveal';
import ShareButton from '@/components/ShareButton';

const MAX_ATTEMPTS = 5;

export default function AbilityMode({ ultimateOnly = false }: { ultimateOnly?: boolean }) {
  const { heroes } = useHeroes();
  const { hero: currentHero, nextHero, playCount } = useGameHero();
  const [guesses, setGuesses] = useState<{ hero: Hero; correct: boolean }[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [allAbilities, setAllAbilities] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetch('/data/abilities.json').then(r => r.json()).then(setAllAbilities).catch(() => {});
  }, []);

  useEffect(() => {
    setGuesses([]);
    setWon(false);
    setLost(false);
  }, [playCount, currentHero?.id]);

  const heroSlug = currentHero?.name.replace('npc_dota_hero_', '') || '';
  const abilities = allAbilities[heroSlug] || [];

  const abilityToShow = useMemo(() => {
    if (!abilities.length) return null;
    if (ultimateOnly) return abilities[abilities.length - 1];
    return abilities[Math.min(guesses.length, abilities.length - 1)];
  }, [abilities, guesses.length, ultimateOnly]);

  function handleGuess(hero: Hero) {
    if (!currentHero || won || lost) return;
    const isCorrect = hero.id === currentHero.id;
    const newGuesses = [...guesses, { hero, correct: isCorrect }];
    setGuesses(newGuesses);
    if (isCorrect) setWon(true);
    else if (newGuesses.length >= MAX_ATTEMPTS) setLost(true);
  }

  const guessedIds = guesses.map(g => g.hero.id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gold-text">
          {ultimateOnly ? 'Режим ультимейта' : 'Режим способностей'}
        </h2>
        <p className="text-gray-400 mt-1">
          {ultimateOnly ? 'Угадай героя по иконке ультимейта' : 'Угадай героя по иконкам способностей'}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {abilityToShow ? (
          <motion.div key={abilityToShow} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <img
              src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${abilityToShow}.png`}
              alt="Иконка способности"
              className="w-28 h-28 rounded-2xl border-2 border-dota-gold shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(200,155,60,0.4)' }}
              onError={e => {
                const img = e.target as HTMLImageElement;
                const oldUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/abilities/${abilityToShow}_hp1.png`;
                if (img.src !== oldUrl) img.src = oldUrl;
              }}
            />
            <div className="absolute -top-2 -right-2 bg-dota-gold text-black text-xs px-2 py-0.5 rounded-full font-bold shadow">?</div>
          </motion.div>
        ) : (
          <div className="w-28 h-28 bg-dota-panel border-2 border-dota-border rounded-2xl flex items-center justify-center">
            <span className="text-gray-500 text-xs text-center px-2">Загрузка...</span>
          </div>
        )}
        {!ultimateOnly && !won && !lost && guesses.length > 0 && abilities.length > 0 && (
          <p className="text-gray-400 text-sm">Способность {Math.min(guesses.length + 1, abilities.length)} из {abilities.length}</p>
        )}
      </div>

      <div className="flex gap-1 justify-center">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <div key={i} className={`h-2 w-6 rounded-full transition-colors ${
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
            <ShareButton text={`DotaGuess ${ultimateOnly ? 'Ультимейт' : 'Способности'}\n${won ? `${guesses.length}/${MAX_ATTEMPTS}` : 'X'}`} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
