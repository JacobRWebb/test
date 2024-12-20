import { FC } from 'react';
import { motion } from 'framer-motion';
import { BattlePokemon } from '@/types/pokemon';

interface BattleStatisticsProps {
  team1: BattlePokemon[];
  team2: BattlePokemon[];
}

const BattleStatistics: FC<BattleStatisticsProps> = ({ team1, team2 }) => {
  const getTeamStats = (team: BattlePokemon[]) => {
    return {
      totalEliminations: team.reduce((sum, p) => sum + p.stats.eliminations, 0),
      totalAssists: team.reduce((sum, p) => sum + p.stats.assists, 0),
      totalDeaths: team.reduce((sum, p) => sum + p.stats.deaths, 0),
      totalHealing: team.reduce((sum, p) => sum + p.stats.healing, 0),
      avgEndorsement: team.reduce((sum, p) => sum + p.endorsements, 0) / team.length,
    };
  };

  const team1Stats = getTeamStats(team1);
  const team2Stats = getTeamStats(team2);

  const StatRow = ({ label, value1, value2 }: { label: string; value1: number; value2: number }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
      <div className="text-right font-mono text-blue-400">{value1}</div>
      <div className="text-center text-gray-400">{label}</div>
      <div className="text-left font-mono text-red-400">{value2}</div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-center text-white mb-6">Team Statistics</h2>
      
      <div className="space-y-4">
        <StatRow 
          label="ELIMINATIONS"
          value1={team1Stats.totalEliminations}
          value2={team2Stats.totalEliminations}
        />
        <StatRow 
          label="ASSISTS"
          value1={team1Stats.totalAssists}
          value2={team2Stats.totalAssists}
        />
        <StatRow 
          label="DEATHS"
          value1={team1Stats.totalDeaths}
          value2={team2Stats.totalDeaths}
        />
        <StatRow 
          label="HEALING"
          value1={team1Stats.totalHealing}
          value2={team2Stats.totalHealing}
        />
        <StatRow 
          label="AVG ENDORSEMENT"
          value1={Math.round(team1Stats.avgEndorsement * 10) / 10}
          value2={Math.round(team2Stats.avgEndorsement * 10) / 10}
        />
      </div>

      {/* Team Performance Comparison */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-center text-white mb-4">Team Performance</h3>
        <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ 
              width: `${(team1Stats.totalEliminations / (team1Stats.totalEliminations + team2Stats.totalEliminations)) * 100}%`
            }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BattleStatistics;
