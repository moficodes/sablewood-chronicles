 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LocationsList() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/campaign').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Locations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.locations?.map((location: any) => (
          <Link key={location.id} href={`/locations/${location.id}`} className="block border p-4 rounded bg-white hover:border-blue-500">
            <h2 className="font-semibold">{location.name}</h2>
            <p className="text-sm text-gray-500">{location.region}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
