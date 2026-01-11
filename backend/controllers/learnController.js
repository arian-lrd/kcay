const learnModel = require("../models/learnModel");

/**
 * Get main learn page content
 */
const getMainLearn = async (req, res, next) => {
    try {
        const section = await learnModel.getLearnSection('main');
        if (!section) {
            return res.status(404).json({ error: "Learn section not found" });
        }
        res.json({
            title: section.title,
            description: section.description,
            content: section.content
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Kurdish Language section
 */
const getKurdishLanguage = async (req, res, next) => {
    try {
        const section = await learnModel.getLearnSection('kurdish_language');
        if (!section) {
            return res.status(404).json({ error: "Learn section not found" });
        }
        res.json({
            title: section.title,
            description: section.description,
            content: section.content
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Kurdish Dance section
 */
const getKurdishDance = async (req, res, next) => {
    try {
        const section = await learnModel.getLearnSection('kurdish_dance');
        if (!section) {
            return res.status(404).json({ error: "Learn section not found" });
        }
        res.json({
            title: section.title,
            description: section.description,
            content: section.content
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Kurdish Heritage section
 */
const getKurdishHeritage = async (req, res, next) => {
    try {
        const section = await learnModel.getLearnSection('kurdish_heritage');
        if (!section) {
            return res.status(404).json({ error: "Learn section not found" });
        }
        res.json({
            title: section.title,
            description: section.description,
            content: section.content
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMainLearn,
    getKurdishLanguage,
    getKurdishDance,
    getKurdishHeritage
};

