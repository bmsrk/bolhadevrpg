export type Attribute = 'Wit' | 'Craft' | 'Social' | 'Luck';

export interface Attributes {
  Wit: number;
  Craft: number;
  Social: number;
  Luck: number;
}

export interface CharacterArchetype {
  id: string;
  name: string;
  starting_attributes: Attributes;
  special: string;
  description: string;
}

export interface Item {
  name: string;
  effect: string;
  id: string;
}

export interface Enemy {
  id: string;
  name: string;
  desc: string;
  abilities: string[];
  loot: string[];
  hp: number; // Added for mechanics
  stats: Attributes; // Added for mechanics
}

export interface Location {
  id: string;
  name: string;
  desc: string;
}

export interface GameState {
  screen: 'START' | 'CLASS_SELECT' | 'EXPLORE' | 'COMBAT' | 'EVENT' | 'GAME_OVER' | 'VICTORY';
  player: {
    archetype: CharacterArchetype | null;
    hp: number;
    maxHp: number; // "Sanity"
    attributes: Attributes;
    inventory: Item[];
    followers: number;
  };
  currentLocation: Location;
  currentEnemy: Enemy | null;
  questProgress: number;
  logs: LogEntry[];
  turn: number;
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'combat' | 'dialogue' | 'system' | 'success' | 'failure';
  sender?: string;
}
