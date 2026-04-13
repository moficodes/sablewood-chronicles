# Agent CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a non-TUI CLI specifically for autonomous agents to modify `campaign.yml` data using `commander`.

**Architecture:** A single file `cli/agent.ts` that configures `commander` subcommands for `home`, `npc`, `location`, `event`, `player`, and `quest`. Each command reads the YAML using `readCampaign`, modifies the relevant array/object, and writes it back using `writeCampaign`.

**Tech Stack:** Bun, TypeScript, Commander, js-yaml, Zod.

---

### Task 1: Install Commander and Setup Package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Commander**
Run: `bun add commander`

- [ ] **Step 2: Add Script Shortcut**
Modify `package.json` to include `"agent": "bun run cli/agent.ts"` in the `"scripts"` block.

- [ ] **Step 3: Commit**
```bash
git add package.json bun.lock
git commit -m "chore: install commander and add agent script"
```

---

### Task 2: Setup `cli/agent.ts` and `home` Commands

**Files:**
- Create: `cli/agent.ts`

- [ ] **Step 1: Create Basic CLI Setup**
Create `cli/agent.ts` with standard `commander` setup and `home update` command.

```typescript
import { Command } from "commander";
import { readCampaign, writeCampaign } from "./data";
import path from "path";

const program = new Command();
const CAMPAIGN_FILE = path.join(process.cwd(), "data", "campaign.yml");

program
  .name("agent")
  .description("Non-TUI CLI for modifying campaign data via automation");

const home = program.command("home").description("Manage home configuration");

home
  .command("update")
  .description("Update home configuration")
  .option("--nextSession <string>", "Next session date/time")
  .option("--lastLocationId <string>", "Last location ID")
  .option("--nextDestinationId <string>", "Next destination ID")
  .action(async (options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      if (options.nextSession) data.home.nextSession = options.nextSession;
      if (options.lastLocationId) data.home.lastLocationId = options.lastLocationId;
      if (options.nextDestinationId) data.home.nextDestinationId = options.nextDestinationId;
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log("Home configuration updated successfully.");
    } catch (err) {
      console.error("Error updating home:", err);
      process.exit(1);
    }
  });

program.parse(process.argv);
```

- [ ] **Step 2: Verify Command**
Run: `bun run cli/agent.ts home update --nextSession "June 1st"`
Run: `cat data/campaign.yml` and check if `nextSession` is "June 1st".

- [ ] **Step 3: Commit**
```bash
git add cli/agent.ts
git commit -m "feat: setup agent cli and home update command"
```

---

### Task 3: Implement `npc` Commands

**Files:**
- Modify: `cli/agent.ts`

- [ ] **Step 1: Add NPC Commands**
Append NPC commands to `cli/agent.ts`:

```typescript
const npc = program.command("npc").description("Manage NPCs");

npc.command("list").action(async () => {
  const data = await readCampaign(CAMPAIGN_FILE);
  console.log(JSON.stringify(data.npcs.map((n: any) => ({ id: n.id, name: n.name })), null, 2));
});

npc.command("add")
  .requiredOption("--id <string>", "NPC ID")
  .requiredOption("--name <string>", "NPC Name")
  .option("--role <string>", "NPC Role")
  .option("--location <string>", "NPC Location")
  .option("--description <string>", "NPC Description")
  .action(async (options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.npcs.push(options);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Added NPC: ${options.name}`);
  });

npc.command("update")
  .argument("<id>", "NPC ID")
  .option("--name <string>")
  .option("--role <string>")
  .option("--location <string>")
  .option("--description <string>")
  .action(async (id, options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    const index = data.npcs.findIndex((n: any) => n.id === id);
    if (index === -1) {
      console.error(`NPC with id ${id} not found.`);
      process.exit(1);
    }
    data.npcs[index] = { ...data.npcs[index], ...options };
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Updated NPC: ${id}`);
  });

npc.command("delete")
  .argument("<id>", "NPC ID")
  .action(async (id) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.npcs = data.npcs.filter((n: any) => n.id !== id);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Deleted NPC: ${id}`);
  });
```

- [ ] **Step 2: Verify Command**
Run: `bun run cli/agent.ts npc add --id "n99" --name "Test NPC"`
Run: `bun run cli/agent.ts npc list` (Should see Test NPC)
Run: `bun run cli/agent.ts npc delete n99`

- [ ] **Step 3: Commit**
```bash
git add cli/agent.ts
git commit -m "feat: add npc commands to agent cli"
```

---

### Task 4: Implement `location` Commands

**Files:**
- Modify: `cli/agent.ts`

- [ ] **Step 1: Add Location Commands**
Append Location commands to `cli/agent.ts`:

```typescript
const location = program.command("location").description("Manage Locations");

location.command("list").action(async () => {
  const data = await readCampaign(CAMPAIGN_FILE);
  console.log(JSON.stringify(data.locations.map((l: any) => ({ id: l.id, name: l.name })), null, 2));
});

location.command("add")
  .requiredOption("--id <string>", "Location ID")
  .requiredOption("--name <string>", "Location Name")
  .option("--region <string>", "Location Region")
  .option("--description <string>", "Location Description")
  .action(async (options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.locations.push(options);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Added Location: ${options.name}`);
  });

location.command("update")
  .argument("<id>", "Location ID")
  .option("--name <string>")
  .option("--region <string>")
  .option("--description <string>")
  .action(async (id, options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    const index = data.locations.findIndex((l: any) => l.id === id);
    if (index === -1) {
      console.error(`Location with id ${id} not found.`);
      process.exit(1);
    }
    data.locations[index] = { ...data.locations[index], ...options };
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Updated Location: ${id}`);
  });

location.command("delete")
  .argument("<id>", "Location ID")
  .action(async (id) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.locations = data.locations.filter((l: any) => l.id !== id);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Deleted Location: ${id}`);
  });
```

- [ ] **Step 2: Verify Command**
Run: `bun run cli/agent.ts location list`

- [ ] **Step 3: Commit**
```bash
git add cli/agent.ts
git commit -m "feat: add location commands to agent cli"
```

---

### Task 5: Implement `event` Commands

**Files:**
- Modify: `cli/agent.ts`

- [ ] **Step 1: Add Event Commands**
Append Event commands to `cli/agent.ts`:

```typescript
const event = program.command("event").description("Manage Timeline Events");

event.command("list").action(async () => {
  const data = await readCampaign(CAMPAIGN_FILE);
  console.log(JSON.stringify(data.timeline.events.map((e: any) => ({ id: e.id, title: e.title })), null, 2));
});

event.command("add")
  .requiredOption("--id <string>", "Event ID")
  .requiredOption("--title <string>", "Event Title")
  .option("--type <string>", "Event Type")
  .option("--description <string>", "Event Description")
  .action(async (options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.timeline.events.push(options);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Added Event: ${options.title}`);
  });

event.command("update")
  .argument("<id>", "Event ID")
  .option("--title <string>")
  .option("--type <string>")
  .option("--description <string>")
  .action(async (id, options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    const index = data.timeline.events.findIndex((e: any) => e.id === id);
    if (index === -1) {
      console.error(`Event with id ${id} not found.`);
      process.exit(1);
    }
    data.timeline.events[index] = { ...data.timeline.events[index], ...options };
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Updated Event: ${id}`);
  });

event.command("delete")
  .argument("<id>", "Event ID")
  .action(async (id) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.timeline.events = data.timeline.events.filter((e: any) => e.id !== id);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Deleted Event: ${id}`);
  });
```

- [ ] **Step 2: Verify Command**
Run: `bun run cli/agent.ts event list`

- [ ] **Step 3: Commit**
```bash
git add cli/agent.ts
git commit -m "feat: add event commands to agent cli"
```

---

### Task 6: Implement `player` Commands

**Files:**
- Modify: `cli/agent.ts`

- [ ] **Step 1: Add Player Commands**
Append Player commands to `cli/agent.ts`:

```typescript
const player = program.command("player").description("Manage Players");

player.command("list").action(async () => {
  const data = await readCampaign(CAMPAIGN_FILE);
  console.log(JSON.stringify(data.players.map((p: any) => ({ id: p.id, name: p.name })), null, 2));
});

player.command("add")
  .requiredOption("--id <string>", "Player ID")
  .requiredOption("--name <string>", "Player Name")
  .option("--class <string>", "Player Class")
  .option("--level <number>", "Player Level", parseInt)
  .action(async (options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.players.push(options);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Added Player: ${options.name}`);
  });

player.command("update")
  .argument("<id>", "Player ID")
  .option("--name <string>")
  .option("--class <string>")
  .option("--level <number>", "Player Level", parseInt)
  .action(async (id, options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    const index = data.players.findIndex((p: any) => p.id === id);
    if (index === -1) {
      console.error(`Player with id ${id} not found.`);
      process.exit(1);
    }
    data.players[index] = { ...data.players[index], ...options };
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Updated Player: ${id}`);
  });

player.command("delete")
  .argument("<id>", "Player ID")
  .action(async (id) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.players = data.players.filter((p: any) => p.id !== id);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Deleted Player: ${id}`);
  });
```

- [ ] **Step 2: Verify Command**
Run: `bun run cli/agent.ts player list`

- [ ] **Step 3: Commit**
```bash
git add cli/agent.ts
git commit -m "feat: add player commands to agent cli"
```

---

### Task 7: Implement `quest` Commands

**Files:**
- Modify: `cli/agent.ts`

- [ ] **Step 1: Add Quest Commands**
Append Quest commands to `cli/agent.ts`:

```typescript
const quest = program.command("quest").description("Manage Quests");

quest.command("list").action(async () => {
  const data = await readCampaign(CAMPAIGN_FILE);
  console.log("Active Quest:", data.home.activeQuest?.title || "None");
  console.log("Quest List:", JSON.stringify(data.home.questList.map((q: any) => q.title), null, 2));
});

quest.command("add")
  .requiredOption("--title <string>", "Quest Title")
  .requiredOption("--status <string>", "Quest Status")
  .requiredOption("--locationId <string>", "Location ID")
  .option("--description <string>", "Quest Description")
  .action(async (options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.home.questList.push(options);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Added Quest: ${options.title}`);
  });

quest.command("update")
  .argument("<title>", "Quest Title")
  .option("--status <string>")
  .option("--locationId <string>")
  .option("--description <string>")
  .action(async (title, options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    const index = data.home.questList.findIndex((q: any) => q.title === title);
    if (index === -1) {
      if (data.home.activeQuest.title === title) {
        data.home.activeQuest = { ...data.home.activeQuest, ...options };
      } else {
        console.error(`Quest with title ${title} not found in questList or activeQuest.`);
        process.exit(1);
      }
    } else {
      data.home.questList[index] = { ...data.home.questList[index], ...options };
    }
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Updated Quest: ${title}`);
  });

quest.command("delete")
  .argument("<title>", "Quest Title")
  .action(async (title) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.home.questList = data.home.questList.filter((q: any) => q.title !== title);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Deleted Quest: ${title}`);
  });
```

- [ ] **Step 2: Verify Command**
Run: `bun run cli/agent.ts quest list`

- [ ] **Step 3: Commit**
```bash
git add cli/agent.ts
git commit -m "feat: add quest commands to agent cli"
```
