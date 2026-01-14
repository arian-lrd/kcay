const aboutModel = require('../models/aboutModel');

/* ----- reusable data functions ----- */
const fetchAboutParagraph = async (contentType = 'about_us_summary') => {
  return await aboutModel.getAboutParagraph(contentType);
}

const fetchAboutExecutives = async () => {
  return await aboutModel.getAboutExecutives();
};

/* ----- route handlers ----- */

const getAboutParagraph = async (req, res, next) => {
  try {
    const paragraph = await fetchAboutParagraph();
    res.json(paragraph);
  } catch(error) {
    next(error);
  }
}; 

const getAboutExecutives = async (req, res, next) => {
  try {
    const executives = await fetchAboutExecutives();
    res.json(executives);
  } catch(error) {
    next(error);
  }
};

const getAboutPage = async (req, res, next) => {
    try {
      // Get content type from query parameter, default to 'about_us_full' for about page
      const contentType = req.query.content || 'about_us_full';
      console.log('Fetching about page data...', contentType);
      const [paragraph, executives] = await Promise.all([
        fetchAboutParagraph(contentType),
        fetchAboutExecutives()
      ]);
  
      console.log('About data fetched - Paragraph:', paragraph, 'Executives:', executives.length);
      res.json({ paragraph, executives });
    } catch (error) {
      console.error('Error in getAboutPage:', error);
      next(error);
    }
  };





module.exports = {
    getAboutParagraph,
    getAboutExecutives,
    getAboutPage
};