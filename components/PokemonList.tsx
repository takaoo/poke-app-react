'use client';

import React, { useState, useMemo } from 'react';
import PokemonCard from './PokemonCard';
import { FormattedPokemon } from '@/types/pokemon';
import { typeConfig } from './TypeBadge';
import { GENERATIONS, Generation } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';

interface PokemonListProps {
  initialPokemons: FormattedPokemon[];
  total: number;
  currentGen: Generation;
}

export default function PokemonList({ initialPokemons, total, currentGen }: PokemonListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Derived state: filter pokemons based on search query and selected types
  const filteredPokemons = useMemo(() => {
    return initialPokemons.filter((pokemon) => {
      // 1. Text Search (matches Japanese name, English name, or ID)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        pokemon.nameJa.includes(query) || 
        pokemon.nameEn.toLowerCase().includes(query) ||
        pokemon.id.toString().includes(query);

      // 2. Type Filter
      const matchesType = 
        selectedTypes.length === 0 || 
        selectedTypes.every(type => pokemon.types.includes(type)); // OR use .some() for looser filtering

      return matchesSearch && matchesType;
    });
  }, [initialPokemons, searchQuery, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const availableTypes = Object.keys(typeConfig).filter(t => t !== 'unknown');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sticky Header with Search and Filters */}
      <div className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 pb-6 pt-4 px-4 md:px-8 shadow-xl shadow-black/50 mb-8 flex flex-col items-center">
        
        {/* Generation Tabs */}
        <div className="w-full max-w-7xl flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2 border-b border-slate-800/50 scroll-smooth">
          {GENERATIONS.map((gen) => (
            <Link 
              key={gen.id} 
              href={`/?gen=${gen.id}`}
              scroll={false} // Prevent jumping to top if not wanted, but next.js top by default is fine
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                currentGen.id === gen.id 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(8,145,178,0.2)]'
                  : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {gen.name}
            </Link>
          ))}
        </div>

        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 items-center justify-between mb-6">
          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-500 tracking-tighter drop-shadow-sm min-w-max">
            ポケモン図鑑
          </h1>
          
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-full text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              placeholder="ポケモンを探す... (名前・ID等)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className="w-full max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedTypes([])}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                selectedTypes.length === 0 
                  ? 'bg-slate-200 text-slate-900 border-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              すべて
            </button>
            {availableTypes.map((type) => {
              const config = typeConfig[type];
              const isSelected = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-300 flex items-center gap-1.5 ${
                    isSelected 
                      ? `${config.bg.replace('/20', '/40')} ${config.text} ${config.border} shadow-[0_0_10px_currentColor] scale-105` 
                      : `bg-slate-800/30 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300`
                  }`}
                >
                  <Image
                    src={`/type-icons/${type}.svg`}
                    alt={config.label}
                    width={14}
                    height={14}
                    className={`opacity-90 ${!isSelected && 'grayscale opacity-50'}`}
                  />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="w-full max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between text-slate-400 text-sm">
          <div>表示件数: <span className="font-bold text-slate-200">{filteredPokemons.length}</span> / {currentGen.limit} 匹</div>
          {filteredPokemons.length === 0 && (
            <button onClick={() => { setSearchQuery(''); setSelectedTypes([]); }} className="text-cyan-400 hover:underline">フィルターをクリア</button>
          )}
        </div>

        {filteredPokemons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 mb-6 opacity-20 relative">
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-slate-400 w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
                <path d="M5 50h30m30 0h30" stroke="currentColor" strokeWidth="5" />
                <circle cx="50" cy="50" r="15" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">見つかりませんでした</h3>
            <p className="text-slate-500">条件を変えてもう一度検索してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
