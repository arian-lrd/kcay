-- Database Schema for Get Involved Feature
-- 
-- HOW TO USE THIS FILE:
-- 1. Run this SQL file once to create the tables
-- 2. KEEP this file - it's documentation and useful for setting up on new machines
-- 3. Run from command line: mysql -u username -p database_name < backend/GET_INVOLVED_SCHEMA.sql
--
-- NOTE: If tables already exist, you'll get an error. Drop them first if needed.

-- Settings table for form links and contact email
CREATE TABLE get_involved_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'general_member_form_link', 'sponsor_form_link', etc.
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Executive positions table
CREATE TABLE executive_positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    position_name VARCHAR(255) NOT NULL, -- e.g., "President", "Vice President", "Treasurer"
    responsibilities TEXT NOT NULL, -- Detailed responsibilities for this position
    sort_order INT DEFAULT 0, -- For custom ordering
    is_open BOOLEAN DEFAULT TRUE, -- Whether this position is currently open
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_open (is_open)
);

-- Insert default settings (update these with your actual Google Form links and email)
INSERT INTO get_involved_settings (setting_key, setting_value) VALUES
    ('general_member_form_link', 'https://forms.gle/YOUR_GENERAL_MEMBER_FORM_LINK'),
    ('sponsor_form_link', 'https://forms.gle/YOUR_SPONSOR_FORM_LINK'),
    ('executive_positions_form_link', 'https://forms.gle/YOUR_EXECUTIVE_POSITIONS_FORM_LINK'),
    ('contact_email', 'contact@kcay.org');

-- Example executive positions (update with actual positions)
/*
INSERT INTO executive_positions (position_name, responsibilities, sort_order, is_open) VALUES
    ('President', 
     'Lead the organization, preside over meetings, represent KCAY at events, coordinate with other executives, make final decisions on organizational matters.', 
     1, TRUE),
    ('Vice President', 
     'Assist the President, preside over meetings in President\'s absence, oversee committee activities, manage internal communications.', 
     2, TRUE),
    ('Treasurer', 
     'Manage organization finances, track expenses and income, prepare financial reports, handle banking and budget planning.', 
     3, TRUE),
    ('Secretary', 
     'Take meeting minutes, maintain records, handle correspondence, manage membership database, coordinate event logistics.', 
     4, TRUE);
*/

-- Notes:
-- 1. Update the Google Form links in get_involved_settings with your actual form URLs
-- 2. Update the contact_email with your actual contact email
-- 3. Add executive positions using INSERT statements (see example above)
-- 4. Set is_open = FALSE for positions that are no longer available
-- 5. Use sort_order to control the display order of positions

