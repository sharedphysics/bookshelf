# Setup Guide

Complete instructions for setting up your Interactive Bookshelf.

## Table of Contents

1. [Google Sheets Setup](#google-sheets-setup)
2. [Apps Script Installation](#apps-script-installation)
3. [Widget Configuration](#widget-configuration)
4. [Deployment Options](#deployment-options)
5. [Troubleshooting](#troubleshooting)

---

## Google Sheets Setup

### Step 1: Create Your Sheet

Create a new Google Sheet with these exact column headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Recommended | Title | Author | Published Year | Type | Year Read | Genre | Sub-Genre | Pages | Rating | Thoughts | Cover URL |

**Important Notes:**
- Column order matters - don't rearrange them
- Column L (Cover URL) stays empty - it's auto-populated by the Apps Script
- Only columns B (Title) and C (Author) are truly required

### Step 2: Add Your Books

Fill in your book data. Example row:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| ⭐ | The Maniac | Benjamin Labatut | 2023 | Print | 2024 | Fiction | Science | 284 | 5 | Fascinating blend of science and fiction! |

**Tips:**
- Use ⭐, Yes, or Y in column A to mark recommended books
- Page count (column I) affects book height in stack view
- Leave Cover URL (column L) blank

### Step 3: Publish to Web

**Critical:** You must publish (not just share) your sheet.

1. Go to **File → Share → Publish to web**
2. Under "Link", select your specific sheet (e.g., "Sheet1")
3. Choose **Comma-separated values (.csv)** from the dropdown
4. Click **Publish**
5. Confirm by clicking **OK**
6. **Copy the published URL** - it looks like:
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vXXXXX.../pub?output=csv
   ```

**Keep this URL** - you'll need it for the widget configuration.

---

## Apps Script Installation

The Apps Script automatically fetches book covers and metadata from Open Library.

### Step 1: Open Apps Script Editor

1. In your Google Sheet, click **Extensions → Apps Script**
2. You'll see a new tab with a code editor
3. **Delete** any existing code in the editor

### Step 2: Add the Script

1. Copy the entire contents of [`fetch-book-covers.gs`](fetch-book-covers.gs)
2. Paste it into the Apps Script editor
3. Click the **Save** icon (or Ctrl/Cmd + S)
4. Name your project (e.g., "Bookshelf Fetcher")

### Step 3: Run the Script

**First Time Setup:**
1. Select **`fetchAllBookData`** from the function dropdown
2. Click **Run** (▶️ button)
3. You'll see an "Authorization required" dialog
4. Click **Review permissions**
5. Choose your Google account
6. Click **Advanced** → **Go to [Your Project] (unsafe)**
7. Click **Allow**

**The script will now run:**
- Takes ~1 minute for 70 books
- Adds book covers, genres, page counts, and publication years
- Check your sheet - Column L should populate with cover URLs

### Step 4: Custom Menu (Optional but Recommended)

The script creates a custom "Bookshelf" menu in your sheet. Refresh the page to see it.

**Menu Options:**
- **📚 Fetch All Book Data** - Fetches covers, pages, genres, years for all books (overwrites existing)
- **🔄 Fetch Missing Data Only** - Only fills in empty cells (preserves your manual entries)
- **🖼️ Fetch Covers Only** - Just updates cover URLs
- **🧹 Clear All Cover URLs** - Removes all covers
- **🧹 Clear All Fetched Data** - Removes all auto-filled data

### What the Script Fetches

From [Open Library](https://openlibrary.org):
- **Column D**: Published Year (first publication)
- **Column G**: Genre (primary subject/category)
- **Column I**: Page Count (median from all editions)
- **Column L**: Cover URL (medium size, ~200x300px)

**Note:** Not all books have complete data. The script does its best, but you may need to manually fill in some fields.

---

## Widget Configuration

### Step 1: Choose Your Version

**Standalone (`bookshelf-widget.html`)**
- Full-page bookshelf with header
- Includes filter dropdowns and toggles
- Best for dedicated pages (e.g., yoursite.com/books)

**Embedded (`bookshelf-embedded.html`)**
- Widget designed to embed in blog posts
- Supports hardcoded default filters
- Best for Ghost, WordPress, or other CMS platforms

### Step 2: Configure the URL

Open your chosen HTML file in a text editor. The **CONFIGURATION** section is at the very top (first 20-30 lines) with clear visual markers:

**Standalone version:**
```javascript
// ============================================================================
// CONFIGURATION - EDIT THIS SECTION ONLY
// ============================================================================

const CONFIG = {
    publishedUrl: 'YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE'
};
```

**Embedded version:**
```javascript
// ============================================================================
// CONFIGURATION - EDIT THIS SECTION ONLY
// ============================================================================

const CONFIG = {
    publishedUrl: 'YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE',
    defaultFilter: 'all',        // 'all' or 'recommended'
    defaultYear: '',             // Leave empty or set to '2024'
    defaultGenre: ''             // Leave empty or set to 'Fiction'
};
```

Replace `YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE` with the URL from Step 3 of Google Sheets Setup.

### Step 3: Test Locally (Optional)

**Important:** Don't just double-click the HTML file - it will cause CORS errors.

Use a local web server:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have npx)
npx http-server
```

Then open http://localhost:8000/bookshelf-widget.html

---

## Deployment Options

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Upload your HTML file
3. Go to Settings → Pages
4. Select your branch and root folder
5. Your site will be live at `https://username.github.io/repo-name/`

### Option 2: Netlify (Free)

1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop your HTML file
3. Get instant deployment with HTTPS

### Option 3: Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your repository or upload files
3. Deploy with one click

### Option 4: Embed in Website

**Ghost:**
1. Create a new post
2. Add an HTML card
3. Paste the entire `bookshelf-embedded.html` contents
4. Publish

**WordPress:**
1. Edit your post
2. Add a Custom HTML block
3. Paste the embedded version
4. Update/Publish

**Any HTML page:**
```html
<!-- In your page HTML -->
<div id="bookshelf-container">
    <!-- Paste bookshelf-embedded.html contents here -->
</div>
```

---

## Troubleshooting

### Books Not Loading

**Check the Console:**
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for error messages

**Common Issues:**
- ❌ **404 Not Found**: Your published URL is incorrect
- ❌ **CORS Error**: You opened the file directly (use a web server)
- ❌ **Empty bookshelf**: Sheet isn't published or URL is wrong

**Solutions:**
1. Verify your sheet is published (File → Share → Publish to web)
2. Check that the CONFIG url matches your published CSV URL
3. Ensure your sheet has data in columns B and C at minimum
4. Check for JavaScript errors in the console

### No Book Covers

**Causes:**
- Column L is empty (Apps Script not run)
- Sheet not re-published after running script
- Cover URLs are broken

**Solutions:**
1. Run the Apps Script: **Bookshelf → Fetch All Book Data**
2. Wait for Column L to populate
3. Re-publish your sheet (File → Share → Publish to web → Re-publish)
4. Clear browser cache and reload

### Apps Script Errors

**"Authorization required":**
- Normal first-time behavior
- Follow the authorization steps in Step 3 above

**"Execution timed out":**
- Your library is too large (>200 books)
- Use **Fetch Missing Data Only** to update incrementally
- Or increase the delay in the script (line 282: change 700 to 1000)

**"No covers found for [book]":**
- Open Library doesn't have that book
- Manually add a cover URL to Column L
- Try simplifying the book title (remove subtitles)

### Performance Issues

**Slow loading:**
- Check your internet connection
- Large libraries (500+ books) take longer
- Consider filtering to show fewer books

**Browser freezing:**
- You may have too many books
- Try using the standalone version with filters
- Consider splitting into multiple sheets (e.g., by year)

### Layout Problems

**Books overlapping:**
- Check browser zoom (should be 100%)
- Try refreshing the page
- Check for CSS conflicts if embedded

**Charts not showing:**
- Missing book data (year read, genre, etc.)
- Check browser console for errors
- Ensure you have multiple books with the required fields

---

## Maintenance

### Adding New Books

1. Add book data to your Google Sheet
2. Run **Bookshelf → Fetch Missing Data Only**
3. Wait for new covers to populate
4. Reload your widget page

### Updating Existing Books

1. Edit the data in your sheet
2. If you added/changed covers manually, skip the next step
3. Optional: Run **Fetch All Book Data** to refresh everything
4. Reload your widget page

### Changing the Design

All styling is in the `<style>` section of the HTML file. Common customizations:

**Colors:**
```css
/* Change primary color */
.toggle-btn.active {
    background: #your-color;
}
```

**Fonts:**
```css
/* Change to your preferred font */
body {
    font-family: 'Your Font', sans-serif;
}
```

**Book heights:**
```javascript
// In createBookElement method
const height = Math.min(120, Math.max(60, book.pageCount * 0.25));
// Adjust the 0.25 multiplier
```

---

## Next Steps

- ✅ Set up automatic re-publishing (File → Share → Publish to web → Auto-publish)
- ✅ Add more books to your collection
- ✅ Customize the colors and layout
- ✅ Share your bookshelf with friends!

**Need more help?** See the [FAQ in README](README.md#faq) or check the [security guide](SECURITY.md).
