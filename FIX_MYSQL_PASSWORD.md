# Fix MySQL Password Connection Issue

## Step 1: Verify MySQL User and Password

**On your server, test if you can connect with the password:**

```bash
# Try connecting with password
mysql -u root -p
# When prompted, enter: @rianAMIRI
```

**If this works**, the password is correct and the issue is with how Node.js is reading it.

**If this fails**, the password might not be set correctly in MySQL.

---

## Step 2: Check Current MySQL User Authentication

**Connect to MySQL (if you can):**

```bash
sudo mysql -u root
# or if that doesn't work:
mysql -u root -p
```

**Once in MySQL, check the user:**

```sql
SELECT user, host, plugin, authentication_string FROM mysql.user WHERE user='root';
```

**Check what you see:**
- If `plugin` is `auth_socket` or `unix_socket`, that's the problem
- If `authentication_string` is empty, the password isn't set

---

## Step 3: Fix Authentication Method

**If the plugin is `auth_socket`, change it to use password authentication:**

```sql
-- In MySQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '@rianAMIRI';
FLUSH PRIVILEGES;
EXIT;
```

**OR if you want to use the newer caching_sha2_password (MySQL 8+):**

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY '@rianAMIRI';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 4: Handle Special Characters in Password

Your password `@rianAMIRI` has a special character `@`. In `.env` files, you might need to quote it:

**Option A: Try with quotes in .env:**

```env
DB_PASSWORD="@rianAMIRI"
```

**Option B: Or escape it:**

```env
DB_PASSWORD=\@rianAMIRI
```

**Option C: Or use single quotes (if your .env parser supports it):**

```env
DB_PASSWORD='@rianAMIRI'
```

---

## Step 5: Test Connection Again

After making changes:

```bash
cd /var/www/kcay/backend
node -e "require('dotenv').config(); const db = require('./config/database'); setTimeout(() => { console.log('Test complete'); process.exit(0); }, 2000);"
```

---

## Alternative: Create a Dedicated Database User (Recommended)

Instead of using root, create a dedicated user for your app:

**In MySQL:**

```sql
-- Create a new user
CREATE USER 'kcay_user'@'localhost' IDENTIFIED BY '@rianAMIRI';

-- Grant all privileges on your database
GRANT ALL PRIVILEGES ON kcay_db.* TO 'kcay_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW GRANTS FOR 'kcay_user'@'localhost';
EXIT;
```

**Then update your `.env`:**

```env
DB_USER=kcay_user
DB_PASSWORD=@rianAMIRI
```

This is more secure and often avoids authentication plugin issues.

---

## Quick Test Commands

**Test MySQL connection from command line:**

```bash
# Test with password
mysql -u root -p@rianAMIRI -e "SELECT 1;"

# Or interactive
mysql -u root -p
# Enter password when prompted
```

**If command line works but Node.js doesn't**, it's likely:
1. Password needs quoting in .env
2. Authentication plugin mismatch
3. Node.js mysql2 library needs different auth method

---

## Most Common Solution

Try this first - update your `.env` file with quoted password:

```env
DB_PASSWORD="@rianAMIRI"
```

Then test again.

