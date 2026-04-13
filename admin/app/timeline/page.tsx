 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimelineList() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/campaign').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-8 p-4 bg-white border rounded shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Timeline Settings</h1>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <p className="border p-2 rounded bg-gray-50">{data.timeline?.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <p className="border p-2 rounded bg-gray-50">{data.timeline?.subtitle}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <p className="border p-2 rounded bg-gray-50">{data.timeline?.description}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.timeline?.events?.map((event: any) => (
          <Link key={event.id} href={`/timeline/${event.id}`} className="block border p-4 rounded bg-white hover:border-blue-500">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-500 capitalize">{event.type?.replace('_', ' ')} - {event.sagaArc}</p>
            <div className="text-xs text-gray-400 mt-2">
              {event.time?.era}, Year {event.time?.year}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
