-- Database Schema for Podcast Feature
-- 
-- HOW TO USE THIS FILE:
-- 1. Run this SQL file once to create the tables
-- 2. KEEP this file - it's documentation and useful for setting up on new machines
-- 3. Run from command line: mysql -u username -p database_name < backend/PODCAST_SCHEMA.sql
--
-- NOTE: If tables already exist, you'll get an error. Drop them first if needed.

-- Main table for podcast episodes
CREATE TABLE podcasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    episode_number INT NOT NULL,
    title VARCHAR(500) NOT NULL, -- e.g., "Episode 155: 2025 Hacker Stats & 2026 Goals"
    description TEXT NOT NULL, -- Short description/summary for listing pages
    release_date DATE NOT NULL, -- Release date of the episode
    youtube_url VARCHAR(500), -- Full YouTube URL
    youtube_video_id VARCHAR(50), -- YouTube video ID for embedding (extracted from URL)
    spotify_url VARCHAR(500), -- Spotify URL
    audio_url VARCHAR(500), -- Direct audio file URL for the audio player
    cover_image_slug VARCHAR(255), -- Cover image filename without extension (e.g., "episode-155-cover")
    thumbnail_image_slug VARCHAR(255), -- Thumbnail image for listing (e.g., "episode-155-thumb")
    show_notes TEXT, -- Full show notes including links, shoutouts, etc.
    duration VARCHAR(20), -- Duration in format like "00:58:49" or "58:49"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_episode_number (episode_number),
    INDEX idx_release_date (release_date),
    UNIQUE KEY unique_episode_number (episode_number)
);

-- Table for podcast timestamps
CREATE TABLE podcast_timestamps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    podcast_id INT NOT NULL,
    timestamp VARCHAR(50) NOT NULL, -- e.g., "00:00:00", "00:09:23"
    label VARCHAR(500) NOT NULL, -- e.g., "Introduction", "Command Palette, Auto-decoding, & Evenbetter"
    sort_order INT DEFAULT 0, -- For ordering timestamps
    FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
    INDEX idx_podcast_id (podcast_id),
    INDEX idx_sort_order (sort_order)
);

-- Table for podcast transcripts in different languages
CREATE TABLE podcast_transcripts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    podcast_id INT NOT NULL,
    language ENUM('english', 'kurdish_sorani', 'kurdish_kurmanji', 'farsi') NOT NULL,
    transcript_text MEDIUMTEXT NOT NULL, -- Full transcript text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_podcast_language (podcast_id, language),
    INDEX idx_podcast_id (podcast_id),
    INDEX idx_language (language)
);

-- Example INSERT statements (replace with actual data):
/*
INSERT INTO podcasts (
    episode_number, 
    title, 
    description, 
    release_date, 
    youtube_url, 
    youtube_video_id, 
    spotify_url, 
    audio_url, 
    cover_image_slug, 
    thumbnail_image_slug, 
    show_notes, 
    duration
) VALUES (
    155,
    'Episode 155: 2025 Hacker Stats & 2026 Goals',
    'Episode 155: In this episode of Critical Thinking - Bug Bounty Podcast Justin, Joseph, and Brandyn reflect on last year of Bug Bounty, and list their goals and predictions for what 2026 holds. Follow us on twitter at: https://...',
    '2026-01-01',
    'https://www.youtube.com/watch?v=VIDEO_ID',
    'VIDEO_ID',
    'https://open.spotify.com/episode/EPISODE_ID',
    'https://example.com/audio/episode-155.mp3',
    'episode-155-cover',
    'episode-155-thumb',
    'Episode 155: In this episode... [full show notes]',
    '00:58:49'
);

-- Add timestamps
INSERT INTO podcast_timestamps (podcast_id, timestamp, label, sort_order) VALUES
    (1, '00:00:00', 'Introduction', 1),
    (1, '00:09:23', 'Command Palette, Auto-decoding, & Evenbetter', 2),
    (1, '00:17:28', 'Chrome Devtools Edit as html & Raycast', 3);

-- Add transcript (English)
INSERT INTO podcast_transcripts (podcast_id, language, transcript_text) VALUES
    (1, 'english', '[00:00:00.64] - Joseph Thacker\nYou don\'t hit a deposit, you enter deposit...');
*/

-- Notes:
-- 1. Images should be placed in: backend/public/images/podcasts/{image_slug}.jpg
-- 2. youtube_video_id can be extracted from YouTube URL (the part after v=)
-- 3. show_notes can contain full text with links formatted as needed
-- 4. Episodes are ordered by episode_number (higher = newer)
-- 5. Transcripts are stored separately per language for better querying

