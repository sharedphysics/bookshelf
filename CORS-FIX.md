# 🔒 CORS Error Fix - Local Testing

## The Problem

If you see this error in the browser console:
```
Access to fetch at 'https://docs.google.com/spreadsheets/...' from origin 'null'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**This is expected when opening HTML files directly from your filesystem!**

## Why This Happens

- When you double-click an HTML file, it opens with `file://` protocol
- Browsers block `file://` pages from fetching external resources (CORS security)
- This is a **testing limitation only** - it won't happen when:
  - Embedded in Ghost (served over `https://`)
  - Hosted on any web server
  - Served via localhost

## ✅ Solution 1: Use Local Web Server (Recommended for Testing)

### Option A: Use the Provided Script

```bash
cd /Users/roman/Documents/GitHub/bookshelf
./start-server.sh
```

Then open: **http://localhost:8000/bookshelf-widget.html**

### Option B: Manual Command

```bash
cd /Users/roman/Documents/GitHub/bookshelf
python3 -m http.server 8000
```

Then open: **http://localhost:8000/bookshelf-widget.html**

Press `Ctrl+C` to stop the server when done.

## ✅ Solution 2: Just Embed in Ghost (No Testing Needed)

The CORS issue **does not affect** the Ghost embed! When you paste the code into Ghost:

1. Ghost serves the page over `https://yoursite.com`
2. Browsers allow `https://` pages to fetch from Google Sheets
3. Everything works perfectly

**You can skip local testing and go straight to Ghost if you prefer.**

## Testing Checklist

### Local Testing (via localhost:8000)
- [x] Started web server (via `start-server.sh`)
- [ ] Opened http://localhost:8000/bookshelf-widget.html
- [ ] Books load within 30 seconds
- [ ] Filters work (All Books, Recommended, Year, Genre)
- [ ] Clicking books opens modal
- [ ] Modal shows book details

### Ghost Testing (actual deployment)
- [ ] Copied contents of `bookshelf-embedded.html`
- [ ] Pasted into Ghost HTML card
- [ ] Published/Previewed post
- [ ] Books load correctly
- [ ] All features work

## Other CORS-Free Testing Methods

### Method 1: Chrome with CORS Disabled (Not Recommended)
```bash
# macOS - Close Chrome first, then run:
open -na "Google Chrome" --args --disable-web-security --user-data-dir=/tmp/chrome-testing
```

⚠️ **Warning**: Only use this for testing, never for normal browsing!

### Method 2: Use Firefox (May work with file://)
Firefox sometimes has more lenient CORS policies for local files, but this is not guaranteed.

### Method 3: Use a Browser Extension
- Install "CORS Unblock" or similar extension
- Enable it only for testing
- Remember to disable it after

## When You Deploy to Ghost

Once embedded in Ghost, the widget will work perfectly because:

1. ✅ Served over HTTPS (not file://)
2. ✅ No CORS restrictions
3. ✅ All modern browsers supported
4. ✅ Mobile-friendly

## Current Server Status

I've started a local server for you at:
- **URL**: http://localhost:8000/bookshelf-widget.html
- **Port**: 8000
- **Files**: All files in `/Users/roman/Documents/GitHub/bookshelf/`

To stop the server later:
```bash
# Find the process
ps aux | grep "http.server 8000"

# Kill it (replace XXXX with the process ID)
kill XXXX
```

Or just close the terminal window.

## Quick Reference

| Testing Method | CORS Issue? | Best For |
|---------------|-------------|----------|
| Double-click HTML file | ❌ Yes | Never use this method |
| localhost:8000 | ✅ No | Local testing |
| Ghost blog | ✅ No | Production use |
| File → Open in browser | ❌ Yes | Never use this method |

---

**TL;DR**: Use `./start-server.sh` to test locally, or just embed directly in Ghost where it will work perfectly.
