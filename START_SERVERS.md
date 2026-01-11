# How to Start Your Servers

You need **TWO terminal windows** running at the same time:

## Step 1: Start Backend Server (Terminal Window 1)

Open a terminal and run:

```bash
cd /Users/ARIAN/Documents/Personal/Kurdish/coding/kcay
npm run dev
```

**You should see:**
```
Server is running on port 3000
Connected to MySQL database
Database pool created successfully
```

**Leave this terminal running!** Don't close it.

---

## Step 2: Start Frontend Server (Terminal Window 2)

Open a **NEW** terminal window (keep the first one running!) and run:

```bash
cd /Users/ARIAN/Documents/Personal/Kurdish/coding/kcay/frontend
npm run dev
```

**You should see:**
```
▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3001
✓ Ready in 451ms
```

**Leave this terminal running too!**

---

## Step 3: Open Your Website

Open your browser and go to:
```
http://localhost:3001
```

Or visit the About page:
```
http://localhost:3001/about
```

---

## Summary

You need **TWO terminals**:
- **Terminal 1:** Backend on port 3000 (provides data)
- **Terminal 2:** Frontend on port 3001 (shows website)

Both must be running at the same time!

---

## Quick Checklist

- [ ] Terminal 1: Backend running (`npm run dev` from project root)
- [ ] Terminal 2: Frontend running (`npm run dev` from frontend folder)
- [ ] Backend shows: "Server is running on port 3000"
- [ ] Frontend shows: "Local: http://localhost:3001"
- [ ] Visit: http://localhost:3001/about

---

## Troubleshooting

**If you see "Error: Failed to fetch" or "Network error":**
- Make sure BOTH servers are running
- Check Terminal 1 shows "Server is running on port 3000"
- Check Terminal 2 shows "Local: http://localhost:3001"

**If backend won't start:**
- Check MySQL is running
- Check your `.env` file has correct database credentials

**If frontend won't start:**
- Make sure you're in the `frontend` folder
- Check port 3001 is not already in use

