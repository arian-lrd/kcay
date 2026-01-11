'use client';

import { useState, useEffect } from 'react';
import { getLearnMain } from '@/lib/api';
import Link from 'next/link';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function LearnPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const learnData = await getLearnMain();
        setData(learnData);
      } catch (err) {
        console.error('Error fetching learn data:', err);
        setError(err.message || 'Failed to load learn data. Please make sure the backend server is running on port 3000.');
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

  const learningOptions = [
    {
      href: '/learn/kurdish-language',
      title: 'Learn Kurdish Language',
      description: 'Explore language learning resources and connect with local learning opportunities.',
      // Image path - user will upload to: backend/public/images/learn/kurdish-language.jpg
      // Or use frontend: /images/learn/kurdish-language.jpg
      imagePath: `${BACKEND_BASE_URL}/assets/images/learn/kurdish-language.jpg`,
      // Fallback to frontend public folder if backend image doesn't exist
      fallbackImagePath: '/images/learn/kurdish-language.jpg',
      // Image positioning: 'center', 'top', 'bottom', 'left', 'right', or custom like 'center 30%'
      objectPosition: 'center'
    },
    {
      href: '/learn/kurdish-dance',
      title: 'Learn Kurdish Dance',
      description: 'Discover dance classes and connect with local dance instructors and studios.',
      imagePath: `${BACKEND_BASE_URL}/assets/images/learn/kurdish-dance.jpg`,
      fallbackImagePath: '/images/learn/kurdish-dance.jpg',
      objectPosition: 'center'
    },
    {
      href: '/learn/kurdish-heritage',
      title: 'Learn Kurdish Heritage',
      description: 'Learn about history, heritage, and folklore through educational resources.',
      imagePath: `${BACKEND_BASE_URL}/assets/images/learn/kurdish-heritage.jpg`,
      fallbackImagePath: '/images/learn/kurdish-heritage.jpg',
      // Zoom in more on this image - adjust the scale and position as needed
      // Options: 'center 30%' (zoom on top), 'center 70%' (zoom on bottom), '30% center' (zoom on left), etc.
      // Or use scale transform for more zoom
      objectPosition: 'center 10%',
      imageScale: '1.15' // Zoom in by 30%
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <section 
        className="relative px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          paddingTop: 'var(--learn-hero-padding-top, 5rem)',
          paddingBottom: 'var(--learn-hero-padding-bottom, 5rem)',
          minHeight: 'var(--learn-hero-min-height, auto)'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'var(--learn-hero-bg-image, none)',
            backgroundSize: 'var(--learn-hero-bg-size, cover)',
            backgroundPosition: 'var(--learn-hero-bg-position, center)',
            backgroundRepeat: 'no-repeat',
            opacity: 'var(--learn-hero-bg-opacity, 0.3)'
          }}
        ></div>
        {/* Gradient Pattern Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'var(--learn-hero-pattern)',
            opacity: 'var(--learn-hero-pattern-opacity, 0.2)'
          }}
        ></div>
        {/* Dark Overlay for Text Readability */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--learn-hero-overlay-color, rgba(0, 0, 0, 0.4))'
          }}
        ></div>
        <div className="relative mx-auto max-w-7xl text-center z-10">
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" 
            style={{ 
              color: 'var(--learn-hero-title-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
          >
            {data.title}
          </h1>
          {data.description && (
            <p 
              className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto" 
              style={{ 
                color: 'var(--learn-hero-subtitle-color)',
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.6s ease-out 0.2s'
              }}
            >
              {data.description}
            </p>
          )}
        </div>
      </section>

      {/* Learning Options Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {learningOptions.map((option, index) => (
              <Link
                key={option.href}
                href={option.href}
                className="group block"
              >
                <div 
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border h-full flex flex-col"
                  style={{
                    backgroundColor: 'var(--learn-card-bg, var(--podcast-tabs-card-bg))',
                    borderColor: 'var(--learn-card-border, var(--podcast-tabs-card-border))',
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    opacity: mounted ? 1 : 0,
                    transition: `all 0.6s ease-out ${0.3 + index * 0.1}s`
                  }}
                >
                  {/* Image Section */}
                  <div 
                    className="relative w-full h-64 sm:h-72 overflow-hidden"
                    style={{
                      backgroundColor: 'var(--learn-card-icon-bg, var(--nav-bg))'
                    }}
                  >
                    {option.imagePath && !imageErrors[option.href] ? (
                      <img 
                        src={option.imagePath} 
                        alt={option.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{
                          objectPosition: option.objectPosition || 'center',
                          transform: option.imageScale 
                            ? `scale(${option.imageScale})` 
                            : undefined,
                          transformOrigin: 'center center'
                        }}
                        onMouseEnter={(e) => {
                          const baseScale = option.imageScale ? parseFloat(option.imageScale) : 1;
                          e.currentTarget.style.transform = `scale(${baseScale * 1.1})`;
                        }}
                        onMouseLeave={(e) => {
                          const baseScale = option.imageScale ? parseFloat(option.imageScale) : 1;
                          e.currentTarget.style.transform = `scale(${baseScale})`;
                        }}
                        onError={() => {
                          // Try fallback image if primary fails
                          if (!imageErrors[option.href]) {
                            setImageErrors(prev => ({ ...prev, [option.href]: 'primary' }));
                            // If fallback also fails, it will be handled by the fallback render
                          }
                        }}
                      />
                    ) : option.fallbackImagePath && imageErrors[option.href] !== 'fallback' ? (
                      <img 
                        src={option.fallbackImagePath} 
                        alt={option.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{
                          objectPosition: option.objectPosition || 'center',
                          transform: option.imageScale 
                            ? `scale(${option.imageScale})` 
                            : undefined,
                          transformOrigin: 'center center'
                        }}
                        onMouseEnter={(e) => {
                          const baseScale = option.imageScale ? parseFloat(option.imageScale) : 1;
                          e.currentTarget.style.transform = `scale(${baseScale * 1.1})`;
                        }}
                        onMouseLeave={(e) => {
                          const baseScale = option.imageScale ? parseFloat(option.imageScale) : 1;
                          e.currentTarget.style.transform = `scale(${baseScale})`;
                        }}
                        onError={() => {
                          if (imageErrors[option.href] !== 'fallback') {
                            setImageErrors(prev => ({ ...prev, [option.href]: 'fallback' }));
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center p-4">
                          <svg 
                            className="w-24 h-24 mx-auto mb-2 opacity-50" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            style={{ color: 'var(--learn-card-icon-text, var(--foreground))' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm opacity-50" style={{ color: 'var(--learn-card-icon-text, var(--foreground))' }}>
                            Image coming soon
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col">
                    <h2 
                      className="text-2xl sm:text-3xl font-bold mb-4 group-hover:opacity-90 transition-opacity"
                      style={{ color: 'var(--learn-card-title-color, var(--foreground))' }}
                    >
                      {option.title}
                    </h2>
                    <p 
                      className="text-base sm:text-lg opacity-80 mb-6 flex-1 leading-relaxed"
                      style={{ color: 'var(--learn-card-text-color, var(--foreground))' }}
                    >
                      {option.description}
                    </p>
                    <div 
                      className="inline-flex items-center gap-2 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300 mt-auto"
                      style={{ color: 'var(--learn-card-link-color, var(--nav-bg))' }}
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

