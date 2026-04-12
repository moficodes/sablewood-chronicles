# Plan 09: Player Data Expansion and Backstory

## Objectives
1. **Extend Player Data**: Add 2 completely new players to the existing roster in `data/players.json`.
2. **Expand Context**: Update all 4 players to have 2-4 `backgroundQuestions` and `connectionQuestions` each.
3. **Enhance Descriptions**: Rewrite player `description` fields to be longer and more engaging.
4. **New Field - Backstory**:
   - Add a `backstory: string;` property to the `Player` interface in `types/index.ts`.
   - Populate the `backstory` field for all 4 players in `data/players.json`.
5. **UI Updates**:
   - Display the new `backstory` field in the player detail page (`app/players/[id]/page.tsx`).
   - The backstory will be rendered as a prominent text section, fitting the aesthetic guidelines (Material Depth, using appropriate surface colors, maintaining high-legibility text).

## Implementation Steps
1. **Types (`types/index.ts`)**: Add `backstory?: string;` (or required `backstory: string;`) to `export interface Player`.
2. **Data (`data/players.json`)**: 
   - Add two new player entries (e.g., an Elf Spellcaster and an Orc Ranger).
   - For all 4 players: Write expanded descriptions, a new `backstory` field, and additional background/connection questions (2-4 per type).
3. **UI (`app/players/[id]/page.tsx`)**:
   - Insert a new section for the `backstory` under the header area and before the traits/questions grid, or inside the "Background" section.
   - Use standard typography spacing and surface/on-surface token classes without borders.