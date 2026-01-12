'use client';

import { useEffect } from 'react';

/**
 * ColorSync Component
 * Listens for color customizations from localStorage and applies them across tabs
 * This allows the color editor (/admin/colors) to update the main website in real-time
 */
export default function ColorSync() {
  useEffect(() => {
    // Function to apply colors from localStorage
    const applySavedColors = () => {
      try {
        const saved = localStorage.getItem('kcay-color-customizations');
        if (saved) {
          const colors = JSON.parse(saved);
          Object.entries(colors).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('#')) {
              document.documentElement.style.setProperty(key, value);
            }
          });
        }
      } catch (e) {
        console.error('Error applying saved colors:', e);
      }
    };

    // Apply saved colors on mount
    applySavedColors();

    // Listen for storage events (triggered when localStorage changes in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'kcay-color-customizations') {
        if (e.newValue === null) {
          // If localStorage was cleared (reset), restore defaults
          COLOR_VARIABLES.forEach(({ key }) => {
            document.documentElement.style.removeProperty(key);
          });
        } else {
          applySavedColors();
        }
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab updates via BroadcastChannel)
    const handleColorUpdate = () => {
      applySavedColors();
    };
    window.addEventListener('kcay-color-update', handleColorUpdate);

    // Listen for reset event
    const handleColorReset = () => {
      // Remove all custom CSS properties to restore defaults
      const style = document.documentElement.style;
      
      // Remove any custom CSS variables we've set
      const varsToRemove = [
        '--background', '--foreground', '--card-bg',
        '--nav-bg', '--nav-text', '--nav-hover', '--nav-active', '--nav-border', '--nav-mobile-bg',
        '--icon-instagram', '--icon-youtube', '--icon-linkedin', '--icon-linktree',
        '--executive-name-color', '--executive-role-color', '--executive-divider-color',
        '--podcast-hero-title-color', '--podcast-hero-subtitle-color',
        '--events-hero-title-color', '--events-hero-subtitle-color', '--events-card-bg', '--events-title-color',
        '--learn-hero-title-color', '--learn-hero-subtitle-color', '--learn-card-bg',
        '--resources-hero-title-color', '--resources-hero-subtitle-color',
        '--notable-figures-hero-title-color', '--notable-figures-hero-subtitle-color',
        '--get-involved-hero-title-color', '--get-involved-hero-subtitle-color', '--get-involved-card-bg',
        '--get-involved-button-general-member-bg', '--get-involved-button-general-member-text',
        '--get-involved-button-sponsor-bg', '--get-involved-button-sponsor-text',
        '--get-involved-button-executive-bg', '--get-involved-button-executive-text',
      ];
      
      varsToRemove.forEach((key) => {
        style.removeProperty(key);
      });
      
      localStorage.removeItem('kcay-color-customizations');
    };
    window.addEventListener('kcay-color-reset', handleColorReset);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kcay-color-update', handleColorUpdate);
      window.removeEventListener('kcay-color-reset', handleColorReset);
    };
  }, []);

  return null; // This component doesn't render anything
}

