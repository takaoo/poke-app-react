import React from 'react';
import Image from 'next/image';

export const typeConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  normal: { label: 'ノーマル', bg: 'bg-gray-400/20', text: 'text-gray-200', border: 'border-gray-500' },
  fire: { label: 'ほのお', bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/50' },
  water: { label: 'みず', bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/50' },
  electric: { label: 'でんき', bg: 'bg-yellow-400/20', text: 'text-yellow-300', border: 'border-yellow-400/50' },
  grass: { label: 'くさ', bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/50' },
  ice: { label: 'こおり', bg: 'bg-cyan-300/20', text: 'text-cyan-300', border: 'border-cyan-300/50' },
  fighting: { label: 'かくとう', bg: 'bg-orange-700/20', text: 'text-orange-400', border: 'border-orange-700/50' },
  poison: { label: 'どく', bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/50' },
  ground: { label: 'じめん', bg: 'bg-yellow-700/20', text: 'text-yellow-600', border: 'border-yellow-700/50' },
  flying: { label: 'ひこう', bg: 'bg-indigo-400/20', text: 'text-indigo-300', border: 'border-indigo-400/50' },
  psychic: { label: 'エスパー', bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/50' },
  bug: { label: 'むし', bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/50' },
  rock: { label: 'いわ', bg: 'bg-yellow-800/20', text: 'text-yellow-700', border: 'border-yellow-800/50' },
  ghost: { label: 'ゴースト', bg: 'bg-purple-800/20', text: 'text-purple-400', border: 'border-purple-800/50' },
  dragon: { label: 'ドラゴン', bg: 'bg-indigo-600/20', text: 'text-indigo-400', border: 'border-indigo-600/50' },
  dark: { label: 'あく', bg: 'bg-gray-800/40', text: 'text-gray-300', border: 'border-gray-700' },
  steel: { label: 'はがね', bg: 'bg-slate-400/20', text: 'text-slate-300', border: 'border-slate-500' },
  fairy: { label: 'フェアリー', bg: 'bg-pink-300/20', text: 'text-pink-200', border: 'border-pink-400/50' },
  // fallback
  unknown: { label: 'はてな', bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500' }
};

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const config = typeConfig[type] || typeConfig.unknown;
  
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${config.bg} ${config.text} ${config.border}`}>
      {type !== 'unknown' && (
        <Image
          src={`/type-icons/${type}.svg`}
          alt={config.label}
          width={14}
          height={14}
          className="opacity-90"
        />
      )}
      {config.label}
    </span>
  );
}
