export interface QA {
  question: string;
  answer: string;
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
