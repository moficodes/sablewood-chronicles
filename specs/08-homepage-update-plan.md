# Homepage Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize data files into a root `data/` directory and rebuild the homepage as a "Notice Board" populated with data.

**Architecture:** Data files are moved to `data/*.json`. The homepage becomes a Client Component pulling from these files, rendering an asymmetrical, overlapping grid of cards using handwriting fonts to simulate a physical notice board.

**Tech Stack:** Next.js App Router, Tailwind CSS, TypeScript, `next/font/google`.

---

### Task 1: Add New Data Types

**Files:**
- Modify: `types/index.ts`

- [ ] **Step 1: Add Quest, WantedPerson, and HomeData types**

Open `types/index.ts` and append the following types to the bottom:

```typescript
export interface Quest {
  title: string;
  status: 'active' | 'completed' | 'pending';
  locationId?: string;
  description?: string;
}

export interface WantedPerson {
  name: string;
  reward: string;
  image: string;
  lastSeenLocation?: string;
}

export interface HomeData {
  nextSession: string;
  activeQuest: Quest;
  questList: Quest[];
  mostWanted: WantedPerson[];
  lastLocationId: string;
  nextDestinationId: string;
}
```

- [ ] **Step 2: Check compiler errors**

Run: `bun run tsc --noEmit`
Expected: Passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "chore: add types for homepage data"
```

---

### Task 2: Centralize Data Files

**Files:**
- Create: `data/` directory
- Create: `data/home.json`
- Move: `app/players/data.json` -> `data/players.json`
- Move: `app/npcs/data.json` -> `data/npcs.json`
- Move: `app/locations/data.json` -> `data/locations.json`
- Move: `app/timeline/data.json` -> `data/timeline.json`

- [ ] **Step 1: Create directory and move files**

Run the following commands:
```bash
mkdir -p data
mv app/players/data.json data/players.json
mv app/npcs/data.json data/npcs.json
mv app/locations/data.json data/locations.json
mv app/timeline/data.json data/timeline.json
```

- [ ] **Step 2: Create data/home.json**

Create `data/home.json` with the following content:

```json
{
  "nextSession": "May 1st, 2026 7PM EST",
  "activeQuest": {
    "title": "Defeat the Cave Troll",
    "status": "active",
    "locationId": "l2",
    "description": "Clear the Whispering Caves so merchants can safely pass."
  },
  "questList": [
    {
      "title": "Find the lost artifact",
      "status": "pending",
      "locationId": "l3"
    }
  ],
  "mostWanted": [
    {
      "name": "The Shadow King",
      "reward": "1000g",
      "image": "https://placehold.co/400x400/3e3101/fff8f0?text=SK",
      "lastSeenLocation": "Unknown"
    }
  ],
  "lastLocationId": "l2",
  "nextDestinationId": "l1"
}
```

- [ ] **Step 3: Commit**

```bash
git add data/
git add app/players/data.json app/npcs/data.json app/locations/data.json app/timeline/data.json
git commit -m "refactor: centralize JSON data into root data directory"
```

---

### Task 3: Update Existing Imports

**Files:**
- Modify: `app/players/page.tsx`
- Modify: `app/npcs/page.tsx`
- Modify: `app/locations/page.tsx`
- Modify: `app/timeline/page.tsx`
- Modify: `app/players/[id]/page.tsx` (if it imports data)
- Modify: `app/npcs/[id]/page.tsx` (if it imports data)
- Modify: `app/locations/[id]/page.tsx` (if it imports data)

- [ ] **Step 1: Update players page import**

In `app/players/page.tsx`, replace `import playersData from "./data.json";` with:
```typescript
import playersData from "@/data/players.json";
```

- [ ] **Step 2: Update locations page import**

In `app/locations/page.tsx`, replace `import locationsData from "./data.json";` with:
```typescript
import locationsData from "@/data/locations.json";
```

- [ ] **Step 3: Update npcs page import**

In `app/npcs/page.tsx`, replace `import npcsData from "./data.json";` with:
```typescript
import npcsData from "@/data/npcs.json";
```

- [ ] **Step 4: Update timeline page import**

In `app/timeline/page.tsx`, replace `import data from "./data.json";` with:
```typescript
import data from "@/data/timeline.json";
```

- [ ] **Step 5: Check dynamic routes (e.g. `[id]/page.tsx`)**

*Agent instruction: Use `grep` to find any other files importing from `./data.json` or `../data.json` inside `app/` and update them to use `@/data/players.json`, `@/data/locations.json`, etc.*

- [ ] **Step 6: Build verification**

Run: `bun run build`
Expected: Next.js builds the static pages without import errors.

- [ ] **Step 7: Commit**

```bash
git add app/
git commit -m "refactor: update imports to use centralized data directory"
```

---

### Task 4: Rebuild Homepage (Notice Board)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite app/page.tsx**

Replace the contents of `app/page.tsx` with the following code. It implements the asymmetrical Notice Board using `next/font/google` handwriting fonts, reads from the JSON data, and handles missing relationships gracefully.

```tsx
"use client";

import Link from "next/link";
import { Caveat, Kalam, Shadows_Into_Light, Gochi_Hand, Indie_Flower } from "next/font/google";
import homeDataRaw from "@/data/home.json";
import playersDataRaw from "@/data/players.json";
import locationsDataRaw from "@/data/locations.json";
import { HomeData, Player, Location } from "@/types";

// Load handwriting fonts
const fontCaveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });
const fontKalam = Kalam({ subsets: ["latin"], weight: ["400", "700"] });
const fontShadows = Shadows_Into_Light({ subsets: ["latin"], weight: ["400"] });
const fontGochi = Gochi_Hand({ subsets: ["latin"], weight: ["400"] });
const fontIndie = Indie_Flower({ subsets: ["latin"], weight: ["400"] });

const homeData: HomeData = homeDataRaw as HomeData;
const players: Player[] = playersDataRaw as Player[];
const locations: Location[] = locationsDataRaw as Location[];

export default function Home() {
  const lastLocation = locations.find(l => l.id === homeData.lastLocationId);
  const nextLocation = locations.find(l => l.id === homeData.nextDestinationId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
        The Notice Board
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Next Session Note */}
        <div className={`bg-surface-container-highest p-6 rounded-[1rem] shadow-sm rotate-2 ${fontCaveat.className}`}>
          <h2 className="text-2xl font-bold text-primary-dim mb-2 border-b-2 border-outline-variant/20 pb-2">Next Session</h2>
          <p className="text-3xl text-on-surface mt-4">{homeData.nextSession}</p>
        </div>

        {/* Active Quest Note */}
        <div className={`bg-surface-container-high p-6 rounded-[2rem_1rem] shadow-sm -rotate-1 ${fontKalam.className}`}>
          <h2 className="text-2xl font-bold text-secondary mb-2">Urgent: {homeData.activeQuest.title}</h2>
          <p className="text-xl text-on-surface mb-2">{homeData.activeQuest.description}</p>
          <div className="text-lg text-outline-variant">Status: <span className="text-primary font-bold">{homeData.activeQuest.status}</span></div>
        </div>

        {/* Current Party Roster Note */}
        <div className={`bg-surface-container p-6 rounded-[1.5rem] shadow-sm rotate-1 ${fontGochi.className} md:col-span-2 lg:col-span-1`}>
          <h2 className="text-3xl font-bold text-primary mb-4">The Party</h2>
          <div className="space-y-4">
            {players.map(player => (
              <div key={player.id} className="flex items-center gap-3 bg-surface-container-low p-2 rounded-xl">
                <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="text-xl font-bold text-on-surface">{player.name}</div>
                  <div className="text-sm text-outline-variant">{player.class}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Wanted Poster */}
        {homeData.mostWanted.map((wanted, idx) => (
          <div key={idx} className={`bg-surface-dim p-6 rounded-[1rem_3rem_1rem_1rem] shadow-sm -rotate-2 ${fontShadows.className} flex flex-col items-center text-center`}>
            <h2 className="text-3xl font-bold text-on-surface uppercase tracking-widest mb-4">Wanted</h2>
            <img src={wanted.image} alt={wanted.name} className="w-32 h-32 rounded-lg object-cover mb-4 border-4 border-surface-container-highest" />
            <div className="text-2xl font-bold text-on-surface">{wanted.name}</div>
            <div className="text-xl text-secondary mt-2">Reward: {wanted.reward}</div>
            {wanted.lastSeenLocation && <div className="text-lg text-outline-variant mt-1">Last seen: {wanted.lastSeenLocation}</div>}
          </div>
        ))}

        {/* Location Cards */}
        {lastLocation && (
          <div className={`bg-surface-container-low p-6 rounded-[2rem] shadow-sm rotate-1 ${fontIndie.className}`}>
            <h2 className="text-2xl font-bold text-on-surface mb-3">Last Camp</h2>
            {lastLocation.images?.[0] && (
              <img src={lastLocation.images[0]} alt={lastLocation.name} className="w-full h-32 object-cover rounded-xl mb-3" />
            )}
            <div className="text-xl font-bold text-primary">{lastLocation.name}</div>
            <div className="text-lg text-on-surface">{lastLocation.region}</div>
          </div>
        )}

        {nextLocation && (
          <div className={`bg-surface-container-lowest p-6 rounded-[1rem] shadow-sm -rotate-1 ${fontIndie.className}`}>
            <h2 className="text-2xl font-bold text-on-surface mb-3">Destination</h2>
            {nextLocation.images?.[0] && (
              <img src={nextLocation.images[0]} alt={nextLocation.name} className="w-full h-32 object-cover rounded-xl mb-3" />
            )}
            <div className="text-xl font-bold text-secondary">{nextLocation.name}</div>
            <div className="text-lg text-on-surface">{nextLocation.region}</div>
          </div>
        )}

        {/* Quick Links Note */}
        <div className={`bg-primary-container p-6 rounded-[3rem_1rem] shadow-sm rotate-2 ${fontCaveat.className} flex flex-col justify-center`}>
          <h2 className="text-3xl font-bold text-on-primary-container mb-4">Directories</h2>
          <div className="flex flex-col gap-3">
            <Link href="/timeline" className="text-2xl text-primary hover:text-primary-dim transition-colors bg-surface-container-lowest p-2 rounded-lg text-center font-bold">Read the Chronicles</Link>
            <Link href="/locations" className="text-2xl text-primary hover:text-primary-dim transition-colors bg-surface-container-lowest p-2 rounded-lg text-center font-bold">Maps & Places</Link>
            <Link href="/npcs" className="text-2xl text-primary hover:text-primary-dim transition-colors bg-surface-container-lowest p-2 rounded-lg text-center font-bold">People of Interest</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build verification**

Run: `bun run build`
Expected: Passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rebuild homepage as a dynamic Notice Board"
```
