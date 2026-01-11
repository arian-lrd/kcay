const express = require('express');
const path = require('path');
const cors = require('cors');
// Load .env from backend directory (when running from root)
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/database');

const app = express();

// Middleware
// CORS configuration - allow requests from Next.js frontend
app.use(cors({
  origin: true, // Allow all origins in development (change to specific origins in production)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public")))

// Test database connection (non-blocking - server will start even if DB fails)
// The database connection test is handled in database.js

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});


// API Routes - all JSON endpoints under /api/v1 prefix
app.use("/api/v1/about", require("./routes/aboutRoutes"));
app.use("/api/v1/events", require("./routes/eventsRoutes"));
app.use("/api/v1/resources", require("./routes/resourcesRoutes"));
app.use("/api/v1/merch", require("./routes/merchRoutes"));
app.use("/api/v1/notable-figures", require("./routes/notableFiguresRoutes"));
app.use("/api/v1/get-involved", require("./routes/getInvolvedRoutes"));
app.use("/api/v1/footnotes", require("./routes/footnotesRoutes"));
app.use("/api/v1/podcast", require("./routes/podcastRoutes"));
app.use("/api/v1/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/v1/learn", require("./routes/learnRoutes"));

/*
    1. DONE: about - team members with their images and responsibilities
    2. DONE: Events - list of events with their images and descriptions
    3. Resources
        DONE: Gallery - list of images from different events each with a brief description
        DONE: Constitution - PDF of the constitution 
    4. DONE: Calendar
    5. DONE: Merch Tab - Placeholder (fully develop later)
    6. DONE: Notable figures - list of notable figures with their images and descriptions
        - Inside each notable figure, Name + century + area of distinction + city born in + essay on the figure + education + other figures associated with the figure
    7. DONE: Get involved 
        - General member form link
        - Sponsor form link
        - Executive positions with responsibilities popup
        - Contact email for form issues
    8. DONE: Footnotes 
        contact us, instagram, youtube, linkedin, linktree (some weekly stuff on there, would be too much to update bottom every week)
    9. DONE: Podcast
    10. DONE: Newsletter
    11. DONE: Learn 
        Kurdish language
        Kurdish dance
        Kurdish heritage

*/
// API Routes (you can add more routes here)
// app.use('/api/users', require('./routes/users'));
// app.use('/api/posts', require('./routes/posts'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  console.error('Error Stack:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  
  // Return detailed error in development, generic in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(500).json({ 
    error: err.message || 'Something went wrong!',
    ...(isDevelopment && { 
      details: err.message,
      stack: err.stack,
      code: err.code
    })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

