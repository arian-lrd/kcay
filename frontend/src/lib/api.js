/**
 * API Utility Functions
 * 
 * This file contains all the functions to communicate with the backend API.
 * All endpoints use the /api/v1 prefix.
 * 
 * Usage examples:
 *   import { getAbout, getEvents, getNotableFigures } from './api';
 *   
 *   const aboutData = await getAbout();
 *   const events = await getEvents();
 */

// Base URL for the API
// In development: your backend runs on http://localhost:3000
// In production: update this to your actual backend URL
// OLD not needed in NExt.js: const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(`API response status: ${response.status} for ${endpoint}`);

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Parse and return JSON data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    
    // Provide better error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const baseUrl = API_BASE_URL.replace('/api/v1', '');
      throw new Error(`Unable to connect to the backend server at ${baseUrl}. Please make sure the backend is running on port 3000.`);
    }
    
    // Re-throw with original message if it exists
    if (error.message) {
      throw error;
    }
    
    // Fallback error message
    throw new Error(`Something went wrong while fetching data from ${endpoint}`);
  }
}

// ============================================================================
// ABOUT API
// ============================================================================

/**
 * Get about page data (team members with images and responsibilities)
 * @returns {Promise<Object>} About page data
 */
export async function getAbout() {
  return apiRequest('/about');
}

// ============================================================================
// EVENTS API
// ============================================================================

/**
 * Get all events (upcoming and past)
 * @returns {Promise<Object>} Object with { upcoming: Array, past: Array }
 */
export async function getEvents() {
  return apiRequest('/events');
}

/**
 * Get a single event by ID
 * @param {number} id - Event ID
 * @returns {Promise<Object>} Event data
 */
export async function getEventById(id) {
  return apiRequest(`/events/${id}`);
}

/**
 * Get events for calendar (FullCalendar format)
 * @param {Object} params - Optional query parameters
 * @param {string} params.start - Start date (ISO format: '2024-01-01')
 * @param {string} params.end - End date (ISO format: '2024-12-31')
 * @returns {Promise<Array>} Array of calendar events
 */
export async function getCalendarEvents(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/events/calendar${queryString ? `?${queryString}` : ''}`;
  return apiRequest(endpoint);
}

// ============================================================================
// RESOURCES API
// ============================================================================

/**
 * Get all gallery items (event thumbnails - one per event)
 * @returns {Promise<Array>} Array of event thumbnail items
 */
export async function getGallery() {
  return apiRequest('/resources/gallery');
}

/**
 * Get all images from a specific event folder
 * @param {string} eventFolder - Event folder name (e.g., 'first-meeting', 'panel:kurdistan-at-a-crossroads')
 * @returns {Promise<Array>} Array of all images from that event
 */
export async function getEventImages(eventFolder) {
  return apiRequest(`/resources/gallery/event/${encodeURIComponent(eventFolder)}`);
}

/**
 * Get constitution PDF URL
 * @returns {Promise<Object>} Object with constitution file path
 */
export async function getConstitution() {
  return apiRequest('/resources/constitution');
}

// ============================================================================
// MERCH API
// ============================================================================

/**
 * Get merch data
 * @returns {Promise<Object>} Merch data
 */
export async function getMerch() {
  return apiRequest('/merch');
}

// ============================================================================
// NOTABLE FIGURES API
// ============================================================================

/**
 * Get all notable figures (for list/grid page)
 * @returns {Promise<Array>} Array of notable figures
 */
export async function getNotableFigures() {
  return apiRequest('/notable-figures');
}

/**
 * Get a single notable figure by ID (with full details)
 * @param {number} id - Notable figure ID
 * @returns {Promise<Object>} Notable figure data with associations
 */
export async function getNotableFigureById(id) {
  return apiRequest(`/notable-figures/${id}`);
}

// ============================================================================
// GET INVOLVED API
// ============================================================================

/**
 * Get get-involved data (form links, executive positions, contact email)
 * @returns {Promise<Object>} Get involved data
 */
export async function getGetInvolved() {
  return apiRequest('/get-involved');
}

// ============================================================================
// FOOTNOTES API
// ============================================================================

/**
 * Get footnotes data (social media links and contact info)
 * @returns {Promise<Object>} Footnotes data with social links
 */
export async function getFootnotes() {
  return apiRequest('/footnotes');
}

// ============================================================================
// PODCAST API
// ============================================================================

/**
 * Get latest podcast episode
 * @returns {Promise<Object>} Latest podcast episode
 */
export async function getLatestPodcast() {
  return apiRequest('/podcast/latest');
}

/**
 * Get recent podcast episodes (excluding latest)
 * @param {number} limit - Number of episodes to return (default: 5)
 * @returns {Promise<Array>} Array of recent podcast episodes
 */
export async function getRecentPodcasts(limit = 5) {
  return apiRequest(`/podcast/recent?limit=${limit}`);
}

/**
 * Get all podcast episodes
 * @returns {Promise<Array>} Array of all podcast episodes
 */
export async function getAllPodcasts() {
  return apiRequest('/podcast');
}

/**
 * Get a single podcast episode by ID (with full details and timestamps)
 * @param {number} id - Podcast episode ID
 * @returns {Promise<Object>} Podcast episode data with timestamps
 */
export async function getPodcastById(id) {
  return apiRequest(`/podcast/${id}`);
}

/**
 * Get podcast transcript in a specific language
 * @param {number} id - Podcast episode ID
 * @param {string} language - Language code: 'english', 'kurdish_sorani', 'kurdish_kurmanji', 'farsi'
 * @returns {Promise<Object>} Transcript data
 */
export async function getPodcastTranscript(id, language) {
  return apiRequest(`/podcast/${id}/transcript/${language}`);
}

// ============================================================================
// NEWSLETTER API
// ============================================================================

/**
 * Subscribe to newsletter
 * @param {Object} subscriptionData - Subscription data
 * @param {string} subscriptionData.email - Email address (required)
 * @param {string} subscriptionData.firstName - First name (required)
 * @param {string} subscriptionData.lastName - Last name (required)
 * @param {string} [subscriptionData.phoneNumber] - Phone number (optional)
 * @param {string} [subscriptionData.job] - Job/occupation (optional)
 * @param {string} [subscriptionData.country] - Country (optional)
 * @param {string} [subscriptionData.city] - City (optional)
 * @returns {Promise<Object>} Subscription result
 */
export async function subscribeToNewsletter(subscriptionData) {
  return apiRequest('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscriptionData),
  });
}

// ============================================================================
// LEARN API
// ============================================================================

/**
 * Get main learn page content
 * @returns {Promise<Object>} Main learn page data
 */
export async function getLearnMain() {
  return apiRequest('/learn');
}

/**
 * Get Kurdish Language section
 * @returns {Promise<Object>} Kurdish Language section data
 */
export async function getLearnKurdishLanguage() {
  return apiRequest('/learn/kurdish-language');
}

/**
 * Get Kurdish Dance section
 * @returns {Promise<Object>} Kurdish Dance section data
 */
export async function getLearnKurdishDance() {
  return apiRequest('/learn/kurdish-dance');
}

/**
 * Get Kurdish Heritage section
 * @returns {Promise<Object>} Kurdish Heritage section data
 */
export async function getLearnKurdishHeritage() {
  return apiRequest('/learn/kurdish-heritage');
}

