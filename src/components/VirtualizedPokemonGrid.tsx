import { FC, useEffect, useState, useRef, useCallback } from "react";
import { FixedSizeList } from "react-window";
import { motion, AnimatePresence } from "framer-motion";
import PokemonCard from "./PokemonCard";
import useWindowSize from "@/hooks/useWindowSize";
import { Pokemon } from "@/types/pokemon";
import dynamic from "next/dynamic";

interface VirtualizedPokemonGridProps {
  pokemons: Pokemon[];
  onPokemonSelect: (id: number) => void;
  onViewDetails: (pokemon: Pokemon) => void;
  selectedPokemon: number[];
  onLoadMore: () => void;
  isLoading: boolean;
  isSearching: boolean;
}

const VirtualizedPokemonGrid: FC<VirtualizedPokemonGridProps> = ({
  pokemons,
  onPokemonSelect,
  onViewDetails,
  selectedPokemon,
  onLoadMore,
  isLoading,
  isSearching,
}) => {
  const { width, height: windowHeight = 800 } = useWindowSize();
  const [columnCount, setColumnCount] = useState(4);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<FixedSizeList>(null);
  const loadingRef = useRef(false);

  // Reset loading ref when isLoading changes
  useEffect(() => {
    if (!isLoading) {
      loadingRef.current = false;
    }
  }, [isLoading]);

  // Calculate item dimensions
  const itemHeight = 450; // Height of each Pokemon card
  const itemWidth = Math.min(300, (width - 48) / columnCount); // Width of each card, with padding

  // Calculate rows needed
  const rowCount = Math.ceil(pokemons.length / columnCount);

  const onScroll = useCallback(
    ({
      scrollOffset,
      scrollUpdateWasRequested,
    }: {
      scrollOffset: number;
      scrollUpdateWasRequested: boolean;
    }) => {
      if (
        !scrollUpdateWasRequested &&
        !isLoading &&
        !isSearching &&
        !loadingRef.current
      ) {
        const scrollHeight = rowCount * itemHeight;
        const scrollThreshold = scrollHeight - windowHeight;

        if (scrollOffset >= scrollThreshold - 200) {
          loadingRef.current = true;
          onLoadMore();
        }
      }
    },
    [rowCount, itemHeight, windowHeight, onLoadMore, isLoading, isSearching]
  );

  const onItemsRendered = useCallback(
    ({ visibleStopIndex }: { visibleStopIndex: number }) => {
      if (
        visibleStopIndex === rowCount - 1 &&
        !isLoading &&
        !isSearching &&
        !loadingRef.current
      ) {
        loadingRef.current = true;
        onLoadMore();
      }
    },
    [rowCount, onLoadMore, isLoading, isSearching]
  );

  // Update column count based on screen width
  useEffect(() => {
    if (width < 640) setColumnCount(1);
    else if (width < 1024) setColumnCount(2);
    else if (width < 1280) setColumnCount(3);
    else setColumnCount(4);
  }, [width]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && listRef.current && listRef.current.resetAfterIndex) {
      listRef.current.resetAfterIndex(0);
    }
  }, [width, columnCount, mounted]);

  if (!mounted) {
    return <div className="w-full h-[800px]" />; // Initial height placeholder
  }

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const startIndex = index * columnCount;
    const rowPokemons = pokemons.slice(startIndex, startIndex + columnCount);

    return (
      <div
        style={{
          ...style,
          display: "grid",
          gap: "1.5rem",
          padding: "0.75rem",
        }}
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {rowPokemons.map((pokemon, colIndex) => (
          <motion.div
            key={pokemon.id}
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
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        <FixedSizeList
          ref={listRef}
          height={Math.min(rowCount * itemHeight, windowHeight - 200)}
          itemCount={rowCount}
          itemSize={itemHeight}
          width="100%"
          className="no-scrollbar"
          overscanCount={2}
          onScroll={onScroll}
          onItemsRendered={onItemsRendered}
        >
          {Row}
        </FixedSizeList>
      </AnimatePresence>
    </div>
  );
};

export default dynamic(() => Promise.resolve(VirtualizedPokemonGrid), {
  ssr: false,
});
