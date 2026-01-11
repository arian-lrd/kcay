const getInvolvedModel = require("../models/getInvolvedModel");

/**
 * Get all get-involved data
 * Returns: form links, executive positions with responsibilities, contact email
 */
const getInvolved = async (req, res, next) => {
    try {
        const data = await getInvolvedModel.getInvolvedData();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInvolved
};

