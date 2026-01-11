'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEventById } from '@/lib/api';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchEvent() {
      if (!eventId) return;
      
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event. Please make sure the backend server is running on port 3000.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-current mb-4" style={{ color: 'var(--nav-bg)' }}></div>
          <p className="text-xl" style={{ color: 'var(--foreground)' }}>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-3xl font-bold mb-4 text-red-600">Event Not Found</h2>
          <p className="text-red-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link
            href="/events"
            className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedDateShort = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const isPastEvent = eventDate < new Date();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Hero Section - Matching Events Main Page */}
      <section 
        className="relative px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          paddingTop: 'var(--events-hero-padding-top, 5rem)',
          paddingBottom: 'var(--events-hero-padding-bottom, 5rem)',
          minHeight: 'var(--events-hero-min-height, auto)'
        }}
      >
        {/* Background Image - Same as events main page */}
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
          {/* Back Button */}
          <div className="mb-8 text-left">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 backdrop-blur-md border shadow-lg"
              style={{
                backgroundColor: 'var(--event-detail-back-button-bg, rgba(0, 0, 0, 0.5))',
                borderColor: 'var(--event-detail-back-button-border, rgba(255, 255, 255, 0.2))',
                color: 'var(--event-detail-back-button-text, #ffffff)'
              }}
            >
              <span className="text-xl">←</span>
              <span>Back to Events</span>
            </Link>
          </div>

          {/* Event Title */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" 
            style={{ 
              color: 'var(--events-hero-title-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
          >
            {event.title}
          </h1>

          {/* Event Date & Location */}
          <div 
            className="flex flex-wrap items-center justify-center gap-4 text-lg sm:text-xl"
            style={{ 
              color: 'var(--events-hero-subtitle-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out 0.2s'
            }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">{formattedDateShort}</span>
              <span className="opacity-70">•</span>
              <span className="opacity-90">{formattedTime}</span>
            </div>
            {event.location && (
              <>
                <span className="opacity-50">|</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold">{event.location}</span>
                </div>
              </>
            )}
            {isPastEvent && (
              <>
                <span className="opacity-50">|</span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                  Past Event
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div 
            className="max-w-none"
            style={{ 
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out 0.3s'
            }}
          >
            {/* Description */}
            {event.description && (
              <div 
                className="relative p-8 sm:p-12 rounded-3xl shadow-xl border mb-10 overflow-hidden backdrop-blur-sm" 
                style={{ 
                  background: 'var(--event-detail-description-card-bg, var(--podcast-tabs-card-bg))',
                  borderColor: 'var(--event-detail-description-card-border, var(--podcast-tabs-card-border))'
                }}
              >
                {/* Decorative corner accents */}
                <div 
                  className="absolute top-0 left-0 w-32 h-32 opacity-5"
                  style={{
                    background: `radial-gradient(circle, var(--nav-bg) 0%, transparent 70%)`
                  }}
                ></div>
                <div 
                  className="absolute bottom-0 right-0 w-32 h-32 opacity-5"
                  style={{
                    background: `radial-gradient(circle, var(--nav-bg) 0%, transparent 70%)`
                  }}
                ></div>
                
                <h2 
                  className="text-3xl sm:text-4xl font-bold mb-6 pb-4 border-b"
                  style={{ 
                    color: 'var(--event-detail-description-heading-color, var(--foreground))',
                    borderColor: 'var(--event-detail-description-divider-color, var(--nav-border))'
                  }}
                >
                  About This Event
                </h2>
                <div 
                  className="text-lg leading-relaxed whitespace-pre-line"
                  style={{ 
                    color: 'var(--event-detail-description-text-color, var(--foreground))'
                  }}
                >
                  {event.description}
                </div>
              </div>
            )}

            {/* Event Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Date Card */}
              <div 
                className="group p-6 sm:p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ 
                  background: 'var(--event-detail-info-card-bg, var(--podcast-tabs-card-bg))',
                  borderColor: 'var(--event-detail-info-card-border, var(--podcast-tabs-card-border))'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                    style={{ 
                      backgroundColor: 'var(--event-detail-icon-bg, var(--nav-bg))', 
                      color: 'var(--event-detail-icon-text, var(--nav-text))'
                    }}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: 'var(--event-detail-info-card-heading-color, var(--foreground))' }}
                  >
                    Date & Time
                  </h3>
                </div>
                <p 
                  className="text-lg sm:text-xl font-semibold mb-2"
                  style={{ color: 'var(--event-detail-info-card-text-color, var(--foreground))' }}
                >
                  {formattedDate}
                </p>
                <p 
                  className="text-base opacity-80"
                  style={{ color: 'var(--event-detail-info-card-text-color, var(--foreground))' }}
                >
                  {formattedTime}
                </p>
              </div>

              {/* Location Card */}
              {event.location && (
                <div 
                  className="group p-6 sm:p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--event-detail-info-card-bg, var(--podcast-tabs-card-bg))',
                    borderColor: 'var(--event-detail-info-card-border, var(--podcast-tabs-card-border))'
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--event-detail-icon-bg, var(--nav-bg))', 
                        color: 'var(--event-detail-icon-text, var(--nav-text))'
                      }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: 'var(--event-detail-info-card-heading-color, var(--foreground))' }}
                    >
                      Location
                    </h3>
                  </div>
                  <p 
                    className="text-lg sm:text-xl font-semibold"
                    style={{ color: 'var(--event-detail-info-card-text-color, var(--foreground))' }}
                  >
                    {event.location}
                  </p>
                </div>
              )}
            </div>

            {/* Call to Action */}
            {!isPastEvent && (
              <div 
                className="p-8 sm:p-12 rounded-3xl shadow-xl border text-center overflow-hidden relative backdrop-blur-sm"
                style={{ 
                  background: 'var(--event-detail-cta-card-bg, linear-gradient(135deg, var(--nav-bg) 0%, rgba(145, 32, 32, 0.9) 100%))',
                  borderColor: 'var(--event-detail-cta-card-border, var(--nav-border))',
                  color: 'var(--event-detail-cta-text, var(--nav-text))'
                }}
              >
                {/* Decorative background pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 
                    className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ color: 'var(--event-detail-cta-heading-color, var(--event-detail-cta-text))' }}
                  >
                    Interested in Attending?
                  </h3>
                  <p 
                    className="text-lg mb-8 opacity-90 max-w-2xl mx-auto"
                    style={{ color: 'var(--event-detail-cta-text)' }}
                  >
                    Join us for this exciting event! Stay tuned for registration details.
                  </p>
                  <Link
                    href="/get-involved"
                    className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    style={{
                      backgroundColor: 'var(--event-detail-cta-button-bg, #ffffff)',
                      color: 'var(--event-detail-cta-button-text, #1a1a1a)'
                    }}
                  >
                    Get Involved
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section 
        className="py-12 px-4 sm:px-6 lg:px-8 border-t"
        style={{ 
          borderColor: 'var(--event-detail-nav-divider-color, var(--nav-border))',
          backgroundColor: 'var(--event-detail-nav-bg, transparent)'
        }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg border"
              style={{ 
                backgroundColor: 'var(--event-detail-nav-button-bg, var(--nav-bg))', 
                color: 'var(--event-detail-nav-button-text, var(--nav-text))',
                borderColor: 'var(--event-detail-nav-button-border, var(--nav-border))'
              }}
            >
              <span className="text-xl">←</span>
              <span>Back to All Events</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-80 border shadow-lg hover:scale-105"
                style={{ 
                  borderColor: 'var(--event-detail-nav-secondary-border, var(--nav-border))', 
                  color: 'var(--event-detail-nav-secondary-text, var(--foreground))',
                  backgroundColor: 'var(--event-detail-nav-secondary-bg, transparent)'
                }}
              >
                Home
              </Link>
              <Link
                href="/get-involved"
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg border"
                style={{ 
                  backgroundColor: 'var(--event-detail-nav-button-bg, var(--nav-bg))', 
                  color: 'var(--event-detail-nav-button-text, var(--nav-text))',
                  borderColor: 'var(--event-detail-nav-button-border, var(--nav-border))'
                }}
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

