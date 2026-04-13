'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function TimelineEventEdit({ params }: { params: Promise<{ id: string }> }) {
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
    router.push('/timeline');
  };

  if (!data) return <div>Loading...</div>;

  const eventIndex = data.timeline?.events?.findIndex((e: any) => e.id === resolvedParams.id);
  const event = eventIndex >= 0 ? data.timeline.events[eventIndex] : null;

  if (!event) return <div>Event not found</div>;

  const updateField = (field: string, value: string) => {
    const newEvents = [...data.timeline.events];
    newEvents[eventIndex] = { ...newEvents[eventIndex], [field]: value };
    setData({
      ...data,
      timeline: {
        ...data.timeline,
        events: newEvents
      }
    });
  };

  const updateTimeField = (field: string, value: string | number) => {
    const newEvents = [...data.timeline.events];
    newEvents[eventIndex] = {
      ...newEvents[eventIndex],
      time: {
        ...newEvents[eventIndex].time,
        [field]: typeof value === 'string' && !isNaN(Number(value)) && field !== 'era' && field !== 'month' ? Number(value) : value
      }
    };
    setData({
      ...data,
      timeline: {
        ...data.timeline,
        events: newEvents
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Event: {event.title}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" className="w-full border p-2 rounded" value={event.title || ''} onChange={(e) => updateField('title', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input type="text" className="w-full border p-2 rounded" value={event.type || ''} onChange={(e) => updateField('type', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Saga Arc</label>
            <input type="text" className="w-full border p-2 rounded" value={event.sagaArc || ''} onChange={(e) => updateField('sagaArc', e.target.value)} />
          </div>
        </div>

        <div className="border p-4 rounded bg-gray-50 space-y-4">
          <h3 className="font-semibold text-sm">Time Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Era</label>
              <input type="text" className="w-full border p-2 rounded text-sm" value={event.time?.era || ''} onChange={(e) => updateTimeField('era', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Year</label>
              <input type="number" className="w-full border p-2 rounded text-sm" value={event.time?.year || ''} onChange={(e) => updateTimeField('year', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Month</label>
              <input type="text" className="w-full border p-2 rounded text-sm" value={event.time?.month || ''} onChange={(e) => updateTimeField('month', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Day</label>
              <input type="number" className="w-full border p-2 rounded text-sm" value={event.time?.day || ''} onChange={(e) => updateTimeField('day', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Hour</label>
              <input type="number" className="w-full border p-2 rounded text-sm" value={event.time?.hour || ''} onChange={(e) => updateTimeField('hour', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Minute</label>
              <input type="number" className="w-full border p-2 rounded text-sm" value={event.time?.minute || ''} onChange={(e) => updateTimeField('minute', e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border p-2 rounded h-32" value={event.description || ''} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
