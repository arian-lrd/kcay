const db = require("../config/database");

/**
 * Get the latest podcast episode (highest episode number)
 */
async function getLatestPodcast() {
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, episode_number, title, description, release_date,
            youtube_url, youtube_video_id, spotify_url, audio_url,
            cover_image_slug, thumbnail_image_slug,
            CONCAT('/assets/images/podcasts/', COALESCE(cover_image_slug, thumbnail_image_slug, 'default-cover'), '.jpg') AS cover_image_url,
            CONCAT('/assets/images/podcasts/', COALESCE(thumbnail_image_slug, cover_image_slug, 'default-thump'), '.jpg') AS thumbnail_image_url,
            duration
        FROM podcasts
        ORDER BY episode_number DESC
        LIMIT 1
        `
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

/**
 * Get recent podcast episodes (EXCLUDING THE LATEST ONE)
 * @param {number} limit - Number of recent episodes to return (default: 5)
 */
async function getRecentPodcasts(limit = 5) {
    // First get the latest episode number
    const [latestRow] = await db.promise.query(
        `SELECT episode_number FROM podcasts ORDER BY episode_number DESC LIMIT 1`
    );

    if (latestRow.length === 0) {
        return [];
    }

    const latestEpisodeNumber = latestRow[0].episode_number;

    // Get recent episodes excluding the latest
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, episode_number, title, description, release_date,
            youtube_url, youtube_video_id, spotify_url, audio_url,
            thumbnail_image_slug, cover_image_slug,
            CONCAT('/assets/images/podcasts/', COALESCE(thumbnail_image_slug, cover_image_slug, 'default-thump'), '.jpg') AS thumbnail_image_url,
            CONCAT('/assets/images/podcasts/', COALESCE(cover_image_slug, thumbnail_image_slug, 'default-cover'), '.jpg') AS cover_image_url,
            duration
        FROM podcasts
        WHERE episode_number < ?
        ORDER BY episode_number DESC
        LIMIT ?
        `,
        [latestEpisodeNumber, limit]
    );

    return rows;
}

/**
 * Get all podcast episodes
 */
async function getAllPodcasts() {
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, episode_number, title, description, release_date,
            youtube_url, youtube_video_id, spotify_url, audio_url,
            thumbnail_image_slug, cover_image_slug,
            CONCAT('/assets/images/podcasts/', COALESCE(thumbnail_image_slug, cover_image_slug, 'default-thump'), '.jpg') AS thumbnail_image_url,
            CONCAT('/assets/images/podcasts/', COALESCE(cover_image_slug, thumbnail_image_slug, 'default-cover'), '.jpg') AS cover_image_url,
            duration
        FROM podcasts
        ORDER BY episode_number DESC
        `
    );

    return rows;
}

/**
 * Get a single podcast episode by ID with full details including timestamps
 */
async function getPodcastById(id) {
    // Get the podcast
    const [podcastRows] = await db.promise.query(
        `
        SELECT 
            id, episode_number, title, description, release_date,
            youtube_url, youtube_video_id, spotify_url, audio_url,
            cover_image_slug, thumbnail_image_slug,
            CONCAT('/assets/images/podcasts/', COALESCE(cover_image_slug, thumbnail_image_slug, 'default-cover'), '.jpg') AS cover_image_url,
            CONCAT('/assets/images/podcasts/', COALESCE(thumbnail_image_slug, cover_image_slug, 'default-thump'), '.jpg') AS thumbnail_image_url,
            show_notes, duration
        FROM podcasts
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    if (podcastRows.length === 0) {
        return null;
    }

    const podcast = podcastRows[0];

    // Get timestamps
    const [timestampRows] = await db.promise.query(
        `
        SELECT timestamp, label
        FROM podcast_timestamps
        WHERE podcast_id = ?
        ORDER BY sort_order ASC
        `,
        [id]
    );

    podcast.timestamps = timestampRows;

    return podcast;
}

/**
 * Get podcast transcript in a specific language
 * @param {number} podcastId - Podcast ID
 * @param {string} language - Language code: 'english', 'kurdish_sorani', 'kurdish_kurmanji', 'farsi'
 */
async function getPodcastTranscript(podcastId, language) {
    const [rows] = await db.promise.query(
        `
        SELECT transcript_text
        FROM podcast_transcripts
        WHERE podcast_id = ? AND language = ?
        LIMIT 1
        `,
        [podcastId, language]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0].transcript_text;
}

module.exports = {
    getLatestPodcast,
    getRecentPodcasts,
    getAllPodcasts,
    getPodcastById,
    getPodcastTranscript
};

