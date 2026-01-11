'use client';

import { useState, useEffect } from 'react';
import { getAbout, subscribeToNewsletter } from '@/lib/api';
import Image from 'next/image';

// Backend base URL for images
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export default function AboutPage() {
  const [data, setData] = useState(null);
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
        const aboutData = await getAbout();
        setData(aboutData);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError(err.message || 'Failed to load about data. Please make sure the backend server is running on port 3000.');
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
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-3xl font-bold mb-4 text-red-600">Error Loading Data</h2>
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
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
        <p className="text-xl" style={{ color: 'var(--foreground)' }}>No data available.</p>
      </div>
    );
  }

  const paragraphs = data.paragraph || [];
  const executives = data.executives || [];
  const mainParagraph = paragraphs[0] || '';

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
        <div className="relative mx-auto max-w-4xl text-center z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            About KCAY
          </h1>
          <div className="w-24 h-1 bg-white/80 mx-auto rounded-full mb-8"></div>
          <p className="text-xl sm:text-2xl opacity-95 max-w-3xl mx-auto">
            Learn about our mission, values, and the team that makes it all possible.
          </p>
        </div>
      </section>

      {/* About Content Section */}
      {mainParagraph && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div 
              className="prose prose-lg max-w-none"
              style={{ 
                color: 'var(--foreground)',
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.6s ease-out'
              }}
            >
              <div className="relative p-8 sm:p-12 rounded-3xl shadow-lg border" 
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--nav-border)'
                }}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 left-0 w-20 h-20 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, var(--nav-bg) 0%, transparent 70%)`
                  }}
                ></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10"
                  style={{
                    background: `linear-gradient(315deg, var(--nav-bg) 0%, transparent 70%)`
                  }}
                ></div>
                
                <div className="relative text-lg sm:text-xl leading-relaxed whitespace-pre-line" style={{ color: 'var(--foreground)' }}>
                  {mainParagraph}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Executive Team Section */}
      {executives.length > 0 && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, var(--nav-bg) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative mx-auto max-w-7xl z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
                Our Executive Team
              </h2>
              <div className="w-24 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--nav-bg)' }}></div>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--foreground)' }}>
                Meet the dedicated leaders who guide our organization and community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
              {executives.map((executive, index) => {
                const imageUrl = executive.photo_url 
                  ? `${BACKEND_BASE_URL}${executive.photo_url}`
                  : null;
                const fullName = `${executive.first_name} ${executive.last_name}`;

                return (
                  <div
                    key={index}
                    className="group relative p-5 sm:p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center overflow-hidden border"
                    style={{ 
                      // Layered background: soft radial glow + diagonal gradient
                      background: `
                        radial-gradient(circle at 20% 0%, rgba(255,255,255,0.18), transparent 55%),
                        radial-gradient(circle at 80% 120%, rgba(255,255,255,0.10), transparent 55%),
                        linear-gradient(135deg, rgba(102,28,28,0.95), var(--card-bg))
                      `,
                      borderColor: 'var(--nav-border)',
                      transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                      opacity: mounted ? 1 : 0,
                      transition: `all 0.6s ease-out ${index * 0.1}s`
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
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-var(--nav-bg) to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(to right, transparent, var(--nav-bg), transparent)` }}
                    ></div>
                    
                    {/* Executive Photo */}
                    <div className="relative z-10 mb-4">
                      {imageUrl ? (
                        <div className="relative w-40 aspect-square mx-auto">
                          {/* Outer glow ring */}
                          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                            style={{ backgroundColor: 'var(--nav-bg)', transform: 'scale(1.1)' }}
                          ></div>
                          
                          {/* Photo container with enhanced styling */}
                          <div className="relative w-40 aspect-square mx-auto rounded-full overflow-hidden ring-2 ring-[var(--executive-divider-color)] ring-offset-2 ring-offset-[var(--card-bg)] shadow-2xl group-hover:scale-110 group-hover:ring-6 transition-all duration-500"
                            style={{ 
                              ringColor: 'var(--nav-bg)',
                              ringOffsetColor: 'var(--card-bg)'
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={fullName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            {/* Fallback avatar */}
                            <div 
                              className="hidden w-full h-full items-center justify-center text-5xl font-bold"
                              style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
                            >
                              {executive.first_name[0]}{executive.last_name[0]}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-40 aspect-square mx-auto">
                          {/* Outer glow ring */}
                          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                            style={{ backgroundColor: 'var(--nav-bg)', transform: 'scale(1.1)' }}
                          ></div>
                          
                          <div 
                            className="relative w-40 aspect-square mx-auto rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl ring-4 ring-offset-4 group-hover:scale-110 group-hover:ring-6 transition-all duration-500"
                            style={{ 
                              backgroundColor: 'var(--nav-bg)', 
                              color: 'var(--nav-text)',
                              ringColor: 'var(--nav-bg)',
                              ringOffsetColor: 'var(--card-bg)'
                            }}
                          >
                            {executive.first_name[0]}{executive.last_name[0]}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Decorative line under image */}
                    <div
                      className="relative z-10 mx-auto mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        width: 'var(--executive-divider-width)',
                        height: 'var(--executive-divider-height)',
                        borderRadius: 'var(--executive-divider-radius)',
                        backgroundColor: 'var(--executive-divider-color)',
                      }}
                    ></div>

                    {/* Executive Info */}
                    <div className="relative z-10 flex-1 w-full px-2">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:opacity-90 transition-opacity leading-tight" style={{ color: 'var(--executive-name-color)' }}>
                        {fullName}
                      </h3>
                      
                      {/* Role badge */}
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}
                      >
                        <p className="text-xs sm:text-sm font-semibold tracking-wide">
                          {executive.role}
                        </p>
                      </div>
                    </div>

                    {/* Bottom accent on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-var(--nav-bg) to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(to right, transparent, var(--nav-bg), transparent)` }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action & Newsletter Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Join Our Team Section */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Want to Join Our Team?</h2>
              <div className="w-20 h-1 bg-white/80 mx-auto lg:mx-0 rounded-full mb-6"></div>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                We're always looking for passionate individuals to help grow our community. Join us and make a difference!
              </p>
              <a
                href="/get-involved"
                className="inline-block px-8 py-4 rounded-xl font-bold text-lg bg-white text-gray-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
              >
                Get Involved
              </a>
            </div>

            {/* Newsletter Signup Section */}
    <div>
              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Connected</h2>
                <div className="w-20 h-1 bg-white/80 mx-auto lg:mx-0 rounded-full mb-4"></div>
                <p className="text-lg opacity-90">
                  Subscribe to our newsletter for updates on events, podcasts, and community news.
                </p>
              </div>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newsletterFirstName}
                    onChange={(e) => setNewsletterFirstName(e.target.value)}
                    required
                    className="px-5 py-3 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-lg"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newsletterLastName}
                    onChange={(e) => setNewsletterLastName(e.target.value)}
                    required
                    className="px-5 py-3 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-lg"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-xl border-0 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all shadow-lg"
                />
                {newsletterError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/50">
                    <p className="text-red-100 text-sm font-medium">{newsletterError}</p>
                  </div>
                )}
                {newsletterSuccess && (
                  <div className="p-3 rounded-xl bg-green-500/20 border border-green-400/50 animate-pulse">
                    <p className="text-green-100 text-sm font-medium">✓ Successfully subscribed! Thank you.</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={newsletterSubmitting}
                  className="w-full px-8 py-3 rounded-xl font-bold text-lg bg-white text-gray-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform"
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
          </div>
        </div>
      </section>
    </div>
  );
}