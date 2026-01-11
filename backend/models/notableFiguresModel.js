const db = require("../config/database");

// Toggle between Cloudinary and database (set USE_CLOUDINARY_FOR_NOTABLE_FIGURES=true in .env to use Cloudinary)
const USE_CLOUDINARY_ENV = process.env.USE_CLOUDINARY_FOR_NOTABLE_FIGURES;
const USE_CLOUDINARY = USE_CLOUDINARY_ENV === 'true' || USE_CLOUDINARY_ENV === true;

// Lazy-load cloudinaryService to prevent crashes if package is not installed
let cloudinaryService = null;
if (USE_CLOUDINARY) {
  try {
    cloudinaryService = require('../services/cloudinaryService');
    console.log('✅ Cloudinary service loaded for notable figures');
  } catch (error) {
    console.error('❌ Failed to load Cloudinary service:', error.message);
    console.log('💾 Falling back to database for notable figures');
  }
}

console.log('📚 Notable Figures Configuration:');
console.log('   USE_CLOUDINARY_FOR_NOTABLE_FIGURES env value:', USE_CLOUDINARY_ENV, '(type:', typeof USE_CLOUDINARY_ENV, ')');
console.log('   USE_CLOUDINARY evaluated:', USE_CLOUDINARY);

/**
 * Get all notable figures for the list page
 * Returns: id, name, century, area_of_distinction, city_born, image_url, sort_order
 */
async function getAllNotableFigures() {
    // Use Cloudinary if enabled
    if (USE_CLOUDINARY && cloudinaryService) {
        try {
            console.log('☁️ Fetching notable figures from Cloudinary...');
            const figures = await cloudinaryService.getNotableFigures('notable-figures');
            
            // Transform to match database format
            return figures.map(figure => ({
                id: figure.id,
                name: figure.name,
                name_kurdish: figure.name_kurdish || null, // Kurdish name
                nickname: figure.nickname || null, // Nickname (optional)
                century: figure.century,
                area_of_distinction: figure.area_of_distinction,
                city_born: figure.city_born,
                image_slug: figure.folder, // Use folder name as slug
                image_url: figure.image_url,
                image_object_position: figure.image_object_position || null, // Per-image positioning
                sort_order: figure.sort_order || 0
            }));
        } catch (error) {
            console.error('❌ Error fetching from Cloudinary, falling back to database:', error);
            // Fall through to database
        }
    }
    
    // Use database (default or fallback)
    console.log('💾 Fetching notable figures from database...');
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, name, century, area_of_distinction, city_born, image_slug, sort_order,
            CONCAT('/assets/images/notable-figures/', image_slug, '.jpg') AS image_url
        FROM notable_figures
        ORDER BY sort_order ASC
        `
    );
    return rows;
}

/**
 * Get a single notable figure by ID with FULL details
 * Also includes associated figures
 * Note: For Cloudinary, the ID is the folder name (slug)
 */
async function getNotableFigureById(id) {
    // Use Cloudinary if enabled
    if (USE_CLOUDINARY && cloudinaryService) {
        try {
            console.log(`☁️ Fetching notable figure ${id} from Cloudinary...`);
            const figure = await cloudinaryService.getNotableFigureBySlug(id, 'notable-figures');
            
            if (!figure) {
                return null;
            }
            
            // Transform to match database format
            return {
                id: figure.id,
                name: figure.name,
                name_kurdish: figure.name_kurdish || null,
                century: figure.century,
                area_of_distinction: figure.area_of_distinction,
                city_born: figure.city_born,
                essay: figure.essay,
                education: figure.education,
                image_slug: figure.folder,
                image_url: figure.image_url,
                image_object_position: figure.image_object_position, // Per-image positioning
                associated_figures: figure.associated_figures || []
            };
        } catch (error) {
            console.error(`❌ Error fetching ${id} from Cloudinary, falling back to database:`, error);
            // Fall through to database
        }
    }
    
    // Use database (default or fallback)
    console.log(`💾 Fetching notable figure ${id} from database...`);
    
    // Get the main figure
    const [figureRows] = await db.promise.query(
        `
        SELECT 
            id, name, century, area_of_distinction, city_born, 
            essay, education, image_slug,
            CONCAT('/assets/images/notable-figures/', image_slug, '.jpg') AS image_url
        FROM notable_figures
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    if (figureRows.length === 0) {
        return null;
    }

    const figure = figureRows[0];

    // Get associated figures
    const [associatedRows] = await db.promise.query(
        `
        SELECT 
            nf.id, nf.name, nf.century, nf.area_of_distinction, nf.city_born,
            nf.image_slug,
            CONCAT('/assets/images/notable-figures/', nf.image_slug, '.jpg') AS image_url
        FROM notable_figures nf
        INNER JOIN notable_figure_associations nfa ON nf.id = nfa.associated_figure_id
        WHERE nfa.figure_id = ?
        ORDER BY nf.name ASC
        `,
        [id]
    );
    //figure.associated_figures = array of objects that are just like the main figure object we are returning
    figure.associated_figures = associatedRows;

    return figure;
}

module.exports = {
    getAllNotableFigures,
    getNotableFigureById
};

