'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ShareButtonProps {
  text: string;
}

export default function ShareButton({ text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="btn-gold flex items-center gap-2"
    >
      <span>{copied ? '✅ Скопировано!' : '📋 Поделиться'}</span>
    </motion.button>
  );
}
