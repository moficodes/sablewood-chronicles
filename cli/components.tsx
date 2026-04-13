// cli/components.tsx
import React from 'react';
import { Box, Text } from 'ink';

export function PlayerDetail({ data }: { data: any }) {
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
      <Box marginTop={1}><Text color="gray">Press [Esc] to return to list</Text></Box>
    </Box>
  );
}

export function NPCDetail({ data }: { data: any }) {
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
      <Box marginTop={1}><Text color="gray">Press [Esc] to return to list</Text></Box>
    </Box>
  );
}

export function LocationDetail({ data }: { data: any }) {
  if (!data) return <Text>Location not found.</Text>;
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="green">{data.name}</Text>
      <Text color="gray">Region: {data.region}</Text>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Description:</Text>
        <Text>{data.description}</Text>
      </Box>
      <Box marginTop={1}><Text color="gray">Press [Esc] to return to list</Text></Box>
    </Box>
  );
}

export function EventDetail({ data }: { data: any }) {
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
      <Box marginTop={1}><Text color="gray">Press [Esc] to return to list</Text></Box>
    </Box>
  );
}