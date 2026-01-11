'use client';

import { useState, useEffect } from 'react';
import { getAllPodcasts } from '@/lib/api';
import Link from 'next/link';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function AllPodcastsPage() {
  const [podcasts, setPodcasts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState({}); // Track which images failed to load

  useEffect(() => {
    setMounted(true);
    async function fetchPodcasts() {
      try {
        const podcastsData = await getAllPodcasts();
        setPodcasts(podcastsData);
      } catch (err) {
        console.error('Error fetching podcasts:', err);
        setError(err.message || 'Failed to load podcasts. Please make sure the backend server is running on port 3000.');
      } finally {
        setLoading(false);
      }
    }
    fetchPodcasts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-current mb-4" style={{ color: 'var(--nav-bg)' }}></div>
          <p className="text-xl" style={{ color: 'var(--foreground)' }}>Loading episodes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-3xl font-bold mb-4 text-red-600">Error Loading Episodes</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            href="/podcast"
            className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
          >
            ← Back to Podcast
          </Link>
        </div>
      </div>
    );
  }

  if (!podcasts || podcasts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>No Episodes Found</h2>
          <p className="mb-6 opacity-80" style={{ color: 'var(--foreground)' }}>
            There are no podcast episodes available at this time.
          </p>
          <Link
            href="/podcast"
            className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
          >
            ← Back to Podcast
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl z-10">
          <div className="text-center">
            <Link
              href="/podcast"
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <span>←</span>
              <span>Back to Podcast</span>
            </Link>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
              All Episodes
            </h1>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full mb-8"></div>
            <p className="text-xl sm:text-2xl opacity-95 max-w-3xl mx-auto">
              Explore our complete collection of podcast episodes covering Kurdish culture, community, and student life.
            </p>
            <p className="mt-4 text-lg opacity-80">
              {podcasts.length} {podcasts.length === 1 ? 'episode' : 'episodes'} available
            </p>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {podcasts.map((episode, index) => {
              const releaseDate = new Date(episode.release_date);
              const formattedDate = releaseDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              });
              
              // Always use thumbnail_image_url with fallback to cover_image_url, then default-thump
              const defaultThumbUrl = `${BACKEND_BASE_URL}/assets/images/podcasts/default-thump.jpg`;
              const apiThumbUrl = episode.thumbnail_image_url || episode.cover_image_url;
              const thumbUrl = apiThumbUrl ? `${BACKEND_BASE_URL}${apiThumbUrl}` : defaultThumbUrl;
              const imageUrl = imageErrors[episode.id] ? defaultThumbUrl : thumbUrl;

              return (
                <Link
                  key={episode.id}
                  href={`/podcast/${episode.id}`}
                  className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border"
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--nav-border)',
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    opacity: mounted ? 1 : 0,
                    transition: `all 0.6s ease-out ${index * 0.05}s`
                  }}
                >
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, var(--nav-bg) 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-var(--nav-bg) to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{ background: `linear-gradient(to right, transparent, var(--nav-bg), transparent)` }}
                  ></div>
                  
                  {/* Episode Image */}
                  <div className="relative w-full aspect-square overflow-hidden" style={{ backgroundColor: 'var(--nav-bg)' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
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
                    {/* Episode Number Badge */}
                    <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
                    >
                      <span className="text-sm font-bold">#{episode.episode_number}</span>
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="relative z-10 p-6">
                    {/* Date & Duration */}
                    <div className="flex items-center justify-between mb-3 text-sm opacity-70" style={{ color: 'var(--foreground)' }}>
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{formattedDate}</span>
                      </span>
                      {episode.duration && (
                        <span className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{episode.duration}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 group-hover:opacity-90 transition-opacity leading-tight line-clamp-2" style={{ color: 'var(--foreground)' }}>
                      {episode.title}
                    </h3>
                    
                    {/* Description */}
                    {episode.description && (
                      <p className="text-sm opacity-80 mb-4 line-clamp-3 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                        {episode.description}
                      </p>
                    )}

                    {/* Listen Button */}
                    <div className="inline-flex items-center gap-2 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300" style={{ color: 'var(--nav-bg)' }}>
                      <span>Listen to Episode</span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>

                  {/* Bottom accent on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-var(--nav-bg) to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{ background: `linear-gradient(to right, transparent, var(--nav-bg), transparent)` }}
                  ></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back to Podcast Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--nav-border)' }}>
        <div className="mx-auto max-w-7xl text-center">
          <Link
            href="/podcast"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
          >
            <span>←</span>
            <span>Back to Podcast</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

