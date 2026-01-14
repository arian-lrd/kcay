'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { getGallery, getConstitution, getEventImages } from '@/lib/api';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

function ResourcesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [gallery, setGallery] = useState(null); // Event thumbnails
  const [constitution, setConstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState({}); // Track which images failed to load
  
  // Event detail view state - read from URL
  const selectedEventFromUrl = searchParams.get('event');
  const [selectedEvent, setSelectedEvent] = useState(selectedEventFromUrl); // Selected event folder name
  const [eventImages, setEventImages] = useState(null); // All images from selected event
  const [eventImagesLoading, setEventImagesLoading] = useState(false);
  const [eventImagesError, setEventImagesError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Sync selectedEvent with URL parameter
  useEffect(() => {
    const eventFromUrl = searchParams.get('event');
    if (eventFromUrl !== selectedEvent) {
      setSelectedEvent(eventFromUrl);
    }
  }, [searchParams, selectedEvent]);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [galleryData, constitutionData] = await Promise.all([
          getGallery().catch(() => []),
          getConstitution().catch(() => null)
        ]);
        setGallery(galleryData);
        setConstitution(constitutionData);
      } catch (err) {
        console.error('Error fetching resources data:', err);
        setError(err.message || 'Failed to load resources data. Please make sure the backend server is running on port 3000.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch event images when an event is selected
  useEffect(() => {
    if (!selectedEvent) {
      setEventImages(null);
      return;
    }

    async function fetchEventImages() {
      setEventImagesLoading(true);
      setEventImagesError(null);
      try {
        const images = await getEventImages(selectedEvent);
        setEventImages(images);
      } catch (err) {
        console.error('Error fetching event images:', err);
        setEventImagesError(err.message || 'Failed to load event images.');
      } finally {
        setEventImagesLoading(false);
      }
    }

    fetchEventImages();
  }, [selectedEvent]);

  // Handle event thumbnail click - update URL
  const handleEventClick = (eventFolder) => {
    // Update URL with event parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('event', eventFolder);
    router.push(`/resources?${params.toString()}`, { scroll: false });
    // Don't scroll - keep current scroll position
  };

  // Handle back to gallery - clear URL parameter
  const handleBackToGallery = () => {
    // Remove event parameter from URL
    router.push('/resources', { scroll: false });
    setEventImages(null);
    setEventImagesError(null);
    // Don't scroll - keep current scroll position
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
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Resources</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--foreground)' }}>
            Please make sure the backend server is running on port 3000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <section 
        className="relative px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          paddingTop: 'var(--resources-hero-padding-top, 5rem)',
          paddingBottom: 'var(--resources-hero-padding-bottom, 5rem)',
          minHeight: 'var(--resources-hero-min-height, auto)'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'var(--resources-hero-bg-image, none)',
            backgroundSize: 'var(--resources-hero-bg-size, cover)',
            backgroundPosition: 'var(--resources-hero-bg-position, center)',
            backgroundRepeat: 'no-repeat',
            opacity: 'var(--resources-hero-bg-opacity, 0.3)'
          }}
        ></div>
        {/* Gradient Pattern Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'var(--resources-hero-pattern)',
            opacity: 'var(--resources-hero-pattern-opacity, 0.2)'
          }}
        ></div>
        {/* Dark Overlay for Text Readability */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--resources-hero-overlay-color, rgba(0, 0, 0, 0.4))'
          }}
        ></div>
        <div className="relative mx-auto max-w-7xl text-center z-10">
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" 
            style={{ 
              color: 'var(--resources-hero-title-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out'
            }}
          >
            Resources
          </h1>
          <p 
            className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto" 
            style={{ 
              color: 'var(--resources-hero-subtitle-color)',
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'all 0.6s ease-out 0.2s'
            }}
          >
            Explore our constitution, gallery, and educational materials
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Constitution Section */}
      {constitution && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                Constitution
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--resources-section-divider, var(--nav-border))' }}></div>
            </div>
            <div 
              className="rounded-3xl shadow-xl border overflow-hidden p-8 sm:p-12 backdrop-blur-sm"
              style={{
                background: 'var(--resources-constitution-card-bg, var(--podcast-tabs-card-bg))',
                borderColor: 'var(--resources-constitution-card-border, var(--podcast-tabs-card-border))',
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.6s ease-out 0.3s'
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--resources-constitution-icon-bg, var(--nav-bg))',
                    color: 'var(--resources-constitution-icon-text, var(--nav-text))'
                  }}
                >
                  📄
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-2xl sm:text-3xl font-bold mb-3"
                    style={{ color: 'var(--resources-constitution-title-color, var(--foreground))' }}
                  >
                    KCAY Constitution
                  </h3>
                  <p 
                    className="text-lg opacity-80 mb-6"
                    style={{ color: 'var(--resources-constitution-text-color, var(--foreground))' }}
                  >
                    Download our organization's constitution document
                  </p>
                  <a 
                    href={`${BACKEND_BASE_URL}${constitution?.file_path || constitution}`} 
            target="_blank" 
            rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg border"
                    style={{
                      backgroundColor: 'var(--resources-constitution-button-bg, var(--nav-bg))',
                      color: 'var(--resources-constitution-button-text, var(--nav-text))',
                      borderColor: 'var(--resources-constitution-button-border, var(--nav-border))'
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Constitution PDF</span>
          </a>
                </div>
              </div>
            </div>
        </section>
      )}

      {/* Gallery Section */}
        {!selectedEvent && gallery && gallery.length > 0 && (
        <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                Gallery
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--resources-section-divider, var(--nav-border))' }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {gallery.map((item, index) => {
                // Cloudinary URLs are already full URLs, database URLs are relative
                const imageUrl = item.image_url 
                  ? (item.image_url.startsWith('http') ? item.image_url : `${BACKEND_BASE_URL}${item.image_url}`)
                  : null;
                const hasImageError = imageErrors[item.id];

                return (
                  <div
                    key={item.id || item.event_folder}
                    className="group cursor-pointer"
                    style={{
                      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                      opacity: mounted ? 1 : 0,
                      transition: `all 0.6s ease-out ${0.4 + (index % 6) * 0.1}s`
                    }}
                    onClick={() => item.event_folder && handleEventClick(item.event_folder)}
                  >
                    <div 
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border h-full flex flex-col"
                      style={{
                        backgroundColor: 'var(--resources-gallery-card-bg, var(--podcast-tabs-card-bg))',
                        borderColor: 'var(--resources-gallery-card-border, var(--podcast-tabs-card-border))'
                      }}
                    >
                      {/* Event Thumbnail */}
                      <div 
                        className="relative w-full h-64 overflow-hidden"
                        style={{ backgroundColor: 'var(--resources-gallery-image-placeholder-bg, var(--background))' }}
                      >
                        {imageUrl && !hasImageError ? (
                  <img 
                            src={imageUrl} 
                            alt={item.event_title || item.description || 'Event thumbnail'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => {
                              if (!imageErrors[item.id]) {
                                setImageErrors(prev => ({ ...prev, [item.id]: true }));
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center p-4">
                              <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm opacity-50" style={{ color: 'var(--foreground)' }}>No Image</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Info - Only show if there's content */}
                      {(item.event_title || item.description || item.event_date) && (
                        <div className="flex-1 p-6">
                          {item.event_title && (
                            <h3 
                              className="text-xl font-bold mb-2"
                              style={{ color: 'var(--resources-gallery-title-color, var(--foreground))' }}
                            >
                              {item.event_title}
                            </h3>
                )}
                {item.description && (
                            <p 
                              className="text-base leading-relaxed opacity-80"
                              style={{ color: 'var(--resources-gallery-text-color, var(--foreground))' }}
                            >
                              {item.description}
                            </p>
                          )}
                          {item.event_date && (
                            <p 
                              className="text-sm mt-2 opacity-60"
                              style={{ color: 'var(--resources-gallery-date-color, var(--foreground))' }}
                            >
                              {new Date(item.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Event Images View */}
        {selectedEvent && (
          <section>
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={handleBackToGallery}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-md border"
                style={{
                  backgroundColor: 'var(--resources-gallery-back-button-bg, var(--nav-bg))',
                  color: 'var(--resources-gallery-back-button-text, var(--nav-text))',
                  borderColor: 'var(--resources-gallery-back-button-border, var(--nav-border))'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Gallery</span>
              </button>
            </div>

            {/* Event Title */}
            {eventImages && eventImages.length > 0 && eventImages[0].event_title && (
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {eventImages[0].event_title}
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--resources-section-divider, var(--nav-border))' }}></div>
              </div>
            )}

            {/* Loading State */}
            {eventImagesLoading && (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-current mb-4" style={{ color: 'var(--foreground)' }}></div>
                  <p style={{ color: 'var(--foreground)' }}>Loading event images...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {eventImagesError && (
              <div className="p-8 text-center">
                <div className="max-w-2xl mx-auto p-6 rounded-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h3 className="text-xl font-bold mb-4 text-red-600">Error Loading Event Images</h3>
                  <p className="text-red-600 mb-4">{eventImagesError}</p>
                  <button
                    onClick={handleBackToGallery}
                    className="px-6 py-3 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: 'var(--nav-bg)',
                      color: 'var(--nav-text)'
                    }}
                  >
                    Back to Gallery
                  </button>
                </div>
              </div>
            )}

            {/* Event Images Grid */}
            {eventImages && eventImages.length > 0 && !eventImagesLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {eventImages.map((item, index) => {
                  const imageUrl = item.image_url 
                    ? (item.image_url.startsWith('http') ? item.image_url : `${BACKEND_BASE_URL}${item.image_url}`)
                    : null;
                  const hasImageError = imageErrors[item.id];

                  return (
                    <div
                      key={item.id}
                      className="group relative"
                      style={{
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        opacity: mounted ? 1 : 0,
                        transition: `all 0.6s ease-out ${0.2 + (index % 6) * 0.1}s`
                      }}
                    >
                      <div 
                        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border aspect-[16/9]"
                        style={{
                          backgroundColor: 'var(--resources-gallery-card-bg, var(--podcast-tabs-card-bg))',
                          borderColor: 'var(--resources-gallery-card-border, var(--podcast-tabs-card-border))'
                        }}
                      >
                        {/* Event Image - Fills entire container */}
                        <div 
                          className="relative w-full h-full overflow-hidden"
                          style={{ backgroundColor: 'var(--resources-gallery-image-placeholder-bg, var(--background))' }}
                        >
                          {imageUrl && !hasImageError ? (
                            <>
                              <img 
                                src={imageUrl} 
                                alt={item.description || 'Event image'}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                                onClick={() => {
                                  setLightboxIndex(index);
                                  setLightboxOpen(true);
                                }}
                                onError={() => {
                                  if (!imageErrors[item.id]) {
                                    setImageErrors(prev => ({ ...prev, [item.id]: true }));
                                  }
                                }}
                              />
                              {/* Description Overlay - Only shown on hover and if description exists */}
                              {item.description && (
                                <div 
                                  className="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                  style={{
                                    color: 'var(--resources-gallery-overlay-text-color, white)',
                                    backgroundColor: 'var(--resources-gallery-overlay-bg, rgba(0, 0, 0, 0.75))'
                                  }}
                                >
                                  <p className="text-sm leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center p-4">
                                <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm opacity-50" style={{ color: 'var(--foreground)' }}>No Image</p>
                              </div>
                  </div>
                )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Images Found */}
            {eventImages && eventImages.length === 0 && !eventImagesLoading && (
              <div className="text-center py-16">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xl opacity-70 mb-6" style={{ color: 'var(--foreground)' }}>No images found for this event.</p>
                <button
                  onClick={handleBackToGallery}
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--nav-bg)',
                    color: 'var(--nav-text)'
                  }}
                >
                  Back to Gallery
                </button>
          </div>
            )}

            {/* YARL Lightbox for Gallery Images */}
            {eventImages && eventImages.length > 0 && (
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={eventImages.map((image) => ({
                  src: image.image_url 
                    ? (image.image_url.startsWith('http') ? image.image_url : `${BACKEND_BASE_URL}${image.image_url}`)
                    : '',
                  alt: image.description || 'Event image',
                  description: image.description || undefined,
                }))}
                on={{ view: ({ index }) => setLightboxIndex(index) }}
              />
            )}
        </section>
      )}

      {(!gallery || gallery.length === 0) && !constitution && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl opacity-70" style={{ color: 'var(--foreground)' }}>No resources available.</p>
          </div>
      )}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-current mb-4" style={{ color: 'var(--foreground)' }}></div>
          <p style={{ color: 'var(--foreground)' }}>Loading...</p>
        </div>
      </div>
    }>
      <ResourcesPageContent />
    </Suspense>
  );
}

