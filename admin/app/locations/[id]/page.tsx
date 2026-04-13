'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function LocationEdit({ params }: { params: Promise<{ id: string }> }) {
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
    router.push('/locations');
  };

  if (!data) return <div>Loading...</div>;

  const locationIndex = data.locations?.findIndex((l: unknown) => l.id === resolvedParams.id);
  const location = locationIndex >= 0 ? data.locations[locationIndex] : null;

  if (!location) return <div>Location not found</div>;

  const updateField = (field: string, value: string) => {
    const newLocations = [...data.locations];
    newLocations[locationIndex] = { ...newLocations[locationIndex], [field]: value };
    setData({ ...data, locations: newLocations });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit {location.name}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full border p-2 rounded" value={location.name || ''} onChange={(e) => updateField('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Region</label>
          <input type="text" className="w-full border p-2 rounded" value={location.region || ''} onChange={(e) => updateField('region', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border p-2 rounded h-32" value={location.description || ''} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
