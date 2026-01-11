const db = require("../config/database");

/**
 * Check if email already exists in subscriptions
 */
async function emailExists(email) {
    const [rows] = await db.promise.query(
        `SELECT id FROM newsletter_subscriptions WHERE email = ?`,
        [email]
    );
    return rows.length > 0;
}

/**
 * Create a new newsletter subscription
 */
async function createSubscription(subscriptionData) {
    const {
        email,
        firstName,
        lastName,
        phoneNumber = null,
        job = null,
        country = null,
        city = null,
        brevoContactId = null
    } = subscriptionData;

    const [result] = await db.promise.query(
        `
        INSERT INTO newsletter_subscriptions 
        (email, first_name, last_name, phone_number, job, country, city, brevo_contact_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [email, firstName, lastName, phoneNumber, job, country, city, brevoContactId]
    );

    return {
        id: result.insertId,
        email,
        firstName,
        lastName,
        phoneNumber,
        job,
        country,
        city,
        brevoContactId
    };
}

/**
 * Update subscription with Brevo contact ID
 */
async function updateBrevoContactId(email, brevoContactId) {
    await db.promise.query(
        `UPDATE newsletter_subscriptions SET brevo_contact_id = ? WHERE email = ?`,
        [brevoContactId, email]
    );
}

/**
 * Update an existing subscription (for when user updates their info)
 */
async function updateSubscription(email, subscriptionData) {
    const {
        firstName,
        lastName,
        phoneNumber = null,
        job = null,
        country = null,
        city = null
    } = subscriptionData;

    await db.promise.query(
        `
        UPDATE newsletter_subscriptions 
        SET first_name = ?, last_name = ?, phone_number = ?, job = ?, country = ?, city = ?
        WHERE email = ?
        `,
        [firstName, lastName, phoneNumber, job, country, city, email]
    );

    return {
        email,
        firstName,
        lastName,
        phoneNumber,
        job,
        country,
        city
    };
}

module.exports = {
    emailExists,
    createSubscription,
    updateBrevoContactId,
    updateSubscription
};

