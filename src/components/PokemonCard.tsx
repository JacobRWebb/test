import { FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PokemonCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
  onClick?: () => void;
  onViewDetails?: () => void;
  isSelected?: boolean;
}

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-300',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-blue-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-600',
  dragon: 'bg-purple-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-400',
};

const PokemonCard: FC<PokemonCardProps> = ({
  id,
  name,
  imageUrl,
  types,
  hp,
  onClick,
  onViewDetails,
  isSelected = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-xl overflow-hidden
                 ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
                 bg-white shadow-xl transition-all duration-200`}
      layout
    >
      <div className="p-4">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain"
            priority={typeof id === 'number' && id <= 12} // Only prioritize first 12 Pokemon
            quality={75}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/pokemon-placeholder.png'; // Use local placeholder
            }}
          />
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-bold capitalize mb-2 text-gray-900">{name}</h2>
          <div className="flex gap-2 mb-2">
            {types.map((type) => (
              <span
                key={`${name}-${id}-${type}`}
                className={`px-2 py-1 rounded-full text-white text-sm ${typeColors[type] || 'bg-gray-400'}`}
              >
                {type}
              </span>
            ))}
          </div>
          <div className="flex items-center mb-4">
            <span className="text-gray-600 font-medium">HP:</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full ml-2">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(hp / 255) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {onViewDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600
                         transition-colors duration-200 text-sm font-medium"
              >
                View Details
              </button>
            )}
            {onClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium
                          ${isSelected 
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
              >
                {isSelected ? 'Deselect' : 'Select for Battle'}
              </button>
            )}
          </div>
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full
                       flex items-center justify-center text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PokemonCard;
