# Add Player Character: Orna Kaan

## Goal
Add a new player character named Orna Kaan to the campaign data, ensuring she conforms to the `Player` schema and can be managed via the data file.

## Requirements
- **Name:** Orna Kaan
- **Ancestry:** Galapa
- **Community:** Loreborn
- **Class:** Sorcerer
- **Subclass:** Primal Origin
- **Level:** 1
- **Tier:** 1

## Implementation Approach
Since the user requested using the Agent CLI, but the CLI currently lacks full argument support for `Player` fields (like ancestry, community, subclass, and tier), we have two sub-tasks:
1. **Update `cli/agent.ts`:** Extend the `player add` and `player update` commands to support the full `Player` interface. We will add flags for `--ancestry`, `--community`, `--subclass`, and `--tier`. Additionally, we will inject safe placeholder defaults for nested required fields (`stats`, `backgroundQuestions`, `connectionQuestions`, `image`, `description`, `backstory`) to ensure the generated YAML adheres to the strict TypeScript `Player` interface.
2. **Execute the CLI Command:** Once the CLI is updated, we will run `bun run agent player add ...` to insert Orna Kaan into `data/campaign.yml`.

## Data Mapping
- **ID:** `orna-kaan`
- **Name:** Orna Kaan
- **Ancestry:** Galapa
- **Community:** Loreborn
- **Class:** Sorcerer
- **Subclass:** Primal Origin
- **Level:** 1
- **Tier:** 1

*Placeholder defaults for required fields will be injected automatically by the updated CLI.*
