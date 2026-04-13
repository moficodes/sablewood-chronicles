# Admin Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a local-only Next.js admin app that allows editing the campaign YAML data directly.

**Architecture:** We will set up a Bun workspace with the `admin/` directory acting as a separate Next.js app. The admin app will have an API route (`/api/campaign`) that reads from and writes to `../data/campaign.yml` using `js-yaml`. It will provide standard HTML forms (managed with standard React state) to edit Players, NPCs, Locations, and Timeline events.

**Tech Stack:** Next.js (App Router), React 19, Tailwind CSS v4, `js-yaml`

---

### Task 1: Initialize Admin Next.js App & Workspace

**Files:**
- Modify: `package.json`
- Create: `bun-workspace.yaml` (optional/alternative depending on how Bun treats workspaces, we'll configure standard `workspaces` in package.json)
- Create: `admin/package.json`
- Create: `admin/next.config.ts`
- Create: `admin/app/layout.tsx`
- Create: `admin/app/page.tsx`
- Create: `admin/app/globals.css`

- [ ] **Step 1: Configure Bun Workspace in root**

Add `"workspaces": ["admin"]` to the root `package.json`:

```bash
sed -i '' 's/"private": true,/"private": true,\n  "workspaces": ["admin"],/g' package.json
```

- [ ] **Step 2: Initialize Next.js in `admin/`**

```bash
bun create next-app admin --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-bun --yes
```

- [ ] **Step 3: Update `admin/package.json` to use correct `next` port**

Modify `admin/package.json` so the dev script runs on a different port than the main app (e.g., 3001).

```bash
sed -i '' 's/"dev": "next dev"/"dev": "next dev -p 3001"/g' admin/package.json
```

- [ ] **Step 4: Add `js-yaml` dependency to `admin/`**

```bash
cd admin && bun add js-yaml && bun add -d @types/js-yaml
```

- [ ] **Step 5: Create a simple layout**

Replace `admin/app/layout.tsx`:

```tsx
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create a simple global CSS**

Replace `admin/app/globals.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 7: Verify**

Run `cd admin && bun run dev` (in background/separate terminal) and verify it starts on port 3001.
Commit changes:
```bash
git add package.json admin/
git commit -m "chore: initialize admin next.js app workspace"
```

### Task 2: Build the API Route for YAML Data

**Files:**
- Create: `admin/app/api/campaign/route.ts`

- [ ] **Step 1: Create the API route file**

Create `admin/app/api/campaign/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Path relative to the admin app directory (admin/ -> ../data/campaign.yml)
const getCampaignFilePath = () => path.join(process.cwd(), '../data/campaign.yml');

export async function GET() {
  try {
    const filePath = getCampaignFilePath();
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading campaign.yml:', error);
    return NextResponse.json({ error: 'Failed to read campaign data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json();
    const filePath = getCampaignFilePath();
    
    // Convert back to YAML, preserving block styles for multiline strings
    const newYamlContent = yaml.dump(updatedData, {
      lineWidth: -1, // Don't wrap long lines
      noRefs: true,
    });
    
    fs.writeFileSync(filePath, newYamlContent, 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing campaign.yml:', error);
    return NextResponse.json({ error: 'Failed to save campaign data' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit changes**

```bash
git add admin/app/api/campaign/route.ts
git commit -m "feat: add api route for reading/writing campaign yaml"
```

### Task 3: Create Admin UI Layout & Navigation

**Files:**
- Create: `admin/components/Sidebar.tsx`
- Modify: `admin/app/layout.tsx`

- [ ] **Step 1: Create Sidebar component**

Create `admin/components/Sidebar.tsx`:

```tsx
import Link from 'next/link';

export default function Sidebar() {
  const links = [
    { name: 'Home Data', path: '/' },
    { name: 'Players', path: '/players' },
    { name: 'NPCs', path: '/npcs' },
    { name: 'Locations', path: '/locations' },
    { name: 'Timeline', path: '/timeline' },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b font-bold text-lg">
        Campaign Admin
      </div>
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link 
            key={link.path} 
            href={link.path}
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Update Layout**

Modify `admin/app/layout.tsx` to include the Sidebar:

```tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900 flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit changes**

```bash
git add admin/components admin/app/layout.tsx
git commit -m "feat: add admin layout and sidebar navigation"
```

### Task 4: Implement Base Form Wrapper and Home Data Edit

**Files:**
- Modify: `admin/app/page.tsx`

- [ ] **Step 1: Build the Home Data Page**

Replace `admin/app/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function HomeAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/campaign')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/campaign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      alert('Saved successfully!');
    } catch (e) {
      alert('Failed to save.');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Error loading data.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Home Data</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Next Session</label>
          <input 
            type="text" 
            className="w-full border p-2 rounded"
            value={data.home.nextSession || ''}
            onChange={(e) => setData({ ...data, home: { ...data.home, nextSession: e.target.value } })}
          />
        </div>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Active Quest</h2>
        <div className="p-4 border rounded space-y-3 bg-gray-50">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded"
              value={data.home.activeQuest.title || ''}
              onChange={(e) => setData({ ...data, home: { ...data.home, activeQuest: { ...data.home.activeQuest, title: e.target.value } } })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full border p-2 rounded h-24"
              value={data.home.activeQuest.description || ''}
              onChange={(e) => setData({ ...data, home: { ...data.home, activeQuest: { ...data.home.activeQuest, description: e.target.value } } })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add admin/app/page.tsx
git commit -m "feat: add editable home data view"
```

### Task 5: Implement Players List and Edit View

**Files:**
- Create: `admin/app/players/page.tsx`
- Create: `admin/app/players/[id]/page.tsx`

- [ ] **Step 1: Create Players List View**

Create `admin/app/players/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersList() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/campaign').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Players</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.players?.map((player: any) => (
          <Link key={player.id} href={`/players/${player.id}`} className="block border p-4 rounded bg-white hover:border-blue-500">
            <h2 className="font-semibold">{player.name}</h2>
            <p className="text-sm text-gray-500">{player.class} - {player.subclass}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Player Edit View**

Create `admin/app/players/[id]/page.tsx` (a simplified view, full implementation handles more fields):

```tsx
'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayerEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/campaign').then(res => res.json()).then(setData);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/campaign', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    router.push('/players');
  };

  if (!data) return <div>Loading...</div>;

  const playerIndex = data.players.findIndex((p: any) => p.id === resolvedParams.id);
  const player = data.players[playerIndex];

  if (!player) return <div>Player not found</div>;

  const updateField = (field: string, value: string) => {
    const newPlayers = [...data.players];
    newPlayers[playerIndex] = { ...newPlayers[playerIndex], [field]: value };
    setData({ ...data, players: newPlayers });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit {player.name}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full border p-2 rounded" value={player.name} onChange={(e) => updateField('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border p-2 rounded h-32" value={player.description || ''} onChange={(e) => updateField('description', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Backstory</label>
          <textarea className="w-full border p-2 rounded h-48" value={player.backstory || ''} onChange={(e) => updateField('backstory', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit changes**

```bash
git add admin/app/players
git commit -m "feat: add player list and edit views"
```

### Task 6: Implement remaining entities (NPCs, Locations, Timeline)

*(These follow the exact same pattern as Players, just reading different arrays from `data`.)*

**Files:**
- Create: `admin/app/npcs/page.tsx`
- Create: `admin/app/npcs/[id]/page.tsx`
- Create: `admin/app/locations/page.tsx`
- Create: `admin/app/locations/[id]/page.tsx`
- Create: `admin/app/timeline/page.tsx`
- Create: `admin/app/timeline/[id]/page.tsx`

- [ ] **Step 1: NPCs List and Edit**
Use the player pattern to create `admin/app/npcs/page.tsx` and `admin/app/npcs/[id]/page.tsx`.

- [ ] **Step 2: Locations List and Edit**
Use the player pattern to create `admin/app/locations/page.tsx` and `admin/app/locations/[id]/page.tsx`.

- [ ] **Step 3: Timeline List and Edit**
Use the player pattern to create `admin/app/timeline/page.tsx` and `admin/app/timeline/[id]/page.tsx`.

- [ ] **Step 4: Commit changes**

```bash
git add admin/app/npcs admin/app/locations admin/app/timeline
git commit -m "feat: add list and edit views for npcs, locations, timeline"
```