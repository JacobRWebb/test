'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pokemon } from '@/types/pokemon';
import Link from 'next/link';
import PokemonBattleCard from '@/components/PokemonBattleCard';
import BattleHighlight from '@/components/BattleHighlight';
import BattleStatistics from '@/components/BattleStatistics';

interface BattleStats {
  eliminations: number;
  assists: number;
  deaths: number;
  healing: number;
}

interface BattlePokemon extends Pokemon {
  stats: BattleStats;
  endorsements: number;
  isActive: boolean;
}

interface Highlight {
  id: string;
  type: 'elimination' | 'multikill' | 'healing' | 'assist';
  attacker: Pokemon;
  victim?: Pokemon;
  description: string;
  timestamp: string;
}

interface Team {
  name: string;
  pokemon: BattlePokemon[];
  score: number;
}

export default function ArenaPage() {
  const [teams, setTeams] = useState<[Team, Team]>([
    { name: 'TEAM 1', pokemon: [], score: 0 },
    { name: 'TEAM 2', pokemon: [], score: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchTime, setMatchTime] = useState(900); // 15 minutes in seconds
  const [mapName, setMapName] = useState('POKEMON STADIUM');
  const [currentView, setCurrentView] = useState<'overview' | 'statistics' | 'highlights'>('overview');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [stayAsTeamVotes, setStayAsTeamVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const fetchRandomPokemon = async (count: number): Promise<BattlePokemon[]> => {
    const pokemon: BattlePokemon[] = [];
    const maxPokemonId = 898;

    while (pokemon.length < count) {
      const id = Math.floor(Math.random() * maxPokemonId) + 1;
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        
        pokemon.push({
          id: data.id,
          name: data.name,
          imageUrl: data.sprites.other['official-artwork'].front_default,
          types: data.types.map((type: { type: { name: string } }) => type.type.name),
          hp: data.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'hp').base_stat,
          stats: data.stats.map((stat: { base_stat: number; stat: { name: string } }) => ({
            name: stat.name,
            value: stat.base_stat,
          })),
          // Add battle stats
          isActive: false,
          endorsements: Math.floor(Math.random() * 5) + 1,
          stats: {
            eliminations: Math.floor(Math.random() * 30),
            assists: Math.floor(Math.random() * 15),
            deaths: Math.floor(Math.random() * 10),
            healing: data.types.includes('grass') ? Math.floor(Math.random() * 8000) : 0,
          }
        });
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    }
    return pokemon;
  };

  const generateHighlights = (team1: BattlePokemon[], team2: BattlePokemon[]) => {
    const allHighlights: Highlight[] = [];
    const allPokemon = [...team1, ...team2];

    // Generate elimination highlights
    allPokemon.forEach(attacker => {
      if (attacker.stats.eliminations > 0) {
        const victims = allPokemon.filter(p => p.id !== attacker.id);
        for (let i = 0; i < attacker.stats.eliminations; i++) {
          const victim = victims[Math.floor(Math.random() * victims.length)];
          const minutes = Math.floor(Math.random() * 15);
          const seconds = Math.floor(Math.random() * 60);

          allHighlights.push({
            id: `${attacker.id}-${victim.id}-${i}`,
            type: attacker.stats.eliminations >= 3 ? 'multikill' : 'elimination',
            attacker,
            victim,
            description: attacker.stats.eliminations >= 3 
              ? `${attacker.name} achieved a multi-elimination!`
              : `${attacker.name} eliminated ${victim.name}`,
            timestamp: `${minutes}:${seconds.toString().padStart(2, '0')}`,
          });
        }
      }
    });

    // Generate healing highlights
    allPokemon
      .filter(p => p.stats.healing > 0)
      .forEach(healer => {
        allHighlights.push({
          id: `healing-${healer.id}`,
          type: 'healing',
          attacker: healer,
          description: `${healer.name} provided exceptional healing support!`,
          timestamp: `${Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        });
      });

    // Sort highlights by timestamp
    return allHighlights.sort((a, b) => {
      const [aMin, aSec] = a.timestamp.split(':').map(Number);
      const [bMin, bSec] = b.timestamp.split(':').map(Number);
      return (aMin * 60 + aSec) - (bMin * 60 + bSec);
    });
  };

  const initializeTeams = async () => {
    setIsLoading(true);
    const team1 = await fetchRandomPokemon(10);
    const team2 = await fetchRandomPokemon(10);
    
    setTeams([
      { name: 'TEAM 1', pokemon: team1, score: 2 },
      { name: 'TEAM 2', pokemon: team2, score: 1 },
    ]);

    // Generate highlights after teams are set
    setHighlights(generateHighlights(team1, team2));
    setIsLoading(false);
  };

  useEffect(() => {
    initializeTeams();
  }, []);

  // Update match time
  useEffect(() => {
    const timer = setInterval(() => {
      setMatchTime(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStayAsTeam = () => {
    if (!hasVoted) {
      setStayAsTeamVotes(prev => Math.min(prev + 1, 5));
      setHasVoted(true);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'statistics':
        return <BattleStatistics team1={teams[0].pokemon} team2={teams[1].pokemon} />;
      case 'highlights':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map(highlight => (
              <div
                key={highlight.id}
                onClick={() => setSelectedHighlight(highlight)}
                className="cursor-pointer"
              >
                <BattleHighlight
                  highlight={highlight}
                  onClose={() => {}}
                />
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-2 gap-8">
            {/* Team 1 */}
            <div className="space-y-2">
              {teams[0].pokemon.map((pokemon) => (
                <PokemonBattleCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  team="red"
                  isActive={pokemon.isActive}
                  stats={pokemon.stats}
                  endorsements={pokemon.endorsements}
                />
              ))}
            </div>

            {/* Team 2 */}
            <div className="space-y-2">
              {teams[1].pokemon.map((pokemon) => (
                <PokemonBattleCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  team="blue"
                  isActive={pokemon.isActive}
                  stats={pokemon.stats}
                  endorsements={pokemon.endorsements}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-white">QUICK PLAY</div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 bg-black bg-opacity-50 px-6 py-2 rounded">
              <div className="text-4xl font-bold text-white">{teams[0].score}</div>
              <div className="text-xl font-bold text-gray-400">{mapName}</div>
              <div className="text-xl font-bold text-gray-400">{formatTime(matchTime)}</div>
              <div className="text-4xl font-bold text-white">{teams[1].score}</div>
            </div>
            <Link
              href="/"
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors uppercase font-bold"
            >
              Leave Match
            </Link>
          </div>
        </div>

        {/* Main Content */}
        {renderContent()}

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center text-white">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 rounded transition-colors ${
                currentView === 'overview' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('statistics')}
              className={`px-4 py-2 rounded transition-colors ${
                currentView === 'statistics' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setCurrentView('highlights')}
              className={`px-4 py-2 rounded transition-colors ${
                currentView === 'highlights' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Highlights
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">STAY AS TEAM?</span>
            <button
              onClick={handleStayAsTeam}
              disabled={hasVoted}
              className={`px-6 py-2 rounded transition-colors ${
                hasVoted ? 'bg-gray-600' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              YES
            </button>
            <div className="text-2xl font-bold">
              {stayAsTeamVotes}<span className="text-gray-400">/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Modal */}
      {selectedHighlight && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <BattleHighlight
              highlight={selectedHighlight}
              onClose={() => setSelectedHighlight(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
