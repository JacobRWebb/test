import { FC } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PokemonModalProps {
  pokemon: {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
    hp: number;
    stats: {
      name: string;
      value: number;
    }[];
    height: number;
    weight: number;
    abilities: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modal = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const PokemonModal: FC<PokemonModalProps> = ({ pokemon, isOpen, onClose }) => {
  if (!pokemon) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <motion.h2 
                  className="text-4xl font-bold capitalize text-gray-800"
                  layoutId={`title-${pokemon.name}`}
                >
                  {pokemon.name}
                </motion.h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative h-64 md:h-80 bg-gray-50 rounded-xl p-4">
                  <Image
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Base Stats</h3>
                    <div className="space-y-4">
                      {pokemon.stats.map(stat => (
                        <div key={stat.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="capitalize text-gray-700 font-medium">{stat.name}</span>
                            <span className="font-bold text-gray-900">{stat.value}</span>
                          </div>
                          <motion.div 
                            className="h-3 bg-gray-100 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.div
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(stat.value / 255) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            />
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Details</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Height</p>
                        <p className="text-xl font-bold text-gray-900">{pokemon.height / 10}m</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Weight</p>
                        <p className="text-xl font-bold text-gray-900">{pokemon.weight / 10}kg</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Abilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities?.map((ability, index) => (
                        <motion.span
                          key={ability}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 font-medium capitalize"
                        >
                          {ability}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PokemonModal;
