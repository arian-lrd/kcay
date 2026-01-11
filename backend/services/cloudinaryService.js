const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('☁️ Cloudinary Configuration:');
console.log(`   Cloud Name: ${cloudName || 'MISSING'}`);
console.log(`   API Key: ${apiKey ? 'Set (' + apiKey.substring(0, 5) + '...)' : 'MISSING'}`);
console.log(`   API Secret: ${apiSecret ? 'Set' : 'MISSING'}`);

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary credentials incomplete! Missing:', {
    cloud_name: !cloudName,
    api_key: !apiKey,
    api_secret: !apiSecret
  });
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

/**
 * Fetch all images from a specific folder in Cloudinary
 * @param {string} folderPath - Path to folder (e.g., 'gallery' or 'gallery/events')
 * @param {number} maxResults - Maximum number of results to return (default: 500)
 * @returns {Promise<Array>} Array of image objects with metadata
 */
async function getImagesFromFolder(folderPath = 'gallery', maxResults = 500) {
  try {
    console.log(`🔍 Cloudinary: Searching for images in folder: ${folderPath}/*`);
    
    // Verify credentials before making API call
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials missing. Check your .env file has CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
    }
    
    // Try multiple search expressions to find images
    // First, try the standard search for subfolders
    let searchExpression = `folder:${folderPath}/*`;
    console.log(`🔍 Cloudinary: Trying search expression: ${searchExpression}`);
    
    let result;
    try {
      // Note: Removed .sort_by() due to Cloudinary SDK serialization issues
      // We'll sort manually after fetching
      result = await cloudinary.search
        .expression(searchExpression)
        .with_field('context')
        .with_field('metadata')
        .max_results(maxResults)
        .execute();
    } catch (searchError) {
      console.error('❌ Cloudinary search API error:');
      console.error('Error type:', typeof searchError);
      console.error('Error keys:', Object.keys(searchError || {}));
      console.error('Full error:', searchError);
      if (searchError.http_code) {
        console.error('HTTP Code:', searchError.http_code);
      }
      if (searchError.message) {
        console.error('Error message:', searchError.message);
      }
      if (searchError.error) {
        console.error('Error.error:', searchError.error);
      }
      throw searchError; // Re-throw to be caught by outer catch
    }
    
    console.log(`🔍 Cloudinary search completed. Found ${result.resources?.length || 0} resources with expression: ${searchExpression}`);
    
    // If no results found, try a different approach - search all resources and filter by folder
    if (!result.resources || result.resources.length === 0) {
      console.log(`⚠️ No results with 'folder:${folderPath}/*', trying alternative search...`);
      
      // Try searching for resources that start with the folder path
      searchExpression = `resource_type:image AND folder:"${folderPath}"`;
      console.log(`🔍 Cloudinary: Trying alternative expression: ${searchExpression}`);
      
      result = await cloudinary.search
        .expression(searchExpression)
        .with_field('context')
        .with_field('metadata')
        .max_results(maxResults)
        .execute();
      
      console.log(`🔍 Alternative search found ${result.resources?.length || 0} resources`);
    }
    
    // Sort results by created_at descending (most recent first)
    if (result.resources && result.resources.length > 0) {
      result.resources.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      });
      
      console.log(`✅ Found ${result.resources.length} resources!`);
      console.log(`📸 Sample folder paths:`, result.resources.slice(0, 5).map(r => ({
        folder: r.folder || 'root',
        public_id: r.public_id?.substring(0, 50)
      })));
    } else {
      console.log(`❌ No resources found in folder: ${folderPath}`);
      console.log(`💡 Debugging info:`);
      console.log(`   - Searching for folder: ${folderPath}`);
      console.log(`   - Make sure folder name is exactly: ${folderPath} (case-sensitive)`);
      console.log(`   - Images should be in: ${folderPath}/event-name/`);
      console.log(`   - Example: ${folderPath}/first-meeting/image.jpg`);
      
      // Try to list all folders to help debug
      try {
        const foldersResult = await cloudinary.api.root_folders();
        console.log(`📁 Available root folders in Cloudinary:`, foldersResult.folders?.map(f => f.name) || 'None');
      } catch (e) {
        console.log(`⚠️ Could not list folders:`, e.message);
      }
    }

    // If no resources found, return empty array
    if (!result.resources || result.resources.length === 0) {
      console.log(`⚠️ No images found. Returning empty array.`);
      return [];
    }
    
    // Transform Cloudinary results to our format
    const images = result.resources.map((resource, index) => {
      // Extract event name from folder path
      // Examples:
      // - 'gallery/first-meeting/image.jpg' -> event_title: 'First Meeting'
      // - 'gallery/panel:kurdistan-at-a-crossroads/image.jpg' -> event_title: 'Panel: Kurdistan At A Crossroads'
      const folderParts = resource.folder ? resource.folder.split('/') : [];
      let eventFolder = null;
      
      // Get the last folder part (the event name)
      // e.g., 'gallery/first-meeting' -> 'first-meeting'
      // e.g., 'gallery/panel:kurdistan-at-a-crossroads' -> 'panel:kurdistan-at-a-crossroads'
      if (folderParts.length > 1) {
        eventFolder = folderParts[folderParts.length - 1];
      } else if (folderParts.length === 1 && folderParts[0] !== folderPath) {
        // If image is directly in a subfolder
        eventFolder = folderParts[0];
      }

      // Format event title from folder name
      // Handle special characters like colons, hyphens
      // Examples:
      // 'first-meeting' -> 'First Meeting'
      // 'panel:kurdistan-at-a-crossroads' -> 'Panel: Kurdistan At A Crossroads'
      let eventTitle = null;
      if (eventFolder) {
        // First, replace colons with a special marker, then process
        // Split by colons first to preserve them
        const parts = eventFolder.split(':');
        if (parts.length > 1) {
          // Has colon (e.g., 'panel:kurdistan-at-a-crossroads')
          eventTitle = parts.map((part, idx) => {
            if (idx === 0) {
              // First part before colon: 'panel' -> 'Panel'
              return part.charAt(0).toUpperCase() + part.slice(1);
            } else {
              // After colon: 'kurdistan-at-a-crossroads' -> 'Kurdistan At A Crossroads'
              return part.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
            }
          }).join(': ');
        } else {
          // No colon, just hyphens: 'first-meeting' -> 'First Meeting'
          eventTitle = eventFolder.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      }

      // Extract description/caption from various possible fields
      // Cloudinary stores descriptions in context.custom.caption, context.alt, or context.custom.description
      let description = '';
      if (resource.context?.custom?.caption) {
        description = resource.context.custom.caption;
      } else if (resource.context?.custom?.description) {
        description = resource.context.custom.description;
      } else if (resource.context?.alt) {
        description = resource.context.alt;
      } else if (resource.metadata?.caption) {
        description = resource.metadata.caption;
      }

      return {
        id: resource.asset_id || resource.public_id, // Use asset_id as unique identifier
        public_id: resource.public_id,
        url: resource.secure_url, // Use secure HTTPS URL
        description: description,
        event_title: eventTitle, // Formatted event name (e.g., 'First Meeting', 'Panel: Kurdistan At A Crossroads')
        event_folder: eventFolder, // Raw folder name for grouping (e.g., 'first-meeting', 'panel:kurdistan-at-a-crossroads')
        event_date: resource.created_at ? new Date(resource.created_at).toISOString().split('T')[0] : null,
        sort_order: index + 1, // Default sort order based on creation date
        width: resource.width,
        height: resource.height,
        format: resource.format,
        folder: resource.folder, // Full folder path (e.g., 'gallery/first-meeting')
        // Additional metadata
        metadata: {
          bytes: resource.bytes,
          format: resource.format,
          created_at: resource.created_at,
        }
      };
    });

    return images;
  } catch (error) {
    console.error('❌ Error fetching images from Cloudinary:');
    console.error('Error object:', JSON.stringify(error, null, 2));
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error code:', error.http_code || error.error?.http_code || 'N/A');
    console.error('Error details:', error.error || error);
    console.error('Full error:', error);
    
    // Extract more detailed error information
    let errorMessage = 'Unknown Cloudinary error';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error) {
      errorMessage = JSON.stringify(error.error);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    throw new Error(`Failed to fetch images from Cloudinary: ${errorMessage}`);
  }
}

/**
 * Fetch images from multiple folders (e.g., gallery and gallery/events)
 * @param {Array<string>} folderPaths - Array of folder paths to search
 * @returns {Promise<Array>} Combined array of all images
 */
async function getImagesFromMultipleFolders(folderPaths = ['gallery']) {
  try {
    const allImages = await Promise.all(
      folderPaths.map(path => getImagesFromFolder(path))
    );

    // Flatten and combine all results
    const combined = allImages.flat();
    
    // Sort by creation date (newest first), then by sort_order
    return combined.sort((a, b) => {
      const dateA = a.metadata?.created_at ? new Date(a.metadata.created_at) : new Date(0);
      const dateB = b.metadata?.created_at ? new Date(b.metadata.created_at) : new Date(0);
      if (dateB - dateA !== 0) return dateB - dateA;
      return a.sort_order - b.sort_order;
    });
  } catch (error) {
    console.error('Error fetching images from multiple Cloudinary folders:', error);
    throw error;
  }
}

/**
 * Get a single image by public_id
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Image object with metadata
 */
async function getImageById(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      context: true,
      metadata: true
    });

    // Extract description from various possible fields
    let description = '';
    if (result.context?.custom?.caption) {
      description = result.context.custom.caption;
    } else if (result.context?.custom?.description) {
      description = result.context.custom.description;
    } else if (result.context?.alt) {
      description = result.context.alt;
    } else if (result.metadata?.caption) {
      description = result.metadata.caption;
    }

    return {
      id: result.asset_id || result.public_id,
      public_id: result.public_id,
      url: result.secure_url,
      description: description,
      width: result.width,
      height: result.height,
      format: result.format,
      folder: result.folder,
      metadata: {
        bytes: result.bytes,
        format: result.format,
        created_at: result.created_at,
      }
    };
  } catch (error) {
    console.error(`Error fetching image ${publicId} from Cloudinary:`, error);
    throw new Error(`Failed to fetch image from Cloudinary: ${error.message}`);
  }
}

/**
 * Fetch images from a Cloudinary Collection
 * Collections are for sharing assets internally and externally
 * @param {string} collectionName - Name of the collection
 * @param {number} maxResults - Maximum number of results (default: 500)
 * @returns {Promise<Array>} Array of image objects with metadata
 */
async function getImagesFromCollection(collectionName, maxResults = 500) {
  try {
    // Get collection details
    const collection = await cloudinary.api.collection(collectionName);
    
    if (!collection || !collection.assets || collection.assets.length === 0) {
      return [];
    }

    // Get full details for each asset in the collection
    const assetPromises = collection.assets.slice(0, maxResults).map(async (assetRef) => {
      try {
        const resource = await cloudinary.api.resource(assetRef.public_id, {
          context: true,
          metadata: true
        });

        // Extract description from various fields
        let description = '';
        if (resource.context?.custom?.caption) {
          description = resource.context.custom.caption;
        } else if (resource.context?.custom?.description) {
          description = resource.context.custom.description;
        } else if (resource.context?.alt) {
          description = resource.context.alt;
        } else if (resource.metadata?.caption) {
          description = resource.metadata.caption;
        }

        // Extract folder name for event name
        const folderParts = resource.folder ? resource.folder.split('/') : [];
        const eventFolder = folderParts.length > 1 ? folderParts[folderParts.length - 1] : null;

        return {
          id: resource.asset_id || resource.public_id,
          public_id: resource.public_id,
          url: resource.secure_url,
          description: description,
          event_title: eventFolder ? eventFolder.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : collectionName,
          event_date: resource.created_at ? new Date(resource.created_at).toISOString().split('T')[0] : null,
          sort_order: assetRef.order || 0, // Collections can have custom order
          width: resource.width,
          height: resource.height,
          format: resource.format,
          folder: resource.folder,
          collection: collectionName,
          metadata: {
            bytes: resource.bytes,
            format: resource.format,
            created_at: resource.created_at,
          }
        };
      } catch (error) {
        console.error(`Error fetching asset ${assetRef.public_id} from collection:`, error);
        return null;
      }
    });

    const images = (await Promise.all(assetPromises)).filter(img => img !== null);
    
    // Sort by collection order if available, otherwise by creation date
    return images.sort((a, b) => {
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      const dateA = a.metadata?.created_at ? new Date(a.metadata.created_at) : new Date(0);
      const dateB = b.metadata?.created_at ? new Date(b.metadata.created_at) : new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching images from Cloudinary collection:', error);
    throw new Error(`Failed to fetch images from collection: ${error.message}`);
  }
}

/**
 * Generate optimized image URL with transformations
 * @param {string} publicId - Cloudinary public_id
 * @param {Object} options - Transformation options
 * @returns {string} Optimized image URL
 */
function getOptimizedImageUrl(publicId, options = {}) {
  const defaults = {
    width: options.width || 'auto',
    height: options.height || 'auto',
    crop: options.crop || 'fill',
    quality: options.quality || 'auto',
    format: options.format || 'auto',
  };

  return cloudinary.url(publicId, defaults);
}

/**
 * List all root folders in Cloudinary (for debugging)
 * @returns {Promise<Array>} Array of folder names
 */
async function listRootFolders() {
  try {
    const result = await cloudinary.api.root_folders();
    return result.folders || [];
  } catch (error) {
    console.error('Error listing root folders:', error);
    throw error;
  }
}

/**
 * List subfolders in a specific folder (for debugging)
 * @param {string} folderPath - Path to folder
 * @returns {Promise<Array>} Array of subfolder names
 */
async function listSubfolders(folderPath) {
  try {
    const result = await cloudinary.api.sub_folders(folderPath);
    return result.folders || [];
  } catch (error) {
    console.error(`Error listing subfolders of ${folderPath}:`, error);
    throw error;
  }
}

/**
 * Get event thumbnails - fetches only thumbnail.jpg from each event folder
 * @param {string} folderPath - Base folder path (default: 'gallery')
 * @returns {Promise<Array>} Array of event thumbnail objects (one per event)
 */
async function getEventThumbnails(folderPath = 'gallery') {
  try {
    console.log(`📸 Cloudinary: Fetching event thumbnails from ${folderPath}/*/thumbnail.jpg`);
    
    // Verify credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials missing');
    }
    
    // Get all images from gallery subfolders, then group by event folder
    // We'll prioritize thumbnails if they exist, otherwise use the first image from each folder
    console.log(`🔍 Cloudinary: Fetching all images from ${folderPath}/* to group by event folder...`);
    
    let searchExpression = `folder:${folderPath}/*`;
    let result;
    try {
      result = await cloudinary.search
        .expression(searchExpression)
        .with_field('context')
        .with_field('metadata')
        .max_results(500)
        .execute();
    } catch (searchError) {
      console.error('❌ Cloudinary search error:', searchError.error?.message || searchError.message);
      throw searchError;
    }
    
    if (!result.resources || result.resources.length === 0) {
      console.log(`⚠️ No images found in ${folderPath}/*. Returning empty array.`);
      return [];
    }
    
    console.log(`📸 Found ${result.resources.length} total images`);
    
    // Debug: Show detailed info about all resources
    console.log(`🔍 Detailed resource info (first 3):`, result.resources.slice(0, 3).map(r => ({
      public_id: r.public_id,
      folder: r.folder,
      asset_folder: r.asset_folder,
      secure_url: r.secure_url?.substring(0, 60) + '...',
      // Check if public_id contains folder structure
      public_id_parts: r.public_id ? r.public_id.split('/') : [],
    })));
    
    // Check if images have folder structure using asset_folder or folder field
    const imagesWithFolders = result.resources.filter(r => r.asset_folder || r.folder);
    const hasFolderStructure = imagesWithFolders.length > 0;
    
    console.log(`📊 Images with folder info (asset_folder or folder): ${imagesWithFolders.length} out of ${result.resources.length}`);
    
    // If no folder structure, return all images individually (old behavior)
    if (!hasFolderStructure) {
      console.log('⚠️ Images are not organized in folders. Returning all images individually.');
      // Transform all images to match the expected format
      return result.resources.map((resource, index) => {
        // Extract description
        let description = '';
        if (resource.context?.custom?.caption) {
          description = resource.context.custom.caption;
        } else if (resource.context?.custom?.description) {
          description = resource.context.custom.description;
        } else if (resource.context?.alt) {
          description = resource.context.alt;
        } else if (resource.metadata?.caption) {
          description = resource.metadata.caption;
        }
        
        // Extract filename for title if no description
        const publicId = resource.public_id || '';
        const filename = publicId.split('/').pop() || `Image ${index + 1}`;
        const eventTitle = description || filename.replace(/\.[^/.]+$/, ''); // Remove extension
        
        return {
          id: resource.asset_id || resource.public_id,
          public_id: resource.public_id,
          url: resource.secure_url,
          description: description || '',
          event_title: eventTitle,
          event_folder: `image-${index + 1}`, // Unique folder per image for now
          event_date: resource.created_at ? new Date(resource.created_at).toISOString().split('T')[0] : null,
          width: resource.width,
          height: resource.height,
          format: resource.format,
          folder: resource.folder || null,
          metadata: {
            bytes: resource.bytes,
            format: resource.format,
            created_at: resource.created_at,
          }
        };
      });
    }
    
    // Images have folder structure - group by event folder
    console.log('📁 Grouping images by event folder...');
    
    // First, collect all images grouped by event folder
    const imagesByEvent = new Map(); // Map of eventFolder -> Array of { resource, isThumbnail }
    
    result.resources.forEach((resource) => {
      // Extract event folder - check asset_folder, folder field, and public_id
      let eventFolder = null;
      
      // Method 1: Use asset_folder field (newer Cloudinary API field)
      if (resource.asset_folder) {
        const assetFolderParts = resource.asset_folder.split('/');
        if (assetFolderParts.length > 1) {
          // e.g., 'gallery/first-meeting' -> 'first-meeting'
          eventFolder = assetFolderParts[assetFolderParts.length - 1];
        } else if (assetFolderParts.length === 1 && assetFolderParts[0] !== folderPath && assetFolderParts[0] !== '') {
          // Single folder name (not the base path)
          eventFolder = assetFolderParts[0];
        }
      }
      
      // Method 2: Use folder field if available (older API or fallback)
      if (!eventFolder && resource.folder) {
        const folderParts = resource.folder.split('/');
        if (folderParts.length > 1) {
          // e.g., 'gallery/first-meeting' -> 'first-meeting'
          eventFolder = folderParts[folderParts.length - 1];
        } else if (folderParts.length === 1 && folderParts[0] !== folderPath && folderParts[0] !== '') {
          // Single folder name (not the base path)
          eventFolder = folderParts[0];
        }
      }
      
      // Method 3: Extract from public_id (this should contain the full path if folders exist)
      if (!eventFolder && resource.public_id) {
        const publicIdParts = resource.public_id.split('/');
        // public_id format: "gallery/event-folder/image-filename" or "gallery/event-folder/subfolder/image-filename"
        if (publicIdParts.length >= 3) {
          // e.g., ['gallery', 'first-meeting', 'image.jpg'] -> 'first-meeting'
          // e.g., ['gallery', 'first-meeting', 'subfolder', 'image.jpg'] -> 'first-meeting'
          eventFolder = publicIdParts[1]; // Second part is the event folder
        } else if (publicIdParts.length === 2 && publicIdParts[0] === folderPath) {
          // e.g., ['gallery', 'image.jpg'] -> no event folder, skip
          return;
        }
      }
      
      if (!eventFolder) {
        console.log(`⚠️ Skipping image - cannot determine event folder:`, {
          public_id: resource.public_id?.substring(0, 50),
          folder: resource.folder || 'null',
          asset_folder: resource.asset_folder || 'null',
          public_id_parts: resource.public_id ? resource.public_id.split('/') : []
        });
        return;
      }
      
      // Check if this is a thumbnail image - check the filename field (without extension) should be exactly "thumbnail"
      let isThumbnail = false;
      let thumbnailCheckDetails = {
        public_id: resource.public_id,
        filename: resource.filename || 'NOT SET',
        display_name: resource.display_name || 'NOT SET',
        asset_folder: resource.asset_folder || 'NOT SET',
        checked_fields: []
      };
      
      // Method 1: Check the filename field from the resource object
      if (resource.filename) {
        const filenameWithoutExt = resource.filename.replace(/\.[^/.]+$/, '').toLowerCase();
        thumbnailCheckDetails.checked_fields.push(`filename="${resource.filename}" -> "${filenameWithoutExt}"`);
        isThumbnail = filenameWithoutExt === 'thumbnail';
      } else {
        thumbnailCheckDetails.checked_fields.push('filename field is null/undefined');
      }
      
      // Method 2: Check display_name field (might be used instead of filename)
      if (!isThumbnail && resource.display_name) {
        const displayNameWithoutExt = resource.display_name.replace(/\.[^/.]+$/, '').toLowerCase();
        thumbnailCheckDetails.checked_fields.push(`display_name="${resource.display_name}" -> "${displayNameWithoutExt}"`);
        isThumbnail = displayNameWithoutExt === 'thumbnail';
      }
      
      // Method 3: Fallback - extract filename from public_id if filename field is not available
      if (!isThumbnail && resource.public_id) {
        const publicId = resource.public_id;
        const filename = publicId.split('/').pop() || '';
        const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '').toLowerCase();
        thumbnailCheckDetails.checked_fields.push(`public_id filename="${filename}" -> "${filenameWithoutExt}"`);
        isThumbnail = filenameWithoutExt === 'thumbnail';
      }
      
      // Log thumbnail detection details for debugging
      if (isThumbnail) {
        console.log(`🎯 Thumbnail detected for event "${eventFolder}":`, thumbnailCheckDetails);
      } else if (eventFolder === 'panel:kurdistan-at-a-crossroads' || eventFolder?.includes('panel')) {
        // Log details for panel event to help debug
        console.log(`🔍 Checking image for "${eventFolder}" (not a thumbnail):`, thumbnailCheckDetails);
      }
      
      // Add to collection for this event folder
      if (!imagesByEvent.has(eventFolder)) {
        imagesByEvent.set(eventFolder, []);
      }
      imagesByEvent.get(eventFolder).push({ resource, isThumbnail });
    });
    
    // Now, for each event folder, select the thumbnail if it exists, otherwise the first image
    const eventResourceMap = new Map(); // Map of eventFolder -> { resource, isThumbnail }
    
    imagesByEvent.forEach((images, eventFolder) => {
      // First, try to find a thumbnail image
      const thumbnailImage = images.find(img => img.isThumbnail);
      
      if (thumbnailImage) {
        // Use the thumbnail image
        eventResourceMap.set(eventFolder, thumbnailImage);
        console.log(`✅ Found thumbnail for event "${eventFolder}": ${thumbnailImage.resource.public_id}`);
      } else if (images.length > 0) {
        // No thumbnail found, use the first image (sorted by date if available, otherwise first in array)
        // Sort by created_at (newest first) for consistency
        images.sort((a, b) => {
          const dateA = a.resource.created_at ? new Date(a.resource.created_at).getTime() : 0;
          const dateB = b.resource.created_at ? new Date(b.resource.created_at).getTime() : 0;
          return dateB - dateA;
        });
        eventResourceMap.set(eventFolder, images[0]);
        console.log(`⚠️ No thumbnail found for event "${eventFolder}", using first image: ${images[0].resource.public_id}`);
        console.log(`📋 Available images in "${eventFolder}" folder:`, images.map(img => ({
          public_id: img.resource.public_id,
          filename: img.resource.filename,
          filename_from_public_id: img.resource.public_id ? img.resource.public_id.split('/').pop() : null
        })));
      }
    });
    
    // Now convert to formatted thumbnail objects
    const eventMap = new Map();
    
    eventResourceMap.forEach(({ resource, isThumbnail }, eventFolder) => {
      // Format event title from folder name
      let eventTitle = null;
      if (eventFolder) {
        const parts = eventFolder.split(':');
        if (parts.length > 1) {
          eventTitle = parts.map((part, idx) => {
            if (idx === 0) {
              return part.charAt(0).toUpperCase() + part.slice(1);
            } else {
              return part.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
            }
          }).join(': ');
        } else {
          eventTitle = eventFolder.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      }
      
      // Extract description from resource metadata
      let description = '';
      if (resource.context?.custom?.caption) {
        description = resource.context.custom.caption;
      } else if (resource.context?.custom?.description) {
        description = resource.context.custom.description;
      } else if (resource.context?.alt) {
        description = resource.context.alt;
      } else if (resource.metadata?.caption) {
        description = resource.metadata.caption;
      }
      
      eventMap.set(eventFolder, {
        id: resource.asset_id || resource.public_id,
        public_id: resource.public_id,
        url: resource.secure_url,
        description: description || eventTitle || 'Event Gallery',
        event_title: eventTitle,
        event_folder: eventFolder,
        event_date: resource.created_at ? new Date(resource.created_at).toISOString().split('T')[0] : null,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        folder: resource.folder,
        metadata: {
          bytes: resource.bytes,
          format: resource.format,
          created_at: resource.created_at,
        }
      });
    });
    
    // Convert map to array and sort by date (newest first)
    const thumbnails = Array.from(eventMap.values());
    thumbnails.sort((a, b) => {
      const dateA = a.metadata?.created_at ? new Date(a.metadata.created_at).getTime() : 0;
      const dateB = b.metadata?.created_at ? new Date(b.metadata.created_at).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log(`✅ Grouped to ${thumbnails.length} events from ${result.resources.length} total images`);
    
    console.log(`✅ Found ${thumbnails.length} unique event thumbnails`);
    return thumbnails;
  } catch (error) {
    console.error('❌ Error fetching event thumbnails:', error);
    throw new Error(`Failed to fetch event thumbnails: ${error.message || error.error?.message || 'Unknown error'}`);
  }
}

/**
 * Get all images from a specific event folder
 * @param {string} eventFolder - Event folder name (e.g., 'first-meeting', 'panel:kurdistan-at-a-crossroads')
 * @param {string} baseFolderPath - Base folder path (default: 'gallery')
 * @returns {Promise<Array>} Array of all images from that event
 */
async function getEventImages(eventFolder, baseFolderPath = 'gallery') {
  try {
    console.log(`📸 Cloudinary: Fetching all images from ${baseFolderPath}/${eventFolder}`);
    
    // Verify credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials missing');
    }
    
    if (!eventFolder) {
      throw new Error('Event folder name is required');
    }
    
    // Handle case where images are not in folders (event_folder starts with "image-")
    // In this case, we return an empty array since there's no "event" to expand
    if (eventFolder.startsWith('image-')) {
      console.log(`⚠️ Event folder "${eventFolder}" is an individual image, not a folder. Returning empty array.`);
      return [];
    }
    
    // Search for all images in the specific event folder
    // Quote the folder path to handle special characters like colons
    const folderPath = `${baseFolderPath}/${eventFolder}`;
    // Use quotes around the folder path to escape special characters
    let searchExpression = `folder:"${folderPath}"`;
    console.log(`🔍 Cloudinary: Search expression: ${searchExpression}`);
    
    let result;
    try {
      result = await cloudinary.search
        .expression(searchExpression)
        .with_field('context')
        .with_field('metadata')
        .max_results(500)
        .execute();
    } catch (searchError) {
      console.error('❌ Cloudinary search error for event images:', searchError.error?.message || searchError.message);
      
      // If the quoted search fails, try alternative approach - search all and filter
      console.log(`⚠️ Search with quoted folder failed, trying alternative approach...`);
      try {
        // Try searching all images in the base folder and filter by folder path
        const baseSearchExpression = `folder:${baseFolderPath}/*`;
        result = await cloudinary.search
          .expression(baseSearchExpression)
          .with_field('context')
          .with_field('metadata')
          .max_results(500)
          .execute();
        
        // Filter to only images from this event folder
        if (result.resources && result.resources.length > 0) {
          result.resources = result.resources.filter(resource => {
            // Check asset_folder field (newer API)
            if (resource.asset_folder) {
              return resource.asset_folder === folderPath || resource.asset_folder.includes(`/${eventFolder}/`) || resource.asset_folder.endsWith(`/${eventFolder}`);
            }
            // Check folder field (older API)
            if (resource.folder) {
              return resource.folder === folderPath || resource.folder.includes(`/${eventFolder}/`) || resource.folder.endsWith(`/${eventFolder}`);
            }
            // Check public_id as fallback
            if (resource.public_id) {
              return resource.public_id.includes(`/${eventFolder}/`) || resource.public_id.startsWith(`${folderPath}/`);
            }
            return false;
          });
          console.log(`🔍 Alternative search found ${result.resources.length} images for event: ${eventFolder}`);
        }
      } catch (altError) {
        console.error('❌ Alternative search also failed:', altError.error?.message || altError.message);
        throw searchError; // Throw original error
      }
    }
    
    console.log(`🔍 Found ${result.resources?.length || 0} images in ${folderPath}`);
    
    if (!result.resources || result.resources.length === 0) {
      console.log(`⚠️ No images found in ${folderPath}`);
      return [];
    }
    
    // Format event title from folder name
    let eventTitle = null;
    const parts = eventFolder.split(':');
    if (parts.length > 1) {
      eventTitle = parts.map((part, idx) => {
        if (idx === 0) {
          return part.charAt(0).toUpperCase() + part.slice(1);
        } else {
          return part.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      }).join(': ');
    } else {
      eventTitle = eventFolder.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    // Transform all images
    const images = result.resources.map((resource, index) => {
      // Extract description
      let description = '';
      if (resource.context?.custom?.caption) {
        description = resource.context.custom.caption;
      } else if (resource.context?.custom?.description) {
        description = resource.context.custom.description;
      } else if (resource.context?.alt) {
        description = resource.context.alt;
      } else if (resource.metadata?.caption) {
        description = resource.metadata.caption;
      }
      
      return {
        id: resource.asset_id || resource.public_id,
        public_id: resource.public_id,
        url: resource.secure_url,
        description: description,
        event_title: eventTitle,
        event_folder: eventFolder,
        event_date: resource.created_at ? new Date(resource.created_at).toISOString().split('T')[0] : null,
        sort_order: index + 1,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        folder: resource.folder,
        filename: resource.public_id.split('/').pop(), // Get filename
        metadata: {
          bytes: resource.bytes,
          format: resource.format,
          created_at: resource.created_at,
        }
      };
    });
    
    // Sort by filename (so thumbnail.jpg comes first) then by creation date
    images.sort((a, b) => {
      // Put thumbnail.jpg first
      const aIsThumbnail = a.filename === 'thumbnail' || a.public_id.includes('thumbnail');
      const bIsThumbnail = b.filename === 'thumbnail' || b.public_id.includes('thumbnail');
      if (aIsThumbnail && !bIsThumbnail) return -1;
      if (!aIsThumbnail && bIsThumbnail) return 1;
      
      // Then by creation date (newest first)
      const dateA = a.metadata?.created_at ? new Date(a.metadata.created_at).getTime() : 0;
      const dateB = b.metadata?.created_at ? new Date(b.metadata.created_at).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log(`✅ Found ${images.length} images for event: ${eventTitle}`);
    return images;
  } catch (error) {
    console.error(`❌ Error fetching images for event ${eventFolder}:`, error);
    throw new Error(`Failed to fetch event images: ${error.message || error.error?.message || 'Unknown error'}`);
  }
}

/**
 * Fetch all notable figures from Cloudinary
 * Structure: notable-figures/{figure-name}/{figure-name}.jpg and {figure-name}.json
 * @param {string} baseFolderPath - Base folder path (default: 'notable-figures')
 * @returns {Promise<Array>} Array of notable figure objects with image and JSON data
 */
async function getNotableFigures(baseFolderPath = 'notable-figures') {
  try {
    console.log(`📚 Cloudinary: Fetching notable figures from ${baseFolderPath}/*`);
    
    // Fetch all images from notable-figures/* subfolders
    const searchExpression = `resource_type:image AND folder:"${baseFolderPath}/*"`;
    console.log(`🔍 Cloudinary: Search expression: ${searchExpression}`);
    
    const result = await cloudinary.search
      .expression(searchExpression)
      .with_field('context')
      .with_field('metadata')
      .max_results(500)
      .execute();
    
    console.log(`📸 Found ${result.resources?.length || 0} images in ${baseFolderPath}/*`);
    
    if (!result.resources || result.resources.length === 0) {
      console.log(`⚠️ No images found in ${baseFolderPath}/*`);
      return [];
    }
    
    // Group images by their folder (each folder is one figure)
    const figuresByFolder = {};
    
    for (const image of result.resources) {
      const folder = image.asset_folder || image.folder;
      if (!folder) {
        console.log(`⚠️ Image ${image.public_id} has no folder info`);
        continue;
      }
      
      // Extract figure folder name (e.g., "notable-figures/saladin" -> "saladin")
      const folderParts = folder.split('/');
      const figureFolderName = folderParts[folderParts.length - 1];
      
      console.log(`🔍 Processing image: public_id="${image.public_id}", folder="${folder}", figureFolderName="${figureFolderName}"`);
      
      if (!figuresByFolder[figureFolderName]) {
        figuresByFolder[figureFolderName] = {
          folder: figureFolderName,
          image: null,
          jsonData: null,
          images: [] // Track all images in this folder
        };
      }
      
      // Extract filename from public_id (e.g., "notable-figures/saladin/saladin" -> "saladin")
      const publicIdParts = image.public_id.split('/');
      const filename = publicIdParts[publicIdParts.length - 1];
      
      // Store all images for this folder (including context/metadata for positioning)
      figuresByFolder[figureFolderName].images.push({
        public_id: image.public_id,
        secure_url: image.secure_url,
        url: image.url,
        folder: folder,
        filename: filename,
        context: image.context,
        metadata: image.metadata
      });
      
      // Check if this is the image file (should match folder name or be the only image)
      // More flexible matching: exact match, or starts with folder name, or has image extension
      const isMatch = filename === figureFolderName || 
                     filename.startsWith(figureFolderName) ||
                     filename.endsWith('.jpg') || 
                     filename.endsWith('.png') ||
                     filename.endsWith('.jpeg') ||
                     filename.endsWith('.webp');
      
      if (isMatch && !figuresByFolder[figureFolderName].image) {
        // Use the first matching image (include context/metadata for positioning)
        figuresByFolder[figureFolderName].image = {
          public_id: image.public_id,
          secure_url: image.secure_url,
          url: image.url,
          folder: folder,
          context: image.context,
          metadata: image.metadata
        };
        console.log(`✅ Matched image for ${figureFolderName}: ${filename}`);
      }
    }
    
      // If any folder has images but no matched image, use the first one
      for (const [folderName, figureData] of Object.entries(figuresByFolder)) {
        if (!figureData.image && figureData.images.length > 0) {
          console.log(`⚠️ No exact match for ${folderName}, using first image: ${figureData.images[0].filename}`);
          figureData.image = {
            public_id: figureData.images[0].public_id,
            secure_url: figureData.images[0].secure_url,
            url: figureData.images[0].url,
            folder: figureData.images[0].folder,
            context: figureData.images[0].context,
            metadata: figureData.images[0].metadata
          };
        }
      }
    
    // Now fetch JSON files for each figure
    const jsonSearchExpression = `resource_type:raw AND folder:"${baseFolderPath}/*"`;
    console.log(`🔍 Cloudinary: Fetching JSON files with expression: ${jsonSearchExpression}`);
    
    const jsonResult = await cloudinary.search
      .expression(jsonSearchExpression)
      .max_results(500)
      .execute();
    
    console.log(`📄 Found ${jsonResult.resources?.length || 0} JSON files`);
    
    // Match JSON files to figures
    for (const jsonFile of jsonResult.resources || []) {
      const folder = jsonFile.asset_folder || jsonFile.folder;
      if (!folder) continue;
      
      const folderParts = folder.split('/');
      const figureFolderName = folderParts[folderParts.length - 1];
      
      if (figuresByFolder[figureFolderName]) {
        // Fetch the JSON content
        try {
          const jsonUrl = jsonFile.secure_url || jsonFile.url;
          console.log(`📥 Fetching JSON content from: ${jsonUrl}`);
          
          const response = await fetch(jsonUrl);
          if (response.ok) {
            const jsonContent = await response.json();
            figuresByFolder[figureFolderName].jsonData = jsonContent;
            console.log(`✅ Parsed JSON for ${figureFolderName}`);
          } else {
            console.warn(`⚠️ Failed to fetch JSON for ${figureFolderName}: ${response.status}`);
          }
        } catch (jsonError) {
          console.error(`❌ Error fetching/parsing JSON for ${figureFolderName}:`, jsonError);
        }
      }
    }
    
    // Convert to array format matching database structure
    const figures = [];
    console.log(`📊 Processing ${Object.keys(figuresByFolder).length} figure folders`);
    for (const [folderName, figureData] of Object.entries(figuresByFolder)) {
      console.log(`🔍 Checking ${folderName}: hasImage=${!!figureData.image}, hasJson=${!!figureData.jsonData}, imageCount=${figureData.images?.length || 0}`);
      if (!figureData.image) {
        console.warn(`⚠️ Skipping ${folderName}: no image found`);
        if (figureData.images && figureData.images.length > 0) {
          console.log(`   Available images: ${figureData.images.map(img => img.filename).join(', ')}`);
        }
        continue;
      }
      
      const jsonData = figureData.jsonData || {};
      
      // Extract image positioning from Cloudinary context/metadata
      // Check both context.custom and metadata for object_position
      const imagePosition = figureData.image.context?.custom?.object_position || 
                           figureData.image.metadata?.object_position ||
                           null;
      
      // Create figure object matching database structure
      const figure = {
        id: jsonData.id || folderName, // Use folder name as ID if no ID in JSON
        name: jsonData.name || folderName,
        name_kurdish: jsonData.name_kurdish || null, // Kurdish name (optional)
        nickname: jsonData.nickname || null, // Nickname (optional, separate from name)
        century: jsonData.century || null,
        area_of_distinction: jsonData.area_of_distinction || null,
        city_born: jsonData.city_born || null,
        essay: jsonData.essay || null,
        education: jsonData.education || null,
        sort_order: jsonData.sort_order || 0,
        image_url: figureData.image.secure_url || figureData.image.url,
        cloudinary_public_id: figureData.image.public_id,
        folder: folderName,
        image_object_position: imagePosition, // Per-image positioning
        associated_figures_slugs: jsonData.associated_figures || [] // Array of folder names
      };
      
      figures.push(figure);
    }
    
    // Sort by sort_order
    figures.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return (a.sort_order || 0) - (b.sort_order || 0);
      }
      return a.name.localeCompare(b.name);
    });
    
    console.log(`✅ Successfully fetched ${figures.length} notable figures from Cloudinary`);
    return figures;
  } catch (error) {
    console.error('❌ Error fetching notable figures from Cloudinary:', error);
    throw new Error(`Failed to fetch notable figures: ${error.message || error.error?.message || 'Unknown error'}`);
  }
}

/**
 * Fetch a single notable figure by folder name (slug)
 * @param {string} figureSlug - Folder name of the figure (e.g., "saladin")
 * @param {string} baseFolderPath - Base folder path (default: 'notable-figures')
 * @returns {Promise<Object|null>} Notable figure object with full details, or null if not found
 */
async function getNotableFigureBySlug(figureSlug, baseFolderPath = 'notable-figures') {
  try {
    console.log(`📚 Cloudinary: Fetching notable figure: ${figureSlug}`);
    
    const figureFolder = `${baseFolderPath}/${figureSlug}`;
    
    // Fetch image
    const imageSearch = `resource_type:image AND folder:"${figureFolder}"`;
    const imageResult = await cloudinary.search
      .expression(imageSearch)
      .with_field('context')
      .with_field('metadata')
      .max_results(10)
      .execute();
    
    if (!imageResult.resources || imageResult.resources.length === 0) {
      console.log(`⚠️ No image found for ${figureSlug}`);
      return null;
    }
    
    // Get the main image (should be the one matching the folder name)
    const image = imageResult.resources.find(img => {
      const filename = img.public_id.split('/').pop();
      return filename === figureSlug || filename.startsWith(figureSlug);
    }) || imageResult.resources[0];
    
    // Fetch JSON file - search for raw files in the folder
    const jsonSearch = `resource_type:raw AND folder:"${figureFolder}"`;
    console.log(`🔍 Cloudinary: Searching for JSON with expression: ${jsonSearch}`);
    const jsonResult = await cloudinary.search
      .expression(jsonSearch)
      .max_results(10)
      .execute();
    
    console.log(`📄 Found ${jsonResult.resources?.length || 0} raw files in ${figureFolder}`);
    
    let jsonData = {};
    // Find the JSON file (should match the folder name or be the only .json file)
    const jsonFile = jsonResult.resources?.find(file => {
      const publicId = file.public_id || '';
      const filename = publicId.split('/').pop();
      // Check if it's a JSON file and matches the folder name
      return filename.includes(figureSlug) || filename.endsWith('.json');
    }) || jsonResult.resources?.[0];
    
    if (jsonFile) {
      try {
        const jsonUrl = jsonFile.secure_url || jsonFile.url;
        console.log(`📥 Fetching JSON content from: ${jsonUrl}`);
        const response = await fetch(jsonUrl);
        if (response.ok) {
          jsonData = await response.json();
          console.log(`✅ Parsed JSON for ${figureSlug}:`, {
            name: jsonData.name,
            hasEssay: !!jsonData.essay,
            essayLength: jsonData.essay?.length || 0
          });
        } else {
          console.warn(`⚠️ Failed to fetch JSON for ${figureSlug}: ${response.status}`);
        }
      } catch (jsonError) {
        console.error(`❌ Error fetching/parsing JSON for ${figureSlug}:`, jsonError);
      }
    } else {
      console.warn(`⚠️ No JSON file found for ${figureSlug} in folder ${figureFolder}`);
    }
    
    // Extract image positioning from Cloudinary context/metadata
    // Check both context.custom and metadata for object_position
    const imagePosition = image.context?.custom?.object_position || 
                         image.metadata?.object_position ||
                         null;
    
    // Build figure object
    const figure = {
      id: jsonData.id || figureSlug,
      name: jsonData.name || figureSlug,
      name_kurdish: jsonData.name_kurdish || null, // Kurdish name (optional)
      nickname: jsonData.nickname || null, // Nickname (optional, separate from name)
      century: jsonData.century || null,
      area_of_distinction: jsonData.area_of_distinction || null,
      city_born: jsonData.city_born || null,
      essay: jsonData.essay || null,
      education: jsonData.education || null,
      image_url: image.secure_url || image.url,
      cloudinary_public_id: image.public_id,
      folder: figureSlug,
      image_object_position: imagePosition, // Per-image positioning
      associated_figures_slugs: jsonData.associated_figures || []
    };
    
    // Fetch associated figures if specified
    if (figure.associated_figures_slugs && figure.associated_figures_slugs.length > 0) {
      const associatedFigures = [];
      for (const associatedSlug of figure.associated_figures_slugs) {
        try {
          const associatedFigure = await getNotableFigureBySlug(associatedSlug, baseFolderPath);
          if (associatedFigure) {
            // Return only basic info for associated figures
            associatedFigures.push({
              id: associatedFigure.id,
              name: associatedFigure.name,
              name_kurdish: associatedFigure.name_kurdish || null,
              century: associatedFigure.century,
              area_of_distinction: associatedFigure.area_of_distinction,
              city_born: associatedFigure.city_born,
              image_url: associatedFigure.image_url,
              image_object_position: associatedFigure.image_object_position
            });
          }
        } catch (err) {
          console.warn(`⚠️ Could not fetch associated figure ${associatedSlug}:`, err.message);
        }
      }
      figure.associated_figures = associatedFigures;
    } else {
      figure.associated_figures = [];
    }
    
    console.log(`✅ Successfully fetched notable figure: ${figureSlug}`);
    return figure;
  } catch (error) {
    console.error(`❌ Error fetching notable figure ${figureSlug}:`, error);
    throw new Error(`Failed to fetch notable figure: ${error.message || error.error?.message || 'Unknown error'}`);
  }
}

module.exports = {
  getImagesFromFolder,
  getImagesFromMultipleFolders,
  getImagesFromCollection, // NEW: Collections support
  getImageById,
  getOptimizedImageUrl,
  listRootFolders, // For debugging
  listSubfolders, // For debugging
  getEventThumbnails, // NEW: Get one thumbnail per event
  getEventImages, // NEW: Get all images from a specific event
  getNotableFigures, // NEW: Get all notable figures from Cloudinary
  getNotableFigureBySlug, // NEW: Get single notable figure by slug
  cloudinary // Export cloudinary instance for advanced usage
};

