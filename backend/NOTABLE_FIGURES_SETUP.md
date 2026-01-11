# How to Set Up Notable Figures Database Tables

## Quick Answer

**✅ Keep the SQL file! Don't delete it.**

The `.sql` file is documentation and a setup script. You run it once (or when you need to recreate the tables), but keep it for:
- Reference/documentation
- Setting up on new machines
- Version control (so others can set up the database)
- Recreating tables if needed

---

## How to Run the SQL File

You have **3 options** to run the SQL file:

### Option 1: Command Line (Recommended)

From your project root directory:

```bash
mysql -u your_username -p your_database_name < backend/NOTABLE_FIGURES_SCHEMA.sql
```

Replace:
- `your_username` - Your MySQL username (often `root`)
- `your_database_name` - Your database name (from your `.env` file, `DB_NAME`)

Example:
```bash
mysql -u root -p kcay_db < backend/NOTABLE_FIGURES_SCHEMA.sql
```

It will prompt you for your MySQL password.

---

### Option 2: MySQL Command Line Client

1. Connect to MySQL:
   ```bash
   mysql -u your_username -p
   ```

2. Select your database:
   ```sql
   USE your_database_name;
   ```

3. Run the SQL file:
   ```sql
   source backend/NOTABLE_FIGURES_SCHEMA.sql;
   ```
   Or with full path:
   ```sql
   source /Users/ARIAN/Documents/Personal/Kurdish/coding/kcay/backend/NOTABLE_FIGURES_SCHEMA.sql;
   ```

---

### Option 3: MySQL Workbench / phpMyAdmin / GUI Tool

1. Open your MySQL GUI tool (MySQL Workbench, phpMyAdmin, TablePlus, etc.)
2. Select your database
3. Open the SQL file: `backend/NOTABLE_FIGURES_SCHEMA.sql`
4. Copy and paste the contents into a SQL query window
5. Execute the query

---

## Verify It Worked

After running the SQL file, verify the tables were created:

```bash
mysql -u your_username -p your_database_name -e "SHOW TABLES;"
```

You should see:
```
+-----------------------------------+
| Tables_in_your_database           |
+-----------------------------------+
| notable_figures                   |
| notable_figure_associations       |
+-----------------------------------+
```

Or check the table structure:
```bash
mysql -u your_username -p your_database_name -e "DESCRIBE notable_figures;"
```

---

## What Happens When You Run It?

When you execute the SQL file, MySQL will:
1. Create the `notable_figures` table with all the columns
2. Create the `notable_figure_associations` table for linking related figures
3. Set up indexes and foreign key relationships

**Note:** If the tables already exist, you'll get an error. If you need to recreate them:
- Drop the tables first: `DROP TABLE notable_figure_associations; DROP TABLE notable_figures;`
- Then run the schema file again

---

## Why Keep the SQL File?

### 1. **Documentation**
   - Shows the exact table structure
   - Serves as reference for what fields exist
   - Includes helpful comments

### 2. **Version Control (Git)**
   - Other developers can set up the database easily
   - Shows how the database evolved over time
   - Part of your project's "source code"

### 3. **Setting Up New Environments**
   - Setting up on a new computer? Just run the SQL file
   - Deploying to production? Run the SQL file
   - Setting up for a teammate? They run the SQL file

### 4. **Recreating Tables**
   - If you need to reset/recreate tables
   - If you accidentally drop a table
   - For testing/development

### 5. **Database Migration History**
   - Shows what tables were added when
   - Helps track database changes
   - Useful for troubleshooting

---

## Best Practice: Organize Schema Files

Consider organizing all your schema files in a dedicated folder:

```
backend/
├── schema/
│   ├── notable_figures.sql
│   ├── events.sql (if you create one)
│   ├── products.sql (for merch feature)
│   └── ... other schema files
```

But for now, keeping it in `backend/` is perfectly fine!

---

## Summary

1. ✅ **Run the SQL file once** to create the tables
2. ✅ **Keep the file** - it's documentation and setup script
3. ✅ **Commit it to Git** - so others can use it too
4. ✅ **Reference it** when you need to remember the table structure

The SQL file is like a "recipe" for your database tables - you use it when you need to "bake" (create) them, but you keep the recipe for later!

