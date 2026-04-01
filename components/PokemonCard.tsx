import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FormattedPokemon } from '@/types/pokemon';
import TypeBadge from './TypeBadge';

interface PokemonCardProps {
  pokemon: FormattedPokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const formattedId = pokemon.id.toString().padStart(3, '0');

  return (
    <Link 
      href={`/pokemon/${pokemon.id}`}
      className="group relative block rounded-2xl p-[1px] bg-gradient-to-b from-slate-700/50 to-slate-900/50 hover:from-slate-500/50 hover:to-slate-700/50 transition-colors duration-300 overflow-hidden shadow-lg shadow-black/20 hover:shadow-cyan-500/10"
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl z-0 rounded-2xl" />
      
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />

      <div className="relative z-20 flex flex-col p-5 items-center justify-center gap-4 h-full">
        {/* ID Bubble */}
        <div className="absolute top-4 left-4 text-xs font-mono font-bold text-slate-500 tracking-wider">
          #{formattedId}
        </div>

        {/* Pokemon Image Area */}
        <div className="relative w-32 h-32 flex items-center justify-center -mt-2 group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-500 ease-out">
          <div className="absolute inset-x-0 bottom-0 h-4 bg-black/40 blur-md rounded-[50%] scale-x-75 group-hover:scale-x-90 group-hover:bg-cyan-500/30 transition-all duration-500" />
          {pokemon.image ? (
            <Image
              src={pokemon.image}
              alt={pokemon.nameJa}
              width={160}
              height={160}
              className="drop-shadow-2xl z-10"
              priority={pokemon.id <= 20} // priority load first ones
            />
          ) : (
            <div className="text-slate-600">No Image</div>
          )}
        </div>

        {/* Info Area */}
        <div className="text-center mt-2 w-full space-y-3">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
            {pokemon.nameJa}
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
