'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Hero } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';

function pickRandom(heroes: Hero[], excludeIds: number[]): Hero {
  const pool = heroes.filter(h => !excludeIds.includes(h.id));
  const list = pool.length > 0 ? pool : heroes;
  return list[Math.floor(Math.random() * list.length)];
}

// Каждый режим получает своего независимого героя
export function useGameHero() {
  const { heroes } = useHeroes();
  const [hero, setHero] = useState<Hero | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const recentIds = useRef<number[]>([]);

  useEffect(() => {
    if (heroes.length > 0 && !hero) {
      const picked = pickRandom(heroes, []);
      setHero(picked);
      recentIds.current = [picked.id];
    }
  }, [heroes]);

  const nextHero = useCallback(() => {
    if (!heroes.length) return;
    const picked = pickRandom(heroes, recentIds.current.slice(-15));
    setHero(picked);
    recentIds.current.push(picked.id);
    setPlayCount(c => c + 1);
  }, [heroes]);

  return { hero, nextHero, playCount };
}
