# Newsletter API Documentation

## Overview

The Newsletter API provides endpoints for subscribing users to the newsletter mailing list. The system integrates with Brevo (formerly Sendinblue) as the mailing list service provider, while also storing subscription data locally in the database.

## Prerequisites

1. **Brevo Account**: You need a Brevo account with an API key and mailing list set up
2. **Node.js Package**: Install the Brevo Node.js SDK:
   ```bash
   npm install @getbrevo/brevo
   ```

## Database Setup

First, run the SQL schema file to create the tables:
```bash
mysql -u your_user -p your_database < backend/NEWSLETTER_SCHEMA.sql
```

## Brevo Setup

### 1. Get Your Brevo API Key

1. Log in to your Brevo account
2. Go to **Settings** > **API Keys**
3. Create a new API key (or use an existing one)
4. Copy the API key

### 2. Get Your Brevo List ID

1. In Brevo, go to **Contacts** > **Lists**
2. Create a new list (or use an existing one)
3. Click on the list to view details
4. The List ID is shown in the URL or list details (e.g., if URL is `https://app.brevo.com/lists/2`, the ID is `2`)

### 3. Configure Custom Attributes (Optional)

If you want to store additional fields (phone, job, country, city) in Brevo:

1. Go to **Contacts** > **Attributes**
2. Create custom attributes if they don't exist:
   - `PHONE` (phone number)
   - `JOB` (job title/occupation)
   - `COUNTRY` (country)
   - `CITY` (city)

**Note**: `FIRSTNAME` and `LASTNAME` are default attributes and don't need to be created.

### 4. Add Environment Variables

Add these to your `.env` file:

```env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_LIST_ID=your_brevo_list_id_here
```

**Note**: The API will still work without these environment variables, but subscriptions will only be saved locally in the database and won't be synced with Brevo.

## API Endpoint

### Subscribe to Newsletter

**Endpoint:** `POST /newsletter/subscribe`

**Description:** Subscribes a user to the newsletter. Creates a new subscription and syncs with Brevo mailing list. Duplicate email addresses are rejected to prevent unauthorized updates.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",  // Optional
  "job": "student",              // Optional
  "country": "United States",    // Optional
  "city": "New York"             // Optional
}
```

**Required Fields:**
- `email` (string): Valid email address
- `firstName` (string): First name
- `lastName` (string): Last name

**Optional Fields:**
- `phoneNumber` (string): Phone number (for future SMS functionality)
- `job` (string): Job title/occupation (e.g., "student", "teacher")
- `country` (string): Country name
- `city` (string): City name

**Success Response (200):**
```json
{
  "message": "Successfully subscribed to newsletter",
  "subscription": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**

**400 Bad Request** - Missing required fields:
```json
{
  "error": "Email, first name, and last name are required"
}
```

**400 Bad Request** - Invalid email:
```json
{
  "error": "Invalid email address"
}
```

**409 Conflict** - Email already subscribed:
```json
{
  "error": "This email is already subscribed to the newsletter"
}
```

**500 Internal Server Error** - Server/database error:
```json
{
  "error": "Something went wrong!"
}
```

## Frontend Implementation

### HTML Form Example

```html
<form id="newsletter-form">
  <div>
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div>
    <label for="firstName">First Name *</label>
    <input type="text" id="firstName" name="firstName" required>
  </div>
  
  <div>
    <label for="lastName">Last Name *</label>
    <input type="text" id="lastName" name="lastName" required>
  </div>
  
  <!-- Optional fields for future development -->
  <div>
    <label for="phoneNumber">Phone Number</label>
    <input type="tel" id="phoneNumber" name="phoneNumber">
  </div>
  
  <div>
    <label for="job">Job/Occupation</label>
    <input type="text" id="job" name="job" placeholder="e.g., student, teacher">
  </div>
  
  <div>
    <label for="country">Country</label>
    <input type="text" id="country" name="country">
  </div>
  
  <div>
    <label for="city">City</label>
    <input type="text" id="city" name="city">
  </div>
  
  <button type="submit">Subscribe</button>
</form>

<div id="message"></div>

<script>
  document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      email: document.getElementById('email').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      phoneNumber: document.getElementById('phoneNumber').value || null,
      job: document.getElementById('job').value || null,
      country: document.getElementById('country').value || null,
      city: document.getElementById('city').value || null
    };
    
    try {
      const response = await fetch('/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        document.getElementById('message').textContent = data.message;
        document.getElementById('message').style.color = 'green';
        document.getElementById('newsletter-form').reset();
      } else {
        document.getElementById('message').textContent = data.error;
        document.getElementById('message').style.color = 'red';
      }
    } catch (error) {
      document.getElementById('message').textContent = 'An error occurred. Please try again.';
      document.getElementById('message').style.color = 'red';
    }
  });
</script>
```

### React Example

```jsx
import React, { useState } from 'react';

function NewsletterForm() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    job: '',
    country: '',
    city: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          phoneNumber: formData.phoneNumber || null,
          job: formData.job || null,
          country: formData.country || null,
          city: formData.city || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          job: '',
          country: '',
          city: ''
        });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>First Name *</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Last Name *</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Optional fields */}
      <div>
        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Job/Occupation</label>
        <input
          type="text"
          name="job"
          value={formData.job}
          onChange={handleChange}
          placeholder="e.g., student, teacher"
        />
      </div>

      <div>
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>

      {message && <div>{message}</div>}
    </form>
  );
}

export default NewsletterForm;
```

## Behavior Notes

### Duplicate Email Handling

- If a user tries to subscribe with an email that already exists, the request is **rejected** with a 409 Conflict status
- This prevents unauthorized users from updating someone else's subscription information
- The error message: "This email is already subscribed to the newsletter"
- This security measure protects user privacy and prevents data tampering

### Brevo Integration

- Subscriptions are **always saved** in the local database, even if Brevo API fails
- If Brevo API key or List ID is not configured, subscriptions work locally only
- The system logs warnings if Brevo integration fails, but doesn't fail the request
- This ensures the subscription form always works, even if Brevo is temporarily unavailable

### Optional Fields

- Optional fields (`phoneNumber`, `job`, `country`, `city`) are stored in the database
- They are only sent to Brevo if:
  1. The field has a value
  2. The corresponding attribute exists in your Brevo account
- These fields are ready for future development (e.g., SMS campaigns, segmentation)

## Data Fields

### Newsletter Subscriptions Table

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | INT | Primary key | Auto |
| `email` | VARCHAR(255) | Email address | Yes (unique) |
| `first_name` | VARCHAR(255) | First name | Yes |
| `last_name` | VARCHAR(255) | Last name | Yes |
| `phone_number` | VARCHAR(50) | Phone number | No |
| `job` | VARCHAR(255) | Job/occupation | No |
| `country` | VARCHAR(255) | Country | No |
| `city` | VARCHAR(255) | City | No |
| `brevo_contact_id` | INT | Brevo contact ID | No |
| `subscribed_at` | TIMESTAMP | Subscription timestamp | Auto |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto |

## Error Handling

- **400**: Bad request (missing required fields, invalid email)
- **500**: Server error (database issues, unexpected errors)

The API is designed to be resilient - subscriptions are saved locally even if external services (Brevo) fail.

## Security Considerations

- Email addresses are validated before processing
- All inputs should be sanitized on the frontend (XSS prevention)
- Consider adding rate limiting to prevent abuse
- Consider adding CAPTCHA for spam prevention
- Ensure compliance with GDPR and other data protection regulations
- Provide unsubscribe functionality (can be added as future enhancement)

## Future Enhancements

Possible future features:
- Unsubscribe endpoint
- Email verification (double opt-in)
- SMS subscription management (using Brevo SMS API)
- Subscription preferences/segmentation
- Subscription history/audit log
- Admin endpoint to view/manage subscriptions

