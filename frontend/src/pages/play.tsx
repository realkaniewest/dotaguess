import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useHeroes } from '@/contexts/HeroContext';
import HeroGuessMode from '@/components/modes/HeroGuessMode';
import SilhouetteMode from '@/components/modes/SilhouetteMode';
import AbilityMode from '@/components/modes/AbilityMode';
import StatMode from '@/components/modes/StatMode';
import EmojiMode from '@/components/modes/EmojiMode';
import LoreMode from '@/components/modes/LoreMode';
import ItemMode from '@/components/modes/ItemMode';

const MODES = [
  { id: 'hero', icon: '⚔️', label: 'Классика' },
  { id: 'silhouette', icon: '🌑', label: 'Силуэт' },
  { id: 'ability', icon: '✨', label: 'Способности' },
  { id: 'ultimate', icon: '⚡', label: 'Ультимейт' },
  { id: 'stat', icon: '📊', label: 'Статистика' },
  { id: 'emoji', icon: '🎭', label: 'Эмодзи' },
  { id: 'lore', icon: '📖', label: 'Лор' },
  { id: 'item', icon: '🎒', label: 'Предметы' },
];

function ModeComponent({ mode }: { mode: string }) {
  switch (mode) {
    case 'hero': return <HeroGuessMode />;
    case 'silhouette': return <SilhouetteMode />;
    case 'ability': return <AbilityMode />;
    case 'ultimate': return <AbilityMode ultimateOnly />;
    case 'stat': return <StatMode />;
    case 'emoji': return <EmojiMode />;
    case 'lore': return <LoreMode />;
    case 'item': return <ItemMode />;
    default: return <HeroGuessMode />;
  }
}

export default function PlayPage() {
  const router = useRouter();
  const { loading, error } = useHeroes();
  const [activeMode, setActiveMode] = useState('hero');

  useEffect(() => {
    const mode = router.query.mode as string;
    if (mode && MODES.find(m => m.id === mode)) {
      setActiveMode(mode);
    }
  }, [router.query.mode]);

  function handleModeChange(modeId: string) {
    setActiveMode(modeId);
    router.push(`/play?mode=${modeId}`, undefined, { shallow: true });
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">Бэкенд не подключён</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <p className="text-gray-500 text-sm">
          Убедись, что бэкенд запущен: <code className="text-dota-gold">cd backend && npm start</code>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⚔️</div>
          <p className="text-gray-400">Загружаем героев...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>DotaGuess - Играть</title>
      </Head>

      <div className="max-w-3xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* Выбор режима */}
        <div className="flex overflow-x-auto gap-1 sm:gap-2 pb-2 mb-3 sm:mb-6 scrollbar-hide">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeMode === mode.id
                  ? 'bg-dota-gold/20 text-dota-gold border border-dota-gold/50 font-bold'
                  : 'bg-dota-panel border border-dota-border text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Контент режима */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="panel p-3 sm:p-6"
          >
            <ModeComponent mode={activeMode} />
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-4 sm:mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← На главную
          </Link>
        </div>
      </div>
    </>
  );
}
