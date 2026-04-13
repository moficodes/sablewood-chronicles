'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function NpcEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<unknown>(null);
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
    router.push('/npcs');
  };

  if (!data) return <div>Loading...</div>;

  const npcIndex = data.npcs?.findIndex((n: unknown) => n.id === resolvedParams.id);
  const npc = npcIndex >= 0 ? data.npcs[npcIndex] : null;

  if (!npc) return <div>NPC not found</div>;

  const updateField = (field: string, value: string) => {
    const newNpcs = [...data.npcs];
    newNpcs[npcIndex] = { ...newNpcs[npcIndex], [field]: value };
    setData({ ...data, npcs: newNpcs });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit {npc.name}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full border p-2 rounded" value={npc.name || ''} onChange={(e) => updateField('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input type="text" className="w-full border p-2 rounded" value={npc.role || ''} onChange={(e) => updateField('role', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" className="w-full border p-2 rounded" value={npc.location || ''} onChange={(e) => updateField('location', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Attitude Toward Party</label>
          <input type="text" className="w-full border p-2 rounded" value={npc.attitudeTowardParty || ''} onChange={(e) => updateField('attitudeTowardParty', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input type="text" className="w-full border p-2 rounded" value={npc.image || ''} onChange={(e) => updateField('image', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border p-2 rounded h-32" value={npc.description || ''} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
