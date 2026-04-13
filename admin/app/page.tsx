'use client';

import { useState, useEffect } from 'react';

export default function HomeAdmin() {
  const [data, setData] = useState<unknown>(null);
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
