'use client';

import { useState, useEffect } from 'react';
import { getEvents } from '@/lib/api';
import Link from 'next/link';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function EventsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // Track which images failed to load

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = await getEvents();
        setData(eventsData);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events. Please make sure the backend server is running on port 3000.');
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
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Events</h2>
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
        <p style={{ color: 'var(--foreground)' }}>No events data available.</p>
      </div>
    );
  }

  const { upcoming = [], past = [] } = data;

  // Helper function to format date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Helper function to format date for card (shorter)
  const formatEventDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <section 
        className="relative px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          paddingTop: 'var(--events-hero-padding-top, 5rem)',
          paddingBottom: 'var(--events-hero-padding-bottom, 5rem)',
          minHeight: 'var(--events-hero-min-height, auto)'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'var(--events-hero-bg-image, none)',
            backgroundSize: 'var(--events-hero-bg-size, cover)',
            backgroundPosition: 'var(--events-hero-bg-position, center)',
            backgroundRepeat: 'no-repeat',
            opacity: 'var(--events-hero-bg-opacity, 0.3)'
          }}
        ></div>
        {/* Gradient Pattern Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'var(--events-hero-pattern)',
            opacity: 'var(--events-hero-pattern-opacity, 0.2)'
          }}
        ></div>
        {/* Dark Overlay for Text Readability */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--events-hero-overlay-color, rgba(0, 0, 0, 0.4))'
          }}
        ></div>
        <div className="relative mx-auto max-w-7xl text-center z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" style={{ color: 'var(--events-hero-title-color)' }}>
            Events
          </h1>
          <p className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto" style={{ color: 'var(--events-hero-subtitle-color)' }}>
            Join us for upcoming events and explore our past gatherings
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Upcoming Events */}
      {upcoming.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                Upcoming Events
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--events-section-divider)' }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {upcoming.map((event) => {
                // Cloudinary URLs are already full URLs, so use directly if it starts with http
                const imageUrl = event.cover_url 
                  ? (event.cover_url.startsWith('http://') || event.cover_url.startsWith('https://') 
                      ? event.cover_url 
                      : `${BACKEND_BASE_URL}${event.cover_url}`)
                  : null;
                const hasImageError = imageErrors[event.id];

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group block"
                  >
                    <div 
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border h-full flex flex-col"
                      style={{
                        backgroundColor: 'var(--events-card-bg)',
                        borderColor: 'var(--events-card-border)'
                      }}
                    >
                      {/* Event Image */}
                      <div className="relative w-full h-56 overflow-hidden" style={{ backgroundColor: 'var(--events-image-placeholder-bg)' }}>
                        {imageUrl && !hasImageError ? (
                          <img 
                            src={imageUrl} 
                    alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => {
                              if (!imageErrors[event.id]) {
                                setImageErrors(prev => ({ ...prev, [event.id]: true }));
                              }
                            }}
                  />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center p-4">
                              <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm opacity-50" style={{ color: 'var(--foreground)' }}>No Image</p>
                            </div>
                          </div>
                        )}
                        {/* Date Badge */}
                        <div 
                          className="absolute top-4 right-4 px-3 py-1 rounded-lg backdrop-blur-sm font-semibold text-sm"
                          style={{
                            backgroundColor: 'var(--events-date-badge-bg)',
                            color: 'var(--events-date-badge-text)'
                          }}
                        >
                          {formatEventDateShort(event.event_date)}
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:opacity-90 transition-opacity leading-tight" style={{ color: 'var(--events-title-color)' }}>
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-sm opacity-80 mb-4 line-clamp-3 flex-1 leading-relaxed" style={{ color: 'var(--events-description-color)' }}>
                            {event.description}
                          </p>
                        )}
                {event.location && (
                          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--events-location-color)' }}>
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="inline-flex items-center gap-2 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300 mt-auto" style={{ color: 'var(--events-view-details-color)' }}>
                          <span>View Details</span>
                          <span style={{ 
                            fontWeight: 900, 
                            fontSize: '1.1em',
                            textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor'
                          }}>→</span>
                        </div>
                      </div>
                    </div>
                </Link>
                );
              })}
          </div>
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                Past Events
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--events-section-divider)' }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {past.map((event) => {
                // Cloudinary URLs are already full URLs, so use directly if it starts with http
                const imageUrl = event.cover_url 
                  ? (event.cover_url.startsWith('http://') || event.cover_url.startsWith('https://') 
                      ? event.cover_url 
                      : `${BACKEND_BASE_URL}${event.cover_url}`)
                  : null;
                const hasImageError = imageErrors[event.id];

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group block"
                  >
                    <div 
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border h-full flex flex-col opacity-90 hover:opacity-100"
                      style={{
                        backgroundColor: 'var(--events-card-bg)',
                        borderColor: 'var(--events-card-border)'
                      }}
                    >
                      {/* Event Image */}
                      <div className="relative w-full h-56 overflow-hidden" style={{ backgroundColor: 'var(--events-image-placeholder-bg)' }}>
                        {imageUrl && !hasImageError ? (
                          <img 
                            src={imageUrl} 
                    alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => {
                              if (!imageErrors[event.id]) {
                                setImageErrors(prev => ({ ...prev, [event.id]: true }));
                              }
                            }}
                  />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center p-4">
                              <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm opacity-50" style={{ color: 'var(--foreground)' }}>No Image</p>
                            </div>
                          </div>
                        )}
                        {/* Date Badge */}
                        <div 
                          className="absolute top-4 right-4 px-3 py-1 rounded-lg backdrop-blur-sm font-semibold text-sm"
                          style={{
                            backgroundColor: 'var(--events-date-badge-bg)',
                            color: 'var(--events-date-badge-text)'
                          }}
                        >
                          {formatEventDateShort(event.event_date)}
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:opacity-90 transition-opacity leading-tight" style={{ color: 'var(--events-title-color)' }}>
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-sm opacity-80 mb-4 line-clamp-3 flex-1 leading-relaxed" style={{ color: 'var(--events-description-color)' }}>
                            {event.description}
                          </p>
                        )}
                {event.location && (
                          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--events-location-color)' }}>
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="inline-flex items-center gap-2 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300 mt-auto" style={{ color: 'var(--events-view-details-color)' }}>
                          <span>View Details</span>
                          <span style={{ 
                            fontWeight: 900, 
                            fontSize: '1.1em',
                            textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor'
                          }}>→</span>
                        </div>
                      </div>
                    </div>
                </Link>
                );
              })}
          </div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl opacity-70" style={{ color: 'var(--foreground)' }}>No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

