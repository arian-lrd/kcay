# How to Start the Backend Server

## The Problem

Your backend server is **NOT running**. That's why you're getting the network error.

## Solution: Start the Backend

### Step 1: Open Terminal 1 (Backend)

Open a terminal window and run these commands:

```bash
# Navigate to your project root
cd /Users/ARIAN/Documents/Personal/Kurdish/coding/kcay

# Start the backend server
npm run dev
```

### Step 2: Wait for Success Message

You should see:
```
Server is running on port 3000
Connected to MySQL database
Database pool created successfully
```

**Important:** Leave this terminal window open and running! Don't close it.

### Step 3: Keep Frontend Running (Terminal 2)

In a **separate terminal window**, keep the frontend running:

```bash
cd /Users/ARIAN/Documents/Personal/Kurdish/coding/kcay/frontend
npm run dev
```

This should show:
```
Local: http://localhost:3001
✓ Ready
```

## Verify Backend is Running

Open a new terminal and test:

```bash
curl http://localhost:3000/api/v1/about
```

If you see JSON data, the backend is working!

## Summary

You need:
1. **Terminal 1:** Backend (`npm run dev` from project root) - Shows "Server is running on port 3000"
2. **Terminal 2:** Frontend (`npm run dev` from frontend folder) - Shows "Local: http://localhost:3001"

**Both must be running at the same time!**

