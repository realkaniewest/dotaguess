import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LeaderboardEntry {
  rank: number;
  name: string;
  streak: number;
  gamesWon: number;
  winRate: number;
  isYou?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Invoker_Pro', streak: 47, gamesWon: 89, winRate: 94 },
  { rank: 2, name: 'PudgeMaster', streak: 32, gamesWon: 76, winRate: 87 },
  { rank: 3, name: 'AntimageGod', streak: 28, gamesWon: 65, winRate: 82 },
  { rank: 4, name: 'CrystalFan', streak: 21, gamesWon: 58, winRate: 78 },
  { rank: 5, name: 'AxeEnjoyer', streak: 18, gamesWon: 52, winRate: 75 },
  { rank: 6, name: 'SlarkHunter', streak: 15, gamesWon: 48, winRate: 71 },
  { rank: 7, name: 'PhantomKing', streak: 12, gamesWon: 43, winRate: 68 },
  { rank: 8, name: 'LionLord', streak: 9, gamesWon: 38, winRate: 64 },
  { rank: 9, name: 'DrowArcher', streak: 7, gamesWon: 34, winRate: 61 },
  { rank: 10, name: 'StormSpirit', streak: 5, gamesWon: 29, winRate: 58 },
];

const RANK_COLORS: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dotaguess_stats');
      if (stored) {
        const stats = JSON.parse(stored);
        if (stats.gamesWon > 0) {
          const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
          const youEntry: LeaderboardEntry = {
            rank: 0, name: 'Вы', streak: stats.currentStreak || 0,
            gamesWon: stats.gamesWon || 0, winRate, isYou: true,
          };
          const sorted = [...MOCK_LEADERBOARD, youEntry]
            .sort((a, b) => b.winRate - a.winRate || b.gamesWon - a.gamesWon)
            .map((e, i) => ({ ...e, rank: i + 1 }));
          setLeaderboard(sorted);
        }
      }
    } catch {}
  }, []);

  return (
    <>
      <Head>
        <title>DotaGuess - Таблица лидеров</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold gold-text">🏆 Таблица лидеров</h1>
            <p className="text-gray-400 mt-2">Лучшие игроки DotaGuess</p>
          </div>

          <div className="panel overflow-hidden">
            <div className="grid grid-cols-5 gap-3 px-4 py-3 border-b border-dota-border text-xs text-gray-500 uppercase">
              <div>#</div>
              <div className="col-span-2">Игрок</div>
              <div className="text-center">Серия</div>
              <div className="text-center">% побед</div>
            </div>

            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-5 gap-3 px-4 py-3 items-center border-b border-dota-border/50 transition-colors ${
                  entry.isYou ? 'bg-dota-gold/10 border-dota-gold/20' : 'hover:bg-white/3'
                }`}
              >
                <div className="font-bold text-lg" style={{ color: RANK_COLORS[entry.rank] || '#9ca3af' }}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-dota-panel border border-dota-border flex items-center justify-center text-sm">
                    {entry.name[0]}
                  </div>
                  <span className={`font-medium ${entry.isYou ? 'text-dota-gold' : 'text-white'}`}>
                    {entry.name}
                    {entry.isYou && <span className="ml-1 text-xs text-dota-gold">(ты)</span>}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-orange-400 font-bold">🔥 {entry.streak}</span>
                </div>
                <div className="text-center">
                  <span className="text-dota-green font-bold">{entry.winRate}%</span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-xs">
            Играй больше, чтобы подняться выше в таблице!
          </p>

          <div className="flex justify-center">
            <Link href="/play" className="btn-gold">
              Сыграть ещё
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
