# Get Involved API Documentation

## Overview

The Get Involved API provides all the data needed for the "Get Involved" page, including form links, executive positions with responsibilities, and contact information.

## Database Setup

First, run the SQL schema file to create the tables:
```bash
mysql -u your_user -p your_database < backend/GET_INVOLVED_SCHEMA.sql
```

Then update the settings with your actual Google Form links and email:
```sql
UPDATE get_involved_settings SET setting_value = 'YOUR_ACTUAL_FORM_LINK' WHERE setting_key = 'general_member_form_link';
UPDATE get_involved_settings SET setting_value = 'YOUR_ACTUAL_FORM_LINK' WHERE setting_key = 'sponsor_form_link';
UPDATE get_involved_settings SET setting_value = 'YOUR_ACTUAL_FORM_LINK' WHERE setting_key = 'executive_positions_form_link';
UPDATE get_involved_settings SET setting_value = 'your-email@kcay.org' WHERE setting_key = 'contact_email';
```

## API Endpoint

### Get Involved Data

**Endpoint:** `GET /get-involved`

**Description:** Returns all get-involved data including form links, executive positions, and contact email.

**Response:**
```json
{
  "generalMemberFormLink": "https://forms.gle/YOUR_GENERAL_MEMBER_FORM_LINK",
  "sponsorFormLink": "https://forms.gle/YOUR_SPONSOR_FORM_LINK",
  "executivePositionsFormLink": "https://forms.gle/YOUR_EXECUTIVE_POSITIONS_FORM_LINK",
  "contactEmail": "contact@kcay.org",
  "executivePositions": [
    {
      "id": 1,
      "positionName": "President",
      "responsibilities": "Lead the organization, preside over meetings, represent KCAY at events, coordinate with other executives, make final decisions on organizational matters."
    },
    {
      "id": 2,
      "positionName": "Vice President",
      "responsibilities": "Assist the President, preside over meetings in President's absence, oversee committee activities, manage internal communications."
    },
    {
      "id": 3,
      "positionName": "Treasurer",
      "responsibilities": "Manage organization finances, track expenses and income, prepare financial reports, handle banking and budget planning."
    }
  ]
}
```

## Frontend Implementation

### Page Structure

The page should have three main sections:

1. **General Members Section**
   - Header: "Become a General Member"
   - Link button to `generalMemberFormLink`

2. **Sponsors Section**
   - Header: "Become a Sponsor" or "Contribute"
   - Link button to `sponsorFormLink`

3. **Executive Positions Section**
   - Text: "The following positions are open:"
   - Bullet list of positions, each with:
     - Position name
     - "Responsibilities" button (opens popup)
   - Link to `executivePositionsFormLink` (for applying to positions)

4. **Footer Text**
   - "In case the forms do not work, contact us at {contactEmail}"

### React Example Implementation

```jsx
import React, { useState, useEffect } from 'react';

function GetInvolved() {
  const [data, setData] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch('/get-involved')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const handleResponsibilitiesClick = (position) => {
    setSelectedPosition(position);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPosition(null);
  };

  return (
    <div className="get-involved-page">
      {/* General Members Section */}
      <section className="general-members">
        <h2>Become a General Member</h2>
        <a 
          href={data.generalMemberFormLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="form-link-button"
        >
          Join as General Member
        </a>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors">
        <h2>Become a Sponsor</h2>
        <a 
          href={data.sponsorFormLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="form-link-button"
        >
          Become a Sponsor
        </a>
      </section>

      {/* Executive Positions Section */}
      <section className="executive-positions">
        <h2>Executive Positions</h2>
        <p>The following positions are open:</p>
        
        <ul className="positions-list">
          {data.executivePositions.map(position => (
            <li key={position.id} className="position-item">
              <span className="position-name">{position.positionName}</span>
              <button 
                className="responsibilities-button"
                onClick={() => handleResponsibilitiesClick(position)}
              >
                Responsibilities
              </button>
            </li>
          ))}
        </ul>

        <a 
          href={data.executivePositionsFormLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="form-link-button"
        >
          Apply for Executive Positions
        </a>
      </section>

      {/* Responsibilities Popup */}
      {showPopup && selectedPosition && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>{selectedPosition.positionName} - Responsibilities</h3>
              <button className="close-button" onClick={closePopup}>×</button>
            </div>
            <div className="popup-body">
              <p>{selectedPosition.responsibilities}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Contact Text */}
      <footer className="contact-footer">
        <p>
          In case the forms do not work, contact us at{' '}
          <a href={`mailto:${data.contactEmail}`}>{data.contactEmail}</a>
        </p>
      </footer>
    </div>
  );
}

export default GetInvolved;
```

### CSS Example for Popup

```css
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
}

.close-button:hover {
  color: #000;
}

.popup-body {
  line-height: 1.6;
}

.positions-list {
  list-style: none;
  padding: 0;
}

.position-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.responsibilities-button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.responsibilities-button:hover {
  background: #0056b3;
}

.form-link-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
}

.form-link-button:hover {
  background: #218838;
}
```

### Vanilla JavaScript Example (No Framework)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Get Involved</title>
  <style>
    /* Add CSS from above */
  </style>
</head>
<body>
  <div id="get-involved-content"></div>

  <script>
    fetch('/get-involved')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('get-involved-content');
        
        // General Members
        container.innerHTML += `
          <section>
            <h2>Become a General Member</h2>
            <a href="${data.generalMemberFormLink}" target="_blank" class="form-link-button">
              Join as General Member
            </a>
          </section>
        `;

        // Sponsors
        container.innerHTML += `
          <section>
            <h2>Become a Sponsor</h2>
            <a href="${data.sponsorFormLink}" target="_blank" class="form-link-button">
              Become a Sponsor
            </a>
          </section>
        `;

        // Executive Positions
        let positionsHTML = `
          <section>
            <h2>Executive Positions</h2>
            <p>The following positions are open:</p>
            <ul class="positions-list">
        `;
        
        data.executivePositions.forEach(position => {
          positionsHTML += `
            <li class="position-item">
              <span>${position.positionName}</span>
              <button onclick="showResponsibilities(${position.id}, '${position.positionName.replace(/'/g, "\\'")}', '${position.responsibilities.replace(/'/g, "\\'")}')">
                Responsibilities
              </button>
            </li>
          `;
        });
        
        positionsHTML += `
            </ul>
            <a href="${data.executivePositionsFormLink}" target="_blank" class="form-link-button">
              Apply for Executive Positions
            </a>
          </section>
        `;
        
        container.innerHTML += positionsHTML;

        // Footer
        container.innerHTML += `
          <footer>
            <p>In case the forms do not work, contact us at 
              <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>
            </p>
          </footer>
        `;
      });

    function showResponsibilities(id, name, responsibilities) {
      const popup = document.createElement('div');
      popup.className = 'popup-overlay';
      popup.onclick = function(e) {
        if (e.target === popup) {
          document.body.removeChild(popup);
        }
      };
      
      popup.innerHTML = `
        <div class="popup-content" onclick="event.stopPropagation()">
          <div class="popup-header">
            <h3>${name} - Responsibilities</h3>
            <button class="close-button" onclick="this.closest('.popup-overlay').remove()">×</button>
          </div>
          <div class="popup-body">
            <p>${responsibilities}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(popup);
    }
  </script>
</body>
</html>
```

## Adding/Updating Executive Positions

### Add a New Position

```sql
INSERT INTO executive_positions (position_name, responsibilities, sort_order, is_open)
VALUES (
    'Secretary',
    'Take meeting minutes, maintain records, handle correspondence, manage membership database, coordinate event logistics.',
    4,
    TRUE
);
```

### Update Responsibilities

```sql
UPDATE executive_positions 
SET responsibilities = 'Updated responsibilities text here...'
WHERE id = 1;
```

### Close a Position (No Longer Available)

```sql
UPDATE executive_positions 
SET is_open = FALSE 
WHERE id = 1;
```

### Update Form Links or Contact Email

```sql
UPDATE get_involved_settings 
SET setting_value = 'https://forms.gle/NEW_LINK' 
WHERE setting_key = 'general_member_form_link';
```

## Notes

- All form links open in a new tab (`target="_blank"`)
- The popup should be dismissible by clicking outside or the close button
- The responsibilities popup shows the full text for each position
- Positions are ordered by `sort_order` (ascending)
- Only positions with `is_open = TRUE` are returned by the API
- The contact email is displayed at the bottom for form troubleshooting

