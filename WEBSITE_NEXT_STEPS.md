# Website Development Next Steps

## Current Status ✅

### Completed:
- ✅ Backend API fully functional (all endpoints on `/api/v1/`)
- ✅ Frontend setup with Next.js
- ✅ Navigation Header (responsive, with logo, mobile menu)
- ✅ Footer (with social links, organized Quick Links, logos, about text)
- ✅ Basic page structure for all routes (About, Events, Podcast, Learn, Resources, Notable Figures, Get Involved)
- ✅ API utility functions (`/frontend/src/lib/api.js`)
- ✅ Color customization system (CSS variables)

### Current State of Pages:
- All pages currently display raw JSON data (placeholder implementation)
- Pages exist but need proper UI design and layout

---

## Recommended Next Steps (Priority Order)

### Phase 1: Core Page Improvements (High Priority)

#### 1. **Home Page (`/`)**
   - **Status**: Currently shows placeholder
   - **What to Build**:
     - Hero section with welcome message
     - Featured/Upcoming Events section (using Events API)
     - Latest Podcast Episode preview
     - Quick links to key sections
     - Newsletter signup form (optional)
   - **Why First**: First impression for visitors

#### 2. **About Page (`/about`)**
   - **Status**: Shows JSON data
   - **What to Build**:
     - Display paragraph text nicely formatted
     - Executive team grid/cards:
       - Profile images
       - Names
       - Positions/titles
       - Responsibilities
     - Professional, clean layout
   - **Why Next**: Core identity page, establishes credibility

#### 3. **Events Page (`/events`)**
   - **Status**: Shows JSON data
   - **What to Build**:
     - Event listing (grid or list view)
     - Event cards with:
       - Images
       - Titles
       - Dates (formatted nicely)
       - Descriptions (truncated with "Read more")
       - Links to event detail pages
     - Filtering by upcoming/past (if applicable)
   - **Why Next**: Important for engagement

#### 4. **Event Detail Pages (`/events/[id]`)**
   - **Status**: Not created yet
   - **What to Build**:
     - Full event details
     - Image gallery
     - Date, time, location
     - Full description
     - Registration/RSVP link (if applicable)
   - **Why Next**: Completes Events feature

---

### Phase 2: Content Pages (Medium Priority)

#### 5. **Podcast Page (`/podcast`)**
   - **Status**: Shows JSON data
   - **What to Build** (based on your original requirements):
     - **Latest Episode Section**:
       - Episode title
       - Description
       - Audio player
       - Spotify/YouTube links
       - Episode cover image
     - **Recent Episodes Section**:
       - Grid of 5-6 recent episodes
       - Thumbnail images
       - Episode numbers/titles
       - Release dates
       - "Listen to Episode" links
       - "View All" button
     - Links to individual episode pages
   - **Why Next**: Important content feature

#### 6. **Podcast Episode Detail Page (`/podcast/[id]`)**
   - **Status**: Not created yet
   - **What to Build**:
     - Full episode details
     - YouTube embed (iframe)
     - Audio player
     - Spotify/YouTube links
     - Show notes (formatted)
     - Timestamps section
     - Transcript section (with language tabs: English, Kurdish Sorani, Kurdish Kurmanji, Farsi)
   - **Why Next**: Completes Podcast feature

#### 7. **Notable Figures Page (`/notable-figures`)**
   - **Status**: Shows JSON data (may have basic grid already)
   - **What to Build**:
     - Grid/list view of notable figures
     - Image thumbnails
     - Names, century, area of distinction
     - Hover effects
     - Links to detail pages
   - **Why Next**: Cultural content

#### 8. **Notable Figure Detail Page (`/notable-figures/[id]`)**
   - **Status**: Not created yet
   - **What to Build**:
     - Large image
     - Full name and metadata (century, area, city)
     - Education section
     - Essay/content
     - Associated figures links
   - **Why Next**: Completes Notable Figures feature

---

### Phase 3: Interactive Features (Medium Priority)

#### 9. **Get Involved Page (`/get-involved`)**
   - **Status**: Shows JSON data
   - **What to Build**:
     - Three sections:
       1. **General Members**: Button linking to form
       2. **Sponsors**: Button linking to form
       3. **Executive Positions**:
          - List of open positions
          - "Responsibilities" button for each (opens popup/modal)
          - Link to application form
     - Contact email at bottom
   - **Why Next**: Important for membership/engagement

#### 10. **Learn Main Page (`/learn`)**
   - **Status**: Shows "Coming soon" placeholder
   - **What to Build**:
     - Introduction text about the learn section
     - Three cards/links to sub-pages:
       - Kurdish Language
       - Kurdish Dance
       - Kurdish Heritage
   - **Why Next**: Navigation/placeholder ready

#### 11. **Learn Sub-Pages (`/learn/kurdish-language`, `/learn/kurdish-dance`, `/learn/kurdish-heritage`)**
   - **Status**: Show "Coming soon" placeholders
   - **What to Build** (for future):
     - Resource listings
     - Local teacher connections
     - Discounts/coupons
     - Contact information
   - **Why Next**: Can stay as placeholders for now

#### 12. **Resources Page (`/resources`)**
   - **Status**: Shows JSON data
   - **What to Build**:
     - Gallery section (image grid)
     - Constitution download link/button
     - Organized, clean layout
   - **Why Next**: Supporting content

---

### Phase 4: Enhanced Features (Lower Priority)

#### 13. **Newsletter Signup Form**
   - **Status**: Backend ready, no frontend component
   - **What to Build**:
     - Form component (reusable)
     - Fields: email, first name, last name
     - Optional: phone, job, country, city
     - Success/error handling
     - Integration with Brevo API
   - **Where to Add**:
     - Footer (optional)
     - Home page
     - Dedicated page (optional)
   - **Why Later**: Nice-to-have, not critical for launch

#### 14. **Search Functionality** (Optional)
   - Search across events, podcasts, notable figures
   - Search bar in header

#### 15. **Image Optimization**
   - Use Next.js `Image` component for better performance
   - Optimize image loading

---

## Design & Styling Considerations

### Throughout All Phases:
- **Responsive Design**: Ensure all pages work on mobile, tablet, desktop
- **Consistent Styling**: Use your color palette (CSS variables)
- **Loading States**: Show loading indicators while fetching data
- **Error Handling**: Graceful error messages if API calls fail
- **Accessibility**: Proper alt text, semantic HTML, keyboard navigation

---

## Quick Wins (Can Do Anytime)

1. **Replace placeholder JSON displays** with basic formatted text
2. **Add loading states** to all pages
3. **Add error handling** to all API calls
4. **Improve typography** (better font sizes, line heights)
5. **Add spacing/padding** improvements

---

## Recommended Starting Point

**Start with the Home Page** - it's the first thing visitors see and sets the tone for the entire website.

Then proceed with:
1. Home Page
2. About Page (builds trust)
3. Events Page (drives engagement)
4. Event Detail Pages
5. Continue with other content pages...

---

## Questions to Consider

1. **Do you have design mockups or a design system?** (colors, fonts, spacing)
2. **Do you have images ready?** (logo, event images, team photos, podcast covers)
3. **What's your timeline/goal?** (MVP launch vs. full-featured site)
4. **Any specific features that are must-haves vs. nice-to-haves?**

---

## Need Help?

When you're ready to start building a specific page, just let me know which one and I can help you:
- Design the layout
- Fetch and display the data
- Style it consistently
- Add interactivity
- Make it responsive


