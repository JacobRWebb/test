import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomPokemon {
  id: string;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
  stats: {
    name: string;
    value: number;
  }[];
  createdAt: string;
}

interface CustomPokemonStore {
  customPokemons: CustomPokemon[];
  addCustomPokemon: (pokemon: Omit<CustomPokemon, 'id' | 'createdAt'>) => void;
  deleteCustomPokemon: (id: string) => void;
  updateCustomPokemon: (id: string, pokemon: Partial<CustomPokemon>) => void;
}

const useCustomPokemonStore = create<CustomPokemonStore>()(
  persist(
    (set) => ({
      customPokemons: [],
      addCustomPokemon: (pokemon) => 
        set((state) => ({
          customPokemons: [...state.customPokemons, {
            ...pokemon,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          }],
        })),
      deleteCustomPokemon: (id) =>
        set((state) => ({
          customPokemons: state.customPokemons.filter((p) => p.id !== id),
        })),
      updateCustomPokemon: (id, pokemon) =>
        set((state) => ({
          customPokemons: state.customPokemons.map((p) =>
            p.id === id ? { ...p, ...pokemon } : p
          ),
        })),
    }),
    {
      name: 'custom-pokemon-storage',
    }
  )
);

export default useCustomPokemonStore;
