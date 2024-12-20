import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';

interface Highlight {
  id: string;
  type: 'elimination' | 'multikill' | 'healing' | 'assist';
  attacker: Pokemon;
  victim?: Pokemon;
  description: string;
  timestamp: string;
}

interface BattleHighlightProps {
  highlight: Highlight;
  onClose: () => void;
}

const BattleHighlight: FC<BattleHighlightProps> = ({ highlight, onClose }) => {
  const getHighlightColor = (type: Highlight['type']) => {
    switch (type) {
      case 'elimination':
        return 'from-red-600 to-red-900';
      case 'multikill':
        return 'from-purple-600 to-purple-900';
      case 'healing':
        return 'from-green-600 to-green-900';
      case 'assist':
        return 'from-blue-600 to-blue-900';
      default:
        return 'from-gray-600 to-gray-900';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative w-full bg-gradient-to-br ${getHighlightColor(highlight.type)} 
                  p-6 rounded-lg shadow-xl text-white`}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white opacity-50 hover:opacity-100"
      >
        ✕
      </button>

      <div className="flex items-center gap-6">
        {/* Attacker */}
        <div className="relative">
          <div className="w-20 h-20 relative"
               style={{
                 clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
               }}>
            <Image
              src={highlight.attacker.imageUrl}
              alt={highlight.attacker.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-2 text-center font-bold uppercase">
            {highlight.attacker.name}
          </div>
        </div>

        {/* Action Icon */}
        <div className="text-4xl">
          {highlight.type === 'elimination' && '💥'}
          {highlight.type === 'multikill' && '⚔️'}
          {highlight.type === 'healing' && '💖'}
          {highlight.type === 'assist' && '🤝'}
        </div>

        {/* Victim (if applicable) */}
        {highlight.victim && (
          <div className="relative">
            <div className="w-20 h-20 relative"
                 style={{
                   clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                 }}>
              <Image
                src={highlight.victim.imageUrl}
                alt={highlight.victim.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-2 text-center font-bold uppercase">
              {highlight.victim.name}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-lg">{highlight.description}</p>
        <p className="text-sm text-gray-300 mt-2">{highlight.timestamp}</p>
      </div>
    </motion.div>
  );
};

export default BattleHighlight;
