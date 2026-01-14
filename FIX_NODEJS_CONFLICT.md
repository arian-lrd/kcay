# Fix Node.js Installation Conflict

You're getting this error because old Node.js 12 packages (`libnode-dev`, `libnode72`) are still installed and conflicting with Node.js 20.

## Quick Fix

Run these commands **on your server** (in order):

```bash
# 1. Remove the conflicting packages
sudo apt remove libnode-dev libnode72 nodejs npm -y

# 2. Clean up any remaining Node.js packages
sudo apt autoremove -y

# 3. Purge any leftover configuration files
sudo apt purge libnode-dev libnode72 nodejs npm -y

# 4. Clean apt cache
sudo apt clean

# 5. Now install Node.js 20 (should work now)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 6. Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x
```

---

## Alternative: If Above Doesn't Work

If you still get conflicts, try this more aggressive approach:

```bash
# 1. Remove ALL node-related packages
sudo apt remove --purge nodejs npm libnode* -y
sudo apt autoremove -y

# 2. Find and remove any remaining node packages
dpkg -l | grep node | awk '{print $2}' | xargs sudo apt remove --purge -y

# 3. Clean everything
sudo apt clean
sudo apt update

# 4. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 5. Verify
node --version
npm --version
```

---

## What Happened?

The error occurred because:
- Your system had Node.js 12 installed from Ubuntu's repositories
- These packages include `libnode-dev` and `libnode72`
- Node.js 20 from NodeSource tries to install files in the same locations
- Package manager prevents overwriting files from different packages

Removing the old packages first resolves the conflict.

