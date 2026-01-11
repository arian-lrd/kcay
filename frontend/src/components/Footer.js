'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFootnotes, getAbout, getGetInvolved } from '@/lib/api';

export default function Footer() {
  const [data, setData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [getInvolvedData, setGetInvolvedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [yorkLogoError, setYorkLogoError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [footnotesData, aboutDataResult, getInvolvedDataResult] = await Promise.all([
          getFootnotes(),
          getAbout().catch(() => null), // Don't fail if about fails
          getGetInvolved().catch(() => null) // Don't fail if get-involved fails
        ]);
        setData(footnotesData);
        setAboutData(aboutDataResult);
        setGetInvolvedData(getInvolvedDataResult);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <footer className="mt-auto border-t" style={{ backgroundColor: 'var(--nav-bg)' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center" style={{ color: 'var(--nav-text)' }}>Loading...</p>
        </div>
      </footer>
    );
  }

  if (error || !data) {
    return null; // Fail silently - footer not critical
  }

  const socialLinks = [
    { 
      name: 'Instagram', 
      url: data.instagram, 
      icon: '/icons/instagram.svg', 
      cssVar: '--icon-instagram',
      useBrandColors: true, // Use brand colors with white center
      scale: 1.0 // Scale up to match other icons (larger viewBox)
    },
    { 
      name: 'YouTube', 
      url: data.youtube, 
      icon: '/icons/youtube.svg', 
      cssVar: '--icon-youtube',
      useBrandColors: true, // Use brand colors with white center
      scale: 1.30 // Scale up to match other icons (larger viewBox)
    },
    { 
      name: 'LinkedIn', 
      url: data.linkedin, 
      icon: '/icons/linkedin.svg', 
      cssVar: '--icon-linkedin',
      useBrandColors: true, // Use brand colors with white center
      scale: 1.0 // Standard size (standard viewBox)
    },
    { 
      name: 'Linktree', 
      url: data.linktree, 
      icon: '/icons/linktree.svg', 
      cssVar: '--icon-linktree',
      useBrandColors: false, // Can use CSS variable (single color)
      scale: 1.0 // Standard size (standard viewBox)
    },
  ].filter(link => link.url); // Only show links that exist

  // Quick Links - organized into columns with stacked sections
  // Column 1 (left): Learn Kurdish
  // Column 2 (middle): Podcasts (top), Resources (below)
  // Column 3 (right): Events (top), Get Involved (below)
  const learnKurdishSection = {
    title: 'Learn Kurdish',
    links: [
      { name: 'Dance', href: '/learn/kurdish-dance' },
      { name: 'Language', href: '/learn/kurdish-language' },
      { name: 'Heritage', href: '/learn/kurdish-heritage' },
      { name: 'Notable Figures', href: '/notable-figures' },
    ]
  };

  const podcastsSection = {
    title: 'Podcasts',
    links: [
      { name: 'Latest Episode', href: '/podcast' },
      { name: 'All Episodes', href: '/podcast' },
    ]
  };

  const resourcesSection = {
    title: 'Resources',
    links: [
      { name: 'Our Constitution', href: '/resources' },
      { name: 'Our Team', href: '/about' },
      { name: 'Gallery', href: '/resources' },
      { 
        name: 'Contact Us', 
        href: data?.contactUs ? `mailto:${data.contactUs}` : '#'
      },
    ]
  };

  const eventsSection = {
    title: 'Events',
    links: [
      { name: 'Upcoming', href: '/events' },
      { name: 'Past', href: '/events' },
    ]
  };

  const getInvolvedSection = {
    title: 'Get Involved',
    links: [
      { 
        name: 'Sponsor Us', 
        href: getInvolvedData?.sponsorFormLink || '#',
        external: true
      },
      { 
        name: 'Become a General Member', 
        href: getInvolvedData?.generalMemberFormLink || '#',
        external: true
      },
      { 
        name: 'Become an Executive Member', 
        href: '/get-involved'
      },
    ]
  };

  return (
    <footer 
      className="mt-auto border-t"
      style={{ 
        backgroundColor: 'var(--nav-bg)',
        color: 'var(--nav-text)',
        borderColor: 'var(--nav-border)'
      }}
    >
      <div className="mx-auto max-w-7xl pl-2 pr-4 py-8 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section - Logos and About */}
          <div className="lg:col-span-4">
            <div className="flex gap-4 items-start">
              {/* Logos - Stacked vertically */}
              <div className="flex flex-col gap-3 flex-shrink-0">
                {/* Club Logo - Bigger */}
                {!logoError && (
                  <Link href="/">
                    <img
                      src="/logo.png"
                      alt="KCAY Logo"
                      className="h-60 w-auto object-contain hover:opacity-80 transition-opacity"
                      onError={() => setLogoError(true)}
                    />
                  </Link>
                )}
                {/* York University Logo - Smaller */}
                {!yorkLogoError && (
                  <a
                    href="https://www.yorku.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/york-logo.png"
                      alt="York University"
                      className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
                      onError={() => setYorkLogoError(true)}
                    />
                  </a>
                )}
              </div>
              
              {/* About Text - To the right of logos */}
              {aboutData?.paragraph?.[0] && (
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--nav-text)' }}>
                  {aboutData.paragraph[0]}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - Follow Us and Quick Links */}
          <div className="lg:col-span-8 flex flex-col lg:flex-row gap-4">
            {/* Follow Us Section - Social Media (Narrower) */}
            <div className="lg:w-40 flex-shrink-0">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity group"
                    style={{ color: 'var(--nav-text)' }}
                  >
                    <span 
                      className="inline-block flex-shrink-0"
                      style={{
                        width: '20px',
                        height: '20px',
                        transform: `scale(${social.scale || 1.0})`,
                        transformOrigin: 'center',
                      }}
                    >
                      {social.useBrandColors ? (
                        // Use brand-colored SVG directly (has white centers built in)
                        <img
                          src={social.icon}
                          alt={social.name}
                          className="w-5 h-5 object-contain"
                          style={{ width: '20px', height: '20px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        // Use CSS variable with mask-image for single-color icons
                        <span
                          className="w-5 h-5 inline-block"
                          style={{
                            backgroundColor: `var(${social.cssVar})`,
                            maskImage: `url(${social.icon})`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: `url(${social.icon})`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      )}
                    </span>
                    <span>{social.name}</span>
                  </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links Section - 3 columns with stacked sections */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Learn Kurdish */}
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--nav-text)' }}>
                    {learnKurdishSection.title}
                  </h4>
                  <ul className="space-y-1.5">
                    {learnKurdishSection.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-xs hover:opacity-80 transition-opacity block"
                          style={{ color: 'var(--nav-text)' }}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Podcasts (top) and Resources (below) */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--nav-text)' }}>
                      {podcastsSection.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {podcastsSection.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-xs hover:opacity-80 transition-opacity block"
                            style={{ color: 'var(--nav-text)' }}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--nav-text)' }}>
                      {resourcesSection.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {resourcesSection.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-xs hover:opacity-80 transition-opacity block"
                            style={{ color: 'var(--nav-text)' }}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 3: Events (top) and Get Involved (below) */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--nav-text)' }}>
                      {eventsSection.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {eventsSection.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-xs hover:opacity-80 transition-opacity block"
                            style={{ color: 'var(--nav-text)' }}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--nav-text)' }}>
                      {getInvolvedSection.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {getInvolvedSection.links.map((link) => (
                        <li key={link.name}>
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs hover:opacity-80 transition-opacity block"
                              style={{ color: 'var(--nav-text)' }}
                            >
                              {link.name}
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-xs hover:opacity-80 transition-opacity block"
                              style={{ color: 'var(--nav-text)' }}
                            >
                              {link.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright/Footer Bottom */}
        <div className="mt-8 pt-6 border-t text-center text-sm opacity-75" style={{ borderColor: 'var(--nav-border)' }}>
          <p>© {new Date().getFullYear()} KCAY - Kurdish Cultural Association at York</p>
        </div>
      </div>
    </footer>
  );
}

