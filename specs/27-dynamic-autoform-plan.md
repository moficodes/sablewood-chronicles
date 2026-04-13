# Dynamic AutoForm Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a generic, schema-driven AutoForm component in the `admin/` application to automatically generate form fields for all entity types defined in `types/index.ts`, handling deep nesting and automatic cleanup of empty optional fields.

**Architecture:** We will create a strongly typed schema definition system in `admin/lib/schema.ts` to describe the shape of campaign entities. A recursive `AutoForm` component will render these schemas dynamically. A `cleanData` utility will pre-process the output before sending the `PUT` request to ensure `js-yaml` output stays clean without stray empty strings or arrays.

**Tech Stack:** Next.js (App Router), React 19, Tailwind CSS v4

---

### Task 1: Implement Schema Types and Cleanup Utility

**Files:**
- Create: `admin/lib/schema.ts`
- Create: `admin/lib/utils.ts`

- [ ] **Step 1: Define Schema Types**

Create `admin/lib/schema.ts`:

```typescript
export type FieldType = 'string' | 'number' | 'textarea' | 'object' | 'array';

export interface BaseFieldSchema {
  type: FieldType;
  label: string;
  optional?: boolean;
}

export interface StringFieldSchema extends BaseFieldSchema {
  type: 'string' | 'textarea';
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: 'number';
}

export interface ObjectFieldSchema extends BaseFieldSchema {
  type: 'object';
  fields: Record<string, FieldSchema>;
}

export interface ArrayFieldSchema extends BaseFieldSchema {
  type: 'array';
  itemSchema: FieldSchema;
}

export type FieldSchema = StringFieldSchema | NumberFieldSchema | ObjectFieldSchema | ArrayFieldSchema;

export type EntitySchema = Record<string, FieldSchema>;
```

- [ ] **Step 2: Implement Data Cleanup Utility**

Create `admin/lib/utils.ts`:

```typescript
import { FieldSchema, EntitySchema } from './schema';

/**
 * Recursively cleans an object by removing empty strings, nulls, undefined, 
 * and empty arrays/objects if they are marked as optional in the schema.
 */
export function cleanData(data: any, schema: EntitySchema | FieldSchema): any {
  if (data === null || data === undefined) return data;

  // Handle root EntitySchema (Record<string, FieldSchema>) vs FieldSchema
  const isEntitySchema = !('type' in schema);
  
  if (isEntitySchema) {
    const objSchema = schema as EntitySchema;
    const cleanedObj: Record<string, any> = {};
    
    for (const key of Object.keys(data)) {
      if (key === 'id') {
        cleanedObj[key] = data[key];
        continue;
      }
      
      const fieldSchema = objSchema[key];
      if (!fieldSchema) {
        cleanedObj[key] = data[key]; // Preserve unknown fields just in case
        continue;
      }
      
      const cleanedValue = cleanData(data[key], fieldSchema);
      
      // Determine if it's empty
      const isEmptyString = typeof cleanedValue === 'string' && cleanedValue.trim() === '';
      const isNullOrUndef = cleanedValue === null || cleanedValue === undefined;
      const isEmptyArray = Array.isArray(cleanedValue) && cleanedValue.length === 0;
      const isEmptyObject = typeof cleanedValue === 'object' && cleanedValue !== null && !Array.isArray(cleanedValue) && Object.keys(cleanedValue).length === 0;
      
      const isEmpty = isEmptyString || isNullOrUndef || isEmptyArray || isEmptyObject;
      
      if (isEmpty && fieldSchema.optional) {
        continue; // Strip it
      }
      
      cleanedObj[key] = cleanedValue;
    }
    return cleanedObj;
  }

  // Handle specific FieldSchema
  const fieldSchema = schema as FieldSchema;
  
  if (fieldSchema.type === 'object' && typeof data === 'object') {
    return cleanData(data, fieldSchema.fields);
  }
  
  if (fieldSchema.type === 'array' && Array.isArray(data)) {
    const cleanedArray = data.map(item => cleanData(item, fieldSchema.itemSchema));
    // We don't remove empty items from within the array here, 
    // unless you want to filter out completely empty object items.
    // For now, just return the mapped array.
    return cleanedArray;
  }
  
  return data;
}
```

- [ ] **Step 3: Commit changes**

```bash
git add admin/lib
git commit -m "feat: add schema types and data cleanup utility"
```

### Task 2: Define Entity Schemas

**Files:**
- Create: `admin/lib/schemas/campaign.ts`

- [ ] **Step 1: Define shared schemas**

Create `admin/lib/schemas/campaign.ts`:

```typescript
import { FieldSchema, EntitySchema } from '../schema';

export const QASchema: FieldSchema = {
  type: 'object',
  label: 'Q&A',
  fields: {
    question: { type: 'string', label: 'Question' },
    answer: { type: 'textarea', label: 'Answer' }
  }
};

export const MemorableInteractionSchema: FieldSchema = {
  type: 'object',
  label: 'Interaction',
  fields: {
    description: { type: 'textarea', label: 'Description' },
    highlight: { type: 'string', label: 'Highlight', optional: true },
    pcInvolved: { type: 'string', label: 'PC Involved (Single)', optional: true },
    pcsInvolved: { 
      type: 'array', 
      label: 'PCs Involved', 
      optional: true,
      itemSchema: { type: 'string', label: 'PC Name' }
    }
  }
};
```

- [ ] **Step 2: Define Location and NPC schemas**

Append to `admin/lib/schemas/campaign.ts`:

```typescript
export const LocationSchema: EntitySchema = {
  name: { type: 'string', label: 'Name' },
  region: { type: 'string', label: 'Region' },
  description: { type: 'textarea', label: 'Description' },
  images: { 
    type: 'array', 
    label: 'Images', 
    optional: true,
    itemSchema: { type: 'string', label: 'Image URL' }
  },
  memorableInteractions: {
    type: 'array',
    label: 'Memorable Interactions',
    optional: true,
    itemSchema: MemorableInteractionSchema
  }
};

export const NPCSchema: EntitySchema = {
  name: { type: 'string', label: 'Name' },
  role: { type: 'string', label: 'Role' },
  location: { type: 'string', label: 'Location' },
  description: { type: 'textarea', label: 'Description' },
  image: { type: 'string', label: 'Image URL', optional: true },
  attitudeTowardParty: { type: 'string', label: 'Attitude', optional: true },
  memorableInteractions: {
    type: 'array',
    label: 'Memorable Interactions',
    optional: true,
    itemSchema: MemorableInteractionSchema
  }
};
```

- [ ] **Step 3: Define Player schema**

Append to `admin/lib/schemas/campaign.ts`:

```typescript
export const PlayerSchema: EntitySchema = {
  name: { type: 'string', label: 'Name' },
  image: { type: 'string', label: 'Image URL' },
  ancestry: { type: 'string', label: 'Ancestry' },
  community: { type: 'string', label: 'Community' },
  class: { type: 'string', label: 'Class' },
  subclass: { type: 'string', label: 'Subclass' },
  level: { type: 'number', label: 'Level' },
  tier: { type: 'number', label: 'Tier' },
  description: { type: 'textarea', label: 'Description' },
  backstory: { type: 'textarea', label: 'Backstory' },
  stats: {
    type: 'object',
    label: 'Stats',
    fields: {
      agility: { type: 'number', label: 'Agility' },
      strength: { type: 'number', label: 'Strength' },
      finesse: { type: 'number', label: 'Finesse' },
      instinct: { type: 'number', label: 'Instinct' },
      presence: { type: 'number', label: 'Presence' },
      knowledge: { type: 'number', label: 'Knowledge' }
    }
  },
  backgroundQuestions: {
    type: 'array',
    label: 'Background Questions',
    itemSchema: QASchema
  },
  connectionQuestions: {
    type: 'array',
    label: 'Connection Questions',
    itemSchema: QASchema
  }
};
```

- [ ] **Step 4: Define Timeline and Home schemas**

Append to `admin/lib/schemas/campaign.ts`:

```typescript
export const TimelineEventSchema: EntitySchema = {
  title: { type: 'string', label: 'Title' },
  type: { type: 'string', label: 'Type' },
  sagaArc: { type: 'string', label: 'Saga Arc', optional: true },
  description: { type: 'textarea', label: 'Description' },
  locationId: { type: 'string', label: 'Location ID', optional: true },
  time: {
    type: 'object',
    label: 'Time',
    fields: {
      era: { type: 'string', label: 'Era' },
      year: { type: 'number', label: 'Year' },
      month: { type: 'string', label: 'Month' },
      day: { type: 'number', label: 'Day' },
      hour: { type: 'number', label: 'Hour', optional: true },
      minute: { type: 'number', label: 'Minute', optional: true }
    }
  },
  pcNotes: {
    type: 'array',
    label: 'PC Notes',
    optional: true,
    itemSchema: {
      type: 'object',
      label: 'Note',
      fields: {
        pcId: { type: 'string', label: 'PC ID' },
        note: { type: 'textarea', label: 'Note' }
      }
    }
  },
  npcIds: {
    type: 'array',
    label: 'NPC IDs',
    optional: true,
    itemSchema: { type: 'string', label: 'NPC ID' }
  }
};

export const HomeSchema: EntitySchema = {
  nextSession: { type: 'string', label: 'Next Session' },
  lastLocationId: { type: 'string', label: 'Last Location ID' },
  nextDestinationId: { type: 'string', label: 'Next Destination ID' },
  activeQuest: {
    type: 'object',
    label: 'Active Quest',
    fields: {
      title: { type: 'string', label: 'Title' },
      status: { type: 'string', label: 'Status' },
      locationId: { type: 'string', label: 'Location ID', optional: true },
      description: { type: 'textarea', label: 'Description', optional: true }
    }
  },
  questList: {
    type: 'array',
    label: 'Quest List',
    itemSchema: {
      type: 'object',
      label: 'Quest',
      fields: {
        title: { type: 'string', label: 'Title' },
        status: { type: 'string', label: 'Status' },
        locationId: { type: 'string', label: 'Location ID', optional: true },
        description: { type: 'textarea', label: 'Description', optional: true }
      }
    }
  },
  mostWanted: {
    type: 'array',
    label: 'Most Wanted',
    itemSchema: {
      type: 'object',
      label: 'Wanted Person',
      fields: {
        name: { type: 'string', label: 'Name' },
        reward: { type: 'string', label: 'Reward' },
        image: { type: 'string', label: 'Image URL' },
        lastSeenLocation: { type: 'string', label: 'Last Seen Location', optional: true }
      }
    }
  }
};
```

- [ ] **Step 5: Commit changes**

```bash
git add admin/lib/schemas
git commit -m "feat: define campaign entity schemas for autoform"
```

### Task 3: Implement AutoForm Component

**Files:**
- Create: `admin/components/AutoForm.tsx`

- [ ] **Step 1: Build the AutoForm components**

Create `admin/components/AutoForm.tsx`:

```tsx
'use client';

import React from 'react';
import { FieldSchema, EntitySchema } from '../lib/schema';

interface AutoFormProps {
  schema: EntitySchema;
  data: any;
  onChange: (data: any) => void;
}

export function AutoForm({ schema, data, onChange }: AutoFormProps) {
  // Ensure data is at least an object
  const safeData = data || {};

  const handleFieldChange = (key: string, value: any) => {
    onChange({ ...safeData, [key]: value });
  };

  return (
    <div className="space-y-4">
      {Object.entries(schema).map(([key, fieldSchema]) => (
        <FormField 
          key={key} 
          schema={fieldSchema} 
          value={safeData[key]} 
          onChange={(val) => handleFieldChange(key, val)} 
        />
      ))}
    </div>
  );
}

interface FormFieldProps {
  schema: FieldSchema;
  value: any;
  onChange: (val: any) => void;
}

function FormField({ schema, value, onChange }: FormFieldProps) {
  const labelText = schema.label + (schema.optional ? ' (Optional)' : '');

  if (schema.type === 'string') {
    return (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">{labelText}</label>
        <input 
          type="text" 
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    );
  }

  if (schema.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">{labelText}</label>
        <textarea 
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] bg-white"
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    );
  }

  if (schema.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">{labelText}</label>
        <input 
          type="number" 
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          value={value === undefined ? '' : value} 
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
        />
      </div>
    );
  }

  if (schema.type === 'object') {
    const safeValue = value || {};
    return (
      <div className="border border-gray-200 rounded p-4 bg-gray-50 mb-2 mt-2">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">{labelText}</h3>
        <AutoForm 
          schema={schema.fields} 
          data={safeValue} 
          onChange={onChange} 
        />
      </div>
    );
  }

  if (schema.type === 'array') {
    const safeArray: any[] = Array.isArray(value) ? value : [];
    
    const handleItemChange = (index: number, newVal: any) => {
      const newArr = [...safeArray];
      newArr[index] = newVal;
      onChange(newArr);
    };

    const handleRemove = (index: number) => {
      const newArr = safeArray.filter((_, i) => i !== index);
      onChange(newArr);
    };

    const handleAdd = () => {
      // Provide an empty structure based on type
      let defaultVal: any = '';
      if (schema.itemSchema.type === 'object') defaultVal = {};
      if (schema.itemSchema.type === 'array') defaultVal = [];
      if (schema.itemSchema.type === 'number') defaultVal = 0;
      
      onChange([...safeArray, defaultVal]);
    };

    return (
      <div className="border border-gray-200 rounded p-4 bg-gray-50 mb-2 mt-2">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">{labelText}</h3>
        
        {safeArray.length === 0 ? (
          <p className="text-sm text-gray-500 italic mb-3">No items yet.</p>
        ) : (
          <div className="space-y-4 mb-4">
            {safeArray.map((item, index) => (
              <div key={index} className="flex gap-2 items-start border-l-2 border-blue-400 pl-3">
                <div className="flex-1">
                  <FormField 
                    schema={{ ...schema.itemSchema, label: `Item ${index + 1}` }} 
                    value={item} 
                    onChange={(val) => handleItemChange(index, val)} 
                  />
                </div>
                <button 
                  onClick={() => handleRemove(index)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm mt-7"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={handleAdd}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm"
        >
          + Add {schema.itemSchema.label || 'Item'}
        </button>
      </div>
    );
  }

  return <div>Unknown field type</div>;
}
```

- [ ] **Step 2: Commit changes**

```bash
git add admin/components/AutoForm.tsx
git commit -m "feat: add recursive AutoForm component"
```

### Task 4: Refactor Edit Pages to Use AutoForm

**Files:**
- Modify: `admin/app/page.tsx`
- Modify: `admin/app/players/[id]/page.tsx`
- Modify: `admin/app/locations/[id]/page.tsx`
- Modify: `admin/app/npcs/[id]/page.tsx`
- Modify: `admin/app/timeline/[id]/page.tsx`

- [ ] **Step 1: Refactor Home Page**

Replace `admin/app/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { AutoForm } from '../components/AutoForm';
import { HomeSchema } from '../lib/schemas/campaign';
import { cleanData } from '../lib/utils';

export default function HomeAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullData, setFullData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/campaign')
      .then(res => res.json())
      .then(json => {
        setFullData(json);
        setData(json.home);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedHome = cleanData(data, HomeSchema);
      const payload = { ...fullData, home: cleanedHome };
      
      await fetch('/api/campaign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

      <AutoForm schema={HomeSchema} data={data} onChange={setData} />
    </div>
  );
}
```

- [ ] **Step 2: Refactor Player Edit Page**

Replace `admin/app/players/[id]/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AutoForm } from '../../../components/AutoForm';
import { PlayerSchema } from '../../../lib/schemas/campaign';
import { cleanData } from '../../../lib/utils';

export default function PlayerEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [fullData, setFullData] = useState<any>(null);
  const [playerData, setPlayerData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/campaign')
      .then(res => res.json())
      .then(data => {
        setFullData(data);
        const p = data.players.find((x: any) => x.id === resolvedParams.id);
        setPlayerData(p);
      });
  }, [resolvedParams.id]);

  const handleSave = async () => {
    setSaving(true);
    
    const cleanedPlayer = cleanData(playerData, PlayerSchema);
    // ID is preserved by cleanData
    
    const newPlayers = fullData.players.map((p: any) => 
      p.id === resolvedParams.id ? cleanedPlayer : p
    );
    
    const payload = { ...fullData, players: newPlayers };

    await fetch('/api/campaign', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    setSaving(false);
    router.push('/players');
  };

  if (!playerData) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit {playerData.name}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <AutoForm schema={PlayerSchema} data={playerData} onChange={setPlayerData} />
    </div>
  );
}
```

- [ ] **Step 3: Refactor remaining edit pages (NPC, Location, Timeline)**

Apply the exact same pattern to:
- `admin/app/npcs/[id]/page.tsx` (using `NPCSchema`, `.npcs`, and `/npcs`)
- `admin/app/locations/[id]/page.tsx` (using `LocationSchema`, `.locations`, and `/locations`)
- `admin/app/timeline/[id]/page.tsx` (using `TimelineEventSchema`, `.timeline.events`, and `/timeline`)

*Note for timeline*: The map needs to be on `fullData.timeline.events`, and payload needs to be `{ ...fullData, timeline: { ...fullData.timeline, events: newEvents } }`

- [ ] **Step 4: Commit changes**

```bash
git add admin/app/page.tsx admin/app/players admin/app/npcs admin/app/locations admin/app/timeline
git commit -m "refactor: replace manual forms with dynamic autoform"
```