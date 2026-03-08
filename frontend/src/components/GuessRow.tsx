'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { GuessHint, ATTR_LABELS } from '@/utils/heroes';
import clsx from 'clsx';

interface GuessRowProps {
  guess: GuessHint;
  index: number;
}

const ATTACK_TYPE_RU: Record<string, string> = {
  Melee: 'Ближний',
  Ranged: 'Дальний',
};

function legsRu(n: number): string {
  if (n === 0) return 'Нет';
  if (n === 2) return '2 ноги';
  if (n === 4) return '4 ноги';
  if (n === 6) return '6 ног';
  if (n === 8) return '8 ног';
  return `${n}`;
}

function HintCell({ value, status, label }: { value: string | number | string[]; status: string; label: string }) {
  const cls = clsx('hint-cell flex-1', {
    'hint-correct': status === 'correct',
    'hint-partial': status === 'partial',
    'hint-wrong': status === 'wrong',
  });
  const displayValue = Array.isArray(value) ? value.join(', ') : String(value);

  return (
    <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
      <span className="text-[9px] sm:text-xs text-gray-500 text-center">{label}</span>
      <div className={cls}>
        <span className="text-[9px] sm:text-xs leading-tight">{displayValue}</span>
      </div>
    </div>
  );
}

export default function GuessRow({ guess, index }: GuessRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-stretch gap-1 sm:gap-2"
    >
      {/* Портрет героя */}
      <div className="flex flex-col gap-0.5 sm:gap-1 w-14 sm:w-20 shrink-0">
        <span className="text-[9px] sm:text-xs text-gray-500 text-center">Герой</span>
        <div className="flex flex-col items-center justify-center bg-dota-panel border border-dota-border rounded-lg sm:rounded-xl p-0.5 sm:p-1 min-h-[40px] sm:min-h-[48px]">
          <img
            src={`/heroes/${guess.slug}.png`}
            alt={guess.name}
            className="w-12 sm:w-16 h-7 sm:h-9 object-cover rounded-md sm:rounded-lg"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-center leading-tight mt-0.5 sm:mt-1 text-gray-300" style={{ fontSize: '8px' }}>
            {guess.name}
          </span>
        </div>
      </div>

      {/* Атрибут */}
      <HintCell
        value={ATTR_LABELS[guess.hints.primary_attr.value] || guess.hints.primary_attr.value}
        status={guess.hints.primary_attr.status}
        label="Атрибут"
      />

      {/* Тип атаки */}
      <HintCell
        value={ATTACK_TYPE_RU[guess.hints.attack_type.value] || guess.hints.attack_type.value}
        status={guess.hints.attack_type.status}
        label="Атака"
      />

      {/* Роли */}
      <HintCell
        value={guess.hints.roles.value}
        status={guess.hints.roles.status}
        label="Роли"
      />

      {/* Ноги */}
      <HintCell
        value={legsRu(guess.hints.legs.value)}
        status={guess.hints.legs.status}
        label="Ноги"
      />

      {guess.correct && (
        <div className="flex items-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="text-lg sm:text-2xl"
          >
            ✅
          </motion.span>
        </div>
      )}
    </motion.div>
  );
}
