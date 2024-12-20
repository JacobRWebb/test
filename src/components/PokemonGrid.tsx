import { FC, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PokemonCard from './PokemonCard';
import { Pokemon } from '@/types/pokemon';

interface Pokemon {
  id: string | number;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
}

interface PokemonGridProps {
  pokemons: Pokemon[];
  isLoading: boolean;
  onPokemonClick: (pokemon: Pokemon) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isSearching: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PokemonGrid: FC<PokemonGridProps> = ({ 
  pokemons, 
  isLoading, 
  onPokemonClick, 
  onLoadMore,
  hasMore,
  isSearching 
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isSearching) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore, isSearching]);

  return (
    <>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {pokemons.map((pokemon) => (
          <motion.div
            key={`${pokemon.name}-${pokemon.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => onPokemonClick(pokemon)}
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <PokemonCard
              name={pokemon.name}
              imageUrl={pokemon.imageUrl}
              types={pokemon.types}
              hp={pokemon.hp}
              id={typeof pokemon.id === 'string' ? parseInt(pokemon.id.replace('custom-', '')) : pokemon.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading States */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={`loading-skeleton-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 h-[350px]"
            >
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Observer */}
      {!isSearching && hasMore && (
        <div ref={observerTarget} className="h-20" />
      )}

      {/* End of List States */}
      {!hasMore && !isLoading && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-4 mb-8"
        >
          You've caught 'em all! No more Pokémon to load.
        </motion.p>
      )}
    </>
  );
};

export default PokemonGrid;
