# Add Player Character: Orna Kaan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the agent CLI to support full Player attributes and use it to add Orna Kaan to the campaign data.

**Architecture:** Extend the `player add` command in `cli/agent.ts` to accept `--ancestry`, `--community`, `--subclass`, and `--tier`. The command will automatically populate required `Player` interface fields (like `stats`, `image`, `description`) with safe defaults to ensure type safety when written to YAML. Then, we will execute the CLI command to add Orna Kaan.

**Tech Stack:** TypeScript, Commander.js, bun

---

### Task 1: Update CLI `player add` command

**Files:**
- Modify: `cli/agent.ts`

- [ ] **Step 1: Write a failing manual test (dry run)**

Run: `bun run agent player add --id orna-kaan --name "Orna Kaan" --ancestry "Galapa" --community "Loreborn" --class "Sorcerer" --subclass "Primal Origin" --level 1 --tier 1`
Expected: Error regarding unknown options (`error: unknown option '--ancestry'`)

- [ ] **Step 2: Write minimal implementation**

Modify `cli/agent.ts` around line 214 (`player.command("add")`) to include the new options and default values.

```typescript
player.command("add")
  .requiredOption("--id <string>", "Player ID")
  .requiredOption("--name <string>", "Player Name")
  .option("--class <string>", "Player Class")
  .option("--level <number>", "Player Level", parseInt)
  .option("--ancestry <string>", "Player Ancestry")
  .option("--community <string>", "Player Community")
  .option("--subclass <string>", "Player Subclass")
  .option("--tier <number>", "Player Tier", parseInt)
  .action(async (options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      if (data.players.some((p: any) => p.id === options.id)) {
        console.error(`Player with id ${options.id} already exists.`);
        process.exit(1);
      }
      
      const newPlayer = {
        id: options.id,
        name: options.name,
        class: options.class || "",
        level: options.level || 1,
        ancestry: options.ancestry || "",
        community: options.community || "",
        subclass: options.subclass || "",
        tier: options.tier || 1,
        image: "/images/placeholders/player.webp",
        description: "",
        backstory: "",
        stats: {
          agility: 0,
          strength: 0,
          finesse: 0,
          instinct: 0,
          presence: 0,
          knowledge: 0
        },
        backgroundQuestions: [],
        connectionQuestions: []
      };

      data.players.push(newPlayer);
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Added Player: ${options.name}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
```

- [ ] **Step 3: Commit CLI updates**

```bash
git add cli/agent.ts
git commit -m "feat(cli): extend player add command with full attributes and defaults"
```

### Task 2: Add Orna Kaan using CLI

**Files:**
- Modify: `data/campaign.yml` (via CLI)

- [ ] **Step 1: Execute the CLI command to add the character**

Run:
```bash
bun run agent player add \
  --id orna-kaan \
  --name "Orna Kaan" \
  --ancestry "Galapa" \
  --community "Loreborn" \
  --class "Sorcerer" \
  --subclass "Primal Origin" \
  --level 1 \
  --tier 1
```
Expected: Output `Added Player: Orna Kaan`

- [ ] **Step 2: Verify the data was added correctly**

Run: `cat data/campaign.yml`
Expected: Orna Kaan's details, including the injected defaults, appear in the `players` list.

- [ ] **Step 3: Run project validation/build checks**

Run: `bun run lint && bun run build` (or the equivalent typescript check `bunx tsc --noEmit`)
Expected: All checks pass, proving the injected data satisfies the application's types.

- [ ] **Step 4: Commit data changes**

```bash
git add data/campaign.yml
git commit -m "data(players): add Orna Kaan"
```
