export interface BattleStats {
  eliminations: number;
  assists: number;
  deaths: number;
  healing: number;
}

export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
  stats: { name: string; value: number }[];
}

export interface BattlePokemon extends Pokemon {
  stats: BattleStats;
  endorsements: number;
  isActive: boolean;
}

export interface BasicPokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  hp: number;
}

export interface Highlight {
  id: string;
  type: 'elimination' | 'multikill' | 'healing' | 'assist';
  attacker: Pokemon;
  victim?: Pokemon;
  description: string;
  timestamp: string;
}
