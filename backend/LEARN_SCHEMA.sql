-- Database Schema for Learn Feature
-- 
-- HOW TO USE THIS FILE:
-- 1. Run this SQL file once to create the tables
-- 2. KEEP this file - it's documentation and useful for setting up on new machines
-- 3. Run from command line: mysql -u username -p database_name < backend/LEARN_SCHEMA.sql
--
-- NOTE: If tables already exist, you'll get an error. Drop them first if needed.

-- Learn sections table (for future development)
-- This structure allows for adding resources, local places, discounts, etc. later
CREATE TABLE learn_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(50) UNIQUE NOT NULL, -- 'main', 'kurdish_language', 'kurdish_dance', 'kurdish_heritage'
    title VARCHAR(255) NOT NULL,
    description TEXT, -- Coming soon message or future content
    content TEXT, -- Future: Rich content, resources, etc.
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_section_key (section_key),
    INDEX idx_sort_order (sort_order)
);

-- Insert placeholder content (coming soon messages)
INSERT INTO learn_sections (section_key, title, description, sort_order) VALUES
    ('main', 'Learn', 'Learn about Kurdish culture, language, dance, and heritage. Explore our educational resources and connect with local learning opportunities.', 1),
    ('kurdish_language', 'Learn Kurdish Language', 'Learning Kurdish language is coming soon. We are working on bringing you resources, courses, and connections to local language learning opportunities.', 2),
    ('kurdish_dance', 'Learn Kurdish Dance', 'Learning Kurdish dance is coming soon. We are working on bringing you resources, classes, and connections to local dance instructors and studios.', 3),
    ('kurdish_heritage', 'Learn Kurdish Heritage', 'Learning about Kurdish heritage, history, and folklore is coming soon. We are working on bringing you educational resources and connections to cultural programs.', 4);

-- Notes:
-- 1. For now, sections contain simple "coming soon" messages
-- 2. Future enhancements can include:
--    - Resources table (links, videos, articles)
--    - Local places table (schools, instructors, studios)
--    - Discounts/promotions table
--    - User progress tracking
--    - Course materials
-- 3. The structure is designed to be extensible for future development

