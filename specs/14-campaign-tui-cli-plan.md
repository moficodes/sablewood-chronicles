# Campaign TUI CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Ink-based terminal dashboard to manage `data/campaign.yml` safely.

**Architecture:** A standalone TypeScript script in the `cli/` directory. It uses `js-yaml` for parsing, `zod` for schema validation, and `ink` for the React-based terminal UI. It leverages `bun test` for TDD.

**Tech Stack:** Bun, React, Ink, Zod, js-yaml.

---

### Task 1: Add Dependencies and Zod Schema

**Files:**
- Modify: `package.json`
- Create: `cli/schema.ts`
- Create: `cli/schema.test.ts`

- [ ] **Step 1: Install dependencies**

```bash
bun add ink zod ink-text-input ink-select-input
bun add -d @types/ink
```

- [ ] **Step 2: Write failing test for schema**

```typescript
// cli/schema.test.ts
import { expect, test } from "bun:test";
import { CampaignSchema } from "./schema";

test("CampaignSchema validates valid data", () => {
  const validData = {
    home: {
      nextSession: "May 1st, 2026 7PM EST",
      activeQuest: { title: "Test", status: "active", locationId: "l1", description: "Desc" },
      questList: [],
      mostWanted: [],
      lastLocationId: "l1",
      nextDestinationId: "l2"
    },
    locations: [],
    timeline: { title: "Title", subtitle: "Sub", description: "Desc", events: [] },
    players: [],
    npcs: []
  };
  
  const result = CampaignSchema.safeParse(validData);
  expect(result.success).toBe(true);
});

test("CampaignSchema rejects missing required fields", () => {
  const invalidData = {
    home: { nextSession: "Time" }
  };
  
  const result = CampaignSchema.safeParse(invalidData);
  expect(result.success).toBe(false);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `bun test cli/schema.test.ts`
Expected: FAIL (Cannot find module './schema')

- [ ] **Step 4: Write minimal implementation**

```typescript
// cli/schema.ts
import { z } from "zod";

export const QuestSchema = z.object({
  title: z.string(),
  status: z.string(),
  locationId: z.string(),
  description: z.string().optional()
});

export const WantedPersonSchema = z.object({
  name: z.string(),
  reward: z.string(),
  image: z.string().optional(),
  lastSeenLocation: z.string().optional()
});

export const HomeSchema = z.object({
  nextSession: z.string(),
  activeQuest: QuestSchema,
  questList: z.array(QuestSchema),
  mostWanted: z.array(WantedPersonSchema),
  lastLocationId: z.string(),
  nextDestinationId: z.string()
});

export const CampaignSchema = z.object({
  home: HomeSchema,
  locations: z.array(z.any()), // Simplified for initial schema
  timeline: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    events: z.array(z.any())
  }),
  players: z.array(z.any()),
  npcs: z.array(z.any())
});

export type Campaign = z.infer<typeof CampaignSchema>;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test cli/schema.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock cli/schema.ts cli/schema.test.ts
git commit -m "feat(cli): add initial zod schema for campaign data"
```

### Task 2: Data Access Layer

**Files:**
- Create: `cli/data.ts`
- Create: `cli/data.test.ts`

- [ ] **Step 1: Write failing test for data layer**

```typescript
// cli/data.test.ts
import { expect, test, beforeAll, afterAll } from "bun:test";
import { readCampaign, writeCampaign } from "./data";
import fs from "fs/promises";
import path from "path";

const TEST_FILE = path.join(process.cwd(), "data", "test_campaign.yml");

const testData = {
  home: {
    nextSession: "Test Session",
    activeQuest: { title: "Q", status: "active", locationId: "1" },
    questList: [],
    mostWanted: [],
    lastLocationId: "1",
    nextDestinationId: "2"
  },
  locations: [],
  timeline: { title: "T", subtitle: "S", description: "D", events: [] },
  players: [],
  npcs: []
};

afterAll(async () => {
  await fs.unlink(TEST_FILE).catch(() => {});
  await fs.unlink(TEST_FILE + ".bak").catch(() => {});
});

test("writeCampaign creates backup and writes valid YAML", async () => {
  await writeCampaign(testData, TEST_FILE);
  const content = await fs.readFile(TEST_FILE, "utf-8");
  expect(content).toContain("nextSession: Test Session");
});

test("readCampaign parses and validates YAML", async () => {
  await writeCampaign(testData, TEST_FILE);
  const data = await readCampaign(TEST_FILE);
  expect(data.home.nextSession).toBe("Test Session");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test cli/data.test.ts`
Expected: FAIL (Cannot find module './data')

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/data.ts
import fs from "fs/promises";
import yaml from "js-yaml";
import { CampaignSchema, type Campaign } from "./schema";
import path from "path";

export async function readCampaign(filePath: string): Promise<Campaign> {
  const content = await fs.readFile(filePath, "utf-8");
  const parsed = yaml.load(content);
  return CampaignSchema.parse(parsed);
}

export async function writeCampaign(data: Campaign, filePath: string): Promise<void> {
  // Create backup if file exists
  try {
    await fs.access(filePath);
    await fs.copyFile(filePath, `${filePath}.bak`);
  } catch (e) {
    // File doesn't exist, ignore
  }

  const yamlStr = yaml.dump(data, { indent: 2 });
  await fs.writeFile(filePath, yamlStr, "utf-8");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test cli/data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/data.ts cli/data.test.ts
git commit -m "feat(cli): add data access layer with backups"
```

### Task 3: Basic Ink App Shell

**Files:**
- Create: `cli/App.tsx`
- Create: `cli/index.tsx`

- [ ] **Step 1: Write the App component implementation**

We will skip TDD for the initial Ink terminal rendering as it requires visual testing, but we'll structure it clearly.

```tsx
// cli/App.tsx
import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import { readCampaign } from "./data";
import type { Campaign } from "./schema";
import path from "path";

export function App() {
  const { exit } = useApp();
  const [data, setData] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePane, setActivePane] = useState<"nav" | "main">("nav");

  useEffect(() => {
    const filePath = path.join(process.cwd(), "data", "campaign.yml");
    readCampaign(filePath)
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useInput((input, key) => {
    if (key.escape || (input === 'q' && activePane === "nav")) {
      exit();
    }
    if (key.tab) {
      setActivePane(prev => prev === "nav" ? "main" : "nav");
    }
  });

  if (error) return <Text color="red">Error loading data: {error}</Text>;
  if (!data) return <Text>Loading campaign data...</Text>;

  return (
    <Box flexDirection="column" minHeight={20} borderStyle="single">
      {/* Header */}
      <Box borderStyle="singleBottom" paddingX={1}>
        <Text bold>Sablewood Chronicles - CLI Manager | </Text>
        <Text color="green">Next Session: {data.home.nextSession}</Text>
      </Box>

      {/* Main Body */}
      <Box flexDirection="row" flexGrow={1}>
        {/* Nav Pane */}
        <Box 
          width="25%" 
          borderStyle="singleRight" 
          borderColor={activePane === "nav" ? "blue" : "gray"}
          flexDirection="column"
          paddingX={1}
        >
          <Text color={activePane === "nav" ? "white" : "gray"}>1. Players</Text>
          <Text color={activePane === "nav" ? "white" : "gray"}>2. NPCs</Text>
          <Text color={activePane === "nav" ? "white" : "gray"}>3. Locations</Text>
          <Text color={activePane === "nav" ? "white" : "gray"}>4. Timeline</Text>
        </Box>

        {/* Content Pane */}
        <Box 
          flexGrow={1} 
          paddingX={1} 
          borderColor={activePane === "main" ? "blue" : "gray"}
          borderStyle={activePane === "main" ? "single" : undefined}
        >
          <Text>Select an item from the menu.</Text>
        </Box>
      </Box>

      {/* Footer */}
      <Box borderStyle="singleTop" paddingX={1}>
        <Text color="gray">[tab] Switch Panes | [q] Quit</Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Create the entry point**

```tsx
// cli/index.tsx
import React from "react";
import { render } from "ink";
import { App } from "./App";

render(<App />);
```

- [ ] **Step 3: Run the CLI manually to verify**

Run: `bun run cli/index.tsx`
Expected: The terminal UI renders with the Next Session loaded from `data/campaign.yml`. Press `q` to exit.

- [ ] **Step 4: Commit**

```bash
git add cli/App.tsx cli/index.tsx
git commit -m "feat(cli): add basic ink UI shell"
```
