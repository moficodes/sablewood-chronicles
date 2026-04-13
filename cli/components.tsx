// cli/components.tsx
import React from 'react';
import { Box, Text } from 'ink';

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface PlayerData {
  id: string;
  name: string;
  ancestry: string;
  class: string;
  subclass: string;
  level: number;
  description?: string;
  backstory?: string;
  stats?: {
    agility: number;
    strength: number;
    finesse: number;
    instinct: number;
    presence: number;
    knowledge: number;
  };
  backgroundQuestions?: QuestionAnswer[];
  connectionQuestions?: QuestionAnswer[];
}

export interface MemorableInteraction {
  description: string;
  highlight?: string;
}

export interface NPCData {
  id: string;
  name: string;
  role: string;
  location: string;
  attitudeTowardParty?: string;
  description?: string;
  memorableInteractions?: MemorableInteraction[];
}

export interface LocationData {
  id: string;
  name: string;
  region: string;
  description?: string;
  memorableInteractions?: MemorableInteraction[];
}

export interface EventData {
  id: string;
  title: string;
  type: string;
  description?: string;
  time?: {
    era: string;
    year: number;
    month: string;
    day: number;
  };
  pcNotes?: { pcId: string; note: string }[];
}

function ReturnInstruction() {
  return (
    <Box marginTop={1}>
      <Text color="gray">Press [Esc] to return to list</Text>
    </Box>
  );
}

export function PlayerDetail({ data }: { data: PlayerData | null }) {
  if (!data) return <Text>Player not found.</Text>;
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="blue">{data.name}</Text>
      <Text color="gray">{data.ancestry} {data.class} ({data.subclass}) - Level {data.level}</Text>
      
      {data.description && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Description:</Text>
          <Text>{data.description}</Text>
        </Box>
      )}

      {data.backstory && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Backstory:</Text>
          <Text>{data.backstory}</Text>
        </Box>
      )}

      {data.stats && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Stats:</Text>
          <Text>AGI: {data.stats.agility} | STR: {data.stats.strength} | FIN: {data.stats.finesse}</Text>
          <Text>INS: {data.stats.instinct} | PRE: {data.stats.presence} | KNO: {data.stats.knowledge}</Text>
        </Box>
      )}

      {data.backgroundQuestions && data.backgroundQuestions.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Background:</Text>
          {data.backgroundQuestions.map((q, i) => (
            <Box key={i} flexDirection="column" marginBottom={1}>
              <Text color="gray">Q: {q.question}</Text>
              <Text>A: {q.answer}</Text>
            </Box>
          ))}
        </Box>
      )}

      {data.connectionQuestions && data.connectionQuestions.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Connections:</Text>
          {data.connectionQuestions.map((q, i) => (
            <Box key={i} flexDirection="column" marginBottom={1}>
              <Text color="gray">Q: {q.question}</Text>
              <Text>A: {q.answer}</Text>
            </Box>
          ))}
        </Box>
      )}

      <ReturnInstruction />
    </Box>
  );
}

export function NPCDetail({ data }: { data: NPCData | null }) {
  if (!data) return <Text>NPC not found.</Text>;
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="yellow">{data.name}</Text>
      <Text color="gray">{data.role} @ {data.location}</Text>
      
      {data.attitudeTowardParty && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Attitude:</Text>
          <Text>{data.attitudeTowardParty}</Text>
        </Box>
      )}
      
      {data.description && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Description:</Text>
          <Text>{data.description}</Text>
        </Box>
      )}

      {data.memorableInteractions && data.memorableInteractions.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Interactions:</Text>
          {data.memorableInteractions.map((mi, i) => (
            <Text key={i}>• {mi.description} {mi.highlight ? <Text color="gray">({mi.highlight})</Text> : ""}</Text>
          ))}
        </Box>
      )}

      <ReturnInstruction />
    </Box>
  );
}

export function LocationDetail({ data }: { data: LocationData | null }) {
  if (!data) return <Text>Location not found.</Text>;
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="green">{data.name}</Text>
      <Text color="gray">Region: {data.region}</Text>
      
      {data.description && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Description:</Text>
          <Text>{data.description}</Text>
        </Box>
      )}

      {data.memorableInteractions && data.memorableInteractions.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Interactions:</Text>
          {data.memorableInteractions.map((mi, i) => (
            <Text key={i}>• {mi.description} {mi.highlight ? <Text color="gray">({mi.highlight})</Text> : ""}</Text>
          ))}
        </Box>
      )}

      <ReturnInstruction />
    </Box>
  );
}

export function EventDetail({ data }: { data: EventData | null }) {
  if (!data) return <Text>Event not found.</Text>;
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="magenta">{data.title}</Text>
      <Text color="gray">Type: {data.type}</Text>
      
      {data.time && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Time:</Text>
          <Text>{data.time.era}, Year {data.time.year}, {data.time.month} {data.time.day}</Text>
        </Box>
      )}
      
      {data.description && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Description:</Text>
          <Text>{data.description}</Text>
        </Box>
      )}

      {data.pcNotes && data.pcNotes.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>PC Notes:</Text>
          {data.pcNotes.map((note, i) => (
            <Text key={i}>• {note.note} <Text color="gray">({note.pcId})</Text></Text>
          ))}
        </Box>
      )}

      <ReturnInstruction />
    </Box>
  );
}
