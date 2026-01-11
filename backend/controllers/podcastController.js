const podcastModel = require("../models/podcastModel");

/**
 * Get latest podcast episode
 */
const getLatestPodcast = async (req, res, next) => {
    try {
        const podcast = await podcastModel.getLatestPodcast();
        if (!podcast) {
            return res.status(404).json({ error: "No podcasts found" });
        }
        res.json(podcast);
    } catch (error) {
        next(error);
    }
};

/**
 * Get recent podcast episodes (excluding latest)
 * Query param: limit (default: 5)
 */
const getRecentPodcasts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const podcasts = await podcastModel.getRecentPodcasts(limit);
        res.json(podcasts);
    } catch (error) {
        next(error);
    }
};

/**
 * Get all podcast episodes
 */
const getAllPodcasts = async (req, res, next) => {
    try {
        const podcasts = await podcastModel.getAllPodcasts();
        res.json(podcasts);
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single podcast episode by ID with full details
 */
const getPodcastById = async (req, res, next) => {
    try {
        const podcast = await podcastModel.getPodcastById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ error: "Podcast episode not found" });
        }
        res.json(podcast);
    } catch (error) {
        next(error);
    }
};

/**
 * Get podcast transcript in a specific language
 */
const getPodcastTranscript = async (req, res, next) => {
    try {
        const { id, language } = req.params;
        const validLanguages = ['english', 'kurdish_sorani', 'kurdish_kurmanji', 'farsi'];
        
        if (!validLanguages.includes(language)) {
            return res.status(400).json({ error: "Invalid language. Must be one of: english, kurdish_sorani, kurdish_kurmanji, farsi" });
        }

        const transcript = await podcastModel.getPodcastTranscript(id, language);
        if (!transcript) {
            return res.status(404).json({ error: "Transcript not found for this language" });
        }

        res.json({
            podcastId: parseInt(id),
            language: language,
            transcript: transcript
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLatestPodcast,
    getRecentPodcasts,
    getAllPodcasts,
    getPodcastById,
    getPodcastTranscript
};

