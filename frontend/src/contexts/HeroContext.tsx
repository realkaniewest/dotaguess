'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Hero } from '@/utils/heroes';

interface HeroContextType {
  heroes: Hero[];
  loading: boolean;
  error: string | null;
}

const HeroContext = createContext<HeroContextType>({
  heroes: [],
  loading: true,
  error: null,
});

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/heroes')
      .then(r => r.json())
      .then((data: Hero[]) => {
        setHeroes(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Не удалось загрузить героев. Запущен ли бэкенд?');
        setLoading(false);
      });
  }, []);

  return (
    <HeroContext.Provider value={{ heroes, loading, error }}>
      {children}
    </HeroContext.Provider>
  );
}

export const useHeroes = () => useContext(HeroContext);
