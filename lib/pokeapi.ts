import { PokemonDetail, PokemonListResponse, PokemonSpecies, FormattedPokemon, FormattedPokemonDetail } from '@/types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit: number = 20, offset: number = 0): Promise<{ pokemons: FormattedPokemon[], total: number }> {
  try {
    const res = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const data: PokemonListResponse = await res.json();

    const pokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const idMatch = pokemon.url.match(/\/pokemon\/(\d+)\//);
        const id = idMatch ? parseInt(idMatch[1]) : 0;
        
        // Fetch detail and species in parallel
        const [detailRes, speciesRes] = await Promise.all([
          fetch(`${API_BASE}/pokemon/${id}`, { next: { revalidate: 86400 } }),
          fetch(`${API_BASE}/pokemon-species/${id}`, { next: { revalidate: 86400 } })
        ]);

        const detail: PokemonDetail = await detailRes.json();
        const species: PokemonSpecies = await speciesRes.json();

        // Extract Japanese name
        const jaNameEntry = species.names.find((n) => n.language.name === 'ja');
        const nameJa = jaNameEntry ? jaNameEntry.name : detail.name;

        // Extract Official Artwork
        const image = detail.sprites.other['official-artwork'].front_default || '';

        // Extract types
        const types = detail.types.map((t) => t.type.name);

        return {
          id: detail.id,
          nameEn: detail.name,
          nameJa,
          image,
          types,
        };
      })
    );

    return {
      pokemons,
      total: data.count
    };
  } catch (error) {
    console.error('Failed to fetch pokemon list:', error);
    return { pokemons: [], total: 0 };
  }
}

export async function getPokemonDetailData(id: number | string): Promise<FormattedPokemonDetail | null> {
  try {
    const [detailRes, speciesRes] = await Promise.all([
      fetch(`${API_BASE}/pokemon/${id}`, { next: { revalidate: 86400 } }),
      fetch(`${API_BASE}/pokemon-species/${id}`, { next: { revalidate: 86400 } })
    ]);

    if (!detailRes.ok || !speciesRes.ok) {
      return null;
    }

    const detail: PokemonDetail = await detailRes.json();
    const species: PokemonSpecies = await speciesRes.json();

    const jaNameEntry = species.names.find((n) => n.language.name === 'ja');
    const nameJa = jaNameEntry ? jaNameEntry.name : detail.name;

    const jaFlavorTextEntry = species.flavor_text_entries.find(
      (f) => f.language.name === 'ja'
    );
    // Replace newlines with spaces for clean display
    const flavorTextJa = jaFlavorTextEntry 
      ? jaFlavorTextEntry.flavor_text.replace(/\n|\f/g, ' ') 
      : '説明文が見つかりませんでした。';

    const image = detail.sprites.other['official-artwork'].front_default || '';
    const types = detail.types.map((t) => t.type.name);
    
    // Stats mapping
    const stats = detail.stats.map(s => ({
      name: s.stat.name,
      value: s.base_stat
    }));

    // Abilities mapping (fetching ja name could be another request, but for simplicity keep it English or fetch later if needed)
    const abilities = detail.abilities.map(a => a.ability.name);

    return {
      id: detail.id,
      nameEn: detail.name,
      nameJa,
      image,
      types,
      height: detail.height,
      weight: detail.weight,
      stats,
      abilities,
      flavorTextJa,
      colorName: species.color.name
    };
  } catch (error) {
    console.error(`Failed to fetch pokemon detail for ${id}:`, error);
    return null;
  }
}
