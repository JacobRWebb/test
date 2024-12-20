import { FC } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon } from '@/types/pokemon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPokemon: Pokemon[];
  onBattle: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, selectedPokemon, onBattle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-6"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <Link
                  href="/create"
                  className="block w-full px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Custom Pokemon
                </Link>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Battle Status</h3>
                  {selectedPokemon.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        {selectedPokemon.length === 1
                          ? "Select one more Pokemon to battle!"
                          : "Ready to battle!"}
                      </p>
                      <div className="flex flex-col gap-2">
                        {selectedPokemon.map((pokemon) => (
                          <div
                            key={pokemon.id}
                            className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                          >
                            <div className="w-10 h-10 relative">
                              <img
                                src={pokemon.imageUrl}
                                alt={pokemon.name}
                                className="object-contain"
                              />
                            </div>
                            <span className="capitalize">{pokemon.name}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={onBattle}
                        disabled={selectedPokemon.length !== 2}
                        className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors
                          ${
                            selectedPokemon.length === 2
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                      >
                        Battle!
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Select Pokemon to start a battle!
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-auto">
                <Link
                  href="/arena"
                  className="block w-full px-4 py-3 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Visit Battle Arena
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
