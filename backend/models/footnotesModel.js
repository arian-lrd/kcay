const db = require("../config/database");

/**
 * Get all footnotes data (social media links and contact info)
 */
async function getFootnotesData() {
    // Get all settings (social media links and contact info)
    const [settingsRows] = await db.promise.query(
        `SELECT setting_key, setting_value FROM footnotes_settings`
    );

    // Convert settings array to object for easier access
    const settings = {};
    settingsRows.forEach(row => {
        settings[row.setting_key] = row.setting_value;
    });

    return {
        contactUs: settings.contact_us || '',
        instagram: settings.instagram || '',
        youtube: settings.youtube || '',
        linkedin: settings.linkedin || '',
        linktree: settings.linktree || ''
    };
}

module.exports = {
    getFootnotesData
};

