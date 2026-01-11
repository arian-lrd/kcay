-- Database Schema for Newsletter Feature
-- 
-- HOW TO USE THIS FILE:
-- 1. Run this SQL file once to create the tables
-- 2. KEEP this file - it's documentation and useful for setting up on new machines
-- 3. Run from command line: mysql -u username -p database_name < backend/NEWSLETTER_SCHEMA.sql
--
-- NOTE: If tables already exist, you'll get an error. Drop them first if needed.

-- Newsletter subscriptions table
CREATE TABLE newsletter_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50), -- Optional, for future SMS functionality
    job VARCHAR(255), -- Optional, e.g., "student", "teacher", etc.
    country VARCHAR(255), -- Optional
    city VARCHAR(255), -- Optional
    brevo_contact_id INT, -- Brevo contact ID (for reference)
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email),
    INDEX idx_email (email),
    INDEX idx_subscribed_at (subscribed_at)
);

-- Notes:
-- 1. Email addresses are unique (one subscription per email)
-- 2. phone_number, job, country, city are optional fields for future development
-- 3. brevo_contact_id stores the Brevo contact ID for reference/sync purposes
-- 4. All subscriptions are synced with Brevo mailing list service

