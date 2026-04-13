import { FieldSchema, EntitySchema } from '../schema';

export const QASchema: FieldSchema = {
  type: 'object',
  label: 'Q&A',
  fields: {
    question: { type: 'string', label: 'Question' },
    answer: { type: 'textarea', label: 'Answer' }
  }
};

export const MemorableInteractionSchema: FieldSchema = {
  type: 'object',
  label: 'Interaction',
  fields: {
    description: { type: 'textarea', label: 'Description' },
    highlight: { type: 'string', label: 'Highlight', optional: true },
    pcInvolved: { type: 'string', label: 'PC Involved (Single)', optional: true },
    pcsInvolved: { 
      type: 'array', 
      label: 'PCs Involved', 
      optional: true,
      itemSchema: { type: 'string', label: 'PC Name' }
    }
  }
};

export const LocationSchema: EntitySchema = {
  name: { type: 'string', label: 'Name' },
  region: { type: 'string', label: 'Region' },
  description: { type: 'textarea', label: 'Description' },
  images: { 
    type: 'array', 
    label: 'Images', 
    optional: true,
    itemSchema: { type: 'string', label: 'Image URL' }
  },
  memorableInteractions: {
    type: 'array',
    label: 'Memorable Interactions',
    optional: true,
    itemSchema: MemorableInteractionSchema
  }
};

export const NPCSchema: EntitySchema = {
  name: { type: 'string', label: 'Name' },
  role: { type: 'string', label: 'Role' },
  location: { type: 'string', label: 'Location' },
  description: { type: 'textarea', label: 'Description' },
  image: { type: 'string', label: 'Image URL', optional: true },
  attitudeTowardParty: { type: 'string', label: 'Attitude', optional: true },
  memorableInteractions: {
    type: 'array',
    label: 'Memorable Interactions',
    optional: true,
    itemSchema: MemorableInteractionSchema
  }
};

export const PlayerSchema: EntitySchema = {
  name: { type: 'string', label: 'Name' },
  image: { type: 'string', label: 'Image URL' },
  ancestry: { type: 'string', label: 'Ancestry' },
  community: { type: 'string', label: 'Community' },
  class: { type: 'string', label: 'Class' },
  subclass: { type: 'string', label: 'Subclass' },
  level: { type: 'number', label: 'Level' },
  tier: { type: 'number', label: 'Tier' },
  description: { type: 'textarea', label: 'Description' },
  backstory: { type: 'textarea', label: 'Backstory' },
  stats: {
    type: 'object',
    label: 'Stats',
    fields: {
      agility: { type: 'number', label: 'Agility' },
      strength: { type: 'number', label: 'Strength' },
      finesse: { type: 'number', label: 'Finesse' },
      instinct: { type: 'number', label: 'Instinct' },
      presence: { type: 'number', label: 'Presence' },
      knowledge: { type: 'number', label: 'Knowledge' }
    }
  },
  backgroundQuestions: {
    type: 'array',
    label: 'Background Questions',
    itemSchema: QASchema
  },
  connectionQuestions: {
    type: 'array',
    label: 'Connection Questions',
    itemSchema: QASchema
  }
};

export const TimelineEventSchema: EntitySchema = {
  title: { type: 'string', label: 'Title' },
  type: { type: 'string', label: 'Type' },
  sagaArc: { type: 'string', label: 'Saga Arc', optional: true },
  description: { type: 'textarea', label: 'Description' },
  locationId: { type: 'string', label: 'Location ID', optional: true },
  time: {
    type: 'object',
    label: 'Time',
    fields: {
      era: { type: 'string', label: 'Era' },
      year: { type: 'number', label: 'Year' },
      month: { type: 'string', label: 'Month' },
      day: { type: 'number', label: 'Day' },
      hour: { type: 'number', label: 'Hour', optional: true },
      minute: { type: 'number', label: 'Minute', optional: true }
    }
  },
  pcNotes: {
    type: 'array',
    label: 'PC Notes',
    optional: true,
    itemSchema: {
      type: 'object',
      label: 'Note',
      fields: {
        pcId: { type: 'string', label: 'PC ID' },
        note: { type: 'textarea', label: 'Note' }
      }
    }
  },
  npcIds: {
    type: 'array',
    label: 'NPC IDs',
    optional: true,
    itemSchema: { type: 'string', label: 'NPC ID' }
  }
};

export const HomeSchema: EntitySchema = {
  nextSession: { type: 'string', label: 'Next Session' },
  lastLocationId: { type: 'string', label: 'Last Location ID' },
  nextDestinationId: { type: 'string', label: 'Next Destination ID' },
  activeQuest: {
    type: 'object',
    label: 'Active Quest',
    fields: {
      title: { type: 'string', label: 'Title' },
      status: { type: 'string', label: 'Status' },
      locationId: { type: 'string', label: 'Location ID', optional: true },
      description: { type: 'textarea', label: 'Description', optional: true }
    }
  },
  questList: {
    type: 'array',
    label: 'Quest List',
    itemSchema: {
      type: 'object',
      label: 'Quest',
      fields: {
        title: { type: 'string', label: 'Title' },
        status: { type: 'string', label: 'Status' },
        locationId: { type: 'string', label: 'Location ID', optional: true },
        description: { type: 'textarea', label: 'Description', optional: true }
      }
    }
  },
  mostWanted: {
    type: 'array',
    label: 'Most Wanted',
    itemSchema: {
      type: 'object',
      label: 'Wanted Person',
      fields: {
        name: { type: 'string', label: 'Name' },
        reward: { type: 'string', label: 'Reward' },
        image: { type: 'string', label: 'Image URL' },
        lastSeenLocation: { type: 'string', label: 'Last Seen Location', optional: true }
      }
    }
  }
};