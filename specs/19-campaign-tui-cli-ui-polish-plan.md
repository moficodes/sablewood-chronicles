# Campaign TUI CLI - Full Screen & Rich Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the CLI to use the full terminal height and width, and add comprehensive rendering of all entity properties in `components.tsx`.

**Architecture:** Use `process.stdout.write('\x1b[?1049h')` on app start to trigger the alternate screen buffer, making the CLI truly full screen and hiding terminal history. We will create a `useTerminalSize` hook to strictly bind the Ink root node boundaries to the window. We will then expand the `cli/components.tsx` interfaces and render trees.

**Tech Stack:** Bun, React, Ink

---

### Task 1: Alternate Screen Buffer & Full Terminal Dimensions

**Files:**
- Modify: `cli/index.tsx`
- Modify: `cli/App.tsx`

- [ ] **Step 1: Update index.tsx to enter Alternate Screen Buffer**

Update `index.tsx` to clear the terminal history and take over the screen, ensuring it restores cleanly on exit.

```tsx
// cli/index.tsx
import React from "react";
import { render } from "ink";
import { App } from "./App";

// Enter alternate screen buffer
process.stdout.write("\x1b[?1049h");

const { unmount } = render(<App />);

// Ensure we clean up when exiting
const cleanup = () => {
  unmount();
  process.stdout.write("\x1b[?1049l");
  process.exit();
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
```

- [ ] **Step 2: Add custom resize hook to App.tsx**

Add a `useTerminalSize` hook inside `App.tsx` and bind it to the root `<Box>`.

```tsx
// Add to the top of cli/App.tsx
function useTerminalSize() {
  const [size, setSize] = useState({
    columns: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    };
    process.stdout.on("resize", onResize);
    return () => {
      process.stdout.off("resize", onResize);
    };
  }, []);

  return size;
}

// Inside App component, replace:
// <Box flexDirection="column" minHeight={20} borderStyle="single">
// with:
// const { columns, rows } = useTerminalSize();
// ...
// <Box flexDirection="column" width={columns} height={rows} borderStyle="single">
```

- [ ] **Step 3: Update `App.tsx` App component implementation**

Ensure you apply the `useTerminalSize` changes to `cli/App.tsx`. Apply it to the main `return` statement's root `<Box>`.

- [ ] **Step 4: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add cli/index.tsx cli/App.tsx
git commit -m "feat(cli): enable full screen layout using alternate buffer and terminal resizing"
```

### Task 2: Expand Data Interfaces

**Files:**
- Modify: `cli/components.tsx`

- [ ] **Step 1: Expand interfaces in `components.tsx`**

```tsx
// In cli/components.tsx
// Add these interfaces to the existing ones
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
```

- [ ] **Step 2: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add cli/components.tsx
git commit -m "feat(cli): expand typescript interfaces for full campaign data"
```

### Task 3: Expand Detail UI Components

**Files:**
- Modify: `cli/components.tsx`

- [ ] **Step 1: Expand PlayerDetail**

```tsx
// Inside cli/components.tsx
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
```

- [ ] **Step 2: Expand NPCDetail & LocationDetail & EventDetail**

```tsx
// Replace existing NPCDetail
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

// Replace existing LocationDetail
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

// Replace existing EventDetail
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
```

- [ ] **Step 3: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add cli/components.tsx
git commit -m "feat(cli): render all comprehensive campaign data properties in UI"
```