'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNotableFigureById } from '@/lib/api';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function NotableFigureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const figureId = params?.id;
  
  const [figure, setFigure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [associatedImageErrors, setAssociatedImageErrors] = useState({});

  useEffect(() => {
    setMounted(true);
    async function fetchFigure() {
      if (!figureId) return;
      
      try {
        console.log(`🔍 Fetching notable figure with ID: ${figureId}`);
        const figureData = await getNotableFigureById(figureId);
        console.log(`✅ Received figure data:`, {
          id: figureData?.id,
          name: figureData?.name,
          hasEssay: !!figureData?.essay,
          essayLength: figureData?.essay?.length || 0,
          century: figureData?.century,
          area: figureData?.area_of_distinction,
          city: figureData?.city_born,
          education: figureData?.education
        });
        setFigure(figureData);
      } catch (err) {
        console.error('Error fetching notable figure:', err);
        setError(err.message || 'Failed to load notable figure. Please make sure the backend server is running on port 3000.');
      } finally {
        setLoading(false);
      }
    }
    fetchFigure();
  }, [figureId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-current mb-4" style={{ color: 'var(--nav-bg)' }}></div>
          <p className="text-xl" style={{ color: 'var(--foreground)' }}>Loading notable figure...</p>
        </div>
      </div>
    );
  }

  if (error || !figure) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-3xl font-bold mb-4 text-red-600">Notable Figure Not Found</h2>
          <p className="text-red-600 mb-6">{error || 'The notable figure you are looking for does not exist.'}</p>
          <Link
            href="/notable-figures"
            className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
          >
            ← Back to Notable Figures
          </Link>
        </div>
      </div>
    );
  }

  // If image_url is already a full URL (Cloudinary), use it directly
  // Otherwise, prepend BACKEND_BASE_URL (database/local files)
  const imageUrl = figure.image_url 
    ? (figure.image_url.startsWith('http://') || figure.image_url.startsWith('https://'))
      ? figure.image_url
      : `${BACKEND_BASE_URL}${figure.image_url}`
    : null;
  const defaultImageUrl = `${BACKEND_BASE_URL}/assets/images/notable-figures/default-figure.jpg`;
  const finalImageUrl = imageError || !imageUrl ? defaultImageUrl : imageUrl;
  
  // Parse name to separate main name and nickname (if in parentheses or separate field)
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Hero Section - Matching Notable Figures Main Page */}
      <section 
        className="relative px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          paddingTop: 'var(--notable-figures-hero-padding-top, 5rem)',
          paddingBottom: 'var(--notable-figures-hero-padding-bottom, 5rem)',
          minHeight: 'var(--notable-figures-hero-min-height, auto)'
        }}
      >
        {/* Background Image - Use figure image or fallback to default */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: finalImageUrl ? `url(${finalImageUrl})` : 'var(--notable-figures-hero-bg-image, none)',
            backgroundSize: 'var(--notable-figures-hero-bg-size, cover)',
            backgroundPosition: 'var(--notable-figures-hero-bg-position, center)',
            backgroundRepeat: 'no-repeat',
            opacity: 'var(--notable-figures-hero-bg-opacity, 0.3)'
          }}
        >
          {/* Hidden image for error detection */}
          {imageUrl && !imageError && (
            <img 
              src={imageUrl}
              alt=""
              className="hidden"
              onError={() => {
                if (!imageError) {
                  console.log(`Notable figure image failed to load, using default`);
                  setImageError(true);
                }
              }}
            />
          )}
        </div>
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
          {/* Back Button */}
          <div className="mb-8 text-left">
            <Link
              href="/notable-figures"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 backdrop-blur-md border shadow-lg"
              style={{
                backgroundColor: 'var(--notable-figure-detail-back-button-bg, rgba(0, 0, 0, 0.5))',
                borderColor: 'var(--notable-figure-detail-back-button-border, rgba(255, 255, 255, 0.2))',
                color: 'var(--notable-figure-detail-back-button-text, #ffffff)'
              }}
            >
              <span className="text-xl">←</span>
              <span>Back to Notable Figures</span>
            </Link>
          </div>

          {/* Figure Name */}
          <div className="mb-6">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 leading-tight" 
              style={{ 
                color: 'var(--notable-figures-hero-title-color)',
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.6s ease-out'
              }}
            >
              {mainName}
            </h1>
            {nickname && (
              <p 
                className="text-xl sm:text-2xl md:text-3xl font-medium italic mb-2 opacity-80" 
                style={{ 
                  color: 'var(--notable-figures-hero-title-color)',
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mounted ? 0.8 : 0,
                  transition: 'all 0.6s ease-out 0.1s'
                }}
              >
                {nickname}
              </p>
            )}
            {mainKurdishName && (
              <div>
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-semibold kurdish-text opacity-90 leading-tight" 
                  style={{ 
                    color: 'var(--notable-figures-hero-title-color)',
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    opacity: mounted ? 0.9 : 0,
                    transition: 'all 0.6s ease-out 0.15s'
                  }}
                >
                  {mainKurdishName}
                </h2>
                {kurdishNickname && (
                  <p 
                    className="text-xl sm:text-2xl md:text-3xl font-medium italic kurdish-text opacity-80 mt-1" 
                    style={{ 
                      color: 'var(--notable-figures-hero-title-color)',
                      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                      opacity: mounted ? 0.8 : 0,
                      transition: 'all 0.6s ease-out 0.2s'
                    }}
                  >
                    {kurdishNickname}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Figure Meta Info */}
          <div 
            className="flex flex-wrap items-center justify-center gap-4 text-lg sm:text-xl"
            style={{ 
              color: 'var(--notable-figures-hero-subtitle-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out 0.2s'
            }}
          >
            {figure.century && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border"
                style={{
                  backgroundColor: 'var(--notable-figure-detail-badge-bg, rgba(0, 0, 0, 0.4))',
                  borderColor: 'var(--notable-figure-detail-badge-border, rgba(255, 255, 255, 0.2))'
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{figure.century}</span>
              </div>
            )}
            {figure.area_of_distinction && (
              <>
                <span className="opacity-50">|</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border"
                  style={{
                    backgroundColor: 'var(--notable-figure-detail-badge-bg, rgba(0, 0, 0, 0.4))',
                    borderColor: 'var(--notable-figure-detail-badge-border, rgba(255, 255, 255, 0.2))'
                  }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="font-semibold">{figure.area_of_distinction}</span>
                </div>
              </>
            )}
            {figure.city_born && (
              <>
                <span className="opacity-50">|</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border"
                  style={{
                    backgroundColor: 'var(--notable-figure-detail-badge-bg, rgba(0, 0, 0, 0.4))',
                    borderColor: 'var(--notable-figure-detail-badge-border, rgba(255, 255, 255, 0.2))'
                  }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold">Born in {figure.city_born}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
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
            {/* Biography/Essay Section */}
            {figure.essay && (
              <div 
                className="relative p-8 sm:p-12 rounded-3xl shadow-xl border mb-10 overflow-hidden backdrop-blur-sm" 
                style={{ 
                  background: 'var(--notable-figure-detail-essay-card-bg, var(--podcast-tabs-card-bg))',
                  borderColor: 'var(--notable-figure-detail-essay-card-border, var(--podcast-tabs-card-border))'
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
                    color: 'var(--notable-figure-detail-heading-color, var(--foreground))',
                    borderColor: 'var(--notable-figure-detail-divider-color, var(--nav-border))'
                  }}
                >
                  Biography
                </h2>
                <div 
                  className="text-lg leading-relaxed whitespace-pre-line"
                  style={{ 
                    color: 'var(--notable-figure-detail-essay-text-color, var(--foreground))'
                  }}
                >
                  {figure.essay}
                </div>
              </div>
            )}

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Century Card */}
              {figure.century && (
                <div 
                  className="group p-6 sm:p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--notable-figure-detail-info-card-bg, var(--podcast-tabs-card-bg))',
                    borderColor: 'var(--notable-figure-detail-info-card-border, var(--podcast-tabs-card-border))'
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--notable-figure-detail-icon-bg, var(--nav-bg))', 
                        color: 'var(--notable-figure-detail-icon-text, var(--nav-text))'
                      }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: 'var(--notable-figure-detail-info-heading-color, var(--foreground))' }}
                    >
                      Century
                    </h3>
                  </div>
                  <p 
                    className="text-lg sm:text-xl font-semibold"
                    style={{ color: 'var(--notable-figure-detail-info-text-color, var(--foreground))' }}
                  >
                    {figure.century}
                  </p>
                </div>
              )}

              {/* Area of Distinction Card */}
              {figure.area_of_distinction && (
                <div 
                  className="group p-6 sm:p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--notable-figure-detail-info-card-bg, var(--podcast-tabs-card-bg))',
                    borderColor: 'var(--notable-figure-detail-info-card-border, var(--podcast-tabs-card-border))'
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--notable-figure-detail-icon-bg, var(--nav-bg))', 
                        color: 'var(--notable-figure-detail-icon-text, var(--nav-text))'
                      }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: 'var(--notable-figure-detail-info-heading-color, var(--foreground))' }}
                    >
                      Area of Distinction
                    </h3>
                  </div>
                  <p 
                    className="text-lg sm:text-xl font-semibold leading-relaxed"
                    style={{ color: 'var(--notable-figure-detail-info-text-color, var(--foreground))' }}
                  >
                    {figure.area_of_distinction}
                  </p>
                </div>
              )}

              {/* City Born Card */}
              {figure.city_born && (
                <div 
                  className="group p-6 sm:p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--notable-figure-detail-info-card-bg, var(--podcast-tabs-card-bg))',
                    borderColor: 'var(--notable-figure-detail-info-card-border, var(--podcast-tabs-card-border))'
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--notable-figure-detail-icon-bg, var(--nav-bg))', 
                        color: 'var(--notable-figure-detail-icon-text, var(--nav-text))'
                      }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: 'var(--notable-figure-detail-info-heading-color, var(--foreground))' }}
                    >
                      Birthplace
                    </h3>
                  </div>
                  <p 
                    className="text-lg sm:text-xl font-semibold"
                    style={{ color: 'var(--notable-figure-detail-info-text-color, var(--foreground))' }}
                  >
                    {figure.city_born}
                  </p>
                </div>
              )}

              {/* Education Card */}
              {figure.education && (
                <div 
                  className="group p-6 sm:p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--notable-figure-detail-info-card-bg, var(--podcast-tabs-card-bg))',
                    borderColor: 'var(--notable-figure-detail-info-card-border, var(--podcast-tabs-card-border))'
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--notable-figure-detail-icon-bg, var(--nav-bg))', 
                        color: 'var(--notable-figure-detail-icon-text, var(--nav-text))'
                      }}
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: 'var(--notable-figure-detail-info-heading-color, var(--foreground))' }}
                    >
                      Education
                    </h3>
                  </div>
                  <p 
                    className="text-lg sm:text-xl font-semibold leading-relaxed"
                    style={{ color: 'var(--notable-figure-detail-info-text-color, var(--foreground))' }}
                  >
                    {figure.education}
                  </p>
                </div>
              )}
            </div>

            {/* Associated Figures Section */}
            {figure.associated_figures && figure.associated_figures.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                    Associated Figures
                  </h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--notable-figure-detail-divider-color, var(--nav-border))' }}></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {figure.associated_figures.map((associatedFigure) => {
                    // If image_url is already a full URL (Cloudinary), use it directly
                    // Otherwise, prepend BACKEND_BASE_URL (database/local files)
                    const assocImageUrl = associatedFigure.image_url 
                      ? (associatedFigure.image_url.startsWith('http://') || associatedFigure.image_url.startsWith('https://'))
                        ? associatedFigure.image_url
                        : `${BACKEND_BASE_URL}${associatedFigure.image_url}`
                      : null;
                    const hasAssocImageError = associatedImageErrors[associatedFigure.id];
                    
                    // Parse associated figure's Kurdish name to separate main name and nickname (if in parentheses)
                    // Handle both formats: "name (nickname)" and "(nickname)name"
                    let mainAssocKurdishName = associatedFigure.name_kurdish || null;
                    let assocKurdishNickname = null;
                    
                    if (mainAssocKurdishName && mainAssocKurdishName.includes('(') && mainAssocKurdishName.includes(')')) {
                      // Try format: "name (nickname)"
                      let assocKurdishMatch = mainAssocKurdishName.match(/^(.+?)\s*\((.+?)\)\s*$/);
                      if (assocKurdishMatch) {
                        mainAssocKurdishName = assocKurdishMatch[1].trim();
                        assocKurdishNickname = assocKurdishMatch[2].trim();
                      } else {
                        // Try format: "(nickname)name"
                        assocKurdishMatch = mainAssocKurdishName.match(/^\((.+?)\)\s*(.+?)$/);
                        if (assocKurdishMatch) {
                          assocKurdishNickname = assocKurdishMatch[1].trim();
                          mainAssocKurdishName = assocKurdishMatch[2].trim();
                        }
                      }
                    }

                    return (
                      <Link
                        key={associatedFigure.id}
                        href={`/notable-figures/${associatedFigure.id}`}
                        className="group block"
                      >
                        <div 
                          className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border h-full flex flex-col"
                          style={{
                            backgroundColor: 'var(--notable-figure-detail-associated-card-bg, var(--podcast-tabs-card-bg))',
                            borderColor: 'var(--notable-figure-detail-associated-card-border, var(--podcast-tabs-card-border))'
                          }}
                        >
                          {/* Associated Figure Image */}
                          <div 
                            className="relative w-full h-48 overflow-hidden"
                            style={{ backgroundColor: 'var(--notable-figures-image-placeholder-bg, var(--background))' }}
                          >
                            {assocImageUrl && !hasAssocImageError ? (
                              <img 
                                src={assocImageUrl} 
                                alt={associatedFigure.name}
                                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                                style={{
                                  objectFit: 'var(--notable-figures-image-object-fit, cover)',
                                  // Use per-image positioning if available, otherwise fall back to CSS variable
                                  objectPosition: associatedFigure.image_object_position || 'var(--notable-figures-image-object-position, center top)'
                                }}
                                onError={() => {
                                  if (!associatedImageErrors[associatedFigure.id]) {
                                    setAssociatedImageErrors(prev => ({ ...prev, [associatedFigure.id]: true }));
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Associated Figure Content */}
                          <div className="flex-1 p-5 flex flex-col">
                            <div>
                              <h3 
                                className="text-lg sm:text-xl font-bold mb-1 group-hover:opacity-90 transition-opacity"
                                style={{ color: 'var(--notable-figure-detail-associated-name-color, var(--foreground))' }}
                              >
                                {associatedFigure.name}
                              </h3>
                              {mainAssocKurdishName && (
                                <div className="mb-3">
                                  <h4 className="text-base sm:text-lg font-semibold kurdish-text opacity-80" style={{ color: 'var(--notable-figure-detail-associated-name-color, var(--foreground))' }}>
                                    {mainAssocKurdishName}
                                  </h4>
                                  {assocKurdishNickname && (
                                    <p className="text-sm sm:text-base font-medium italic kurdish-text opacity-70 mt-1" style={{ color: 'var(--notable-figure-detail-associated-name-color, var(--foreground))' }}>
                                      {assocKurdishNickname}
                                    </p>
                                  )}
                                </div>
                              )}
                              {!mainAssocKurdishName && <div className="mb-3"></div>}
                            </div>
                            <div className="space-y-1 flex-1">
                              {associatedFigure.century && (
                                <p 
                                  className="text-sm opacity-70"
                                  style={{ color: 'var(--notable-figure-detail-associated-text-color, var(--foreground))' }}
                                >
                                  {associatedFigure.century}
                                </p>
                              )}
                              {associatedFigure.area_of_distinction && (
                                <p 
                                  className="text-sm opacity-80"
                                  style={{ color: 'var(--notable-figure-detail-associated-text-color, var(--foreground))' }}
                                >
                                  {associatedFigure.area_of_distinction}
                                </p>
                              )}
                            </div>
                            <div 
                              className="inline-flex items-center gap-2 text-xs font-semibold mt-4 pt-3 border-t group-hover:translate-x-2 transition-transform duration-300"
                              style={{ 
                                color: 'var(--notable-figure-detail-associated-link-color, var(--nav-bg))',
                                borderColor: 'var(--notable-figure-detail-associated-link-divider-color, var(--nav-border))'
                              }}
                            >
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
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section 
        className="py-12 px-4 sm:px-6 lg:px-8 border-t"
        style={{ 
          borderColor: 'var(--notable-figure-detail-nav-divider-color, var(--nav-border))',
          backgroundColor: 'var(--notable-figure-detail-nav-bg, transparent)'
        }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/notable-figures"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg border"
              style={{ 
                backgroundColor: 'var(--notable-figure-detail-nav-button-bg, var(--nav-bg))', 
                color: 'var(--notable-figure-detail-nav-button-text, var(--nav-text))',
                borderColor: 'var(--notable-figure-detail-nav-button-border, var(--nav-border))'
              }}
            >
              <span className="text-xl">←</span>
              <span>Back to All Notable Figures</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-80 border shadow-lg hover:scale-105"
                style={{ 
                  borderColor: 'var(--notable-figure-detail-nav-secondary-border, var(--nav-border))', 
                  color: 'var(--notable-figure-detail-nav-secondary-text, var(--foreground))',
                  backgroundColor: 'var(--notable-figure-detail-nav-secondary-bg, transparent)'
                }}
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

