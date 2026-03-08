'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero, ATTR_LABELS } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';
import { useGameHero } from '@/hooks/useGameHero';
import HeroSearch from '@/components/HeroSearch';
import HeroReveal from '@/components/HeroReveal';
import ShareButton from '@/components/ShareButton';

const MAX_ATTEMPTS = 6;

const ATTR_EMOJI: Record<string, string> = {
  str: '💪', agi: '🏃', int: '🧠', all: '⭐',
};

const ROLE_EMOJI: Record<string, string> = {
  Carry: '💰', Support: '🛡️', Initiator: '⚡', Disabler: '🔒',
  Jungler: '🌲', Durable: '🏋️', Nuker: '💥', Pusher: '🏰', Escape: '💨',
};

const ROLE_RU: Record<string, string> = {
  Carry: 'Керри', Support: 'Саппорт', Initiator: 'Инициатор',
  Disabler: 'Контролёр', Jungler: 'Джанглер', Durable: 'Танк',
  Nuker: 'Нюкер', Pusher: 'Пушер', Escape: 'Мобильный',
};

function legsEmoji(n: number): string {
  if (n === 0) return '🐍';
  if (n === 2) return '🚶';
  if (n === 4) return '🐴';
  if (n === 6) return '🦂';
  if (n === 8) return '🕷️';
  return '❓';
}

function legsText(n: number): string {
  if (n === 0) return 'Без ног — парит или ползёт';
  if (n === 2) return '2 ноги — двуногий';
  if (n === 4) return '4 ноги — не человекоподобный';
  if (n === 6) return '6 ног — насекомое или существо';
  if (n === 8) return '8 ног — паук или подобное';
  return `${n} ног`;
}

function buildEmojis(hero: Hero): string[] {
  return [
    ATTR_EMOJI[hero.primary_attr] || '❓',
    hero.attack_type === 'Melee' ? '⚔️' : '🏹',
    ...hero.roles.slice(0, 2).map(r => ROLE_EMOJI[r] || '🎮'),
    legsEmoji(hero.legs),
  ];
}

function buildHints(hero: Hero): string[] {
  const rolesStr = hero.roles.map(r => `${ROLE_EMOJI[r] || ''} ${ROLE_RU[r] || r}`).join(', ');
  const attrRu = ATTR_LABELS[hero.primary_attr] || hero.primary_attr;
  return [
    `Роли: ${rolesStr}`,
    `Главный атрибут: ${ATTR_EMOJI[hero.primary_attr]} ${attrRu}`,
    `Тип атаки: ${hero.attack_type === 'Melee' ? '⚔️ Ближний бой' : '🏹 Дальний бой'}`,
    legsText(hero.legs),
    `Скорость передвижения: ${(hero as any).move_speed ?? '?'}`,
    `Количество ролей: ${hero.roles.length}`,
  ];
}

export default function EmojiMode() {
  const { heroes } = useHeroes();
  const { hero: currentHero, nextHero, playCount: playedCount } = useGameHero();
  const [guesses, setGuesses] = useState<{ hero: Hero; correct: boolean }[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    setGuesses([]);
    setWon(false);
    setLost(false);
  }, [playedCount, currentHero?.id]);

  function handleGuess(hero: Hero) {
    if (!currentHero || won || lost) return;
    const isCorrect = hero.id === currentHero.id;
    const newGuesses = [...guesses, { hero, correct: isCorrect }];
    setGuesses(newGuesses);
    if (isCorrect) setWon(true);
    else if (newGuesses.length >= MAX_ATTEMPTS) setLost(true);
  }

  const emojis = useMemo(() => currentHero ? buildEmojis(currentHero) : [], [currentHero]);
  const hints = useMemo(() => currentHero ? buildHints(currentHero) : [], [currentHero]);
  const wrongCount = guesses.filter(g => !g.correct).length;
  const visibleHints = hints.slice(0, Math.min(1 + wrongCount, hints.length));
  const guessedIds = guesses.map(g => g.hero.id);

  if (!currentHero) return null;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold gold-text">Режим эмодзи</h2>
        <p className="text-gray-400 mt-1 text-sm">Угадай героя по эмодзи и подсказкам</p>
      </div>

      {/* Эмодзи */}
      <div className="text-center panel p-5 sm:p-8 glow-border">
        <motion.div
          key={currentHero.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-4xl sm:text-6xl tracking-widest mb-2"
        >
          {emojis.join(' ')}
        </motion.div>
        <p className="text-gray-600 text-xs mt-2">атрибут · атака · роли · ноги</p>
      </div>

      {/* Подсказки */}
      <div className="panel p-4 space-y-2">
        <div className="text-dota-gold text-sm font-bold mb-2">
          💡 Подсказки ({visibleHints.length} из {hints.length})
        </div>
        <AnimatePresence>
          {visibleHints.map((hint, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-start gap-2 text-sm text-gray-300 py-1 border-b border-dota-border last:border-0"
            >
              <span className="text-dota-gold font-bold shrink-0">{i + 1}.</span>
              <span>{hint}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {!won && !lost && visibleHints.length < hints.length && (
          <p className="text-gray-600 text-xs pt-1">
            Новая подсказка с каждой ошибкой...
          </p>
        )}
      </div>

      {/* Прогресс */}
      <div className="flex gap-1 justify-center">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <div key={i} className={`h-2 w-6 rounded-full transition-colors ${
            i < guesses.length ? (guesses[i].correct ? 'bg-dota-green' : 'bg-gray-600') : 'bg-dota-border'
          }`} />
        ))}
      </div>

      {!won && !lost && (
        <>
          <p className="text-center text-gray-400 text-sm">Осталось попыток: {MAX_ATTEMPTS - guesses.length}</p>
          <HeroSearch heroes={heroes} onGuess={handleGuess} guessedIds={guessedIds} placeholder="Введи имя героя..." />
        </>
      )}

      {guesses.length > 0 && (
        <div className="space-y-1">
          {guesses.map(({ hero, correct }, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl panel">
              <span>{correct ? '✅' : '❌'}</span>
              <span className="text-sm text-white">{hero.localized_name}</span>
            </motion.div>
          ))}
        </div>
      )}

      {(won || lost) && (
        <div className="space-y-4">
          <HeroReveal hero={currentHero} won={won} attempts={guesses.length} />
          <div className="flex justify-center gap-3">
            <ShareButton text={`DotaGuess Эмодзи ${emojis.join('')}\n${won ? `${guesses.length}/${MAX_ATTEMPTS}` : 'X'}`} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
