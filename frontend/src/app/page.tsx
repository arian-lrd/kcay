'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAbout, getEvents, getLatestPodcast, subscribeToNewsletter } from '@/lib/api';

// Backend base URL for images (same as API but without /api/v1)
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function Home() {
  const [aboutData, setAboutData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [podcastData, setPodcastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFirstName, setNewsletterFirstName] = useState('');
  const [newsletterLastName, setNewsletterLastName] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [about, events, podcast] = await Promise.all([
          getAbout().catch(() => null),
          getEvents().catch(() => null),
          getLatestPodcast().catch(() => null),
        ]);
        setAboutData(about);
        setEventsData(events);
        setPodcastData(podcast);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterSubmitting(true);
    setNewsletterError('');
    setNewsletterSuccess(false);

    try {
      await subscribeToNewsletter({
        email: newsletterEmail,
        firstName: newsletterFirstName,
        lastName: newsletterLastName,
      });
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setNewsletterFirstName('');
      setNewsletterLastName('');
    } catch (err) {
      setNewsletterError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-current mb-4" style={{ color: 'var(--nav-bg)' }}></div>
          <p className="text-xl" style={{ color: 'var(--foreground)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const upcomingEvents = eventsData?.upcoming || [];
  const pastEvents = eventsData?.past || [];
  const welcomeText = aboutData?.paragraph?.[0] || 'Welcome to the Kurdish Cultural Association at York (KCAY). We are dedicated to celebrating and sharing Kurdish culture, heritage, and community.';
  const executives = aboutData?.executives || [];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Hero Section with Enhanced Animations */}
      <section
        className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundColor: 'var(--nav-bg)',
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl z-10">
          <div className="text-center transform transition-all duration-1000" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl animate-fade-in">
              Welcome to KCAY
            </h1>
            <div className="w-24 h-1 bg-white/80 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl sm:text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed mb-10 text-white/95 font-light">
              {welcomeText}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/learn"
                className="group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-white/95 text-gray-900 hover:bg-white"
              >
                <span className="flex items-center gap-2">
                  Learn Kurdish
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link
                href="/get-involved"
                className="group px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 transform hover:scale-105 hover:bg-white/20 text-white backdrop-blur-sm"
                style={{ borderColor: 'white' }}
              >
                <span className="flex items-center gap-2">
                  Get Involved
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      {(upcomingEvents.length > 0 || pastEvents.length > 0 || podcastData) && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: 'var(--nav-border)', backgroundColor: 'var(--background)' }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {upcomingEvents.length > 0 && (
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--nav-bg)' }}>
                    {upcomingEvents.length}
                  </div>
                  <div className="text-sm md:text-base opacity-80" style={{ color: 'var(--foreground)' }}>
                    Upcoming Events
                  </div>
                </div>
              )}
              {pastEvents.length > 0 && (
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--nav-bg)' }}>
                    {pastEvents.length}
                  </div>
                  <div className="text-sm md:text-base opacity-80" style={{ color: 'var(--foreground)' }}>
                    Past Events
                  </div>
                </div>
              )}
              {podcastData && (
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--nav-bg)' }}>
                    #{podcastData.episode_number}
                  </div>
                  <div className="text-sm md:text-base opacity-80" style={{ color: 'var(--foreground)' }}>
                    Latest Podcast
                  </div>
                </div>
              )}
              <div className="text-center transform transition-all duration-500 hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--nav-bg)' }}>
                  150+
                </div>
                <div className="text-sm md:text-base opacity-80" style={{ color: 'var(--foreground)' }}>
                  Active Members
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Culture & Learning Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Discover Kurdish Culture
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--nav-bg)' }}></div>
            <p className="mt-6 text-lg opacity-80 max-w-2xl mx-auto" style={{ color: 'var(--foreground)' }}>
              Explore our rich heritage, language, and community through curated resources and engaging content.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Learn Kurdish - Primary focal card */}
            <Link
              href="/learn"
              className="group relative p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📚</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:opacity-90 transition-opacity" style={{ color: 'var(--foreground)' }}>
                  Learn Kurdish
                </h3>
                <p className="text-base opacity-80 mb-6 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                  Explore Kurdish language, dance, and heritage through curated resources and community knowledge.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                <span className="px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>Language</span>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>Dance</span>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>Heritage</span>
              </div>
            </Link>

            {/* Notable Figures */}
            <Link
              href="/notable-figures"
              className="group relative p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">⭐</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:opacity-90 transition-opacity" style={{ color: 'var(--foreground)' }}>
                  Notable Figures
                </h3>
                <p className="text-base opacity-80 mb-6 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                  Meet Kurdish leaders, artists, thinkers, and visionaries who shaped our history and culture.
                </p>
              </div>
              <span className="inline-flex items-center text-sm font-semibold mt-4 relative z-10 group-hover:translate-x-2 transition-transform duration-300" style={{ color: 'var(--nav-bg)' }}>
                Browse the gallery
                <span className="ml-2 text-lg">→</span>
              </span>
            </Link>

            {/* Podcast Highlight */}
            <div
              className="group relative p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎧</div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                  KCAY Podcast
                </h3>
                {podcastData ? (
                  <>
                    <p className="text-sm font-semibold mb-2 opacity-90" style={{ color: 'var(--nav-bg)' }}>
                      Latest: Episode {podcastData.episode_number}
                    </p>
                    <p className="text-base opacity-80 mb-6 line-clamp-3 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                      {podcastData.title}
                    </p>
                  </>
                ) : (
                  <p className="text-base opacity-80 mb-6 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                    Listen to conversations about Kurdish culture, community, and student life at York.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                <Link
                  href="/podcast"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
                >
                  Go to Podcast
                </Link>
                {podcastData?.spotify_url && (
                  <a
                    href={podcastData.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 hover:bg-white/10"
                    style={{ borderColor: 'var(--nav-bg)', color: 'var(--foreground)' }}
                  >
                    Spotify
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                  Upcoming Events
                </h2>
                <div className="w-16 h-1 rounded-full" style={{ backgroundColor: 'var(--nav-bg)' }}></div>
              </div>
              <Link
                href="/events"
                className="text-base font-semibold hover:opacity-80 transition-all flex items-center gap-2 group"
                style={{ color: 'var(--nav-bg)' }}
              >
                View all
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.slice(0, 3).map((event) => {
                const eventDate = new Date(event.event_date);
                const formattedDate = eventDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                });
                const imageUrl = event.cover_url 
                  ? `${BACKEND_BASE_URL}${event.cover_url}`
                  : null;

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group relative rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    style={{ backgroundColor: 'var(--card-bg)' }}
                  >
                    {imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                        <img
                          src={imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                          <p className="text-xs font-semibold text-white/90 mb-1">
                            {formattedDate}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:opacity-90 transition-opacity" style={{ color: 'var(--foreground)' }}>
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-sm mb-3 opacity-70 flex items-center gap-1" style={{ color: 'var(--foreground)' }}>
                          <span>📍</span>
                          <span>{event.location}</span>
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm line-clamp-2 opacity-80 mb-4 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                          {event.description}
                        </p>
                      )}
                      <span className="inline-flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300" style={{ color: 'var(--nav-bg)' }}>
                        Learn more
                        <span className="ml-2">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-3xl text-center z-10">
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Stay Connected</h2>
            <div className="w-20 h-1 bg-white/80 mx-auto rounded-full mb-6"></div>
            <p className="text-xl mb-2 opacity-95">
              Subscribe to our newsletter
            </p>
            <p className="text-lg opacity-80">
              Get updates on events, podcasts, and community news delivered to your inbox.
            </p>
          </div>
          
          <form onSubmit={handleNewsletterSubmit} className="space-y-5 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={newsletterFirstName}
                onChange={(e) => setNewsletterFirstName(e.target.value)}
                required
                className="px-5 py-4 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-lg"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newsletterLastName}
                onChange={(e) => setNewsletterLastName(e.target.value)}
                required
                className="px-5 py-4 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-lg"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="w-full px-5 py-4 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-lg"
            />
            {newsletterError && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-400/50">
                <p className="text-red-100 text-sm font-medium">{newsletterError}</p>
              </div>
            )}
            {newsletterSuccess && (
              <div className="p-4 rounded-xl bg-green-500/20 border border-green-400/50 animate-pulse">
                <p className="text-green-100 text-sm font-medium">✓ Successfully subscribed! Thank you.</p>
              </div>
            )}
            <button
              type="submit"
              disabled={newsletterSubmitting}
              className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-lg bg-white text-gray-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform"
            >
              {newsletterSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full"></span>
                  Subscribing...
                </span>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
