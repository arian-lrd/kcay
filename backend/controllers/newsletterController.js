const newsletterModel = require("../models/newsletterModel");

// Brevo API setup (conditional - only if API key is provided)
let brevoApi = null;
let contactsApi = null;

if (process.env.BREVO_API_KEY) {
    try {
        const brevo = require("@getbrevo/brevo");
        const defaultClient = brevo.ApiClient.instance;
        const apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        contactsApi = new brevo.ContactsApi();
        brevoApi = brevo;
    } catch (error) {
        console.warn("Brevo package not installed. Install with: npm install @getbrevo/brevo");
    }
}

/**
 * Subscribe to newsletter
 * Creates subscription in database and adds contact to Brevo mailing list
 */
const subscribe = async (req, res, next) => {
    try {
        const { email, firstName, lastName, phoneNumber, job, country, city } = req.body;

        // Validation
        if (!email || !firstName || !lastName) {
            return res.status(400).json({
                error: "Email, first name, and last name are required"
            });
        }

        // Email validation (basic) TODO: CHECK THE EMAIL REGEX LATER
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Invalid email address"
            });
        }

        // Check if email already exists
        const exists = await newsletterModel.emailExists(email);
        
        // Prevent unauthorized updates - reject duplicate emails
        if (exists) {
            return res.status(409).json({
                error: "This email is already subscribed to the newsletter"
            });
        }
        
        // Create new subscription
        const subscription = await newsletterModel.createSubscription({
            email,
            firstName,
            lastName,
            phoneNumber,
            job,
            country,
            city
        });

        // Add contact to Brevo
        if (contactsApi && brevoApi && process.env.BREVO_LIST_ID) {
            try {
                const createContact = new brevoApi.CreateContact();
                createContact.email = email;
                createContact.attributes = {
                    FIRSTNAME: firstName,
                    LASTNAME: lastName
                };

                // Add optional attributes if provided
                if (phoneNumber) {
                    createContact.attributes.PHONE = phoneNumber;
                }
                if (job) {
                    createContact.attributes.JOB = job;
                }
                if (country) {
                    createContact.attributes.COUNTRY = country;
                }
                if (city) {
                    createContact.attributes.CITY = city;
                }

                createContact.listIds = [parseInt(process.env.BREVO_LIST_ID)];

                // Create new contact in Brevo
                await contactsApi.createContact(createContact);

                // Note: Brevo API doesn't always return the contact ID directly
                // You may need to fetch it separately if needed
            } catch (brevoError) {
                // Log Brevo error but don't fail the request
                // Subscription is saved in database even if Brevo fails
                console.error("Brevo API error:", brevoError.message);
                
                // If contact already exists in Brevo, that's okay (idempotent)
                if (!brevoError.response || brevoError.response.statusCode !== 400) {
                    console.error("Failed to sync with Brevo, but subscription saved locally");
                }
            }
        } else {
            console.warn("Brevo API key or list ID not configured. Subscription saved locally only.");
        }

        res.status(200).json({
            message: "Successfully subscribed to newsletter",
            subscription: {
                email: subscription.email,
                firstName: subscription.firstName,
                lastName: subscription.lastName
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    subscribe
};

