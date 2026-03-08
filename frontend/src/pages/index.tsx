import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useHeroes } from '@/contexts/HeroContext';
import Head from 'next/head';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const MODES = [
  { icon: '⚔️', name: 'Классика', desc: 'Угадывай героя по подсказкам-сравнениям', href: '/play?mode=hero' },
  { icon: '🌑', name: 'Силуэт', desc: 'Угадай героя по его тени', href: '/play?mode=silhouette' },
  { icon: '✨', name: 'Способности', desc: 'Угадай по иконкам способностей', href: '/play?mode=ability' },
  { icon: '⚡', name: 'Ультимейт', desc: 'Показывается только ультимейт', href: '/play?mode=ultimate' },
  { icon: '📊', name: 'Статистика', desc: 'Угадай по характеристикам героя', href: '/play?mode=stat' },
  { icon: '🎭', name: 'Эмодзи', desc: 'Герой описан с помощью эмодзи', href: '/play?mode=emoji' },
  { icon: '📖', name: 'Лор', desc: 'Угадай по отрывкам из биографии', href: '/play?mode=lore' },
  { icon: '🎒', name: 'Предметы', desc: 'Угадай по типичной сборке предметов', href: '/play?mode=item' },
];

export default function Home() {
  const { heroes, loading } = useHeroes();

  return (
    <>
      <Head>
        <title>DotaGuess - Игра на угадывание героев Dota 2</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Шапка */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚔️</div>
          <h1 className="text-3xl sm:text-5xl font-bold gold-text mb-3 sm:mb-4">DotaGuess</h1>
          <p className="text-base sm:text-xl text-gray-400 mb-2">Игра на угадывание героев Dota 2</p>
          <p className="text-gray-500">
            {loading ? 'Загрузка...' : `${heroes.length} героев • Угадывай бесконечно`}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-4 py-2 panel rounded-full text-xs sm:text-sm text-gray-400"
          >
            <span className="w-2 h-2 bg-dota-green rounded-full animate-pulse" />
            Сыграй столько раундов, сколько хочешь!
          </motion.div>
        </motion.div>

        {/* Кнопка играть */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8 sm:mb-12"
        >
          <Link href="/play" className="btn-gold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
            🎮 Играть
          </Link>
        </motion.div>

        {/* Сетка режимов */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12"
        >
          {MODES.map(mode => (
            <motion.div key={mode.name} variants={item}>
              <Link href={mode.href} className="mode-card block p-3 sm:p-4 rounded-xl cursor-pointer">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{mode.icon}</div>
                <div className="font-bold text-white text-sm sm:text-base mb-0.5 sm:mb-1">{mode.name}</div>
                <div className="text-xs text-gray-400 hidden sm:block">{mode.desc}</div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Как играть */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="panel p-4 sm:p-6 glow-border"
        >
          <h2 className="text-lg sm:text-xl font-bold gold-text mb-3 sm:mb-4 text-center">Как играть</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 text-sm text-gray-300">
            <div>
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-white mb-1">Угадывай героя</h3>
              <p>Введи имя героя и отправь ответ. После каждой попытки появятся цветные подсказки.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🟩🟨⬛</div>
              <h3 className="font-bold text-white mb-1">Читай подсказки</h3>
              <p>Зелёный = совпадает. Жёлтый = частично совпадает. Серый = не совпадает.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔁</div>
              <h3 className="font-bold text-white mb-1">Играй бесконечно</h3>
              <p>Угадал — сразу появляется новый герой. Никаких ограничений на количество раундов!</p>
            </div>
          </div>
        </motion.div>

        {/* Подвал */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>by realkaniewest</p>
        </div>
      </div>
    </>
  );
}
