'use client';

import { useState, useEffect } from 'react';
import { getLatestPodcast, getRecentPodcasts, subscribeToNewsletter } from '@/lib/api';
import Link from 'next/link';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

// Helper: get YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.searchParams.has('v')) {
      return urlObj.searchParams.get('v');
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const path = urlObj.pathname;
      return path.split('/').filter(Boolean)[0];
    }
    if (urlObj.pathname.includes('/embed/')) {
      return urlObj.pathname.split('/embed/')[1]?.split('?')[0];
    }
  } catch (e) {
    return null;
  }
  return null;
};

export default function PodcastPage() {
  const [latest, setLatest] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // Track which images failed to load
  
  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFirstName, setNewsletterFirstName] = useState('');
  const [newsletterLastName, setNewsletterLastName] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [latestData, recentData] = await Promise.all([
          getLatestPodcast().catch(() => null),
          getRecentPodcasts(10).catch(() => [])
        ]);
        setLatest(latestData);
        // Include latest episode in recent episodes if it exists
        if (latestData && recentData) {
          // Remove latest from recent if it's there, then add it at the beginning
          const filtered = recentData.filter(ep => ep.id !== latestData.id);
          setRecent([latestData, ...filtered].slice(0, 10));
        } else {
        setRecent(recentData);
        }
      } catch (err) {
        console.error('Error fetching podcast data:', err);
        setError(err.message || 'Failed to load podcast data. Please make sure the backend server is running on port 3000.');
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
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Podcast</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--foreground)' }}>
            Please make sure the backend server is running on port 3000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Top Section - Latest Episode */}
      {latest && (
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--podcast-page-top-bg)' }}>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8 items-end">
              {/* Left Column - Episode Info */}
              <div className="flex-1">
                <h1 className="text-base sm:text-lg md:text-xl font-bold mb-6 uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
                  Latest Episode
                </h1>
                
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                    Episode {latest.episode_number}: {latest.title}
                  </h2>
                  {latest.description && (
                    <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--foreground)' }}>
                      Episode {latest.episode_number}: {latest.description}
                    </p>
                  )}
                </div>

                {/* Audio Player */}
                {latest.spotify_url ? (
                  <div className="mb-6">
                    <iframe
                      src={`https://open.spotify.com/embed/episode/${latest.spotify_url.split('/').pop()}`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="encrypted-media"
                      style={{ borderRadius: '0.75rem' }}
                    ></iframe>
                  </div>
                ) : latest.audio_url ? (
                  <div className="mb-6">
                    <audio
                      controls
                      className="w-full"
                      style={{
                        backgroundColor: 'var(--podcast-audio-bg)',
                        borderRadius: '0.75rem'
                      }}
                    >
                  <source src={latest.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
                ) : null}

                {/* Platform Icons - Side by Side */}
                <div className="flex items-center gap-4">
                  {latest.spotify_url && (
                    <a
                      href={latest.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all hover:scale-110"
                    >
                      <img src="/icons/spotify.svg" alt="Spotify" className="w-12 h-12" />
                </a>
              )}
                  {latest.youtube_url && (
                    <a
                      href={latest.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all hover:scale-110"
                    >
                      <img src="/icons/youtube.svg" alt="YouTube" className="w-12 h-12" />
                </a>
              )}
                  <Link
                    href={`/podcast/${latest.id}`}
                    className="transition-all hover:scale-110"
                  >
                    <img src={`${BACKEND_BASE_URL}/assets/images/podcasts/default-thump.jpg`} alt="KCAY Podcast" className="w-12 h-12 object-contain rounded-full" />
                  </Link>
                </div>
              </div>

              {/* Right Column - Podcast Logo Square */}
              <div className="lg:w-96 lg:flex-shrink-0 w-full">
                <div className="w-full rounded-2xl overflow-hidden shadow-xl border backdrop-blur-md"
                  style={{
                    background: 'var(--podcast-tabs-card-bg)',
                    borderColor: 'var(--podcast-tabs-card-border)',
                    aspectRatio: '1 / 1'
                  }}
                >
                  <img
                    src={`${BACKEND_BASE_URL}/assets/images/podcasts/default-thump.jpg`}
                    alt="KCAY Podcast"
                    className="w-full h-full object-contain p-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Episodes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Recent Episodes */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                  Recent Episodes
                </h2>
                <Link
                  href="/podcast/all"
                  className="inline-flex items-center gap-2 text-lg font-semibold transition-all hover:scale-105"
                  style={{ color: 'var(--podcast-page-view-all-link-color)' }}
                >
                  <span>View all</span>
                  <span style={{ 
                    fontWeight: 900, 
                    fontSize: '1.2em',
                    textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor'
                  }}>→</span>
            </Link>
          </div>

              {recent && recent.length > 0 ? (
                <>
                  <div className="space-y-4 mb-8">
                {recent.map((episode) => {
                  const defaultThumbUrl = `${BACKEND_BASE_URL}/assets/images/podcasts/default-thump.jpg`;
                  const apiThumbUrl = episode.thumbnail_image_url || episode.cover_image_url;
                  const thumbUrl = apiThumbUrl ? `${BACKEND_BASE_URL}${apiThumbUrl}` : defaultThumbUrl;
                  const imageUrl = imageErrors[episode.id] ? defaultThumbUrl : thumbUrl;
                  const releaseDate = new Date(episode.release_date);
                  const formattedDate = releaseDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  });

                  return (
                    <Link
                      key={episode.id}
                      href={`/podcast/${episode.id}`}
                      className="group flex gap-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border p-3 sm:p-4"
                      style={{
                        backgroundColor: 'var(--podcast-tabs-card-bg)',
                        borderColor: 'var(--podcast-tabs-card-border)'
                      }}
                    >
                      {/* Episode Thumbnail - Left */}
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 p-2 overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--nav-bg)' }}>
                        <img
                          src={imageUrl}
                    alt={episode.title}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          onError={() => {
                            if (!imageErrors[episode.id]) {
                              console.log(`Thumbnail for episode ${episode.id} failed to load, using default-thump.jpg`);
                              setImageErrors(prev => ({ ...prev, [episode.id]: true }));
                            }
                          }}
                        />
                      </div>

                      {/* Episode Info - Right */}
                      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                        <p className="text-xs sm:text-sm opacity-70 mb-2" style={{ color: 'var(--foreground)' }}>
                          {formattedDate}
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:opacity-90 transition-opacity leading-tight" style={{ color: 'var(--foreground)' }}>
                          Episode {episode.episode_number}: {episode.title}
                        </h3>
                        {episode.description && (
                          <p className="text-sm opacity-80 mb-3 line-clamp-2 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                            Episode {episode.episode_number}: {episode.description}
                          </p>
                        )}
                        <div className="inline-flex items-center gap-2 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300" style={{ color: 'var(--podcast-page-listen-episode-text-color)' }}>
                          <span>→</span>
                          <span>Listen to this episode</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
                  {/* View All Episodes Button */}
                  <div className="text-center">
                    <Link
                      href="/podcast/all"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--podcast-page-view-all-button-bg)', 
                        color: 'var(--podcast-page-view-all-button-text)'
                      }}
                    >
                      <span>View All Episodes</span>
                      <span style={{ 
                        fontWeight: 900, 
                        fontSize: '1.2em',
                        textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor'
                      }}>→</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg opacity-70" style={{ color: 'var(--foreground)' }}>
                    No recent episodes available.
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* Newsletter Signup */}
                <div className="rounded-3xl shadow-xl border overflow-hidden backdrop-blur-md p-6"
                  style={{
                    background: 'var(--podcast-page-newsletter-container-bg)',
                    borderColor: 'var(--podcast-tabs-card-border)'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                    Join Our Mailing List
                  </h3>
                  <p className="text-sm opacity-80 mb-4" style={{ color: 'var(--foreground)' }}>
                    Subscribe to our newsletter for updates on events, podcasts, and community news.
                  </p>
                  
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={newsletterFirstName}
                      onChange={(e) => setNewsletterFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--nav-border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={newsletterLastName}
                      onChange={(e) => setNewsletterLastName(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--nav-border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--nav-border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    {newsletterError && (
                      <div className="p-2 rounded-lg bg-red-500/20 border border-red-400/50">
                        <p className="text-red-600 text-xs font-medium">{newsletterError}</p>
                      </div>
                    )}
                    {newsletterSuccess && (
                      <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/50">
                        <p className="text-green-600 text-xs font-medium">✓ Successfully subscribed!</p>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={newsletterSubmitting}
                      className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        backgroundColor: 'var(--podcast-page-subscribe-button-bg)', 
                        color: 'var(--podcast-page-subscribe-button-text)'
                      }}
                    >
                      {newsletterSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                  </form>
                </div>

                {/* Listen On Section */}
                <div className="rounded-3xl shadow-xl border overflow-hidden backdrop-blur-md p-6"
                  style={{
                    background: 'var(--podcast-page-listen-on-container-bg)',
                    borderColor: 'var(--podcast-tabs-card-border)'
                  }}
                >
                  <h3 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
                    Listen On
                  </h3>
                  <div className="space-y-3">
                    {/* Spotify */}
                    <a
                      href="https://open.spotify.com/show/1QlGiIJuy42yryTDLhrlo7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-105 border group"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--nav-border)'
                      }}
                    >
                      <div className="flex-shrink-0">
                        <img src="/icons/spotify.svg" alt="Spotify" className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block" style={{ color: 'var(--foreground)' }}>Spotify</span>
                      </div>
                    </a>
                    
                    {/* YouTube */}
                    <a
                      href="https://www.youtube.com/@KurdishAtYork"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-105 border group"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--nav-border)'
                      }}
                    >
                      <div className="flex-shrink-0">
                        <img src="/icons/youtube.svg" alt="YouTube" className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block" style={{ color: 'var(--foreground)' }}>YouTube</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          </div>
        </section>

      {!latest && (!recent || recent.length === 0) && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-lg opacity-70" style={{ color: 'var(--foreground)' }}>
              No podcast episodes available.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

