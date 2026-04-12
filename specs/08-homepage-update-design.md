# Homepage Update Design

## 1. Overview
The Sablewood Chronicles homepage will be completely overhauled. We are migrating to a centralized flat data architecture and adopting a "Notice Board" layout for the homepage. The design will stay true to the "Living Chronicle" design system, using tonal shifts and avoiding hard borders.

## 2. Data Architecture

### Data Consolidation
Currently, JSON files are scattered across the `app/` folder (e.g., `app/players/data.json`). We will centralize all data into a new root `data/` folder to make it easier to manage as a static site.
- Create `data/` folder at the project root.
- Move `app/players/data.json` to `data/players.json`.
- Move `app/npcs/data.json` to `data/npcs.json`.
- Move `app/locations/data.json` to `data/locations.json`.
- Move `app/timeline/data.json` to `data/timeline.json`.
- Update all existing pages and type references to import data from these new centralized paths.

### Type Validation
We will add proper TypeScript interfaces in `types/index.ts` (or equivalent types file) for the new homepage data.

```typescript
export interface Quest {
  title: string;
  status: 'active' | 'completed' | 'pending';
  locationId?: string; // Optional reference to a location
  description?: string;
}

export interface WantedPerson {
  name: string;
  reward: string;
  image: string;
  lastSeenLocation?: string;
}

export interface HomeData {
  nextSession: string; // e.g. "May 1st, 2026 7PM EST"
  activeQuest: Quest; 
  questList: Quest[];
  mostWanted: WantedPerson[];
  lastLocationId: string;
  nextDestinationId: string;
}
```

### Homepage Data Structure (`data/home.json`)
We will create a new file `data/home.json` with the structure mapping to the `HomeData` type.

## 3. UI and Layout: The Notice Board

### Component Architecture
The homepage (`app/page.tsx`) will be converted to a Client Component (`"use client"`). It will directly import the required JSON files (`home.json`, `players.json`, `locations.json`) to bundle the data for static export.

### Visual Design
The layout will mimic a physical Notice Board:
- **Grid Layout**: A masonry-like or modular grid containing different "pinned notes" (cards).
- **Physicality**: Cards will use subtle rotations (e.g., `rotate-1`, `-rotate-2`) to mimic overlapping physical papers.
- **Typography**: The main site will continue to use *Plus Jakarta Sans*. However, the "Notice Board" cards on the homepage will exclusively use a variety of handwriting fonts. We will import 4-5 different handwriting fonts from Google Fonts (e.g., *Caveat, Kalam, Shadows Into Light, Gochi Hand, Indie Flower*) and assign them to different cards to give a varied, handwritten feel.
- **Depth and Color**: We will strictly follow `DESIGN.md`. 
  - No 1px borders.
  - We will use `surface-container-low` to `surface-container-highest` for the cards.
  - Soft, tinted drop shadows (ambient shadow with tinted `on-surface` color) will emphasize depth.

### Data Rendering Requirements
The homepage will parse the imported data and display the following cards:
- **Welcome Hero**: A brief title/intro.
- **Current Party**: Reads from `players.json` to display the avatars and names of current heroes.
- **Next Session**: Displays `home.json.nextSession`.
- **Active Quest**: Displays `home.json.activeQuest`.
- **Quests**: Displays `home.json.questList`.
- **Most Wanted**: Displays `home.json.mostWanted`.
- **Locations**:
  - Both **Last Location** (`home.json.lastLocationId`) and **Next Destination** (`home.json.nextDestinationId`) will be rendered as simple cards, pulling image and name from `locations.json`.
- **Quick Links**: Aesthetic buttons linking to `/timeline`, `/locations`, and `/npcs`.

## 4. Constraints & Notes
- Static Export compatible (using Client Component and direct imports).
- Must adhere strictly to "The Living Chronicle" aesthetics from `DESIGN.md`.