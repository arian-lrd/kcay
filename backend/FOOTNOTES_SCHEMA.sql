-- Database Schema for Footnotes Feature
-- 
-- HOW TO USE THIS FILE:
-- 1. Run this SQL file once to create the tables
-- 2. KEEP this file - it's documentation and useful for setting up on new machines
-- 3. Run from command line: mysql -u username -p database_name < backend/FOOTNOTES_SCHEMA.sql
--
-- NOTE: If tables already exist, you'll get an error. Drop them first if needed.

-- Settings table for footnotes (social media links and contact info)
CREATE TABLE footnotes_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'contact_us', 'instagram', 'youtube', 'linkedin', 'linktree'
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings (update these with your actual links)
INSERT INTO footnotes_settings (setting_key, setting_value) VALUES
    ('contact_us', 'contact@kcay.org'),
    ('instagram', 'https://instagram.com/kcay'),
    ('youtube', 'https://youtube.com/@kcay'),
    ('linkedin', 'https://linkedin.com/company/kcay'),
    ('linktree', 'https://linktr.ee/kcay');

-- Notes:
-- 1. Update the links in footnotes_settings with your actual social media URLs
-- 2. contact_us can be an email address or a contact form URL
-- 3. All social media links should be full URLs (https://...)
-- 4. The linktree link can be updated when weekly content changes (no need to update bottom footer every week)

