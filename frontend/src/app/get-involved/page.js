'use client';

import { useState, useEffect } from 'react';
import { getGetInvolved } from '@/lib/api';

export default function GetInvolvedPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const involvedData = await getGetInvolved();
        setData(involvedData);
      } catch (err) {
        console.error('Error fetching get-involved data:', err);
        setError(err.message || 'Failed to load get-involved data. Please make sure the backend server is running on port 3000.');
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
      <h1 className="text-4xl font-bold mb-8">Get Involved</h1>

      {/* General Member Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Become a General Member</h2>
        {data.generalMemberFormLink && (
          <a 
            href={data.generalMemberFormLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Join as General Member
          </a>
        )}
      </section>

      {/* Sponsors Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Become a Sponsor</h2>
        {data.sponsorFormLink && (
          <a 
            href={data.sponsorFormLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Become a Sponsor
          </a>
        )}
      </section>

      {/* Executive Positions Section */}
      {data.executivePositions && data.executivePositions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Executive Positions</h2>
          <p className="text-gray-700 mb-4">The following positions are open:</p>
          
          <ul className="space-y-4 mb-6">
            {data.executivePositions.map((position) => (
              <li key={position.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{position.positionName}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedPosition(position)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition"
                  >
                    View Responsibilities
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {data.executivePositionsFormLink && (
            <a 
              href={data.executivePositionsFormLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Apply for Executive Position
            </a>
          )}
        </section>
      )}

      {/* Contact Info */}
      {data.contactEmail && (
        <section className="border-t pt-6">
          <p className="text-gray-600">
            In case the forms do not work, contact us at:{' '}
            <a href={`mailto:${data.contactEmail}`} className="text-blue-600 hover:underline">
              {data.contactEmail}
            </a>
          </p>
        </section>
      )}

      {/* Responsibilities Popup */}
      {selectedPosition && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPosition(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{selectedPosition.positionName} - Responsibilities</h3>
              <button
                onClick={() => setSelectedPosition(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{selectedPosition.responsibilities}</p>
          </div>
        </div>
      )}
    </div>
  );
}

