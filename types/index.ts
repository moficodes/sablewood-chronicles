export interface QA {
  question: string;
  answer: string;
}

export interface MemorableInteraction {
  description: string;
  highlight?: string;
  pcInvolved?: string;
  pcsInvolved?: string[];
}

export interface Location {
  id: string;
  name: string;
  region: string;
  description: string;
  images?: string[];
  memorableInteractions?: MemorableInteraction[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  location: string;
  description: string;
  image?: string;
  attitudeTowardParty?: string;
  memorableInteractions?: MemorableInteraction[];
}

export interface PlayerStats {
  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;
}

export interface Player {
  id: string;
  name: string;
  image: string;
  ancestry: string;
  community: string;
  class: string;
  subclass: string;
  level: number;
  tier: number;
  description: string;
  stats: PlayerStats;
  backgroundQuestions: QA[];
  connectionQuestions: QA[];
}
