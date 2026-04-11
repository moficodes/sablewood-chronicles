# Daggerheart Player Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the player data model to Daggerheart conventions and implement a card-based list view with a detailed individual player page using the Living Chronicle design system.

**Architecture:** We will formalize the `Player` type in a new `types/index.ts` file. We will update the mock data in `app/players/data.json` to match the new schema. The main `app/players/page.tsx` will be refactored to render the new card layout with an image and Next.js `<Link>` components. We will create a new dynamic route `app/players/[id]/page.tsx` for the detailed view.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4

---

### Task 1: Define Types and Update Data

**Files:**
- Create: `types/index.ts`
- Modify: `app/players/data.json`

- [ ] **Step 1: Create the Player type definition**

Create the file `types/index.ts` and add the new `Player` interface.

```typescript
export interface QA {
  question: string;
  answer: string;
}

export interface PlayerStats {
  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;
}

export interface Player {
  id: string;
  name: string;
  image: string;
  ancestry: string;
  community: string;
  class: string;
  subclass: string;
  level: number;
  tier: number;
  description: string;
  stats: PlayerStats;
  backgroundQuestions: QA[];
  connectionQuestions: QA[];
}
```

- [ ] **Step 2: Update mock data to Daggerheart schema**

Replace the contents of `app/players/data.json` with the updated structure:

```json
[
  {
    "id": "p1",
    "name": "Kaelen Swift",
    "image": "https://placehold.co/400x400/8d34b4/fff8f0?text=KS",
    "ancestry": "Ribbet",
    "community": "Underborne",
    "class": "Rogue",
    "subclass": "Nightwalker",
    "level": 2,
    "tier": 1,
    "description": "A swift and cunning rogue with a mysterious past, striking from the shadows.",
    "stats": {
      "agility": 2,
      "strength": -1,
      "finesse": 3,
      "instinct": 1,
      "presence": 0,
      "knowledge": 1
    },
    "backgroundQuestions": [
      {
        "question": "Who taught you how to hide in plain sight?",
        "answer": "An old beggar who was actually a retired master thief."
      }
    ],
    "connectionQuestions": [
      {
        "question": "Which member of the party caught you stealing and let you go?",
        "answer": "Thrain saw me lift an apple but pretended to look the other way."
      }
    ]
  },
  {
    "id": "p2",
    "name": "Thrain Ironshield",
    "image": "https://placehold.co/400x400/954b00/fff8f0?text=TI",
    "ancestry": "Dwarf",
    "community": "Highborne",
    "class": "Warrior",
    "subclass": "Stalwart",
    "level": 2,
    "tier": 1,
    "description": "A stoic dwarven warrior who honors his ancestors and protects his allies.",
    "stats": {
      "agility": 0,
      "strength": 3,
      "finesse": 1,
      "instinct": 0,
      "presence": -1,
      "knowledge": 2
    },
    "backgroundQuestions": [
      {
        "question": "What heirloom weapon do you carry?",
        "answer": "The Ironshield family broadsword, forged three ages ago."
      }
    ],
    "connectionQuestions": [
      {
        "question": "Who in the party do you trust to guard your back?",
        "answer": "I trust Kaelen, despite his sticky fingers."
      }
    ]
  }
]
```

- [ ] **Step 3: Run TypeScript compiler to ensure no immediate breaks**

Run: `bun run tsc --noEmit`
*(Note: It may fail on `app/players/page.tsx` since we haven't updated it yet, but we will fix that in the next task).*

### Task 2: Refactor the Party Card View

**Files:**
- Modify: `app/players/page.tsx`

- [ ] **Step 1: Update the grid to match the new design requirements**

Replace the contents of `app/players/page.tsx` to use the new `Player` type, display the image, and link to the detail page. Remove the old stats grid.

```tsx
import Link from "next/link";
import playersData from "./data.json";
import { Player } from "@/types";

const players: Player[] = playersData;

export default function PlayersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-12">
        The Party
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((player) => (
          <Link href={`/players/${player.id}`} key={player.id} className="group outline-none">
            <div className="bg-surface-container-low p-6 rounded-[2rem] relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary h-full flex flex-col">
              {/* Background tonal shift */}
              <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-[1.5rem] -z-10 transition-transform duration-500 group-hover:scale-[0.98]"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 bg-surface-container-highest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={player.image} alt={player.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface leading-tight">{player.name}</h2>
                  <p className="text-sm font-medium text-outline-variant mt-1">
                    Lvl {player.level} • {player.ancestry} {player.community}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                 <p className="text-sm font-bold text-primary tracking-wide uppercase mb-1">
                  {player.class} / {player.subclass}
                </p>
              </div>
              
              <p className="text-on-surface line-clamp-3 flex-grow">{player.description}</p>
              
              <div className="mt-6 flex justify-end">
                <span className="text-primary font-medium text-sm group-hover:underline underline-offset-4 decoration-primary-container decoration-2">
                  View Chronicle →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript builds**

Run: `bun run tsc --noEmit`
Expected: Passes without errors related to `Player`.

### Task 3: Create the Detail View

**Files:**
- Create: `app/players/[id]/page.tsx`

- [ ] **Step 1: Create the dynamic route component**

Create `app/players/[id]/page.tsx`. This page will find the player from the JSON data and render their full details using the "Living Chronicle" patterns (glassmorphism, no borders, specific surface colors).

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import playersData from "../data.json";
import { Player } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return playersData.map((p) => ({
    id: p.id,
  }));
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const player = (playersData as Player[]).find((p) => p.id === resolvedParams.id);

  if (!player) {
    notFound();
  }

  const statLabels = [
    { key: "agility", label: "AGI" },
    { key: "strength", label: "STR" },
    { key: "finesse", label: "FIN" },
    { key: "instinct", label: "INS" },
    { key: "presence", label: "PRE" },
    { key: "knowledge", label: "KNO" },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/players" 
        className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dim transition-colors mb-8"
      >
        ← Back to Party
      </Link>

      <div className="bg-surface-container-low rounded-[2rem] p-6 sm:p-10 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-surface-container-lowest m-2 sm:m-4 rounded-[1.5rem] -z-10"></div>
        
        <div className="flex flex-col sm:flex-row gap-8 items-start">
           <div className="w-32 h-32 sm:w-48 sm:h-48 shrink-0 rounded-[2rem] overflow-hidden bg-surface-container-highest shadow-sm">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
           </div>

           <div className="flex-grow">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <h1 className="text-4xl sm:text-5xl font-bold text-on-surface tracking-tight">{player.name}</h1>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="px-4 py-1.5 bg-tertiary-container text-on-surface rounded-full text-sm font-bold">
                    Tier {player.tier} • Level {player.level}
                 </span>
                 <span className="px-4 py-1.5 bg-secondary-container text-secondary font-bold rounded-full text-sm">
                    {player.ancestry} ({player.community})
                 </span>
                 <span className="px-4 py-1.5 bg-primary-container text-primary font-bold rounded-full text-sm">
                    {player.class} / {player.subclass}
                 </span>
              </div>

              <p className="text-lg text-on-surface leading-relaxed">{player.description}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Traits</h2>
          <div className="flex flex-col gap-4">
            {statLabels.map((stat) => (
              <div key={stat.key} className="bg-surface-container rounded-[1.5rem] p-4 flex justify-between items-center">
                <span className="font-bold text-outline-variant tracking-widest">{stat.label}</span>
                <span className="text-2xl font-bold text-primary-dim">
                  {player.stats[stat.key] > 0 ? `+${player.stats[stat.key]}` : player.stats[stat.key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-12">
          {player.backgroundQuestions.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-6">Background</h2>
              <div className="space-y-6">
                {player.backgroundQuestions.map((q, i) => (
                  <div key={i} className="bg-surface-variant rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-lg rounded-bl-lg p-6 sm:p-8">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">{q.question}</h3>
                    <p className="text-on-surface font-serif italic text-lg leading-relaxed">&quot;{q.answer}&quot;</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {player.connectionQuestions.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-6">Connections</h2>
              <div className="space-y-6">
                {player.connectionQuestions.map((q, i) => (
                  <div key={i} className="bg-surface-variant rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-lg rounded-bl-lg p-6 sm:p-8">
                    <h3 className="text-sm font-bold text-tertiary uppercase tracking-wider mb-3">{q.question}</h3>
                    <p className="text-on-surface font-serif italic text-lg leading-relaxed">&quot;{q.answer}&quot;</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build project**

Run: `bun run build`
Expected: Successfully compiles without errors.

- [ ] **Step 3: Commit all changes**

Run:
```bash
git add types/index.ts app/players/data.json app/players/page.tsx app/players/\[id\]/page.tsx
git commit -m "feat: migrate player data to daggerheart system and add detail view"
```