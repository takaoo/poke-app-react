import { getPokemonList } from '@/lib/pokeapi';
import PokemonList from '@/components/PokemonList';
import { GENERATIONS } from '@/lib/constants';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const genParam = typeof searchParams.gen === 'string' ? parseInt(searchParams.gen, 10) : 1;
  const currentGen = GENERATIONS.find(g => g.id === genParam) || GENERATIONS[0];

  // Fetch the Pokemon for the selected generation
  const { pokemons, total } = await getPokemonList(currentGen.limit, currentGen.offset);

  return (
    <main className="min-h-screen pb-24 flex flex-col items-center">
      <PokemonList initialPokemons={pokemons} currentGen={currentGen} total={total} />
    </main>
  );
}
