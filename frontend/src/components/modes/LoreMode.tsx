'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/utils/heroes';
import { useHeroes } from '@/contexts/HeroContext';
import { useGameHero } from '@/hooks/useGameHero';
import HeroSearch from '@/components/HeroSearch';
import HeroReveal from '@/components/HeroReveal';
import ShareButton from '@/components/ShareButton';

const MAX_ATTEMPTS = 4;

const HERO_LORE: Record<string, string[]> = {
  antimage: [
    'Он посвятил жизнь борьбе с магией...',
    'Когда-то молодой послушник, он стал свидетелем того, как монастырь сожгли маги...',
    'С клинками, поглощающими магическую энергию, он жаждет мести...',
    'Странствующий монах, ставший величайшим врагом магии.',
  ],
  axe: [
    'В армии Красного Тумана один солдат возвысился над всеми...',
    'Могул Хан, теперь просто Акс, был изгнан из своей армии...',
    'Он несёт хаос и разрушение везде, куда приходит...',
    'Акс смеётся в лицо опасности — и смотрит врагу в глаза.',
  ],
  crystal_maiden: [
    'Рождённая в королевстве вечной мерзлоты, она освоила криомантию...',
    'Её сестра управляет огнём, она — льдом...',
    'Изгнанная из родных краёв, она странствует в поисках цели...',
    'Кристальная Дева, также известная как Рилай, повелительница зимы.',
  ],
  invoker: [
    'Рождённый в эпоху легенд, этот архимаг выжил, освоив десять фундаментальных сил...',
    'Столетиями он учился у величайших магов мира...',
    'Он говорит о себе в третьем лице и считает большинство героев детьми...',
    'Карл, Инвокер, мастер кваса, векса и экзорта.',
  ],
  pudge: [
    'В те времена, когда город носил другое имя...',
    'Мясник бродит по полям сражений, добавляя плоть к своему жуткому телу...',
    'Его крюк летит точно, волоча жертв навстречу гибели...',
    'Пудж, омерзительный вурдалак, растущий с каждым убийством.',
  ],
  juggernaut: [
    'Последний выживший из древнего клана мечников...',
    'Он путешествует с вечно скрытым лицом, его личность неизвестна...',
    'Его клинок не останавливается, когда он входит в ярость...',
    'Юрнеро Джаггернаут, мастер Омниклеша.',
  ],
};

const DEFAULT_LORE = [
  'Легендарный герой вселенной Dota 2...',
  'Его силы вселяют страх по всему миру...',
  'С уникальными способностями и силой, он сражается за своё дело...',
  'Один из многих героев, борющихся за трон Древних.',
];

export default function LoreMode() {
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

  const heroSlug = currentHero?.name.replace('npc_dota_hero_', '') || '';
  const loreParts = HERO_LORE[heroSlug] || DEFAULT_LORE;
  const visibleLore = loreParts.slice(0, Math.min(1 + guesses.length, loreParts.length));
  const guessedIds = guesses.map(g => g.hero.id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gold-text">Режим лора</h2>
        <p className="text-gray-400 mt-1">Угадай героя по его предыстории</p>
      </div>

      <div className="panel p-6 glow-border space-y-3 max-w-lg mx-auto">
        <div className="text-dota-gold text-sm mb-3">📖 Лор героя</div>
        {visibleLore.map((lore, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }} className="text-gray-300 text-sm italic leading-relaxed">
            "{lore}"
          </motion.p>
        ))}
        {!won && !lost && visibleLore.length < loreParts.length && (
          <p className="text-gray-600 text-xs">Больше лора с каждой неверной попыткой...</p>
        )}
      </div>

      <div className="flex gap-1 justify-center">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <div key={i} className={`h-2 w-6 rounded-full ${
            i < guesses.length ? (guesses[i].correct ? 'bg-dota-green' : 'bg-gray-600') : 'bg-dota-border'
          }`} />
        ))}
      </div>

      {!won && !lost && (
        <HeroSearch heroes={heroes} onGuess={handleGuess} guessedIds={guessedIds} placeholder="Введи имя героя..." />
      )}

      {guesses.length > 0 && (
        <div className="space-y-1">
          {guesses.map(({ hero, correct }, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-4 py-2 rounded panel">
              <span>{correct ? '✅' : '❌'}</span>
              <span className="text-sm text-white">{hero.localized_name}</span>
            </motion.div>
          ))}
        </div>
      )}

      {(won || lost) && currentHero && (
        <div className="space-y-4">
          <HeroReveal hero={currentHero} won={won} attempts={guesses.length} />
          <div className="flex justify-center gap-3">
            <ShareButton text={`DotaGuess Лор\n${won ? `${guesses.length}/${MAX_ATTEMPTS}` : 'X'}`} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={nextHero} className="btn-gold">
              ➡️ Следующий герой
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
