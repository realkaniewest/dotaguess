'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Hero } from '@/utils/heroes';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSearchProps {
  heroes: Hero[];
  onGuess: (hero: Hero) => void;
  disabled?: boolean;
  guessedIds?: number[];
  placeholder?: string;
}

export default function HeroSearch({ heroes, onGuess, disabled, guessedIds = [], placeholder = 'Введи имя героя...' }: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Hero[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const filtered = heroes
      .filter(h => !guessedIds.includes(h.id))
      .filter(h => h.localized_name.toLowerCase().includes(q))
      .slice(0, 10);
    setSuggestions(filtered);
  }, [query, heroes, guessedIds]);

  function selectHero(hero: Hero) {
    onGuess(hero);
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        disabled={disabled}
        placeholder={heroes.length === 0 ? 'Загружаем героев...' : placeholder}
        className="w-full px-4 py-3 bg-dota-panel border border-dota-border rounded-xl
                   text-white placeholder-gray-500 focus:outline-none focus:border-dota-gold
                   transition-colors text-base"
        autoComplete="off"
      />

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.08 }}
            className="absolute z-50 w-full mt-1 bg-dota-panel border border-dota-border rounded-xl overflow-hidden shadow-2xl"
          >
            {suggestions.map(hero => {
              const heroName = hero.name.replace('npc_dota_hero_', '');
              return (
                <button
                  key={hero.id}
                  onMouseDown={e => { e.preventDefault(); selectHero(hero); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <img
                    src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName}.png`}
                    alt={hero.localized_name}
                    className="w-12 h-7 object-cover rounded-lg"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-white text-sm flex-1">{hero.localized_name}</span>
                  <span className={`text-xs attr-${hero.primary_attr} font-bold`}>
                    {hero.primary_attr.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
