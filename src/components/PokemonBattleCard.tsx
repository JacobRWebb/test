import { FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BattlePokemon, BattleStats } from '@/types/pokemon';

interface PokemonBattleCardProps {
  pokemon: BattlePokemon;
  team: 'red' | 'blue';
  isActive: boolean;
  stats: BattleStats;
  endorsements: number;
}

const PokemonBattleCard: FC<PokemonBattleCardProps> = ({
  pokemon,
  team,
  isActive,
  stats,
  endorsements,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fire':
        return '🔥';
      case 'water':
        return '💧';
      case 'grass':
        return '🌿';
      case 'electric':
        return '⚡';
      case 'psychic':
        return '🔮';
      case 'fighting':
        return '👊';
      case 'rock':
        return '🪨';
      case 'ground':
        return '🌍';
      case 'flying':
        return '🦅';
      case 'bug':
        return '🐛';
      case 'poison':
        return '☠️';
      case 'normal':
        return '⭐';
      case 'ghost':
        return '👻';
      case 'dragon':
        return '🐉';
      case 'ice':
        return '❄️';
      case 'dark':
        return '🌑';
      case 'steel':
        return '⚔️';
      case 'fairy':
        return '🧚';
      default:
        return '❓';
    }
  };

  const getRole = (types: string[]) => {
    if (types.includes('grass')) return 'support';
    if (['fire', 'electric', 'dragon'].some(t => types.includes(t))) return 'damage';
    if (['rock', 'steel', 'ice'].some(t => types.includes(t))) return 'tank';
    return 'flex';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'support':
        return '💖';
      case 'damage':
        return '⚔️';
      case 'tank':
        return '🛡️';
      default:
        return '🔄';
    }
  };

  const role = getRole(pokemon.types);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center gap-4 p-4 rounded-lg ${
        team === 'red' ? 'bg-gradient-to-r from-red-900 to-red-800' : 'bg-gradient-to-r from-blue-900 to-blue-800'
      }`}
    >
      {/* Pokemon Portrait */}
      <div className="relative">
        <div
          className="w-16 h-16 relative overflow-hidden"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          <Image
            src={pokemon.imageUrl}
            alt={pokemon.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full p-1">
          {getRoleIcon(role)}
        </div>
      </div>

      {/* Pokemon Info */}
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-white uppercase">{pokemon.name}</h3>
            <div className="flex gap-1 mt-1">
              {pokemon.types.map((type) => (
                <span key={type} className="text-sm">{getTypeIcon(type)}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(endorsements)].map((_, i) => (
              <div key={i} className="text-yellow-500">⭐</div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-2 text-sm">
          <div className="text-red-400">{stats.eliminations}</div>
          <div className="text-blue-400">{stats.assists}</div>
          <div className="text-gray-400">{stats.deaths}</div>
          {stats.healing > 0 && (
            <div className="text-green-400">{Math.floor(stats.healing / 1000)}k</div>
          )}
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-yellow-400 rounded-full" />
      )}
    </motion.div>
  );
};

export default PokemonBattleCard;
