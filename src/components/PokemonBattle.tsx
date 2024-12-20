import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
  stats: {
    name: string;
    value: number;
  }[];
}

interface BattleState {
  hp1: number;
  hp2: number;
  logs: string[];
  isFinished: boolean;
  winner?: Pokemon;
  currentTurn: number;
  isAnimating: boolean;
  lastMove?: {
    attacker: number;
    damage: number;
    isCritical: boolean;
  };
}

const PokemonBattle: FC<{
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  onBattleEnd: () => void;
}> = ({ pokemon1, pokemon2, onBattleEnd }) => {
  const [battleState, setBattleState] = useState<BattleState>({
    hp1: pokemon1.hp,
    hp2: pokemon2.hp,
    logs: [],
    isFinished: false,
    currentTurn: Math.random() < 0.5 ? 1 : 2, // Random first turn
    isAnimating: false
  });
  const [canMove, setCanMove] = useState(true);

  const addLog = (message: string) => {
    setBattleState(prev => ({
      ...prev,
      logs: [...prev.logs, message]
    }));
  };

  const calculateDamage = (attacker: Pokemon, defender: Pokemon) => {
    const attack = attacker.stats.find(stat => stat.name === 'attack')?.value || 0;
    const defense = defender.stats.find(stat => stat.name === 'defense')?.value || 0;
    const speed = attacker.stats.find(stat => stat.name === 'speed')?.value || 0;
    
    const baseDamage = Math.floor((attack * 0.5) * (100 / (defense + 50)));
    const variance = Math.random() * 0.2 + 0.9; // 0.9 to 1.1
    const isCritical = Math.random() < speed/512;
    const criticalMultiplier = isCritical ? 1.5 : 1;
    
    return {
      damage: Math.floor(baseDamage * variance * criticalMultiplier),
      isCritical
    };
  };

  const executeTurn = async () => {
    if (!canMove || battleState.isAnimating || battleState.isFinished) return;

    setCanMove(false);
    setBattleState(prev => ({ ...prev, isAnimating: true }));

    const attacker = battleState.currentTurn === 1 ? pokemon1 : pokemon2;
    const defender = battleState.currentTurn === 1 ? pokemon2 : pokemon1;
    const { damage, isCritical } = calculateDamage(attacker, defender);

    // Attack animation and damage calculation
    await new Promise(resolve => setTimeout(resolve, 500));

    setBattleState(prev => {
      const newHp = battleState.currentTurn === 1 
        ? Math.max(0, prev.hp2 - damage)
        : Math.max(0, prev.hp1 - damage);

      const isBattleFinished = newHp === 0;
      
      addLog(`${attacker.name} ${isCritical ? 'lands a critical hit and' : ''} deals ${damage} damage to ${defender.name}!`);
      if (isBattleFinished) {
        addLog(`${attacker.name} wins the battle!`);
      }
      
      return {
        ...prev,
        hp1: battleState.currentTurn === 2 ? newHp : prev.hp1,
        hp2: battleState.currentTurn === 1 ? newHp : prev.hp2,
        isFinished: isBattleFinished,
        winner: isBattleFinished ? attacker : undefined,
        lastMove: {
          attacker: battleState.currentTurn,
          damage,
          isCritical
        },
        isAnimating: false,
        currentTurn: isBattleFinished ? prev.currentTurn : (prev.currentTurn === 1 ? 2 : 1)
      };
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setCanMove(true);
  };

  useEffect(() => {
    addLog('Battle starts!');
    addLog(`${battleState.currentTurn === 1 ? pokemon1.name : pokemon2.name} goes first!`);
    setCanMove(true);
  }, []);

  const getHpPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Pokemon 1 */}
          <div className="relative">
            <motion.div
              animate={{
                x: battleState.currentTurn === 1 ? [0, 20, 0] : 0,
                scale: battleState.lastMove?.attacker === 2 && battleState.isAnimating ? 0.95 : 1,
                opacity: battleState.hp1 === 0 ? 0.5 : 1
              }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 relative overflow-hidden"
            >
              <h2 className="text-2xl font-bold mb-2 capitalize">{pokemon1.name}</h2>
              <div className="relative h-4 bg-gray-700 rounded-full mb-4">
                <motion.div
                  className="absolute h-full rounded-full"
                  style={{
                    backgroundColor: battleState.hp1 > pokemon1.hp * 0.5 ? '#10B981' : 
                                   battleState.hp1 > pokemon1.hp * 0.2 ? '#F59E0B' : '#EF4444'
                  }}
                  animate={{ width: `${getHpPercentage(battleState.hp1, pokemon1.hp)}%` }}
                  transition={{ type: 'spring' }}
                />
              </div>
              <div className="relative h-48">
                <Image
                  src={pokemon1.imageUrl}
                  alt={pokemon1.name}
                  fill
                  className="object-contain"
                />
              </div>
              {battleState.lastMove?.attacker === 2 && battleState.isAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-red-500 mix-blend-overlay"
                />
              )}
            </motion.div>
          </div>

          {/* Pokemon 2 */}
          <div className="relative">
            <motion.div
              animate={{
                x: battleState.currentTurn === 2 ? [0, -20, 0] : 0,
                scale: battleState.lastMove?.attacker === 1 && battleState.isAnimating ? 0.95 : 1,
                opacity: battleState.hp2 === 0 ? 0.5 : 1
              }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 relative overflow-hidden"
            >
              <h2 className="text-2xl font-bold mb-2 capitalize">{pokemon2.name}</h2>
              <div className="relative h-4 bg-gray-700 rounded-full mb-4">
                <motion.div
                  className="absolute h-full rounded-full"
                  style={{
                    backgroundColor: battleState.hp2 > pokemon2.hp * 0.5 ? '#10B981' : 
                                   battleState.hp2 > pokemon2.hp * 0.2 ? '#F59E0B' : '#EF4444'
                  }}
                  animate={{ width: `${getHpPercentage(battleState.hp2, pokemon2.hp)}%` }}
                  transition={{ type: 'spring' }}
                />
              </div>
              <div className="relative h-48">
                <Image
                  src={pokemon2.imageUrl}
                  alt={pokemon2.name}
                  fill
                  className="object-contain"
                />
              </div>
              {battleState.lastMove?.attacker === 1 && battleState.isAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-red-500 mix-blend-overlay"
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Battle Controls */}
        {!battleState.isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h3 className="text-xl font-semibold mb-4">
              {battleState.currentTurn === 1 ? pokemon1.name : pokemon2.name}'s Turn
            </h3>
            <button
              onClick={executeTurn}
              disabled={!canMove || battleState.isAnimating}
              className={`px-6 py-3 rounded-lg font-semibold text-white
                         transition-all duration-200
                         ${canMove && !battleState.isAnimating
                           ? 'bg-blue-600 hover:bg-blue-700'
                           : 'bg-gray-600 cursor-not-allowed'}`}
            >
              Attack!
            </button>
          </motion.div>
        )}

        {/* Battle Log */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Battle Log</h3>
          <div className="h-48 overflow-y-auto space-y-2">
            <AnimatePresence>
              {battleState.logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-gray-300 ${
                    log.includes('critical hit') ? 'text-yellow-400 font-semibold' : ''
                  }`}
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {battleState.isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              {battleState.winner?.name} Wins!
            </h2>
            <button
              onClick={onBattleEnd}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold
                         transition-colors duration-200"
            >
              Return to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PokemonBattle;
