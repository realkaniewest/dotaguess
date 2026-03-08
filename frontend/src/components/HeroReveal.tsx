'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Hero, ATTR_LABELS } from '@/utils/heroes';

interface HeroRevealProps {
  hero: Hero;
  won: boolean;
  attempts: number;
}

export default function HeroReveal({ hero, won, attempts }: HeroRevealProps) {
  const heroName = hero.name.replace('npc_dota_hero_', '');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="text-center panel p-4 sm:p-6 glow-border"
    >
      <div className="text-3xl sm:text-4xl mb-2">{won ? '🏆' : '💀'}</div>
      <h2 className="text-lg sm:text-2xl font-bold gold-text mb-3 sm:mb-4">
        {won ? `Угадал с ${attempts} ${attempts === 1 ? 'попытки' : 'попыток'}!` : 'Не повезло, попробуй ещё раз!'}
      </h2>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <motion.img
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName}.png`}
          alt={hero.localized_name}
          className="w-24 sm:w-32 h-14 sm:h-20 object-cover rounded-lg border-2 border-dota-gold"
          onError={e => { (e.target as HTMLImageElement).src = '/placeholder-hero.png'; }}
        />
        <div className="text-left">
          <div className="text-lg sm:text-2xl font-bold text-white">{hero.localized_name}</div>
          <div className={`text-base sm:text-lg attr-${hero.primary_attr}`}>{ATTR_LABELS[hero.primary_attr]}</div>
          <div className="text-gray-400 text-xs sm:text-sm">{hero.attack_type === 'Melee' ? 'Ближний бой' : 'Дальний бой'}</div>
          <div className="text-gray-400 text-xs sm:text-sm">{hero.roles.join(', ')}</div>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        Нажми «Следующий герой» чтобы продолжить!
      </div>
    </motion.div>
  );
}
