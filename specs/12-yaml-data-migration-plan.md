# Plan 12: YAML Data Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current multiple JSON data files architecture into a single YAML configuration file to make data entry more human-readable and maintainable.

**Architecture:** We have already created the `campaign.yml` and `src/lib/data.ts` utilities. Now, we need to refactor all React Server Components pulling directly from JSON files to use the `getCampaignData()` utility, and clean up the old JSON files.

**Tech Stack:** Next.js (App Router), React 19, `js-yaml`

---

### Task 1: Refactor Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace imports and fetch data from utility**
```tsx
// Replace:
// import homeDataRaw from "@/data/home.json";
// import playersDataRaw from "@/data/players.json";
// import locationsDataRaw from "@/data/locations.json";

import { getCampaignData } from "@/lib/data";

// Inside Home component:
const { home: homeDataRaw, players: playersDataRaw, locations: locationsDataRaw } = getCampaignData();
```

- [ ] **Step 2: Verify application builds**
Run: `bun run build`
Expected: Passes without errors for this page.

- [ ] **Step 3: Commit**
```bash
git add app/page.tsx
git commit -m "refactor: update home page to use yaml data utility"
```

### Task 2: Refactor Locations Pages

**Files:**
- Modify: `app/locations/page.tsx`
- Modify: `app/locations/[id]/page.tsx`

- [ ] **Step 1: Update locations index page**
```tsx
// In app/locations/page.tsx, replace:
// import locationsData from "@/data/locations.json";
import { getCampaignData } from "@/lib/data";

// Inside component:
const { locations: locationsData } = getCampaignData();
```

- [ ] **Step 2: Update locations detail page**
```tsx
// In app/locations/[id]/page.tsx, replace:
// import locationsData from "@/data/locations.json";
import { getCampaignData } from "@/lib/data";

// Inside component and generateStaticParams:
const { locations: locationsData } = getCampaignData();
```

- [ ] **Step 3: Verify application builds**
Run: `bun run build`
Expected: Passes without errors for these pages.

- [ ] **Step 4: Commit**
```bash
git add app/locations/page.tsx app/locations/\[id\]/page.tsx
git commit -m "refactor: update locations pages to use yaml data utility"
```

### Task 3: Refactor Players Pages

**Files:**
- Modify: `app/players/page.tsx`
- Modify: `app/players/[id]/page.tsx`

- [ ] **Step 1: Update players index page**
```tsx
// In app/players/page.tsx, replace:
// import playersData from "@/data/players.json";
import { getCampaignData } from "@/lib/data";

// Inside component:
const { players: playersData } = getCampaignData();
```

- [ ] **Step 2: Update players detail page**
```tsx
// In app/players/[id]/page.tsx, replace:
// import playersData from "@/data/players.json";
import { getCampaignData } from "@/lib/data";

// Inside component and generateStaticParams:
const { players: playersData } = getCampaignData();
```

- [ ] **Step 3: Verify application builds**
Run: `bun run build`
Expected: Passes without errors for these pages.

- [ ] **Step 4: Commit**
```bash
git add app/players/page.tsx app/players/\[id\]/page.tsx
git commit -m "refactor: update players pages to use yaml data utility"
```

### Task 4: Refactor NPCs Pages

**Files:**
- Modify: `app/npcs/page.tsx`
- Modify: `app/npcs/[id]/page.tsx`

- [ ] **Step 1: Update NPCs index page**
```tsx
// In app/npcs/page.tsx, replace:
// import npcs from "@/data/npcs.json";
import { getCampaignData } from "@/lib/data";

// Inside component:
const { npcs } = getCampaignData();
```

- [ ] **Step 2: Update NPCs detail page**
```tsx
// In app/npcs/[id]/page.tsx, replace:
// import npcs from "@/data/npcs.json";
import { getCampaignData } from "@/lib/data";

// Inside component and generateStaticParams:
const { npcs } = getCampaignData();
```

- [ ] **Step 3: Verify application builds**
Run: `bun run build`
Expected: Passes without errors for these pages.

- [ ] **Step 4: Commit**
```bash
git add app/npcs/page.tsx app/npcs/\[id\]/page.tsx
git commit -m "refactor: update NPCs pages to use yaml data utility"
```

### Task 5: Refactor Timeline Page and Clean Up

**Files:**
- Modify: `app/timeline/page.tsx`
- Delete: `data/home.json`, `data/locations.json`, `data/timeline.json`, `data/players.json`, `data/npcs.json`

- [ ] **Step 1: Update Timeline page**
```tsx
// In app/timeline/page.tsx, replace:
// import eventsDataFile from '@/data/timeline.json';
import { getCampaignData } from "@/lib/data";

// Inside component:
const { timeline: eventsDataFile } = getCampaignData();
```

- [ ] **Step 2: Delete old JSON files**
Run: `rm data/home.json data/locations.json data/timeline.json data/players.json data/npcs.json`

- [ ] **Step 3: Final build verification**
Run: `bun run build && bun run lint`
Expected: Passes without errors.

- [ ] **Step 4: Commit**
```bash
git add app/timeline/page.tsx
git rm data/home.json data/locations.json data/timeline.json data/players.json data/npcs.json
git commit -m "refactor: update timeline page and remove old json files"
```
