/* eslint-disable @typescript-eslint/no-explicit-any */
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
    if (!fullData || !data) return;
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
      console.error(e);
      alert('Failed to save.');
    }
    setSaving(false);
  };

  if (loading) return <div className="text-[#3e3101] p-8 text-xl">Loading...</div>;
  if (!data) return <div className="text-[#3e3101] p-8 text-xl">Error loading data.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-[#ffffff] p-8 rounded-3xl shadow-xl shadow-[#3e3101]/5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#3e3101]">Home Data</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-[#e05a33] to-[#c74421] text-white px-6 py-3 rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shadow-md shadow-[#e05a33]/20"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <AutoForm schema={HomeSchema} data={data} onChange={setData} />
    </div>
  );
}