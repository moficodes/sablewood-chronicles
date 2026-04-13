# Homepage Empty Players Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a cheeky "Wanted: Heroes" sign when the player list is empty on the homepage.

**Architecture:** We will modify the `PlayerList` component to render the "Wanted" poster UI using Google Fonts (`Shadows_Into_Light` and `Kalam`) when the `players` array is empty, adhering to the project's strict design constraints.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4, Google Fonts

---

### Task 1: Update PlayerList component with empty state

**Files:**
- Modify: `app/components/player-list.tsx`

- [ ] **Step 1: Import Google Fonts**

Update the imports in `app/components/player-list.tsx` to include the required fonts and instantiate them.

```tsx
import Link from "next/link";
import { useState } from "react";
import { Player } from "@/types";
import { Shadows_Into_Light, Kalam } from "next/font/google";

const fontShadows = Shadows_Into_Light({ subsets: ["latin"], weight: ["400"] });
const fontKalam = Kalam({ subsets: ["latin"], weight: ["400", "700"] });
```

- [ ] **Step 2: Add early return for empty state**

Insert the conditional rendering at the beginning of the `PlayerList` component to handle the empty state. This uses `rounded-2xl` to adhere to the 1rem minimum border radius constraint, and avoids 1px borders entirely.

```tsx
export default function PlayerList({ players }: { players: Player[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!players || players.length === 0) {
    return (
      <section className="w-full bg-surface-container-low py-16">
        <div className="max-w-3xl mx-auto px-4 flex justify-center">
          <div className={`bg-[#f4ebd8] p-8 md:p-12 shadow-md transform rotate-2 rounded-2xl relative flex flex-col items-center text-center max-w-lg w-full ${fontKalam.className}`}>
            {/* Pin */}
            <div className="absolute top-3 md:top-4 right-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-slate-800 shadow-lg"></div>
            
            <h3 className={`text-5xl md:text-6xl font-bold text-red-900 mb-8 tracking-wider uppercase mt-4 ${fontShadows.className}`}>Wanted: Heroes</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#3e3101] mb-6 leading-relaxed">The tavern is quiet. Too quiet.</p>
            <p className="text-xl md:text-2xl text-[#3e3101]/80 mb-4 italic">Inquire within... survival not guaranteed.</p>
          </div>
        </div>
      </section>
    );
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % players.length);
// ... rest of existing code
```

- [ ] **Step 3: Run linter and build to verify changes**

Run: `bun run lint && bun run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/components/player-list.tsx
git commit -m "feat: add cheeky wanted poster for empty player list"
```
