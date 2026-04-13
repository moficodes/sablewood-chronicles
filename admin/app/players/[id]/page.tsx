/* eslint-disable @typescript-eslint/no-explicit-any */
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
    if (!fullData || !playerData) return;
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

  if (!playerData) return <div className="text-[#3e3101] p-8 text-xl">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-[#ffffff] p-8 rounded-3xl shadow-xl shadow-[#3e3101]/5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#3e3101]">Edit {playerData.name}</h1>
        <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-[#e05a33] to-[#c74421] text-white px-6 py-3 rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shadow-md shadow-[#e05a33]/20">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <AutoForm schema={PlayerSchema} data={playerData} onChange={setPlayerData} />
    </div>
  );
}