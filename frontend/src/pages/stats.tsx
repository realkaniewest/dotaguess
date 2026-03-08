import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { getStats, GameStats } from '@/utils/storage';
import Link from 'next/link';

export default function StatsPage() {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats) return null;

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const maxDist = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <>
      <Head>
        <title>DotaGuess - Статистика</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="text-3xl font-bold gold-text text-center">Твоя статистика</h1>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Сыграно', value: stats.gamesPlayed },
              { label: '% побед', value: `${winRate}%` },
              { label: 'Серия', value: stats.currentStreak },
              { label: 'Лучшая серия', value: stats.maxStreak },
            ].map(stat => (
              <div key={stat.label} className="panel p-4 text-center">
                <div className="text-3xl font-bold gold-text">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="panel p-6">
            <h2 className="text-lg font-bold text-white mb-4">Распределение попыток</h2>
            <div className="space-y-2">
              {Object.entries(stats.guessDistribution).map(([guess, count]) => (
                <div key={guess} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-4 text-right">{guess}</span>
                  <div className="flex-1 h-6 bg-dota-dark rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxDist) * 100}%` }}
                      transition={{ duration: 0.5, delay: parseInt(guess) * 0.05 }}
                      className="h-full bg-dota-gold rounded flex items-center justify-end pr-2"
                      style={{ minWidth: count > 0 ? '24px' : '0' }}
                    >
                      {count > 0 && <span className="text-black text-xs font-bold">{count}</span>}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {stats.gamesPlayed === 0 && (
            <div className="text-center text-gray-400 panel p-8">
              <div className="text-4xl mb-3">📊</div>
              <p>Ты ещё не сыграл ни одной игры!</p>
              <Link href="/play" className="btn-gold inline-block mt-4">
                Играть
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
