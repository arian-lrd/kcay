# Database Setup Guide

## Issue: Database Connection Failed

If you see this error:
```
Error connecting to database: ECONNREFUSED
```

It means **MySQL is not running** on your system.

---

## How to Start MySQL on macOS

### Option 1: If MySQL was installed via Homebrew

```bash
brew services start mysql
```

Or:
```bash
brew services start mysql@8.0
# or
brew services start mysql@5.7
```

### Option 2: If MySQL was installed via MySQL Installer

1. Open **System Preferences** (or **System Settings** on newer macOS)
2. Look for **MySQL** in the list
3. Click **Start MySQL Server**

Or use the command line:
```bash
sudo /usr/local/mysql/support-files/mysql.server start
```

### Option 3: If MySQL is installed but not as a service

```bash
mysqld_safe --user=mysql &
```

### Option 4: Check if MySQL is installed

```bash
which mysql
mysql --version
```

If these commands don't work, MySQL might not be installed.

---

## Install MySQL (if not installed)

### Using Homebrew (Recommended)

```bash
brew install mysql
brew services start mysql
```

### Using MySQL Official Installer

1. Download from: https://dev.mysql.com/downloads/mysql/
2. Install the `.dmg` file
3. Follow the installation wizard
4. Start MySQL from System Preferences

---

## Verify MySQL is Running

After starting MySQL, verify it's running:

```bash
lsof -ti:3306
```

If you see a process ID, MySQL is running!

Or test the connection:
```bash
mysql -u root -p
```

Enter your MySQL password when prompted.

---

## Configure Your .env File

Make sure your `.env` file in the project root has the correct database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
PORT=3000
```

**Important:** Replace:
- `your_mysql_password` with your actual MySQL root password
- `your_database_name` with your actual database name

---

## Create the Database (if it doesn't exist)

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Create the database:
   ```sql
   CREATE DATABASE your_database_name;
   ```

3. Exit MySQL:
   ```sql
   exit;
   ```

---

## After Starting MySQL

1. **Restart your backend server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. **You should now see:**
   ```
   ✅ Connected to MySQL database
   Server is running on port 3000
   ```

---

## Troubleshooting

**"Command not found: mysql"**
- MySQL is not installed or not in your PATH
- Install MySQL using one of the methods above

**"Access denied for user 'root'@'localhost'"**
- Your password in `.env` is incorrect
- Update `DB_PASSWORD` in your `.env` file

**"Unknown database 'your_database_name'"**
- The database doesn't exist
- Create it using the steps above

**Port 3306 already in use**
- Another MySQL instance might be running
- Check: `lsof -ti:3306`
- Stop it: `brew services stop mysql` (if using Homebrew)

---

## Quick Start Checklist

- [ ] MySQL is installed
- [ ] MySQL service is running (`brew services list` or System Preferences)
- [ ] `.env` file exists with correct credentials
- [ ] Database exists (create it if needed)
- [ ] Backend server restarted after starting MySQL

