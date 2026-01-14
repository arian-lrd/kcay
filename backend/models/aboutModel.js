const db = require('../config/database');

async function getAboutParagraph(contentType = 'about_us_summary') {
    // Filter by content type: 'about_us_summary' for homepage, 'about_us_full' for about page
    const [rows] = await db.promise.query(
        'SELECT paragraph FROM about_page WHERE content = ? ORDER BY updated_at DESC LIMIT 1',
        [contentType]
    );
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