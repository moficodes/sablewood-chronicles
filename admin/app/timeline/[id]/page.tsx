/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AutoForm } from '../../../components/AutoForm';
import { TimelineEventSchema } from '../../../lib/schemas/campaign';
import { cleanData } from '../../../lib/utils';

export default function TimelineEventEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [fullData, setFullData] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/campaign')
      .then(res => res.json())
      .then(data => {
        setFullData(data);
        const p = data.timeline.events.find((x: any) => x.id === resolvedParams.id);
        setEventData(p);
      });
  }, [resolvedParams.id]);

  const handleSave = async () => {
    if (!fullData || !eventData) return;
    setSaving(true);
    
    const cleanedEvent = cleanData(eventData, TimelineEventSchema);
    
    const newEvents = fullData.timeline.events.map((p: any) => 
      p.id === resolvedParams.id ? cleanedEvent : p
    );
    
    const payload = { ...fullData, timeline: { ...fullData.timeline, events: newEvents } };

    await fetch('/api/campaign', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    setSaving(false);
    router.push('/timeline');
  };

  if (!eventData) return <div className="text-[#3e3101] p-8 text-xl">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-[#ffffff] p-8 rounded-3xl shadow-xl shadow-[#3e3101]/5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#3e3101]">Edit {eventData.title || 'Event'}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-[#e05a33] to-[#c74421] text-white px-6 py-3 rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shadow-md shadow-[#e05a33]/20">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <AutoForm schema={TimelineEventSchema} data={eventData} onChange={setEventData} />
    </div>
  );
}