const db = require("../config/database");

/**
 * Get learn section by key (main, kurdish_language, kurdish_dance, kurdish_heritage)
 */
async function getLearnSection(sectionKey) {
    const [rows] = await db.promise.query(
        `
        SELECT id, section_key, title, description, content, is_active
        FROM learn_sections
        WHERE section_key = ? AND is_active = TRUE
        LIMIT 1
        `,
        [sectionKey]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

/**
 * Get all learn sections (for future use - listing all sections)
 */
async function getAllLearnSections() {
    const [rows] = await db.promise.query(
        `
        SELECT id, section_key, title, description, is_active, sort_order
        FROM learn_sections
        WHERE is_active = TRUE
        ORDER BY sort_order ASC
        `
    );

    return rows;
}

module.exports = {
    getLearnSection,
    getAllLearnSections
};

