export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface PokemonSpeciesName {
  language: NamedAPIResource;
  name: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  names: PokemonSpeciesName[];
  flavor_text_entries: PokemonSpeciesFlavorText[];
  color: NamedAPIResource;
}

export interface FormattedPokemon {
  id: number;
  nameEn: string;
  nameJa: string;
  image: string;
  types: string[];
}

export interface FormattedPokemonDetail extends FormattedPokemon {
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
  abilities: string[];
  flavorTextJa: string;
  colorName: string;
}
