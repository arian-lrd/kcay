'use client';

import { useState, useEffect } from 'react';
import { getLearnKurdishHeritage } from '@/lib/api';

export default function KurdishHeritagePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const learnData = await getLearnKurdishHeritage();
        setData(learnData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-current mb-4" style={{ color: 'var(--foreground)' }}></div>
          <p style={{ color: 'var(--foreground)' }}>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-2xl mx-auto p-6 rounded-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--foreground)' }}>
            Please make sure the backend server is running on port 3000.
          </p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: 'var(--foreground)' }}>No data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 
        className="text-4xl font-bold mb-4"
        style={{ color: 'var(--learn-subpage-title-color, var(--foreground))' }}
      >
        {data.title}
      </h1>
      {data.description && (
        <div 
          className="text-lg whitespace-pre-line leading-relaxed"
          style={{ color: 'var(--learn-subpage-description-color, var(--foreground))' }}
        >
          {data.description}
        </div>
      )}
    </div>
  );
}

