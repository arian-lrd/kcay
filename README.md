# Kcay Web Application

A web application with Express backend and MySQL database.

## Project Structure

```
kcay/
├── backend/                 # Express backend
│   ├── config/             # Configuration files
│   │   └── database.js     # MySQL database connection
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── frontend/               # Frontend application (to be set up)
└── package.json            # Node.js dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Make sure MySQL is installed and running on your system
2. Create a new database:
   ```sql
   CREATE DATABASE your_database_name;
   ```
3. Copy `.env.example` to `.env` and update the database credentials:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   DB_PORT=3306
   PORT=3000
   ```

### 3. Run the Server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in .env)

## API Endpoints

- `GET /` - Welcome message
- More endpoints will be added as you create routes

## Adding New Features

### Adding a New Route

1. Create a route file in `backend/routes/`
2. Create a controller file in `backend/controllers/`
3. Create a model file in `backend/models/` (if database interaction is needed)
4. Import and use the route in `backend/server.js`

Example:
```javascript
// In server.js
app.use('/api/example', require('./routes/example'));
```

## Frontend Setup

The frontend folder is ready for you to set up your preferred frontend framework (React, Vue, etc.). See `frontend/README.md` for more information.

## Development

- Backend runs on: `http://localhost:3000`
- Make sure your MySQL database is running before starting the server

