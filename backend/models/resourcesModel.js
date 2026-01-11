const db = require('../config/database');

// Toggle between Cloudinary and database (set USE_CLOUDINARY=true in .env to use Cloudinary)
// Check both with and without string check for debugging
const USE_CLOUDINARY_ENV = process.env.USE_CLOUDINARY;
const USE_CLOUDINARY = USE_CLOUDINARY_ENV === 'true' || USE_CLOUDINARY_ENV === true;
// Use Collections instead of Folders? (set USE_CLOUDINARY_COLLECTION=true to use Collections)
const USE_CLOUDINARY_COLLECTION = process.env.USE_CLOUDINARY_COLLECTION === 'true';
const CLOUDINARY_COLLECTION_NAME = process.env.CLOUDINARY_COLLECTION_NAME || 'gallery';

// Debug logging for env variables
console.log('🔧 Environment check on model load:');
console.log('   USE_CLOUDINARY env value:', USE_CLOUDINARY_ENV, '(type:', typeof USE_CLOUDINARY_ENV, ')');
console.log('   USE_CLOUDINARY evaluated:', USE_CLOUDINARY);
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

// Lazy load Cloudinary service only when needed (to avoid crashing if not installed)
let cloudinaryService = null;
function getCloudinaryService() {
  if (!cloudinaryService && USE_CLOUDINARY) {
    try {
      console.log('📦 Loading Cloudinary service...');
      cloudinaryService = require('../services/cloudinaryService');
      console.log('✅ Cloudinary service loaded successfully');
      // Check if credentials are configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn('⚠️ Cloudinary credentials missing in .env file!');
        console.warn('⚠️ Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
        return null;
      }
      console.log('✅ Cloudinary credentials found');
    } catch (error) {
      console.warn('❌ Cloudinary module not found. Install it with: npm install cloudinary');
      console.warn('Error:', error.message);
      console.warn('Falling back to database for gallery images.');
      return null;
    }
  }
  return cloudinaryService;
}

async function getAllEventImages() {
    const [rows] = await db.promise.query(
        `
        SELECT 
            ei.id, ei.image_slug, ei.description, ei.sort_order,
            e.id AS event_id, e.title AS event_title, e.event_date,
            CONCAT('/assets/images/events/', ei.image_slug, '.jpg') AS image_url
        FROM event_images ei
        LEFT JOIN events e ON ei.event_id = e.id
        ORDER BY ei.sort_order ASC, e.event_date DESC
        `
    );
    return rows;
}

async function getStandaloneGalleryImages() {
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, image_slug, description, sort_order,
            CONCAT('/assets/images/gallery/', image_slug, '.jpg') AS image_url
        FROM gallery
        ORDER BY sort_order ASC
        `
    );
    return rows;
}

/**
 * Get gallery items - uses Cloudinary if enabled, otherwise uses database
 * Supports both Folders (default) and Collections
 */
async function getGalleryItems() {
    // Debug logging
    console.log('📸 Gallery fetch - USE_CLOUDINARY:', USE_CLOUDINARY);
    console.log('📸 Gallery fetch - USE_CLOUDINARY_COLLECTION:', USE_CLOUDINARY_COLLECTION);
    console.log('📸 Gallery fetch - CLOUDINARY_COLLECTION_NAME:', CLOUDINARY_COLLECTION_NAME);
    
    // If Cloudinary is enabled, fetch from Cloudinary
    if (USE_CLOUDINARY) {
        console.log('☁️ Attempting to fetch from Cloudinary...');
        const service = getCloudinaryService();
        if (!service) {
            // Cloudinary not installed, fall back to database
            console.log('⚠️ Cloudinary service not available, using database');
            return getGalleryItemsFromDatabase();
        }
        
        try {
            let cloudinaryImages = [];
            
            // Use Collections if enabled, otherwise use Folders
            if (USE_CLOUDINARY_COLLECTION) {
                console.log(`📚 Fetching from Cloudinary Collection: ${CLOUDINARY_COLLECTION_NAME}`);
                // Fetch from Cloudinary Collection
                cloudinaryImages = await service.getImagesFromCollection(CLOUDINARY_COLLECTION_NAME, 500);
                
                // Group by event folder and use first image as thumbnail
                const eventMap = new Map();
                cloudinaryImages.forEach((img) => {
                    const eventFolder = img.event_folder;
                    if (eventFolder && !eventMap.has(eventFolder)) {
                        eventMap.set(eventFolder, img);
                    }
                });
                cloudinaryImages = Array.from(eventMap.values());
            } else {
                console.log('📁 Fetching event thumbnails from Cloudinary Folder: gallery');
                // getEventThumbnails handles everything: tries to find thumbnails, falls back to first image per folder
                cloudinaryImages = await service.getEventThumbnails('gallery');
            }
            
            console.log(`✅ Successfully fetched ${cloudinaryImages.length} event thumbnails from Cloudinary`);
            
            // Transform Cloudinary format to match our existing format
            return cloudinaryImages.map((img, index) => ({
                id: img.id,
                image_url: img.url, // Cloudinary URL is already full URL
                description: img.description || '',
                sort_order: index + 1,
                event_title: img.event_title, // Formatted event name (e.g., 'First Meeting', 'Panel: Kurdistan At A Crossroads')
                event_folder: img.event_folder || null, // Raw folder name for grouping (e.g., 'first-meeting', 'panel:kurdistan-at-a-crossroads')
                event_date: img.event_date,
                // Additional Cloudinary metadata
                public_id: img.public_id,
                width: img.width,
                height: img.height,
                format: img.format,
                folder: img.folder, // Full folder path (e.g., 'gallery/first-meeting')
                collection: img.collection || null, // Include collection name if using collections
            }));
        } catch (error) {
            console.error('❌ Error fetching from Cloudinary:');
            console.error('Error message:', error.message);
            console.error('Error code:', error.error?.http_code || 'N/A');
            console.error('Error details:', error);
            console.error('Stack trace:', error.stack);
            console.log('💾 Falling back to database for gallery images');
            // Fall back to database if Cloudinary completely fails
            return getGalleryItemsFromDatabase();
        }
    }
    
    // Otherwise, use database
    console.log('💾 Using database for gallery images (USE_CLOUDINARY is not true)');
    return getGalleryItemsFromDatabase();
}

/**
 * Get gallery items from database (original implementation)
 */
async function getGalleryItemsFromDatabase() {
    const [eventImages, standaloneImages] = await Promise.all([
        getAllEventImages(),
        getStandaloneGalleryImages()
    ]);
    
    // Combine both arrays and sort by sort_order
    const combined = [...eventImages, ...standaloneImages];
    return combined.sort((a, b) => a.sort_order - b.sort_order);
}

//this returns the file_path of th econstitution with the .pdf at the end 
async function getConstitution() {
    const [rows] = await db.promise.query(
        'SELECT file_path FROM constitution ORDER BY updated_at DESC LIMIT 1'
    );
    if (rows.length === 0) {
        return null;
    }
    // Construct the full URL path
    return `/assets/documents/${rows[0].file_path}`;
}

/**
 * Get all images from a specific event folder
 * @param {string} eventFolder - Event folder name (e.g., 'first-meeting')
 * @returns {Promise<Array>} Array of all images from that event
 */
async function getEventImages(eventFolder) {
    if (!eventFolder) {
        throw new Error('Event folder name is required');
    }
    
    // If Cloudinary is enabled, fetch from Cloudinary
    if (USE_CLOUDINARY) {
        console.log(`☁️ Fetching images for event: ${eventFolder}`);
        const service = getCloudinaryService();
        if (!service) {
            throw new Error('Cloudinary service not available');
        }
        
        try {
            const eventImages = await service.getEventImages(eventFolder, 'gallery');
            console.log(`✅ Successfully fetched ${eventImages.length} images for event: ${eventFolder}`);
            
            // Transform to our format
            return eventImages.map((img, index) => ({
                id: img.id,
                image_url: img.url,
                description: img.description || '',
                sort_order: img.sort_order || index + 1,
                event_title: img.event_title,
                event_folder: img.event_folder,
                event_date: img.event_date,
                public_id: img.public_id,
                width: img.width,
                height: img.height,
                format: img.format,
                folder: img.folder,
                filename: img.filename,
            }));
        } catch (error) {
            console.error(`❌ Error fetching event images for ${eventFolder}:`, error);
            throw error;
        }
    }
    
    // Otherwise, fetch from database (legacy support)
    // This would need database structure to support event folders
    console.log('⚠️ Database event folder fetching not implemented, Cloudinary only');
    return [];
}

module.exports = {
    getAllEventImages,
    getStandaloneGalleryImages,
    getGalleryItems,
    getEventImages, // NEW: Get all images from a specific event
    getConstitution
};

