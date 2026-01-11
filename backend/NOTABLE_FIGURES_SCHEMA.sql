-- Database Schema for Notable Figures Feature
-- 
-- HOW TO USE THIS FILE:
-- 1. Run this SQL file once to create the tables
-- 2. KEEP this file - it's documentation and useful for setting up on new machines
-- 3. Run from command line: mysql -u username -p database_name < backend/NOTABLE_FIGURES_SCHEMA.sql
--    Or copy/paste into MySQL client
--
-- NOTE: If tables already exist, you'll get an error. Drop them first if needed.

-- Main table for notable figures
CREATE TABLE notable_figures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    century VARCHAR(100), -- e.g., "19th century", "20th century"
    area_of_distinction VARCHAR(255) NOT NULL, -- e.g., "Political Figure", "Poet", "Writer", "Scholar"
    city_born VARCHAR(255), -- City they were born in
    essay MEDIUMTEXT, -- Detailed essay about the figure (can store very long blog-style articles, up to ~16MB)
    education TEXT, -- Education background
    image_slug VARCHAR(255) NOT NULL, -- Image filename without extension (e.g., "saladin" for saladin.jpg)
    sort_order INT DEFAULT 0, -- For custom ordering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sort_order (sort_order)
);

-- Association table for linking related notable figures
-- This creates a many-to-many relationship between figures
CREATE TABLE notable_figure_associations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    figure_id INT NOT NULL, -- The main figure
    associated_figure_id INT NOT NULL, -- The associated figure
    FOREIGN KEY (figure_id) REFERENCES notable_figures(id) ON DELETE CASCADE,
    FOREIGN KEY (associated_figure_id) REFERENCES notable_figures(id) ON DELETE CASCADE,
    UNIQUE KEY unique_association (figure_id, associated_figure_id),
    -- Prevent a figure from being associated with itself
    CHECK (figure_id != associated_figure_id)
);

-- Example INSERT statements (replace with actual data):
/*
INSERT INTO notable_figures (name, century, area_of_distinction, city_born, education, image_slug, sort_order)
VALUES 
    ('Example Figure', '20th Century', 'Political Figure', 'Erbil', 'University of Baghdad', 'example-figure', 1);

-- To associate two figures:
INSERT INTO notable_figure_associations (figure_id, associated_figure_id)
VALUES (1, 2); -- Links figure 1 with figure 2
*/

-- Notes:
-- 1. Images should be placed in: backend/public/images/notable-figures/{image_slug}.jpg
-- 2. The essay field can be NULL initially and filled in later
-- 3. Associations are bidirectional in logic (if A is associated with B, B appears in A's associated_figures list)

