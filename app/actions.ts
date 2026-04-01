'use server';

import { getPokemonList } from '@/lib/pokeapi';

export async function fetchMorePokemon(offset: number) {
  return await getPokemonList(20, offset);
}
