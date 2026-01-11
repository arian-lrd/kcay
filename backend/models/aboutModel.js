const db = require('../config/database');

async function getAboutParagraph() {
    // the following line will only show the latest entry in the about_page table
    const [rows] = await db.promise.query('SELECT paragraph FROM about_page ORDER BY updated_at DESC LIMIT 1');
    return [rows[0]?.paragraph || ""]; // return the paragraph or an empty string if no paragraph is found
}

async function getAboutExecutives() {
    const [rows] = await db.promise.query(
        `SELECT first_name, last_name, role, 
            CONCAT('/assets/images/executives/', photo_url, '.jpg') AS photo_url, sort_order 
            FROM executives 
            ORDER BY 
                CASE WHEN sort_order = 0 THEN 1 ELSE 0 END,
                sort_order ASC`
    );
    return rows;
}

module.exports = {
    getAboutParagraph,
    getAboutExecutives
};