const resourcesModel = require('../models/resourcesModel');

const getGallery = async (req, res, next) => {
    try {
        console.log('📥 GET /api/v1/resources/gallery - Request received');
        const galleryItems = await resourcesModel.getGalleryItems();
        console.log(`✅ Gallery items fetched: ${galleryItems.length} items`);
        if (galleryItems.length > 0) {
            console.log(`📸 First item sample:`, {
                id: galleryItems[0].id,
                event_title: galleryItems[0].event_title,
                event_folder: galleryItems[0].event_folder,
                has_url: !!galleryItems[0].image_url,
                url_preview: galleryItems[0].image_url?.substring(0, 50) + '...'
            });
        }
        res.json(galleryItems);
    } catch (error) {
        console.error('❌ Error in getGallery controller:', error);
        next(error);
    }
};

const getConstitution = async (req, res, next) => {
    try {
        const constitutionPath = await resourcesModel.getConstitution();
        if (!constitutionPath) {
            return res.status(404).json({ error: 'Constitution not found' });
        }
        res.json({ file_path: constitutionPath });
    } catch (error) {
        next(error);
    }
};

const getEventImages = async (req, res, next) => {
    try {
        const { eventFolder } = req.params;
        console.log(`📥 GET /api/v1/resources/gallery/event/${eventFolder} - Request received`);
        
        if (!eventFolder) {
            return res.status(400).json({ error: 'Event folder name is required' });
        }
        
        const eventImages = await resourcesModel.getEventImages(eventFolder);
        console.log(`✅ Event images fetched: ${eventImages.length} items for event: ${eventFolder}`);
        
        res.json(eventImages);
    } catch (error) {
        console.error(`❌ Error in getEventImages controller:`, error);
        next(error);
    }
};

module.exports = {
    getGallery,
    getConstitution,
    getEventImages // NEW: Get all images from a specific event
};

