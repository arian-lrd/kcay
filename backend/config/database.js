const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection -- keep for production but OPTIONAL for development
//  if you keep it and something goes wrong, the connection will fail and the server will not start
pool.getConnection((err, connection) => {
  if (err) {
    // Extract error message - handle AggregateError and regular errors
    let errorMsg = err.message || err.toString();
    if (err.code) {
      errorMsg = `${err.code}: ${errorMsg}`;
    }
    
    console.error('\n⚠️  Database connection error:', errorMsg);
    
    // Show specific error code details
    if (err.code === 'ECONNREFUSED') {
      console.error('   → MySQL server is not running or not accessible on port', process.env.DB_PORT || 3306);
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.error('   → Database credentials are incorrect. Check your .env file.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   → Database does not exist. Create it first.');
    }
    
    console.error('\n📋 To fix this issue:');
    console.error('   1. Make sure MySQL is running on your system');
    console.error('   2. Check your .env file has correct database credentials:');
    console.error(`      DB_HOST=${process.env.DB_HOST || 'localhost'}`);
    console.error(`      DB_USER=${process.env.DB_USER || 'root'}`);
    console.error(`      DB_PASSWORD=${process.env.DB_PASSWORD ? '***' : 'your_password'}`);
    console.error(`      DB_NAME=${process.env.DB_NAME || 'your_database_name'}`);
    console.error(`      DB_PORT=${process.env.DB_PORT || 3306}`);
    console.error('   3. Start MySQL:');
    console.error('      - macOS: brew services start mysql (or check System Preferences)');
    console.error('      - Linux: sudo systemctl start mysql');
    console.error('      - Windows: Start MySQL service from Services');
    console.error('\n⚠️  Server will continue running, but API endpoints requiring database will fail.\n');
  } else {
    console.log('✅ Connected to MySQL database');
    connection.release();
  }
});

// Export both callback and promise-based pools
// Export the real Pool instance so methods like getConnection/query work.
// Attach the promise-based pool as a property for async/await usage.
pool.promisePool = promisePool;
pool.promise = promisePool;
module.exports = pool;