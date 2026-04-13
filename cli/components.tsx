// cli/components.tsx
import React from 'react';
import { Box, Text } from 'ink';

export interface PlayerData {
  name: string;
  ancestry: string;
  class: string;
  subclass: string;
  level: number | string;
  description: string;
  stats?: {
    agility: number | string;
    strength: number | string;
    finesse: number | string;
    instinct: number | string;
    presence: number | string;
    knowledge: number | string;
  };
}

export interface NPCData {
  name: string;
  role: string;
  location: string;
  attitudeTowardParty: string;
  description: string;
}

export interface LocationData {
  name: string;
  region: string;
  description: string;
}

export interface EventData {
  title: string;
  type: string;
  description: string;
  time?: {
    era: string;
    year: number | string;
    month: string;
    day: number | string;
  };
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
      <Box marginTop={1} flexDirection="column">
        <Text bold>Description:</Text>
        <Text>{data.description}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Stats:</Text>
        <Text>Agility: {data.stats?.agility} | Strength: {data.stats?.strength} | Finesse: {data.stats?.finesse}</Text>
        <Text>Instinct: {data.stats?.instinct} | Presence: {data.stats?.presence} | Knowledge: {data.stats?.knowledge}</Text>
      </Box>
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
      <Box marginTop={1} flexDirection="column">
        <Text bold>Attitude:</Text>
        <Text>{data.attitudeTowardParty}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Description:</Text>
        <Text>{data.description}</Text>
      </Box>
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
      <Box marginTop={1} flexDirection="column">
        <Text bold>Description:</Text>
        <Text>{data.description}</Text>
      </Box>
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
      <Box marginTop={1} flexDirection="column">
        <Text bold>Time:</Text>
        <Text>{data.time?.era}, Year {data.time?.year}, {data.time?.month} {data.time?.day}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Description:</Text>
        <Text>{data.description}</Text>
      </Box>
      <ReturnInstruction />
    </Box>
  );
}