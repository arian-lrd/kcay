# Database Migration Guide: Local Mac to Production Server

This guide explains how to export your local MySQL database and import it to your production server.

---

## Step 1: Export Database from Your Local Mac

### Option A: Export Entire Database (Recommended)

1. **Open Terminal on your Mac**

2. **Export the database structure and data:**
   ```bash
   mysqldump -u root -p your_database_name > kcay_database_backup.sql
   ```
   
   Replace:
   - `root` with your MySQL username (if different)
   - `your_database_name` with your actual database name (check your `.env` file, `DB_NAME`)
   
   Example:
   ```bash
   mysqldump -u root -p kcay_db > kcay_database_backup.sql
   ```
   
   It will prompt you for your MySQL password.

3. **The backup file will be created in your current directory**
   - Check that the file was created: `ls -lh kcay_database_backup.sql`
   - The file should be several KB to MB in size (depending on your data)

### Option B: Export Only Structure (Schema) - If you want to start fresh

If you want to export only the table structures without data:
```bash
mysqldump -u root -p --no-data your_database_name > kcay_database_schema.sql
```

### Option C: Export with More Options (Compressed, Better for Large Databases)

```bash
mysqldump -u root -p --single-transaction --quick --lock-tables=false your_database_name | gzip > kcay_database_backup.sql.gz
```

---

## Step 2: Transfer the Backup File to Your Production Server

You have several options:

### Option A: Using SCP (Secure Copy) - Recommended

```bash
scp kcay_database_backup.sql user@your-server-ip:/path/to/destination/
```

Replace:
- `user` with your server username (e.g., `root`, `ubuntu`, `debian`)
- `your-server-ip` with your server's IP address or domain
- `/path/to/destination/` with where you want to save it (e.g., `~/` or `/home/user/`)

Example:
```bash
scp kcay_database_backup.sql root@192.168.1.100:~/backups/
```

### Option B: Using SFTP

1. Use an SFTP client like FileZilla, Cyberduck, or Terminal:
   ```bash
   sftp user@your-server-ip
   put kcay_database_backup.sql
   ```

### Option C: Using Cloud Storage

1. Upload the file to Google Drive, Dropbox, or AWS S3
2. Download it on your production server

### Option D: Using Git (NOT Recommended for large databases)

Only use this if the backup file is small (< 10MB). Add `.sql` files to `.gitignore` in production.

---

## Step 3: Set Up MySQL on Your Production Server

### If MySQL is NOT installed on your production server:

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**On CentOS/RHEL:**
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo mysql_secure_installation
```

### Create the Database on Production Server:

1. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create the database:**
   ```sql
   CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   
   Replace `your_database_name` with your database name (same as local).

3. **Create a database user (Recommended for security):**
   ```sql
   CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'strong_password_here';
   GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_db_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## Step 4: Import Database to Production Server

1. **SSH into your production server:**
   ```bash
   ssh user@your-server-ip
   ```

2. **Navigate to where you saved the backup file:**
   ```bash
   cd ~/backups/  # or wherever you saved it
   ```

3. **Import the database:**
   ```bash
   mysql -u root -p your_database_name < kcay_database_backup.sql
   ```
   
   Or if you created a database user:
   ```bash
   mysql -u your_db_user -p your_database_name < kcay_database_backup.sql
   ```

4. **Verify the import:**
   ```bash
   mysql -u root -p -e "USE your_database_name; SHOW TABLES;"
   ```
   
   You should see all your tables listed.

---

## Step 5: Update Production Environment Variables

1. **On your production server, update `backend/.env`:**
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=strong_password_here
   DB_NAME=your_database_name
   DB_PORT=3306
   NODE_ENV=production
   PORT=3000
   ```

2. **Make sure the file is secure (only readable by the app):**
   ```bash
   chmod 600 backend/.env
   ```

---

## Step 6: Update Your Application Code (If Needed)

Make sure your production server's backend can connect to MySQL. Test the connection:

```bash
cd /path/to/your/app/backend
node -e "require('dotenv').config(); const db = require('./config/database'); setTimeout(() => process.exit(0), 2000);"
```

---

## Troubleshooting

### Issue: "Access denied" when importing

**Solution:** Make sure you're using the correct username and password, and that the user has privileges on the database.

### Issue: "Database doesn't exist"

**Solution:** Create the database first (Step 3).

### Issue: "Table already exists"

**Solution:** Either drop the existing tables first, or use `--add-drop-table` when exporting:
```bash
mysqldump -u root -p --add-drop-table your_database_name > kcay_database_backup.sql
```

### Issue: Import is very slow

**Solution:** For large databases, disable foreign key checks temporarily:
```bash
mysql -u root -p your_database_name -e "SET FOREIGN_KEY_CHECKS=0; SOURCE kcay_database_backup.sql; SET FOREIGN_KEY_CHECKS=1;"
```

Or:
```bash
mysql -u root -p your_database_name < kcay_database_backup.sql
# Then after import:
mysql -u root -p your_database_name -e "SET FOREIGN_KEY_CHECKS=1;"
```

---

## Alternative: Using MySQL Workbench or phpMyAdmin

If you prefer a GUI:

### MySQL Workbench:
1. Connect to your local database
2. Go to **Server** > **Data Export**
3. Select your database and tables
4. Export to file
5. Connect to production server
6. Go to **Server** > **Data Import**
7. Import the file

### phpMyAdmin:
1. Local: Select database → **Export** tab → **Go**
2. Save the SQL file
3. Production: Select database → **Import** tab → Choose file → **Go**

---

## Security Best Practices

1. **Never commit `.env` files or database backups to Git**
2. **Use strong passwords for production database users**
3. **Restrict database access** (only allow connections from `localhost` or your app server IP)
4. **Use SSL/TLS** for database connections in production (if possible)
5. **Regular backups**: Set up automated backups on your production server

---

## Quick Checklist

- [ ] Database exported from local Mac
- [ ] Backup file transferred to production server
- [ ] MySQL installed on production server
- [ ] Database created on production server
- [ ] Database user created (optional but recommended)
- [ ] Database imported successfully
- [ ] Tables verified
- [ ] Production `.env` file updated with correct credentials
- [ ] Application tested and connecting to database

---

## Need Help?

If you run into issues:
1. Check MySQL error logs: `sudo tail -f /var/log/mysql/error.log`
2. Verify MySQL is running: `sudo systemctl status mysql`
3. Check firewall rules (MySQL port 3306 should be accessible)
4. Verify credentials are correct in `.env` file

