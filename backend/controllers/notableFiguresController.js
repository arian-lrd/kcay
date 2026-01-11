const notableFiguresModel = require("../models/notableFiguresModel");

/**
 * Get all notable figures for the list/grid page
 * Returns basic info: name, century, area, city, image (for hover display)
 */
const getAllNotableFigures = async (req, res, next) => {
    try {
        const figures = await notableFiguresModel.getAllNotableFigures();
        res.json(figures);
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single notable figure by ID with full details
 * Includes: name, century, area, city, essay, education, associated figures
 */
const getNotableFigure = async (req, res, next) => {
    try {
        const figure = await notableFiguresModel.getNotableFigureById(req.params.id);
        if (!figure) {
            return res.status(404).json({ error: "Notable figure not found" });
        }
        res.json(figure);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNotableFigures,
    getNotableFigure
};

