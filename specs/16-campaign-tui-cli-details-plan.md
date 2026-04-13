# Campaign TUI CLI - Interactive Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Ink TUI to support nested states (`nav` -> `list` -> `detail`), allowing users to select an entity and view its full YAML properties.

**Architecture:** We will introduce an `AppState` type and shift control of focus (`isFocused`) dynamically between components. We will separate `ListView` and `DetailView` components to keep `App.tsx` manageable.

**Tech Stack:** React, Ink, ink-select-input

---

### Task 1: Create Detail Components

**Files:**
- Create: `cli/components.tsx`

- [ ] **Step 1: Write the detail components**

```tsx
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
      <Text color="gray" marginTop={1}>Press [Esc] to return to list</Text>
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
      <Text color="gray" marginTop={1}>Press [Esc] to return to list</Text>
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
      <Text color="gray" marginTop={1}>Press [Esc] to return to list</Text>
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
      <Text color="gray" marginTop={1}>Press [Esc] to return to list</Text>
    </Box>
  );
}
```

- [ ] **Step 2: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add cli/components.tsx
git commit -m "feat(cli): add detail view components for each entity type"
```

### Task 2: Refactor State Machine in App.tsx

**Files:**
- Modify: `cli/App.tsx`

- [ ] **Step 1: Refactor App.tsx to use nested state and new components**

```tsx
// cli/App.tsx (Replace entirely)
import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";
import { readCampaign } from "./data";
import type { Campaign } from "./schema";
import path from "path";
import { PlayerDetail, NPCDetail, LocationDetail, EventDetail } from "./components";

type AppState = "nav" | "list" | "detail";

const navItems = [
  { label: 'Players', value: 'players' },
  { label: 'NPCs', value: 'npcs' },
  { label: 'Locations', value: 'locations' },
  { label: 'Timeline', value: 'timeline' },
];

export function App() {
  const { exit } = useApp();
  const [data, setData] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [appState, setAppState] = useState<AppState>("nav");
  const [selectedCategory, setSelectedCategory] = useState("players");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  useEffect(() => {
    const filePath = path.join(process.cwd(), "data", "campaign.yml");
    readCampaign(filePath)
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      if (appState === "detail") setAppState("list");
      else exit();
      return;
    }
    
    if (input === 'q' && appState !== "detail") {
      exit();
      return;
    }
    
    if (key.tab) {
      if (appState === "nav") setAppState("list");
      else if (appState === "list") setAppState("nav");
    }
  });

  if (error) return <Text color="red">Error loading data: {error}</Text>;
  if (!data) return <Text>Loading campaign data...</Text>;

  // Compute current list items for the right pane based on category
  let listItems: {label: string, value: string}[] = [];
  if (selectedCategory === "players") listItems = data.players.map((p: any) => ({ label: p.name, value: p.id }));
  if (selectedCategory === "npcs") listItems = data.npcs.map((n: any) => ({ label: n.name, value: n.id }));
  if (selectedCategory === "locations") listItems = data.locations.map((l: any) => ({ label: l.name, value: l.id }));
  if (selectedCategory === "timeline") listItems = data.timeline.events.map((e: any) => ({ label: e.title, value: e.id }));

  const activeItemData = selectedEntityId 
    ? (data as any)[selectedCategory === 'timeline' ? 'events' : selectedCategory]?.find((x: any) => x.id === selectedEntityId) || 
      data.timeline.events.find((x: any) => x.id === selectedEntityId) // fallback for timeline nested search
    : null;

  return (
    <Box flexDirection="column" minHeight={20} borderStyle="single">
      {/* Header */}
      <Box borderBottom={true} borderStyle="single" paddingX={1} borderTop={false} borderLeft={false} borderRight={false}>
        <Text bold>Sablewood Chronicles - CLI Manager | </Text>
        <Text color="green">Next Session: {data.home.nextSession}</Text>
      </Box>

      {/* Main Body */}
      <Box flexDirection="row" flexGrow={1}>
        {/* Nav Pane */}
        <Box 
          width="25%" 
          borderRight={true} borderStyle="single" borderTop={false} borderBottom={false} borderLeft={false}
          borderColor={appState === "nav" ? "blue" : "gray"}
          flexDirection="column"
          paddingX={1}
        >
          <SelectInput 
            items={navItems} 
            isFocused={appState === "nav"}
            onSelect={(item) => setSelectedCategory(item.value)}
            onHighlight={(item) => setSelectedCategory(item.value)}
          />
        </Box>

        {/* Content Pane */}
        <Box 
          flexGrow={1} 
          paddingX={1} 
          borderColor={appState !== "nav" ? "blue" : "gray"}
          borderStyle={appState !== "nav" ? "single" : undefined}
          flexDirection="column"
        >
          {appState === "detail" ? (
            <Box>
              {selectedCategory === "players" && <PlayerDetail data={activeItemData} />}
              {selectedCategory === "npcs" && <NPCDetail data={activeItemData} />}
              {selectedCategory === "locations" && <LocationDetail data={activeItemData} />}
              {selectedCategory === "timeline" && <EventDetail data={activeItemData} />}
            </Box>
          ) : (
            <SelectInput 
              items={listItems} 
              isFocused={appState === "list"}
              onSelect={(item) => {
                setSelectedEntityId(item.value);
                setAppState("detail");
              }}
            />
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box borderTop={true} borderStyle="single" paddingX={1} borderBottom={false} borderLeft={false} borderRight={false}>
        <Text color="gray">[tab] Switch Panes | [Enter] Select Item | [Esc] Go Back/Quit</Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add cli/App.tsx
git commit -m "feat(cli): refactor app state machine to support nested lists and details views"
```