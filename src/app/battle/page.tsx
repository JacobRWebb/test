'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PokemonBattle from '@/components/PokemonBattle';

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
  stats: {
    name: string;
    value: number;
  }[];
}

export default function BattlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const id1 = searchParams.get('pokemon1');
        const id2 = searchParams.get('pokemon2');

        if (!id1 || !id2) {
          router.push('/');
          return;
        }

        const [res1, res2] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id1}`),
          fetch(`https://pokeapi.co/api/v2/pokemon/${id2}`)
        ]);

        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        const createPokemonObject = (data: any): Pokemon => ({
          id: data.id,
          name: data.name,
          imageUrl: data.sprites.other['official-artwork'].front_default,
          types: data.types.map((type: { type: { name: string } }) => type.type.name),
          hp: data.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'hp').base_stat,
          stats: data.stats.map((stat: { base_stat: number; stat: { name: string } }) => ({
            name: stat.stat.name,
            value: stat.base_stat
          }))
        });

        setPokemon1(createPokemonObject(data1));
        setPokemon2(createPokemonObject(data2));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        router.push('/');
      }
    };

    fetchPokemon();
  }, [searchParams, router]);

  if (isLoading || !pokemon1 || !pokemon2) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <PokemonBattle
      pokemon1={pokemon1}
      pokemon2={pokemon2}
      onBattleEnd={() => router.push('/')}
    />
  );
}
