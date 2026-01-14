# Quick Guide: Upgrade Node.js from v12 to v20

Your server has Node.js v12.22.9, but your project requires **Node.js 18.17.0 or higher** (we recommend **Node.js 20 LTS**).

## ⚠️ Why You Need to Upgrade

- **Node.js v12** reached End-of-Life (EOL) in April 2022
- **Next.js 16** requires Node.js 18.17.0+
- **Modern npm packages** require Node.js 18+
- Your app **will not work** with Node.js v12

---

## Quick Upgrade Steps (On Your Server)

SSH into your server first, then run:

```bash
# 1. Check current version
node --version  # Shows: v12.22.9

# 2. Remove old Node.js
sudo apt remove nodejs npm -y
sudo apt remove nodejs npm -y

# 3. Install Node.js 20.x (Current LTS - Recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# OR if you prefer Node.js 18.x (also supported):
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt-get install -y nodejs

# 4. Verify new version
node --version  # Should show: v18.x.x or v20.x.x
npm --version   # Should show: 9.x or 10.x

# 5. If it still shows old version, restart your SSH session:
exit
# Then SSH back in and check again
```

---

## Alternative: Using NVM (If Above Doesn't Work)

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install and use Node.js 20 (or 18)
nvm install 20
nvm use 20
nvm alias default 20

# OR if you prefer Node.js 18:
# nvm install 18
# nvm use 18
# nvm alias default 18

# Verify
node --version  # Should show v18.x.x
```

---

## Verify Installation

After upgrading, verify everything works:

```bash
# Check Node.js version
node --version  # Must be 18.x.x or higher!

# Check npm version
npm --version

# Test npm works
npm --help

# Try installing a package globally (test)
sudo npm install -g pm2
pm2 --version
```

---

## Common Issues

### Issue: `node --version` still shows v12 after installation

**Solution:**
1. Logout and login again (restart SSH session)
2. Check which node: `which node`
3. Try: `sudo hash -r` to refresh command cache
4. Or use NVM method above

### Issue: Permission errors

**Solution:**
- Use `sudo` for global installations
- Or configure npm to use a different directory (see npm docs)

### Issue: Old npm packages cached

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall packages in your project
cd /path/to/your/project
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

After upgrading Node.js:

1. ✅ Verify: `node --version` shows 18+
2. ✅ Install PM2: `sudo npm install -g pm2`
3. ✅ Install project dependencies: `cd backend && npm install`
4. ✅ Test build: `cd frontend && npm run build`

---

## Version Compatibility

| Component | Required Node.js | Your Current | Status |
|-----------|-----------------|--------------|--------|
| Next.js 16 | 18.17.0+ | 12.22.9 | ❌ Must Upgrade |
| React 19 | 18.0.0+ | 12.22.9 | ❌ Must Upgrade |
| Modern npm | 18.0.0+ | 12.22.9 | ❌ Must Upgrade |

**Action Required:** Upgrade to Node.js 20 (Current LTS - Recommended) or 18 (Also Supported)

## About the Deprecation Warning

If you see a warning about Node.js 18.x being "no longer actively supported" - this is just NodeSource's way of encouraging you to use Node.js 20. **Node.js 18 is still an LTS version** and is supported until April 2025. However, **Node.js 20 is the current LTS** and is supported until April 2026, so we recommend using Node.js 20.

Both versions (18 and 20) work perfectly fine with your Next.js 16 application.

