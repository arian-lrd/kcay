'use client';

import { useState, useEffect } from 'react';

// Extract all color-related CSS variables from the page
const COLOR_VARIABLES = [
  // Global Colors
  { key: '--background', label: 'Background Color', category: 'Global', type: 'color' },
  { key: '--foreground', label: 'Text Color', category: 'Global', type: 'color' },
  { key: '--card-bg', label: 'Card Background', category: 'Global', type: 'color' },
  
  // Navigation
  { key: '--nav-bg', label: 'Navigation Background', category: 'Navigation', type: 'color' },
  { key: '--nav-text', label: 'Navigation Text', category: 'Navigation', type: 'color' },
  { key: '--nav-hover', label: 'Navigation Hover', category: 'Navigation', type: 'color' },
  { key: '--nav-active', label: 'Navigation Active', category: 'Navigation', type: 'color' },
  { key: '--nav-border', label: 'Navigation Border', category: 'Navigation', type: 'color' },
  { key: '--nav-mobile-bg', label: 'Mobile Menu Background', category: 'Navigation', type: 'color' },
  
  // Social Icons
  { key: '--icon-instagram', label: 'Instagram Icon', category: 'Social Icons', type: 'color' },
  { key: '--icon-youtube', label: 'YouTube Icon', category: 'Social Icons', type: 'color' },
  { key: '--icon-linkedin', label: 'LinkedIn Icon', category: 'Social Icons', type: 'color' },
  { key: '--icon-linktree', label: 'Linktree Icon', category: 'Social Icons', type: 'color' },
  
  // About Page - Executives
  { key: '--executive-name-color', label: 'Executive Name Color', category: 'About Page', type: 'color' },
  { key: '--executive-role-color', label: 'Executive Role Color', category: 'About Page', type: 'color' },
  { key: '--executive-divider-color', label: 'Executive Divider Line', category: 'About Page', type: 'color' },
  
  // Podcast Page
  { key: '--podcast-hero-title-color', label: 'Podcast Hero Title', category: 'Podcast Page', type: 'color' },
  { key: '--podcast-hero-subtitle-color', label: 'Podcast Hero Subtitle', category: 'Podcast Page', type: 'color' },
  { key: '--podcast-page-latest-ep-bg', label: 'Latest Episode Background', category: 'Podcast Page', type: 'color' },
  { key: '--podcast-page-recent-ep-bg', label: 'Recent Episodes Background', category: 'Podcast Page', type: 'color' },
  
  // Events Page
  { key: '--events-hero-title-color', label: 'Events Hero Title', category: 'Events Page', type: 'color' },
  { key: '--events-hero-subtitle-color', label: 'Events Hero Subtitle', category: 'Events Page', type: 'color' },
  { key: '--events-card-bg', label: 'Event Card Background', category: 'Events Page', type: 'color' },
  { key: '--events-title-color', label: 'Event Title Color', category: 'Events Page', type: 'color' },
  
  // Learn Page
  { key: '--learn-hero-title-color', label: 'Learn Hero Title', category: 'Learn Page', type: 'color' },
  { key: '--learn-hero-subtitle-color', label: 'Learn Hero Subtitle', category: 'Learn Page', type: 'color' },
  { key: '--learn-card-bg', label: 'Learn Card Background', category: 'Learn Page', type: 'color' },
  
  // Resources Page
  { key: '--resources-hero-title-color', label: 'Resources Hero Title', category: 'Resources Page', type: 'color' },
  { key: '--resources-hero-subtitle-color', label: 'Resources Hero Subtitle', category: 'Resources Page', type: 'color' },
  { key: '--resources-constitution-card-bg', label: 'Constitution Card Background', category: 'Resources Page', type: 'color' },
  { key: '--resources-gallery-card-bg', label: 'Gallery Card Background', category: 'Resources Page', type: 'color' },
  
  // Notable Figures Page
  { key: '--notable-figures-hero-title-color', label: 'Notable Figures Hero Title', category: 'Notable Figures Page', type: 'color' },
  { key: '--notable-figures-hero-subtitle-color', label: 'Notable Figures Hero Subtitle', category: 'Notable Figures Page', type: 'color' },
  { key: '--notable-figures-card-bg', label: 'Notable Figure Card Background', category: 'Notable Figures Page', type: 'color' },
  { key: '--notable-figures-name-color', label: 'Notable Figure Name', category: 'Notable Figures Page', type: 'color' },
  
  // Get Involved Page
  { key: '--get-involved-hero-title-color', label: 'Get Involved Hero Title', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-hero-subtitle-color', label: 'Get Involved Hero Subtitle', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-card-bg', label: 'Get Involved Card Background', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-button-general-member-bg', label: 'General Member Button Background', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-button-general-member-text', label: 'General Member Button Text', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-button-sponsor-bg', label: 'Sponsor Button Background', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-button-sponsor-text', label: 'Sponsor Button Text', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-button-executive-bg', label: 'Executive Button Background', category: 'Get Involved Page', type: 'color' },
  { key: '--get-involved-button-executive-text', label: 'Executive Button Text', category: 'Get Involved Page', type: 'color' },
];

// Helper function to get computed CSS variable value
function getCSSVariableValue(variableName) {
  if (typeof window === 'undefined') return '#000000';
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  
  // Handle rgba() values - extract the color part
  if (value.startsWith('rgba') || value.startsWith('rgb')) {
    // For rgba/rgb, try to extract or use a fallback
    // This is simplified - you might want more sophisticated parsing
    return '#000000';
  }
  
  // Handle var() references - get the referenced value
  if (value.startsWith('var(')) {
    const refVar = value.match(/var\((--[a-z-]+)\)/)?.[1];
    if (refVar) {
      return getCSSVariableValue(refVar);
    }
    return '#000000';
  }
  
  // If it's a hex color, return it
  if (value.startsWith('#')) {
    return value;
  }
  
  // Try to convert named colors or other formats
  return value || '#000000';
}

// Helper function to convert hex to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper function to extract color from rgba
function extractColorFromRgba(rgbaString) {
  // Simple extraction - this is a basic implementation
  // For production, you'd want more robust parsing
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#000000';
}

export default function ColorCustomizationPage() {
  const [colors, setColors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadColors();
  }, []);

  const loadColors = () => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('kcay-color-customizations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setColors(parsed);
        applyColors(parsed);
        return;
      } catch (e) {
        console.error('Error loading saved colors:', e);
      }
    }
    
    // Otherwise, get current values from CSS
    const initialColors = {};
    COLOR_VARIABLES.forEach(({ key }) => {
      const value = getCSSVariableValue(key);
      initialColors[key] = value;
    });
    setColors(initialColors);
  };

  const applyColors = (colorsToApply) => {
    if (typeof window === 'undefined') return;
    
    Object.entries(colorsToApply).forEach(([key, value]) => {
      if (value && value.startsWith('#')) {
        document.documentElement.style.setProperty(key, value);
      }
    });
  };

  const handleColorChange = (variable, newColor) => {
    const updated = { ...colors, [variable]: newColor };
    setColors(updated);
    applyColors(updated);
    // Save to localStorage immediately so other tabs can see the changes
    localStorage.setItem('kcay-color-customizations', JSON.stringify(updated));
    setSaved(false);
  };

  const saveColors = () => {
    localStorage.setItem('kcay-color-customizations', JSON.stringify(colors));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetColors = () => {
    if (confirm('Are you sure you want to reset all colors to default? This will restore all original colors.')) {
      // Clear localStorage
      localStorage.removeItem('kcay-color-customizations');
      
      // Remove all custom CSS properties to restore defaults
      if (typeof window !== 'undefined') {
        COLOR_VARIABLES.forEach(({ key }) => {
          document.documentElement.style.removeProperty(key);
        });
        
        // Trigger event so other tabs also reset
        window.dispatchEvent(new CustomEvent('kcay-color-reset'));
        
        // Reload the page to fully restore defaults
        window.location.reload();
      }
    }
  };

  const exportColors = () => {
    const dataStr = JSON.stringify(colors, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kcay-colors.json';
    link.click();
  };

  const importColors = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setColors(imported);
        applyColors(imported);
        saveColors();
      } catch (err) {
        alert('Error importing colors. Please make sure the file is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  const categories = ['all', ...new Set(COLOR_VARIABLES.map(v => v.category))];
  const filteredVariables = activeCategory === 'all' 
    ? COLOR_VARIABLES 
    : COLOR_VARIABLES.filter(v => v.category === activeCategory);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-current mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Color Customization</h1>
          <p className="text-lg opacity-80">
            Customize the colors of your website. Changes are applied instantly. Don't forget to save!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={saveColors}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--nav-bg)' }}
          >
            {saved ? '✓ Saved!' : 'Save Colors'}
          </button>
          <button
            onClick={resetColors}
            className="px-6 py-3 rounded-lg font-semibold border transition-all hover:scale-105"
            style={{ borderColor: 'var(--nav-border)', color: 'var(--foreground)' }}
          >
            Reset to Default
          </button>
          <button
            onClick={exportColors}
            className="px-6 py-3 rounded-lg font-semibold border transition-all hover:scale-105"
            style={{ borderColor: 'var(--nav-border)', color: 'var(--foreground)' }}
          >
            Export Colors
          </button>
          <label className="px-6 py-3 rounded-lg font-semibold border transition-all hover:scale-105 cursor-pointer"
            style={{ borderColor: 'var(--nav-border)', color: 'var(--foreground)' }}
          >
            Import Colors
            <input
              type="file"
              accept=".json"
              onChange={importColors}
              className="hidden"
            />
          </label>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: activeCategory === category ? 'var(--nav-bg)' : 'var(--card-bg)',
                  color: activeCategory === category ? 'var(--nav-text)' : 'var(--foreground)',
                  border: activeCategory === category ? 'none' : `1px solid var(--nav-border)`
                }}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVariables.map(({ key, label, category }) => (
            <div
              key={key}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--nav-border)'
              }}
            >
              <label className="block mb-3 font-semibold" style={{ color: 'var(--foreground)' }}>
                {label}
                <span className="block text-xs font-normal opacity-70 mt-1">{key}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors[key] || '#000000'}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-16 h-16 rounded cursor-pointer border-2"
                  style={{ borderColor: 'var(--nav-border)' }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={colors[key] || '#000000'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        handleColorChange(key, val);
                      }
                    }}
                    className="w-full px-3 py-2 rounded border font-mono text-sm"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--nav-border)',
                      color: 'var(--foreground)'
                    }}
                    placeholder="#000000"
                  />
                </div>
              </div>
              {category !== activeCategory && activeCategory !== 'all' && (
                <div className="mt-2 text-xs opacity-60" style={{ color: 'var(--foreground)' }}>
                  {category}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 rounded-lg border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--nav-border)' }}>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>How to Use</h3>
          <ul className="space-y-2 list-disc list-inside opacity-80" style={{ color: 'var(--foreground)' }}>
            <li>Click on any color picker or type a hex color code (e.g., #FF0000 for red)</li>
            <li>Changes are applied instantly so you can see the results immediately</li>
            <li>Click "Save Colors" to save your changes permanently</li>
            <li>Use "Export Colors" to backup your color scheme</li>
            <li>Use "Import Colors" to load a previously exported color scheme</li>
            <li>Use "Reset to Default" to restore all original colors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

