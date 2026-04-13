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
  backstory: string;
  stats: PlayerStats;
  backgroundQuestions: QA[];
  connectionQuestions: QA[];
}

export interface GameTime {
  era: string;
  year: number;
  month: string;
  day: number;
  hour?: number;
  minute?: number;
}

export type EventType = 'location_change' | 'achievement' | 'drawback' | 'npc_meet' | 'combat' | 'general';
export type SagaArc = 'arc_1_intro' | 'arc_2_shadows' | 'arc_3_revelation';

export interface PCNote {
  pcId: string;
  note: string;
}

export interface TimelineData {
  title: string;
  subtitle: string;
  description: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: GameTime;
  type: EventType;
  sagaArc?: SagaArc;
  description: string;
  pcNotes?: PCNote[];
  locationId?: string;
  npcIds?: string[];
}

export interface Quest {
  title: string;
  status: 'active' | 'completed' | 'pending';
  locationId?: string;
  description?: string;
}

export interface WantedPerson {
  name: string;
  reward: string;
  image: string;
  lastSeenLocation?: string;
}

export interface HomeHeader {
  title: string;
  description: string;
  navBrand: string;
}

export interface HomeData {
  header?: HomeHeader;
  nextSession?: string;
  activeQuest?: Quest;
  questList?: Quest[];
  mostWanted?: WantedPerson[];
  lastLocationId?: string;
  nextDestinationId?: string;
}

export interface CampaignData {
  home: HomeData;
  locations: Location[];
  timeline: TimelineData;
  players: Player[];
  npcs: NPC[];
}
