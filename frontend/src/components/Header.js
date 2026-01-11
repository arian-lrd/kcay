'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Podcast', href: '/podcast' },
    { name: 'Learn', href: '/learn' },
    { name: 'Resources', href: '/resources' },
    { name: 'Notable Figures', href: '/notable-figures' },
    { name: 'Get Involved', href: '/get-involved' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full shadow-lg"
      style={{ 
        backgroundColor: 'var(--nav-bg)',
        color: 'var(--nav-text)'
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {/* Logo Image */}
              {!logoError && (
                <img
                  src="/logo.png"
                  alt="KCAY Logo"
                  className="h-12 w-auto object-contain flex-shrink-0"
                  onError={() => setLogoError(true)}
                />
              )}
              {/* Separator and Club Name */}
              <span 
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: 'var(--nav-text)' }}
              >
                {!logoError && <span className="text-gray-400">|</span>}
                KCAY
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? 'font-semibold'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: active ? 'var(--nav-active)' : 'transparent',
                      color: 'var(--nav-text)',
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ 
                color: 'var(--nav-text)',
                backgroundColor: mobileMenuOpen ? 'var(--nav-mobile-bg)' : 'transparent'
              }}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-t"
          style={{ 
            backgroundColor: 'var(--nav-mobile-bg)',
            borderColor: 'var(--nav-border)'
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    active ? 'font-semibold' : ''
                  }`}
                  style={{
                    backgroundColor: active ? 'var(--nav-active)' : 'transparent',
                    color: 'var(--nav-text)',
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

