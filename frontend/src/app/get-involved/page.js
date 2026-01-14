'use client';

import { useState, useEffect } from 'react';
import { getGetInvolved } from '@/lib/api';

export default function GetInvolvedPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔍 Fetching get-involved data...');
        const involvedData = await getGetInvolved();
        console.log('✅ Received get-involved data:', involvedData);
        setData(involvedData);
      } catch (err) {
        console.error('❌ Error fetching get-involved data:', err);
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Hero Section */}
      <section 
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: `var(--get-involved-hero-bg-image)`,
          backgroundSize: 'var(--get-involved-hero-bg-size)',
          backgroundPosition: 'var(--get-involved-hero-bg-position)',
          backgroundRepeat: 'no-repeat',
          minHeight: 'var(--get-involved-hero-min-height)',
          paddingTop: 'var(--get-involved-hero-padding-top)',
          paddingBottom: 'var(--get-involved-hero-padding-bottom)'
        }}
      >
        {/* Background Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: 'var(--get-involved-hero-overlay-color)',
            backgroundImage: 'var(--get-involved-hero-pattern)',
            opacity: 'var(--get-involved-hero-pattern-opacity)'
          }}
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ 
              color: 'var(--get-involved-hero-title-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
          >
            Get Involved
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-90"
            style={{ 
              color: 'var(--get-involved-hero-subtitle-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 0.9 : 0,
              transition: 'all 0.6s ease-out 0.1s'
            }}
          >
            Join us in building a stronger Kurdish community at York University
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Sponsor and General Member Sections - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Sponsor Section - Left */}
          {data.sponsorFormLink && (
            <section>
              <div 
                className="rounded-2xl p-8 sm:p-10 border shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                style={{
                  backgroundColor: 'var(--get-involved-card-bg)',
                  borderColor: 'var(--get-involved-card-border)'
                }}
              >
                <div className="flex flex-col items-center text-center flex-1">
                  <h2 
                    className="text-3xl sm:text-4xl font-bold mb-4"
                    style={{ color: 'var(--get-involved-section-title-color)' }}
                  >
                    Become a Sponsor
                  </h2>
                  <p 
                    className="text-lg opacity-80 mb-6 flex-1"
                    style={{ color: 'var(--get-involved-section-text-color)' }}
                  >
                    Support our mission and help us create meaningful experiences for the Kurdish community at York University.
                  </p>
                  <a 
                    href={data.sponsorFormLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl w-full text-center"
                    style={{
                      backgroundColor: 'var(--get-involved-button-sponsor-bg)',
                      color: 'var(--get-involved-button-sponsor-text)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--get-involved-button-sponsor-hover-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--get-involved-button-sponsor-bg)';
                    }}
                  >
                    Become a Sponsor →
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* General Member Section - Right */}
          {data.generalMemberFormLink && (
            <section>
              <div 
                className="rounded-2xl p-8 sm:p-10 border shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                style={{
                  backgroundColor: 'var(--get-involved-card-bg)',
                  borderColor: 'var(--get-involved-card-border)'
                }}
              >
                <div className="flex flex-col items-center text-center flex-1">
                  <h2 
                    className="text-3xl sm:text-4xl font-bold mb-4"
                    style={{ color: 'var(--get-involved-section-title-color)' }}
                  >
                    Become a General Member
                  </h2>
                  <p 
                    className="text-lg opacity-80 mb-6 flex-1"
                    style={{ color: 'var(--get-involved-section-text-color)' }}
                  >
                    Join our community and stay connected with Kurdish culture, events, and activities at York University.
                  </p>
                  <a 
                    href={data.generalMemberFormLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl w-full text-center"
                    style={{
                      backgroundColor: 'var(--get-involved-button-general-member-bg)',
                      color: 'var(--get-involved-button-general-member-text)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--get-involved-button-general-member-hover-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--get-involved-button-general-member-bg)';
                    }}
                  >
                    Join as General Member →
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Executive Positions Section */}
        {data.executivePositions && data.executivePositions.length > 0 && (
          <section className="mb-16">
            <div className="mb-8">
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-4 text-center"
                style={{ color: 'var(--get-involved-section-title-color)' }}
              >
                Executive Positions
              </h2>
              <p 
                className="text-lg text-center opacity-80 max-w-2xl mx-auto"
                style={{ color: 'var(--get-involved-section-text-color)' }}
              >
                Take on a leadership role and help shape the future of KCAY. We have several positions open for dedicated members.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {data.executivePositions.map((position) => (
                <div 
                  key={position.id} 
                  className="rounded-xl p-6 border shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--get-involved-position-card-bg)',
                    borderColor: 'var(--get-involved-position-card-border)'
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 
                        className="text-xl sm:text-2xl font-bold mb-2"
                        style={{ color: 'var(--get-involved-position-card-title-color)' }}
                      >
                        {position.positionName}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedPosition(position)}
                      className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 whitespace-nowrap"
                      style={{
                        backgroundColor: 'var(--get-involved-button-view-details-bg)',
                        color: 'var(--get-involved-button-view-details-text)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--get-involved-button-view-details-hover-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--get-involved-button-view-details-bg)';
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {data.executivePositionsFormLink && (
              <div className="text-center">
                <a 
                  href={data.executivePositionsFormLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: 'var(--get-involved-button-executive-bg)',
                    color: 'var(--get-involved-button-executive-text)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--get-involved-button-executive-hover-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--get-involved-button-executive-bg)';
                  }}
                >
                  Apply for Executive Position →
                </a>
              </div>
            )}
          </section>
        )}

        {/* Contact Info */}
        {data.contactEmail && (
          <section 
            className="rounded-2xl p-8 sm:p-10 border text-center"
            style={{
              backgroundColor: 'var(--get-involved-contact-bg)',
              borderColor: 'var(--get-involved-contact-border)'
            }}
          >
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--get-involved-contact-text-color)' }}
            >
              Need Help?
            </h3>
            <p 
              className="text-lg mb-4 opacity-80"
              style={{ color: 'var(--get-involved-contact-text-color)' }}
            >
              In case the forms do not work or you have questions, please contact us:
            </p>
            <a 
              href={`mailto:${data.contactEmail}`} 
              className="text-xl font-semibold hover:underline transition-all"
              style={{ color: 'var(--get-involved-contact-link-color)' }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--get-involved-contact-link-hover-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--get-involved-contact-link-color)';
              }}
            >
              {data.contactEmail}
            </a>
          </section>
        )}
      </div>

      {/* Responsibilities Modal */}
      {selectedPosition && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'var(--get-involved-modal-overlay-bg)' }}
          onClick={() => setSelectedPosition(null)}
        >
          <div 
            className="rounded-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto border shadow-2xl"
            style={{
              backgroundColor: 'var(--get-involved-modal-bg)',
              borderColor: 'var(--get-involved-modal-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 
                className="text-2xl sm:text-3xl font-bold pr-4"
                style={{ color: 'var(--get-involved-modal-title-color)' }}
              >
                {selectedPosition.positionName} - Responsibilities
              </h3>
              <button
                onClick={() => setSelectedPosition(null)}
                className="text-3xl leading-none hover:scale-110 transition-transform flex-shrink-0"
                style={{ 
                  color: 'var(--get-involved-modal-close-color)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--get-involved-modal-close-hover-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--get-involved-modal-close-color)';
                }}
              >
                ×
              </button>
            </div>
            <div 
              className="prose prose-lg max-w-none whitespace-pre-line leading-relaxed"
              style={{ color: 'var(--get-involved-modal-text-color)' }}
            >
              {selectedPosition.responsibilities}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
