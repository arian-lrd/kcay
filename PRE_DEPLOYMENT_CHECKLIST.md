# Pre-Deployment Checklist

Before deploying your website to the server, complete these tasks:

## 1. ✅ Code & Git

- [ ] **Commit all changes to Git**
  ```bash
  git add .
  git commit -m "Final pre-deployment commit"
  git push origin main
  ```

- [ ] **Review code for any TODO comments or debug code**
  - Remove console.log statements (or leave for production debugging if needed)
  - Remove test/dummy data
  - Remove commented-out code

## 2. 🔐 Environment Variables

### Backend Environment Variables (`backend/.env`)

Create/verify your production `.env` file with:

```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Server Port (optional - defaults to 3000)
PORT=3000

# Cloudinary (if using)
USE_CLOUDINARY=true
USE_CLOUDINARY_COLLECTION=false
CLOUDINARY_COLLECTION_NAME=
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cloudinary Notable Figures (if using)
USE_CLOUDINARY_FOR_NOTABLE_FIGURES=true

# Newsletter/Brevo (if using)
BREVO_API_KEY=your_brevo_key
```

### Frontend Environment Variables (`frontend/.env.local`)

Create `.env.local` with:

```env
# Backend API URL (production URL)
NEXT_PUBLIC_API_URL=http://your-domain.com:3000/api/v1
# OR if using same domain:
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
```

**⚠️ IMPORTANT**: 
- Never commit `.env` or `.env.local` files to Git (they should be in `.gitignore`)
- Use different credentials for production vs development
- Keep credentials secure and don't share them

## 3. 🗄️ Database Setup

- [ ] **Backup your development database** (if you have important data)

- [ ] **Create production database** on your server:
  ```sql
  CREATE DATABASE your_production_db_name;
  CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'strong_password';
  GRANT ALL PRIVILEGES ON your_production_db_name.* TO 'your_db_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

- [ ] **Run all SQL schema files** in order:
  - `backend/GET_INVOLVED_SCHEMA.sql`
  - `backend/LEARN_SCHEMA.sql`
  - `backend/NEWSLETTER_SCHEMA.sql`
  - `backend/NOTABLE_FIGURES_SCHEMA.sql`
  - `backend/PODCAST_SCHEMA.sql`
  - `backend/RESOURCES_SCHEMA.sql`
  - `backend/FOOTNOTES_SCHEMA.sql`
  - Any other schema files you have

- [ ] **Import any initial data** (if needed)
  - Events data
  - Podcasts data
  - Notable figures data
  - About page data
  - Footer/social links (footnotes)

## 4. ☁️ Cloudinary Setup (if using)

- [ ] **Verify Cloudinary credentials** work in production
- [ ] **Upload all images** to Cloudinary:
  - Gallery images (in correct folder structure)
  - Notable figures images and JSON files
  - Any other images used on the site

- [ ] **Test Cloudinary API access** from your server
  ```bash
  # Test from server
  curl -X GET "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/resources/image?max_results=1" \
    -u YOUR_API_KEY:YOUR_API_SECRET
  ```

## 5. 🔧 Server Requirements

### Node.js & npm
- [ ] **Install Node.js** (version 18 or higher recommended)
  ```bash
  node --version  # Should be 18+ 
  npm --version
  ```

### MySQL
- [ ] **Install MySQL** on server
- [ ] **Start MySQL service**
  ```bash
  sudo systemctl start mysql
  sudo systemctl enable mysql  # Start on boot
  ```

### Process Manager (PM2 recommended)
- [ ] **Install PM2 globally**
  ```bash
  npm install -g pm2
  ```

## 6. 📦 Dependencies

- [ ] **Verify all dependencies** are in `package.json` files
- [ ] **Test npm install** locally to ensure no issues:
  ```bash
  # Backend
  cd backend
  npm install
  
  # Frontend
  cd frontend
  npm install
  ```

## 7. 🏗️ Build Configuration

- [ ] **Test production build locally**:
  ```bash
  # Frontend
  cd frontend
  npm run build
  npm start  # Test production build
  ```

- [ ] **Verify build succeeds** without errors

## 8. 🔒 Security Considerations

- [ ] **Review CORS settings** in `backend/server.js`
  - In production, specify exact origins instead of allowing all
  ```javascript
  // Production example:
  origin: ['https://your-domain.com', 'https://www.your-domain.com']
  ```

- [ ] **Use strong database passwords**
- [ ] **Use HTTPS** (SSL certificates)
- [ ] **Keep `.env` files secure** (proper file permissions)
  ```bash
  chmod 600 backend/.env
  chmod 600 frontend/.env.local
  ```

- [ ] **Review API endpoints** - ensure sensitive endpoints are protected if needed

## 9. 📝 Configuration Files

- [ ] **Review `backend/server.js`**
  - Port configuration
  - CORS settings
  - Error handling

- [ ] **Review `frontend/next.config.ts`**
  - Any production-specific settings
  - Image domains (if using external images)

- [ ] **Create `ecosystem.config.js` for PM2** (example below)

## 10. 🧪 Testing

- [ ] **Test all major features locally**:
  - Home page loads
  - All pages accessible
  - API endpoints work
  - Database queries work
  - Images load correctly
  - Forms submit correctly
  - Newsletter signup works

- [ ] **Test in production mode locally**:
  ```bash
  # Backend
  NODE_ENV=production npm start
  
  # Frontend
  npm run build
  npm start
  ```

## 11. 📄 Documentation

- [ ] **Document your deployment process** (keep this checklist!)
- [ ] **Document server credentials** (securely, not in Git)
- [ ] **Document database credentials** (securely)
- [ ] **Note any server-specific configurations**

## 12. 🚀 Deployment Files (Optional but Recommended)

Create `ecosystem.config.js` in project root for PM2:

```javascript
module.exports = {
  apps: [
    {
      name: 'kcay-backend',
      script: './backend/server.js',
      cwd: '/path/to/your/project',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'kcay-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/your/project/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

## 13. 📋 Final Checklist Before Server Setup

- [ ] All code committed and pushed to Git
- [ ] Environment variables documented and ready
- [ ] Database created and schemas ready to run
- [ ] Cloudinary images uploaded (if using)
- [ ] Server has Node.js 18+ installed
- [ ] Server has MySQL installed and running
- [ ] PM2 installed (or another process manager)
- [ ] Production build tested locally
- [ ] All dependencies verified
- [ ] Security considerations reviewed
- [ ] Documentation updated

---

## Quick Commands Reference

### Local Testing (Production Mode)
```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend (in another terminal)
cd frontend
npm run build
npm start
```

### Database Backup (Before Deployment)
```bash
mysqldump -u your_user -p your_database > backup_before_deployment.sql
```

### Check What Ports Are in Use
```bash
# Linux/Mac
netstat -tulpn | grep LISTEN
# or
lsof -i -P -n | grep LISTEN
```

---

**Once you've completed this checklist, you're ready to set up the server! 🚀**

