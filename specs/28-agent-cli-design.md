# Agent CLI Design

## Overview
A non-TUI CLI tool designed specifically for autonomous agents to modify the `@data/campaign.yml` file. This CLI runs alongside the existing TUI CLI and provides simple CRUD subcommands.

## Approach
- Use `commander` for robust subcommand and flag parsing.
- Provide discrete subcommands for each entity type: `home`, `npc`, `location`, `event`, `player`, `quest`.
- Reuse existing data access utilities (`readData`, `writeData`) from `cli/data.ts`.

## Commands Structure

- `bun run agent-cli home update [options]` (e.g. `--nextSession`)
- `bun run agent-cli npc add [options]`
- `bun run agent-cli npc update <id> [options]`
- `bun run agent-cli npc delete <id>`
- `bun run agent-cli location add [options]`
- `bun run agent-cli location update <id> [options]`
- `bun run agent-cli location delete <id>`
- `bun run agent-cli event add [options]`
- `bun run agent-cli event update <id> [options]`
- `bun run agent-cli event delete <id>`
- `bun run agent-cli player add [options]`
- `bun run agent-cli player update <id> [options]`
- `bun run agent-cli player delete <id>`
- `bun run agent-cli quest add [options]`
- `bun run agent-cli quest update <title> [options]`
- `bun run agent-cli quest delete <title>`

## File Structure
- `cli/agent.ts`: Entry point for the new CLI.
- `package.json`: A script shortcut, e.g., `"agent": "bun run cli/agent.ts"`, and the addition of `commander` dependency.

## Error Handling
- Invalid JSON strings passed in flags will be caught by `commander` or explicitly validated.
- If an entity to update/delete is not found, the CLI will error with code 1 and a clear message.
- Validation using `schema.ts` (Zod) will ensure that any writes result in a valid `campaign.yml`.

## Testing/Verification
- Run the CLI with help flag to ensure output.
- Add a test entity and verify it writes to the YAML.
