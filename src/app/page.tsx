"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import PokemonModal from "@/components/PokemonModal";
import { motion } from "framer-motion";
import Link from "next/link";
import useCustomPokemonStore from "@/store/useCustomPokemonStore";
import PokemonGrid from "@/components/PokemonGrid";
import Navigation from "@/components/Navigation"; // Import Navigation component
import { Pokemon } from "@/types/pokemon";
import { PokemonClient } from "pokenode-ts";

const ITEMS_PER_PAGE = 24;
const api = new PokemonClient();

export default function Home() {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedPokemonForBattle, setSelectedPokemonForBattle] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const customPokemons = useCustomPokemonStore((state) => state.customPokemons);

  const fetchPokemons = async (offset: number) => {
    try {
      const response = await api.listPokemons(offset, ITEMS_PER_PAGE);
      
      if (offset + ITEMS_PER_PAGE >= response.count) {
        setHasMore(false);
      }

      const pokemonDetails = await Promise.all(
        response.results.map(async (pokemon) => {
          const detail = await api.getPokemonById(parseInt(pokemon.url.split('/').filter(Boolean).pop() || "0"));
          return {
            id: `api-${detail.id}`, // Add prefix to ensure uniqueness
            name: detail.name,
            imageUrl: detail.sprites.other?.["official-artwork"].front_default || "",
            types: detail.types.map((type) => type.type.name),
            hp: detail.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0,
            stats: detail.stats.map((stat) => ({
              name: stat.stat.name,
              value: stat.base_stat,
            })),
          };
        })
      );

      return pokemonDetails;
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      return [];
    }
  };

  const loadMorePokemons = useCallback(async () => {
    if (!isLoading && !isSearching && hasMore) {
      try {
        setIsLoading(true);
        const newPokemons = await fetchPokemons(offset);
        
        // Only update state if we got new Pokemon
        if (newPokemons.length > 0) {
          setPokemons(prev => {
            // Filter out any duplicates
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewPokemons = newPokemons.filter(p => !existingIds.has(p.id));
            return [...prev, ...uniqueNewPokemons];
          });
          setOffset(prev => prev + ITEMS_PER_PAGE);
        }
      } catch (error) {
        console.error('Error loading more pokemon:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [offset, isLoading, isSearching, hasMore]);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      setIsSearching(true);

      if (!query) {
        const allPokemon = [
          ...customPokemons.map(p => ({
            ...p,
            id: `custom-${p.id}` // Add prefix to ensure uniqueness
          })),
          ...pokemons
        ];
        setFilteredPokemons(allPokemon);
        setIsSearching(false);
        return;
      }

      const normalizedQuery = query.toLowerCase();
      const allPokemon = [
        ...customPokemons.map(p => ({
          ...p,
          id: `custom-${p.id}` // Add prefix to ensure uniqueness
        })),
        ...pokemons
      ];
      
      const filtered = allPokemon.filter((pokemon) => {
        return (
          pokemon.name.toLowerCase().includes(normalizedQuery) ||
          pokemon.types.some((type) =>
            type.toLowerCase().includes(normalizedQuery)
          )
        );
      });

      setFilteredPokemons(filtered);
      setIsSearching(false);
    },
    [customPokemons, pokemons]
  );

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectedPokemonForBattle(prev => {
      if (prev.some(p => p.id === pokemon.id)) {
        return prev.filter(p => p.id !== pokemon.id);
      }
      if (prev.length >= 2) {
        return [prev[1], pokemon];
      }
      return [...prev, pokemon];
    });
  };

  const handleBattle = () => {
    if (selectedPokemonForBattle.length === 2) {
      router.push(
        `/battle?pokemon1=${selectedPokemonForBattle[0].id}&pokemon2=${selectedPokemonForBattle[1].id}`
      );
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      const initialPokemons = await fetchPokemons(0);
      setPokemons(initialPokemons);
      setFilteredPokemons([
        ...customPokemons.map(p => ({
          ...p,
          id: `custom-${p.id}`
        })),
        ...initialPokemons
      ]);
      setOffset(ITEMS_PER_PAGE); // Update offset after initial load
      setIsLoading(false);
    };

    initialLoad();
  }, [customPokemons]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation
        selectedPokemon={selectedPokemonForBattle}
        onBattle={handleBattle}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            <PokemonGrid
              pokemons={searchQuery ? filteredPokemons : [
                ...customPokemons.map(p => ({
                  ...p,
                  id: `custom-${p.id}`
                })),
                ...pokemons
              ]}
              isLoading={isLoading}
              onPokemonClick={handlePokemonSelect}
              onViewDetails={setSelectedPokemon}
              selectedPokemon={selectedPokemonForBattle.map(p => p.id)}
              onLoadMore={loadMorePokemons}
              hasMore={hasMore && !searchQuery}
              isSearching={isSearching}
            />

            {selectedPokemon && (
              <PokemonModal
                pokemon={selectedPokemon}
                onClose={() => setSelectedPokemon(null)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
