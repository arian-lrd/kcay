const footnotesModel = require("../models/footnotesModel");

/**
 * Get all footnotes data (social media links and contact info)
 * Returns: contact us, instagram, youtube, linkedin, linktree
 */
const getFootnotes = async (req, res, next) => {
    try {
        const data = await footnotesModel.getFootnotesData();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFootnotes
};

