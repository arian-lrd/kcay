'use client';

import { useState, useEffect } from 'react';
import { getNotableFigures } from '@/lib/api';
import Link from 'next/link';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function NotableFiguresPage() {
  const [figures, setFigures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState({}); // Track which images failed to load

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const figuresData = await getNotableFigures();
        setFigures(figuresData);
      } catch (err) {
        console.error('Error fetching notable figures:', err);
        setError(err.message || 'Failed to load notable figures. Please make sure the backend server is running on port 3000.');
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
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Notable Figures</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--foreground)' }}>
            Please make sure the backend server is running on port 3000.
          </p>
        </div>
      </div>
    );
  }
  
  if (!figures || figures.length === 0) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: 'var(--foreground)' }}>No notable figures found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <section 
        className="relative px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          paddingTop: 'var(--notable-figures-hero-padding-top, 5rem)',
          paddingBottom: 'var(--notable-figures-hero-padding-bottom, 5rem)',
          minHeight: 'var(--notable-figures-hero-min-height, auto)'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'var(--notable-figures-hero-bg-image, none)',
            backgroundSize: 'var(--notable-figures-hero-bg-size, cover)',
            backgroundPosition: 'var(--notable-figures-hero-bg-position, center)',
            backgroundRepeat: 'no-repeat',
            opacity: 'var(--notable-figures-hero-bg-opacity, 0.3)'
          }}
        ></div>
        {/* Gradient Pattern Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'var(--notable-figures-hero-pattern)',
            opacity: 'var(--notable-figures-hero-pattern-opacity, 0.2)'
          }}
        ></div>
        {/* Dark Overlay for Text Readability */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--notable-figures-hero-overlay-color, rgba(0, 0, 0, 0.4))'
          }}
        ></div>
        <div className="relative mx-auto max-w-7xl text-center z-10">
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" 
            style={{ 
              color: 'var(--notable-figures-hero-title-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
          >
            Notable Figures
          </h1>
          <p 
            className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto" 
            style={{ 
              color: 'var(--notable-figures-hero-subtitle-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out 0.2s'
            }}
          >
            Explore the lives and contributions of remarkable Kurdish figures throughout history
          </p>
        </div>
      </section>

      {/* Figures Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {figures.map((figure, index) => {
              // If image_url is already a full URL (Cloudinary), use it directly
              // Otherwise, prepend BACKEND_BASE_URL (database/local files)
              const imageUrl = figure.image_url 
                ? (figure.image_url.startsWith('http://') || figure.image_url.startsWith('https://'))
                  ? figure.image_url
                  : `${BACKEND_BASE_URL}${figure.image_url}`
                : null;
              const hasImageError = imageErrors[figure.id];
              
              // Parse name to separate main name and nickname (if in parentheses)
              // Example: "Abdurrahman Sharafkandi (Mamosta Hejar)" -> main: "Abdurrahman Sharafkandi", nickname: "Mamosta Hejar"
              let mainName = figure.name;
              let nickname = figure.nickname || null;
              
              // If no separate nickname field, try to extract from parentheses in name
              if (!nickname && figure.name.includes('(') && figure.name.includes(')')) {
                const match = figure.name.match(/^(.+?)\s*\((.+?)\)\s*$/);
                if (match) {
                  mainName = match[1].trim();
                  nickname = match[2].trim();
                }
              }
              
              // Parse Kurdish name to separate main name and nickname (if in parentheses)
              // Handle both formats: "name (nickname)" and "(nickname)name"
              let mainKurdishName = figure.name_kurdish || null;
              let kurdishNickname = null;
              
              if (mainKurdishName && mainKurdishName.includes('(') && mainKurdishName.includes(')')) {
                // Try format: "name (nickname)"
                let kurdishMatch = mainKurdishName.match(/^(.+?)\s*\((.+?)\)\s*$/);
                if (kurdishMatch) {
                  mainKurdishName = kurdishMatch[1].trim();
                  kurdishNickname = kurdishMatch[2].trim();
                } else {
                  // Try format: "(nickname)name"
                  kurdishMatch = mainKurdishName.match(/^\((.+?)\)\s*(.+?)$/);
                  if (kurdishMatch) {
                    kurdishNickname = kurdishMatch[1].trim();
                    mainKurdishName = kurdishMatch[2].trim();
                  }
                }
              }

              return (
          <Link 
            key={figure.id} 
            href={`/notable-figures/${figure.id}`}
                  className="group block"
                  style={{
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    opacity: mounted ? 1 : 0,
                    transition: `all 0.6s ease-out ${0.3 + (index % 8) * 0.05}s`
                  }}
                >
                  <div 
                    className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border h-full flex flex-col"
                    style={{
                      backgroundColor: 'var(--notable-figures-card-bg, var(--podcast-tabs-card-bg))',
                      borderColor: 'var(--notable-figures-card-border, var(--podcast-tabs-card-border))'
                    }}
                  >
                    {/* Figure Image */}
                    <div 
                      className="relative w-full h-72 overflow-hidden"
                      style={{ backgroundColor: 'var(--notable-figures-image-placeholder-bg, var(--background))' }}
                    >
                      {imageUrl && !hasImageError ? (
                        <img 
                          src={imageUrl} 
                  alt={figure.name}
                          className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                          style={{
                            objectFit: 'var(--notable-figures-image-object-fit, cover)',
                            // Use per-image positioning if available, otherwise fall back to CSS variable
                            objectPosition: figure.image_object_position || 'var(--notable-figures-image-object-position, center top)'
                          }}
                          onError={() => {
                            if (!imageErrors[figure.id]) {
                              setImageErrors(prev => ({ ...prev, [figure.id]: true }));
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center p-4">
                            <svg className="w-20 h-20 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-sm opacity-50" style={{ color: 'var(--foreground)' }}>No Image</p>
                          </div>
                        </div>
                      )}
                      {/* Name Overlay on Image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <h3 
                            className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg leading-tight"
                            style={{ color: 'var(--notable-figures-name-overlay-color, #ffffff)' }}
                          >
                            {mainName}
                          </h3>
                          {nickname && (
                            <p className="text-base sm:text-lg font-medium text-white/85 drop-shadow-lg mt-1 italic">
                              {nickname}
                            </p>
                          )}
                          {mainKurdishName && (
                            <div className="mt-2">
                              <h4 className="text-lg sm:text-xl font-semibold text-white/90 drop-shadow-lg kurdish-text">
                                {mainKurdishName}
                              </h4>
                              {kurdishNickname && (
                                <p className="text-base sm:text-lg font-medium text-white/85 drop-shadow-lg mt-1 italic kurdish-text">
                                  {kurdishNickname}
                                </p>
                              )}
                            </div>
                          )}
                  </div>
                </div>
                    </div>

                    {/* Figure Content */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col">
                      <div>
                        <h3 
                          className="text-xl sm:text-2xl font-bold mb-1 group-hover:opacity-90 transition-opacity leading-tight"
                          style={{ color: 'var(--notable-figures-name-color, var(--foreground))' }}
                        >
                          {mainName}
                        </h3>
                        {nickname && (
                          <p className="text-sm sm:text-base font-medium mb-2 italic opacity-75" style={{ color: 'var(--notable-figures-name-color, var(--foreground))' }}>
                            {nickname}
                          </p>
                        )}
                        {mainKurdishName && (
                          <div className="mb-4">
                            <h4 className="text-base sm:text-lg font-semibold kurdish-text opacity-90" style={{ color: 'var(--notable-figures-name-color, var(--foreground))' }}>
                              {mainKurdishName}
                            </h4>
                            {kurdishNickname && (
                              <p className="text-sm sm:text-base font-medium italic opacity-75 mt-1 kurdish-text" style={{ color: 'var(--notable-figures-name-color, var(--foreground))' }}>
                                {kurdishNickname}
                              </p>
                            )}
              </div>
            )}
                        {!figure.name_kurdish && !nickname && <div className="mb-4"></div>}
                      </div>
                      <div className="space-y-2 flex-1">
              {figure.century && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--notable-figures-text-color, var(--foreground))' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p 
                              className="text-sm font-medium"
                              style={{ color: 'var(--notable-figures-century-color, var(--foreground))' }}
                            >
                              {figure.century}
                            </p>
                          </div>
              )}
              {figure.area_of_distinction && (
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 opacity-60 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--notable-figures-text-color, var(--foreground))' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p 
                              className="text-sm leading-relaxed"
                              style={{ color: 'var(--notable-figures-area-color, var(--foreground))' }}
                            >
                              {figure.area_of_distinction}
                            </p>
                          </div>
              )}
              {figure.city_born && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--notable-figures-text-color, var(--foreground))' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p 
                              className="text-sm"
                              style={{ color: 'var(--notable-figures-location-color, var(--foreground))' }}
                            >
                              Born in {figure.city_born}
                            </p>
                          </div>
              )}
                      </div>
                      <div 
                        className="inline-flex items-center gap-2 text-sm font-semibold mt-4 pt-4 border-t group-hover:translate-x-2 transition-transform duration-300"
                        style={{ 
                          color: 'var(--notable-figures-link-color, var(--nav-bg))',
                          borderColor: 'var(--notable-figures-link-divider-color, var(--nav-border))'
                        }}
                      >
                        <span>Learn More</span>
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
      </div>
      </section>
    </div>
  );
}

