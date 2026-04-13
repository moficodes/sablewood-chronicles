---
name: sablewood-agent-cli
description: Use when you need to modify or query the Sablewood Chronicles campaign data via automation. Use this skill whenever interacting with the data/campaign.yml file through the agent CLI tool.
---

# Sablewood Agent CLI

## Overview
This skill provides the instructions on how to effectively use the internal non-TUI agent CLI (`bun run agent` or `bun run cli/agent.ts`) to manage the `campaign.yml` data autonomously. The CLI handles validation, schema constraints, and backup generation safely so you don't have to manually manipulate the YAML file.

## When to Use
- You need to add, update, delete, or list **Players**, **NPCs**, **Locations**, **Events**, or **Quests**.
- You need to update the global **Home** configuration (e.g., next session date).
- You are writing automation tests or performing bulk data updates.
- NEVER try to manually edit the `data/campaign.yml` file using text replacement tools. Always use this CLI.

## Quick Reference
The tool is accessible via `bun run agent <entity> <operation> [options]`.

Entities supported: `home`, `npc`, `location`, `event`, `player`, `quest`

### Home Entity
```bash
# Update the next session date
bun run agent home update --nextSession "June 1st, 2026"
```

### CRUD Entities (NPC, Location, Event, Player)
These entities all follow a standard `list`, `add`, `update`, `delete` pattern.

**Listing Data**
```bash
bun run agent npc list
bun run agent player list
```

**Adding Data**
Note: Most entities require an `--id` and `--name` (or `--title` for events).
```bash
bun run agent player add --id "p5" --name "Gale" --class "Wizard" --level 3
bun run agent event add --id "evt-002" --title "The Ambush" --type "combat"
```

**Updating Data**
Pass the `id` as an argument, then provide the flags you want to update.
```bash
bun run agent location update "l1" --region "The Dark Woods"
```

**Deleting Data**
```bash
bun run agent npc delete "n1"
```

### Quest Entity
Quests are slightly different. They use `--title` as their primary identifier.

```bash
# List all quests including the active quest
bun run agent quest list

# Add a quest
bun run agent quest add --title "Find the chalice" --status "pending" --locationId "l3"

# Update a quest (will update it whether it's the active quest or in the quest list)
bun run agent quest update "Find the chalice" --status "active"

# Delete a quest
bun run agent quest delete "Find the chalice"
```

## Common Mistakes
- **Forgetting Quotes:** Always quote string values containing spaces (e.g., `--name "Big Bob"`).
- **Using `update` without the ID argument:** The `update` commands expect the ID as a positional argument before the flags (e.g., `bun run agent npc update n1 --name "New Name"`).
- **Modifying YAML directly:** Do not use `sed`, `awk`, or `edit` tools on `data/campaign.yml`. Use the CLI.
