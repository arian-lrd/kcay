# Verify PM2 Installation

## Quick Check

Run these commands to verify PM2 is installed correctly:

```bash
# Check PM2 version
pm2 --version

# Check PM2 is in your PATH
which pm2

# Get PM2 help (to confirm it works)
pm2 --help
```

If you see a version number (like `5.3.0` or similar), PM2 is installed correctly!

---

## About That Warning

The warning "Command line option 'g' [from -g] is not understood in combination with the other options" is confusing, but **PM2 installed successfully anyway**. You can see "added 133 packages in 15s" which confirms the installation worked.

This might be a configuration quirk, but since it worked, you can ignore it.

---

## Optional: Update npm (Not Required)

You also saw this notice:
```
npm notice New major version of npm available! 10.8.2 -> 11.7.0
```

This is **optional**. Your current npm (10.8.2) works fine. If you want to update:

```bash
sudo npm install -g npm@latest
npm --version  # Should show 11.x
```

But **you don't need to** - npm 10.8.2 works perfectly fine.

---

## Next Steps

Now that PM2 is installed:

1. ✅ **PM2 installed** - Check with `pm2 --version`
2. ✅ **Node.js 20 installed** - You have Node.js 20.x
3. ✅ **npm works** - You can install packages
4. ⏭️ **Next**: Install MySQL (if not already)
5. ⏭️ **Next**: Set up your application with PM2

---

## Test PM2

Try running PM2 to make sure it works:

```bash
# Start a simple test process
pm2 start echo -- "Hello PM2"

# Check PM2 status
pm2 status

# Stop the test process
pm2 stop echo
pm2 delete echo
```

If this works, PM2 is ready to use!

