'use client';

import CreatePokemonForm from '@/components/CreatePokemonForm';
import useCustomPokemonStore from '@/store/useCustomPokemonStore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PokemonCard from '@/components/PokemonCard';

export default function CreatePage() {
  const customPokemons = useCustomPokemonStore((state) => state.customPokemons);
  const deleteCustomPokemon = useCustomPokemonStore((state) => state.deleteCustomPokemon);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Create Pokemon</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700
                     transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <section>
            <CreatePokemonForm />
          </section>

          {/* Custom Pokemon List Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Custom Pokemon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customPokemons.map((pokemon) => (
                <motion.div
                  key={pokemon.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  <button
                    onClick={() => deleteCustomPokemon(pokemon.id)}
                    className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full
                               hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <PokemonCard
                    id={parseInt(pokemon.id)}
                    name={pokemon.name}
                    imageUrl={pokemon.imageUrl}
                    types={pokemon.types}
                    hp={pokemon.hp}
                    onClick={() => {}}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
