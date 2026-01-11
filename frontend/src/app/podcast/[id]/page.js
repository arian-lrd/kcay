'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPodcastById, getPodcastTranscript, getAllPodcasts } from '@/lib/api';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const podcastId = params?.id;
  
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [transcript, setTranscript] = useState(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'transcript'
  const [playbackRate, setPlaybackRate] = useState(1); // audio speed
  const audioRef = useRef(null);
  const [recentEpisodes, setRecentEpisodes] = useState([]);

  // Helper: get YouTube video ID from either explicit ID or URL
  const getYouTubeVideoId = () => {
    if (!podcast) return null;
    if (podcast.youtube_video_id) return podcast.youtube_video_id;
    if (!podcast.youtube_url) return null;

    try {
      const url = new URL(podcast.youtube_url);

      // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.searchParams.has('v')) {
        return url.searchParams.get('v');
      }

      // Short URL: https://youtu.be/VIDEO_ID or https://youtu.be/VIDEO_ID?si=...
      if (url.hostname.includes('youtu.be')) {
        const path = url.pathname; // e.g. /VIDEO_ID
        const parts = path.split('/').filter(Boolean);
        if (parts.length > 0) {
          return parts[0];
        }
      }

      // Fallback: last path segment without query
      const fallbackParts = url.pathname.split('/').filter(Boolean);
      if (fallbackParts.length > 0) {
        return fallbackParts[fallbackParts.length - 1];
      }
    } catch (e) {
      // If it's not a valid URL, maybe it's already just an ID
      return podcast.youtube_url;
    }

    return null;
  };

  const youtubeVideoId = getYouTubeVideoId();

  // Helper: get iframe-friendly embed URL
  const getYouTubeEmbedUrl = () => {
    if (!podcast) return null;

    // If they pasted the full embed src from YouTube, just use it directly
    if (podcast.youtube_url && podcast.youtube_url.includes('youtube.com/embed')) {
      return podcast.youtube_url;
    }

    // Otherwise, build an /embed URL from the extracted ID
    if (!youtubeVideoId) return null;
    return `https://www.youtube.com/embed/${youtubeVideoId}`;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl();

  // Helper: get Spotify embed URL from spotify_url (if present)
  const getSpotifyEmbedUrl = () => {
    if (!podcast || !podcast.spotify_url) return null;

    try {
      const url = new URL(podcast.spotify_url);

      // If it's already an embed URL, just return it
      if (url.pathname.startsWith('/embed/')) {
        return podcast.spotify_url;
      }

      // Standard episode URL: https://open.spotify.com/episode/{id}
      // Convert to embed: https://open.spotify.com/embed/episode/{id}
      const parts = url.pathname.split('/').filter(Boolean); // ['episode', '{id}']
      if (parts.length >= 2 && parts[0] === 'episode') {
        const episodeId = parts[1];
        const params = url.search ? url.search : '';
        return `https://open.spotify.com/embed/episode/${episodeId}${params}`;
      }

      // Fallback: if we can't parse it, return null so we don't embed
      return null;
    } catch (e) {
      return null;
    }
  };

  const spotifyEmbedUrl = getSpotifyEmbedUrl();

  // Audio helpers: skip and change speed
  const skipAudio = (seconds) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const nextTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration || Infinity));
    audio.currentTime = nextTime;
  };

  const cyclePlaybackSpeed = () => {
    if (!audioRef.current) return;
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextRate = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextRate);
    audioRef.current.playbackRate = nextRate;
  };

  useEffect(() => {
    setMounted(true);
    async function fetchPodcast() {
      if (!podcastId) return;
      
      try {
        const podcastData = await getPodcastById(podcastId);
        setPodcast(podcastData);
        
        // Fetch recent episodes (excluding current one)
        try {
          const allEpisodes = await getAllPodcasts();
          const filtered = allEpisodes
            .filter(ep => ep.id !== podcastData.id)
            .slice(0, 9); // Get 9 recent episodes
          setRecentEpisodes(filtered);
        } catch (err) {
          console.error('Error fetching recent episodes:', err);
          // Don't fail the whole page if recent episodes fail
        }
      } catch (err) {
        console.error('Error fetching podcast:', err);
        setError(err.message || 'Failed to load podcast. Please make sure the backend server is running on port 3000.');
      } finally {
        setLoading(false);
      }
    }
    fetchPodcast();
  }, [podcastId]);

  useEffect(() => {
    if (podcast && selectedLanguage) {
      setLoadingTranscript(true);
      getPodcastTranscript(podcastId, selectedLanguage)
        .then((data) => {
          setTranscript(data?.transcript || null);
        })
        .catch((err) => {
          console.error('Error fetching transcript:', err);
          setTranscript(null);
        })
        .finally(() => {
          setLoadingTranscript(false);
        });
    }
  }, [podcast, selectedLanguage, podcastId]);

  const handleTimestampClick = (timestamp) => {
    if (youtubeVideoId) {
      // Convert timestamp (HH:MM:SS) to seconds
      const [hours, minutes, seconds] = timestamp.split(':').map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // Open YouTube video at specific timestamp
      window.open(
        `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${totalSeconds}s`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-current mb-4" style={{ color: 'var(--nav-bg)' }}></div>
          <p className="text-xl" style={{ color: 'var(--foreground)' }}>Loading episode...</p>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-3xl font-bold mb-4 text-red-600">Episode Not Found</h2>
          <p className="text-red-600 mb-6">{error || 'The episode you are looking for does not exist.'}</p>
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

  const releaseDate = new Date(podcast.release_date);
  const formattedDate = releaseDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Always use cover_image_url (API should return it with default-cover fallback)
  // Add frontend fallback just in case, and handle image loading errors
  const defaultCoverUrl = `${BACKEND_BASE_URL}/assets/images/podcasts/default-cover.jpg`;
  
  // Get the cover URL from API, or use default
  const apiCoverUrl = podcast.cover_image_url 
    ? `${BACKEND_BASE_URL}${podcast.cover_image_url}`
    : defaultCoverUrl;
  
  // If image failed to load, use default-cover
  const coverImageUrl = imageError ? defaultCoverUrl : apiCoverUrl;

  const languages = [
    { code: 'english', label: 'English' },
    { code: 'kurdish_sorani', label: 'Kurdish (Sorani)' },
    { code: 'kurdish_kurmanji', label: 'Kurdish (Kurmanji)' },
    { code: 'farsi', label: 'Farsi' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Column */}
            <div className="flex-1 max-w-4xl relative">
          {/* Soft background halo behind content */}
          <div
            className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(circle at top, var(--podcast-halo-top), transparent 60%), radial-gradient(circle at bottom, var(--podcast-halo-bottom), transparent 55%)'
            }}
          ></div>

          <div className="relative z-10">
          {/* Top meta + title + media */}
          <div
            className="mb-10 rounded-3xl border shadow-xl px-5 sm:px-8 py-6 sm:py-8 backdrop-blur-md"
            style={{
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out',
              background: 'var(--podcast-header-card-bg)',
              borderColor: 'var(--podcast-header-card-border)'
            }}
          >
            {/* Back Button */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Link
                href="/podcast"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:scale-105 border"
                style={{
                  backgroundColor: 'var(--podcast-back-button-bg)',
                  borderColor: 'var(--podcast-back-button-border)',
                  color: 'var(--podcast-back-button-text)'
                }}
              >
                <span>←</span>
                <span>Back to Podcast</span>
              </Link>

              <span className="text-xs uppercase tracking-[0.18em] px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--podcast-badge-bg)', color: 'var(--podcast-badge-text)' }}
              >
                KCAY PODCAST
              </span>
            </div>

            {/* Date */}
            <p className="text-sm sm:text-base mb-1 opacity-80" style={{ color: 'var(--foreground)' }}>
              {releaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>

            {/* Episode title line */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight" style={{ color: 'var(--foreground)' }}>
              <span className="opacity-80">Episode {podcast.episode_number}:</span>{' '}
              <span className="block sm:inline">{podcast.title}</span>
            </h1>

            {/* Under-title accent line */}
            <div className="h-1 w-20 rounded-full mb-4"
              style={{
                background: 'linear-gradient(90deg, var(--podcast-accent-line-start), transparent)'
              }}
            ></div>

            {/* Duration (optional) */}
            {podcast.duration && (
              <p className="mb-5 text-sm opacity-80" style={{ color: 'var(--foreground)' }}>
                ⏱️ {podcast.duration}
              </p>
            )}

            {/* YouTube frame */}
            {youtubeEmbedUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl border"
                style={{ borderColor: 'var(--podcast-youtube-frame-border)' }}
              >
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={youtubeEmbedUrl}
                    title={podcast.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Audio / Spotify player */}
            {(spotifyEmbedUrl || podcast.audio_url) && (
              <div className="mb-6">
                {spotifyEmbedUrl ? (
                  // Spotify embed player (preferred if spotify_url is present)
                  <iframe
                    src={spotifyEmbedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="encrypted-media"
                    className="w-full"
                  ></iframe>
                ) : (
                  <>
                    {/* Native audio element fallback if spotify not available */}
                    <audio
                      ref={audioRef}
                      controls
                      className="w-full"
                      style={{
                        backgroundColor: 'var(--podcast-audio-bg)',
                        borderRadius: '0.75rem'
                      }}
                      onLoadedMetadata={() => {
                        if (audioRef.current) {
                          audioRef.current.playbackRate = playbackRate;
                        }
                      }}
                    >
                      <source src={podcast.audio_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>

                    {/* Extra controls: skip and speed */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => skipAudio(-15)}
                          className="px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition hover:scale-105"
                          style={{
                            borderColor: 'var(--nav-border)',
                            color: 'var(--foreground)',
                            backgroundColor: 'var(--background)'
                          }}
                        >
                          ⏪ 15s
                        </button>
                        <button
                          type="button"
                          onClick={() => skipAudio(15)}
                          className="px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition hover:scale-105"
                          style={{
                            borderColor: 'var(--nav-border)',
                            color: 'var(--foreground)',
                            backgroundColor: 'var(--background)'
                          }}
                        >
                          15s ⏩
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={cyclePlaybackSpeed}
                        className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition hover:scale-105"
                        style={{
                          backgroundColor: 'var(--nav-bg)',
                          color: 'var(--nav-text)'
                        }}
                      >
                        Speed: {playbackRate.toFixed(2).replace(/\.00$/, '')}x
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* External Links - YouTube, Spotify, Share */}
            <div className="flex flex-wrap gap-3 mb-1">
              {/* YouTube Button */}
              {podcast.youtube_url && (
                <a
                  href={podcast.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--podcast-youtube-button-gradient-start), var(--podcast-youtube-button-gradient-end))',
                    color: 'white',
                    boxShadow: '0 18px 45px var(--podcast-youtube-button-shadow)'
                  }}
                >
                  <img
                    src="/icons/youtube.svg"
                    alt="YouTube"
                    className="w-5 h-5"
                  />
                  <span>Watch on YouTube</span>
                </a>
              )}

              {/* Spotify Button */}
              {podcast.spotify_url && (
                <a
                  href={podcast.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: '#1DB954',
                    color: 'white',
                    boxShadow: '0 18px 45px rgba(29, 185, 84, 0.35)'
                  }}
                >
                  <img
                    src="/icons/spotify.svg"
                    alt="Spotify"
                    className="w-5 h-5"
                  />
                  <span>Listen on Spotify</span>
                </a>
              )}

              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Episode ${podcast.episode_number}: ${podcast.title}`,
                      text: podcast.description || `Check out this podcast episode!`,
                      url: window.location.href
                    }).catch(() => {
                      // Fallback to copy if share fails
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    });
                  } else {
                    // Fallback for browsers without Web Share API
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg border"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--nav-border)',
                  color: 'var(--foreground)'
                }}
              >
                <span>🔗</span>
                <span>Share with friends</span>
              </button>
            </div>
          </div>

          {/* Show Notes / Transcript Tabs */}
          <div
            className="mb-8 rounded-3xl shadow-xl border overflow-hidden backdrop-blur-md"
            style={{
              background: 'var(--podcast-tabs-card-bg)',
              borderColor: 'var(--podcast-tabs-card-border)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out 0.4s'
            }}
          >
            {/* Tab bar */}
            <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b" style={{ borderColor: 'var(--nav-border)' }}>
              <div className="inline-flex rounded-full p-1"
                style={{ backgroundColor: 'var(--podcast-tabs-pill-bg)' }}
              >
              {['notes', 'transcript'].map((tab) => {
                const isActive = activeTab === tab;
                const label = tab === 'notes' ? 'Show Notes' : 'Transcript';
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold rounded-full transition-all ${
                      isActive ? 'shadow-md scale-105' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--podcast-tab-active-bg)' : 'transparent',
                      color: isActive ? 'var(--podcast-tab-active-text)' : 'var(--podcast-tab-inactive-text)',
                      border: 'none'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6 sm:p-8">
              {activeTab === 'notes' ? (
                <>
                  {/* Episode description in notes tab */}
                  {podcast.description && (
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: 'var(--podcast-description-heading-color)' }}>
                        Episode {podcast.episode_number}: Description
                      </h2>
                      <p
                        className="text-base sm:text-lg leading-relaxed whitespace-pre-line"
                        style={{ color: 'var(--podcast-description-text-color)' }}
                      >
                        {podcast.description}
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  {podcast.timestamps && podcast.timestamps.length > 0 && (
                    <div>
                      <h3 
                        className="text-xs font-semibold uppercase tracking-[0.25em] mb-1" 
                        style={{ 
                          color: 'var(--podcast-timestamps-heading-color)',
                          opacity: 'var(--podcast-timestamps-heading-opacity)'
                        }}
                      >
                        ===== Timestamps =====
                      </h3>
                      <div className="space-y-3">
                        {podcast.timestamps.map((ts, index) => (
                          <button
                            key={index}
                            onClick={() => handleTimestampClick(ts.timestamp)}
                            className="w-full text-left p-3 sm:p-4 rounded-xl transition-all hover:shadow-md border"
                            style={{
                              backgroundColor: 'var(--podcast-timestamp-button-bg)',
                              borderColor: 'var(--podcast-timestamp-button-border)',
                              color: 'var(--podcast-timestamp-button-text)',
                              transform: 'scale(1)',
                              transition: 'transform 0.2s ease-out'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = `scale(var(--podcast-timestamp-button-hover-scale))`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-base sm:text-lg">{ts.label}</span>
                              <span
                                className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                                style={{ 
                                  backgroundColor: 'var(--podcast-timestamp-badge-bg)', 
                                  color: 'var(--podcast-timestamp-badge-text)' 
                                }}
                              >
                                {ts.timestamp}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Existing rich show notes (if any) below timestamps */}
                  {podcast.show_notes && (
                    <div className="mt-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: 'var(--podcast-show-notes-heading-color)' }}>
                        Additional Show Notes
                      </h3>
                      <div
                        className="text-base leading-relaxed whitespace-pre-line prose prose-lg max-w-none"
                        style={{ color: 'var(--podcast-show-notes-text-color)' }}
                        dangerouslySetInnerHTML={{ __html: podcast.show_notes.replace(/\n/g, '<br />') }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Transcript tab with language selector */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {languages.map((lang) => {
                      const isActive = selectedLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLanguage(lang.code)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            isActive ? 'scale-105 shadow-lg' : 'hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: isActive 
                              ? 'var(--podcast-transcript-lang-button-active-bg)' 
                              : 'var(--podcast-transcript-lang-button-inactive-bg)',
                            color: isActive 
                              ? 'var(--podcast-transcript-lang-button-active-text)' 
                              : 'var(--podcast-transcript-lang-button-inactive-text)',
                            border: `2px solid ${
                              isActive 
                                ? 'var(--podcast-transcript-lang-button-active-border)' 
                                : 'var(--podcast-transcript-lang-button-inactive-border)'
                            }`
                          }}
                        >
                          {lang.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="min-h-[200px]">
                    {loadingTranscript ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div
                            className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-current mb-2"
                            style={{ color: 'var(--nav-bg)' }}
                          ></div>
                          <p style={{ color: 'var(--foreground)' }}>Loading transcript...</p>
                        </div>
                      </div>
                    ) : transcript ? (
                      <div
                        className="p-6 rounded-xl whitespace-pre-wrap leading-relaxed"
                        style={{
                          backgroundColor: 'var(--podcast-transcript-text-bg)',
                          color: 'var(--podcast-transcript-text-color)'
                        }}
                      >
                        {transcript}
                      </div>
                    ) : (
                      <div
                        className="p-6 rounded-xl text-center opacity-70"
                        style={{
                          backgroundColor: 'var(--podcast-transcript-text-bg)',
                          color: 'var(--podcast-transcript-text-color)'
                        }}
                      >
                        Transcript not available in{' '}
                        {languages.find((l) => l.code === selectedLanguage)?.label || selectedLanguage}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            </div>
          </div>
          </div>

          {/* Sidebar - Recent Episodes */}
          <aside className="lg:w-80 flex-shrink-0">
            <div
              className="sticky top-8 rounded-3xl shadow-xl border overflow-hidden backdrop-blur-md p-6"
              style={{
                background: 'var(--podcast-tabs-card-bg)',
                borderColor: 'var(--podcast-tabs-card-border)',
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.6s ease-out 0.5s'
              }}
            >
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ 
                color: 'var(--podcast-sidebar-heading-color)',
                fontSize: 'var(--podcast-sidebar-heading-size)',
                marginBottom: 'var(--podcast-sidebar-heading-margin-bottom)'
              }}>
                RECENT EPISODES
              </h2>
              
              {recentEpisodes.length > 0 ? (
                <>
                  <div className="space-y-3 mb-4" style={{ gap: 'var(--podcast-sidebar-episode-gap)' }}>
                    {recentEpisodes.map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/podcast/${episode.id}`}
                        className="block rounded-xl transition-all hover:shadow-md border"
                        style={{
                          padding: 'var(--podcast-sidebar-episode-padding)',
                          backgroundColor: episode.id === podcastId 
                            ? 'var(--podcast-sidebar-episode-active-bg)' 
                            : 'var(--podcast-sidebar-episode-bg)',
                          borderColor: episode.id === podcastId
                            ? 'var(--podcast-sidebar-episode-active-border)'
                            : 'var(--podcast-sidebar-episode-border)',
                          color: episode.id === podcastId
                            ? 'var(--podcast-sidebar-episode-active-text)'
                            : 'var(--podcast-sidebar-episode-text)',
                          transform: 'scale(1)',
                          transition: 'transform 0.2s ease-out'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(var(--podcast-sidebar-episode-hover-scale))';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <p className="font-semibold leading-tight" style={{ 
                          fontSize: 'var(--podcast-sidebar-episode-text-size)',
                          fontWeight: 'var(--podcast-sidebar-episode-text-weight)'
                        }}>
                          Episode {episode.episode_number}: {episode.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--podcast-sidebar-divider-color)' }}>
                    <Link
                      href="/podcast/all"
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:scale-105"
                      style={{ color: 'var(--podcast-sidebar-see-all-color)' }}
                    >
                      <span>See all</span>
                      <span style={{ 
                        fontWeight: 900, 
                        fontSize: '1.2em',
                        textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor'
                      }}>→</span>
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm opacity-70" style={{ color: 'var(--foreground)' }}>
                  Loading recent episodes...
                </p>
              )}
            </div>
          </aside>
        </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--nav-border)' }}>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/podcast"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
            >
              <span>←</span>
              <span>Back to All Episodes</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-80 border"
                style={{ borderColor: 'var(--nav-bg)', color: 'var(--foreground)' }}
              >
                Home
              </Link>
              <Link
                href="/get-involved"
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
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

