import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPokemonDetailData } from '@/lib/pokeapi';
import TypeBadge from '@/components/TypeBadge';
import PokemonCard from '@/components/PokemonCard';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

const statNamesJa: Record<string, string> = {
  hp: 'HP',
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  'special-attack': 'とくこう',
  'special-defense': 'とくぼう',
  speed: 'すばやさ'
};

export default async function PokemonDetail({ params }: DetailPageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  
  const [pokemon, prevPokemon, nextPokemon] = await Promise.all([
    getPokemonDetailData(numId),
    numId > 1 ? getPokemonDetailData(numId - 1) : Promise.resolve(null),
    numId < 1025 ? getPokemonDetailData(numId + 1) : Promise.resolve(null)
  ]);

  if (!pokemon) {
    notFound();
  }

  const formattedId = pokemon.id.toString().padStart(3, '0');
  
  // A color mapping for the background aura based on pokedex color
  // In a real app we could map this precisely to tailwind colors,
  // here we use generic slate or specific if matched
  const colorMap: Record<string, string> = {
    red: 'from-red-500/20 via-red-900/10 to-slate-950',
    blue: 'from-blue-500/20 via-blue-900/10 to-slate-950',
    yellow: 'from-yellow-500/20 via-yellow-900/10 to-slate-950',
    green: 'from-green-500/20 via-green-900/10 to-slate-950',
    black: 'from-gray-500/20 via-gray-900/10 to-slate-950',
    brown: 'from-amber-700/20 via-amber-900/10 to-slate-950',
    purple: 'from-purple-500/20 via-purple-900/10 to-slate-950',
    gray: 'from-slate-500/20 via-slate-900/10 to-slate-950',
    white: 'from-slate-200/20 via-slate-500/10 to-slate-950',
    pink: 'from-pink-500/20 via-pink-900/10 to-slate-950',
  };
  
  const bgGradient = colorMap[pokemon.colorName] || 'from-cyan-500/20 via-cyan-900/10 to-slate-950';

  return (
    <main className={`min-h-screen relative overflow-hidden bg-gradient-to-b ${bgGradient}`}>
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 py-12 md:py-24 relative z-10 max-w-5xl">
        {/* Header navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-md rounded-full text-slate-300 transition-colors mb-8 border border-slate-700/50 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          図鑑に戻る
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Image */}
          <div className="relative group">
            <div className="absolute inset-x-0 bottom-0 h-12 bg-black/40 blur-xl rounded-[50%] scale-x-75" />
            <div className="relative aspect-square flex items-center justify-center animate-bounce-slow">
              {pokemon.image && (
                <Image
                  src={pokemon.image}
                  alt={pokemon.nameJa}
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  priority
                />
              )}
            </div>
            
            <div className="mt-8 text-center text-slate-400 italic">
              &quot;{pokemon.flavorTextJa}&quot;
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
            <div className="mb-8">
              <div className="text-xl font-mono text-cyan-400 tracking-wider mb-2">
                #{formattedId}
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight text-white drop-shadow-md">
                {pokemon.nameJa}
              </h1>
              <div className="text-lg text-slate-400 capitalize mb-6 text-opacity-80">
                {pokemon.nameEn}
              </div>

              <div className="flex gap-3 mb-8">
                {pokemon.types.map(t => (
                  <TypeBadge key={t} type={t} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
              <div>
                <div className="text-sm text-slate-400 mb-1">高さ (Height)</div>
                <div className="text-2xl font-semibold text-slate-200">
                  {pokemon.height / 10} <span className="text-lg text-slate-500">m</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">重さ (Weight)</div>
                <div className="text-2xl font-semibold text-slate-200">
                  {pokemon.weight / 10} <span className="text-lg text-slate-500">kg</span>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                種族値 (Base Stats)
              </h3>
              <div className="space-y-4">
                {pokemon.stats.map(stat => (
                  <div key={stat.name} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-slate-400 font-medium">
                      {statNamesJa[stat.name] || stat.name}
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="w-8 text-right text-sm font-mono font-bold text-slate-300">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 border-t border-slate-800/50">
          <div>
            {prevPokemon && (
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-sm font-bold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  前のポケモン
                </span>
                <PokemonCard pokemon={prevPokemon} />
              </div>
            )}
          </div>
          <div>
            {nextPokemon && (
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-sm font-bold flex items-center justify-end gap-1">
                  次のポケモン
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
                <PokemonCard pokemon={nextPokemon} />
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
