import { FC } from 'react';
import { FixedSizeList } from 'react-window';
import { motion, AnimatePresence } from 'framer-motion';
import PokemonCard from './PokemonCard';
import useWindowSize from '@/hooks/useWindowSize';

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
}

interface HorizontalPokemonListProps {
  pokemons: Pokemon[];
  onPokemonSelect: (id: number) => void;
  onViewDetails: (pokemon: Pokemon) => void;
  selectedPokemon: number[];
  loadMoreRef?: (node?: Element | null) => void;
}

const HorizontalPokemonList: FC<HorizontalPokemonListProps> = ({
  pokemons,
  onPokemonSelect,
  onViewDetails,
  selectedPokemon,
  loadMoreRef,
}) => {
  const { width } = useWindowSize();
  const itemWidth = 300;
  const itemHeight = 450;
  const listHeight = itemHeight + 20; // Add padding

  const Row = ({ index, style }: any) => {
    const pokemon = pokemons[index];
    if (!pokemon) return null;

    const isLast = index === pokemons.length - 1;

    return (
      <div 
        style={style} 
        ref={isLast ? loadMoreRef : undefined}
        className="px-2"
      >
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <PokemonCard
            id={pokemon.id}
            name={pokemon.name}
            imageUrl={pokemon.imageUrl}
            types={pokemon.types}
            hp={pokemon.hp}
            onClick={() => onPokemonSelect(pokemon.id)}
            onViewDetails={() => onViewDetails(pokemon)}
            isSelected={selectedPokemon.includes(pokemon.id)}
          />
        </motion.div>
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <AnimatePresence>
        <FixedSizeList
          height={listHeight}
          itemCount={pokemons.length}
          itemSize={itemWidth}
          width={width - 48} // Account for page padding
          layout="horizontal"
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          overscanCount={3}
        >
          {Row}
        </FixedSizeList>
      </AnimatePresence>
    </div>
  );
};

export default HorizontalPokemonList;
