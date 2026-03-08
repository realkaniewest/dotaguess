'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/play', label: 'Играть' },
  { href: '/stats', label: 'Статистика' },
  { href: '/leaderboard', label: 'Таблица лидеров' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dota-border bg-dota-dark/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <span className="text-xl font-bold gold-text">DotaGuess</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-3 py-1.5 rounded text-sm transition-colors',
                pathname === link.href
                  ? 'bg-dota-gold/20 text-dota-gold border border-dota-gold/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
