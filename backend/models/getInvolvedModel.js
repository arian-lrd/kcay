const db = require("../config/database");

/**
 * Get all get-involved data including form links, positions, and contact email
 */
async function getInvolvedData() {
    // Get all settings (form links and contact email)
    const [settingsRows] = await db.promise.query(
        `SELECT setting_key, setting_value FROM get_involved_settings`
    );

    // Convert settings array to object for easier access
    const settings = {};
    settingsRows.forEach(row => {
        settings[row.setting_key] = row.setting_value;
    });

    // Get all open executive positions
    const [positionsRows] = await db.promise.query(
        `
        SELECT id, position_name, responsibilities, sort_order
        FROM executive_positions
        WHERE is_open = TRUE
        ORDER BY sort_order ASC
        `
    );

    return {
        generalMemberFormLink: settings.general_member_form_link || '',
        sponsorFormLink: settings.sponsor_form_link || '',
        executivePositionsFormLink: settings.executive_positions_form_link || '',
        contactEmail: settings.contact_email || '',
        executivePositions: positionsRows.map(pos => ({
            id: pos.id,
            positionName: pos.position_name,
            responsibilities: pos.responsibilities
        }))
    };
}

module.exports = {
    getInvolvedData
};

