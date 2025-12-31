# Interactive Bookshelf Widget

An elegant, interactive bookshelf that displays your reading list from Google Sheets with beautiful book covers and instant loading.

## Features

✅ **Instant Loading**: Pre-fetched book covers load in ~1 second
✅ **Visual Book Covers**: Real book cover images from Open Library
✅ **Variable Heights**: Book spine height based on actual page counts
✅ **Stacked Appearance**: Random horizontal offsets create natural book stack
✅ **Interactive Modals**: Click any book to see full details, ratings, and your notes
✅ **Smart Filtering**: Filter by recommended status
✅ **Fully Self-Contained**: Single HTML file with no external dependencies
✅ **Responsive Design**: Works on desktop, tablet, and mobile
✅ **Modern Typography**: Clean sans-serif titles with serif metadata

## Performance

⚡ **Page Load**: 1 second (vs 15 seconds with old approach)
⚡ **Zero API Calls**: All covers pre-fetched via Google Apps Script
⚡ **Graceful Fallback**: Muted grey backgrounds when covers unavailable

---

## Quick Start

### ⚠️ Important: Local Testing

**Do not double-click the HTML file!** This causes CORS errors.

**For local testing**, use the provided web server:
```bash
./start-server.sh
```
Then open: http://localhost:8000/bookshelf-widget.html

See [CORS-FIX.md](CORS-FIX.md) for details.

---

## Two Versions

### Option 1: Standalone HTML File
Use `bookshelf-widget.html` for a standalone page hosted on any web server.
- Includes "All" and "Recommended" filter buttons
- Full-page layout with header

### Option 2: Ghost Blog Embed (Recommended)
Use `bookshelf-embedded.html` to embed the bookshelf in a Ghost blog post:
1. Open your Ghost blog post editor
2. Add an HTML card
3. Copy and paste the entire contents of `bookshelf-embedded.html`
4. Publish!

---

## Setup Guide

### Step 1: Set Up Your Google Sheet

Your Google Sheet should have these columns (in order):

| Column | Header | Example | Required |
|--------|---------|---------|----------|
| A | Recommended | ⭐ or Yes | Optional |
| B | Title | The Maniac | **Required** |
| C | Author | Benjamin Labatut | **Required** |
| D | Published Year | 2023 | Optional |
| E | Type | Print/Digital/Audio | Optional |
| F | Year Read | 2024 | Optional |
| G | Genre | Fiction | Optional |
| H | Sub-Genre | Science, History | Optional |
| I | Pages | 284 | **Required** |
| J | Rating | 5 | Optional |
| K | Thoughts | Fascinating read... | Optional |
| L | Cover URL | https://covers... | **Auto-populated** |

**Note**: Column L (Cover URL) will be automatically populated by the Google Apps Script.

---

### Step 2: Publish Your Sheet to the Web

**IMPORTANT:** You must publish your sheet, not just share it!

1. In your Google Sheet, go to **File → Share → Publish to web**
2. In the dropdown, select your sheet name (e.g., "Sheet1")
3. Choose format: **Comma-separated values (.csv)**
4. Click **Publish**
5. Click **OK** on the confirmation
6. Copy the published URL (it will look like: `https://docs.google.com/spreadsheets/d/e/2PACX-XXXXX/pub?output=csv`)

---

### Step 3: Set Up Google Apps Script (For Book Covers)

This is the key to instant loading! Follow the detailed guide:

📖 **See [APPS-SCRIPT-SETUP.md](APPS-SCRIPT-SETUP.md) for complete instructions**

**Quick summary:**
1. Add "Cover URL" as Column L header
2. Open **Extensions → Apps Script** in your sheet
3. Paste code from `fetch-book-covers.gs`
4. Run `fetchAllBookCovers` function
5. Authorize and wait ~1 minute
6. Column L will populate with cover URLs

**Files:**
- `fetch-book-covers.gs` - The Apps Script code
- `APPS-SCRIPT-SETUP.md` - Detailed setup instructions
- `COVER-INTEGRATION-SUMMARY.md` - How it all works together

---

### Step 4: Configure the Widget

In the HTML file (bookshelf-widget.html or bookshelf-embedded.html), find the CONFIG section and update with your published URL:

```javascript
const CONFIG = {
    publishedUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-XXXXX/pub?output=csv'
};
```

**Note:** Use the published URL from Step 2, not your edit URL!

---

## How It Works

### The Performance Problem (Old Approach)
```
User visits page
  ↓
70+ API calls to Open Library (15 seconds)
  ↓
Page loads with covers
```

### The Solution (New Approach)
```
One-time: Run Google Apps Script (~1 minute)
  ↓
Cover URLs saved in Sheet Column L
  ↓
User visits page → Reads CSV → Instant load! (1 second)
```

### Visual Display

**Books with covers:**
```
┌────────────────────────────────────────┐
│ [Cover] │ The Maniac                📖 │
│  Image  │ Benjamin Labatut, 2023       │
└────────────────────────────────────────┘
```

**Books without covers:**
```
┌────────────────────────────────────────┐
│ The Maniac                          📖 │
│ Benjamin Labatut, 2023                 │
└────────────────────────────────────────┘
(muted grey background)
```

---

## Customization Options

### Visual Styling

The widget uses muted grey/beige colors by default. To customize:

```css
/* In the <style> section, find: */
.ibs-book-title {
    font-size: 1.5rem;      /* Title size */
}

.ibs-book-meta {
    font-size: 0.875rem;    /* Author/year size */
}
```

### Layout Configuration

**Adjust horizontal offset (stacked look):**
```javascript
// In createBookElement method:
const offsetPercent = offsetRandom * 100 - 6.5; // ±6.5% offset
// Increase for more dramatic stacking
```

**Adjust height calculation:**
```javascript
// In createBookElement method:
const height = Math.min(maxHeight, Math.max(minHeight, book.pageCount * 0.25));
// Adjust the multiplier (0.25) to make books taller or shorter
```

---

## Maintenance

### Adding New Books
1. Add book data to your sheet (Columns A-K)
2. Fill in the page count in Column I
3. Open your sheet → **Bookshelf** menu → **Fetch Missing Covers Only**
4. Re-publish your sheet (if not auto-publishing)
5. Reload widget

### Refreshing All Covers
1. **Bookshelf** menu → **Fetch All Book Covers**
2. Wait ~1 minute
3. Re-publish your sheet
4. Reload widget

### Manual Cover URLs
If the script can't find a cover:
1. Find the cover image online (Goodreads, Amazon, etc.)
2. Upload to an image host (Imgur, etc.)
3. Paste URL directly into Column L
4. Widget will use your custom URL

---

## Troubleshooting

### Books Not Loading
1. Check that your Google Sheet is published to web as CSV
2. Verify the publishedUrl in CONFIG matches your sheet
3. Check browser console for errors (F12 > Console tab)
4. Ensure your sheet has the correct column structure

### Covers Not Showing
1. Check Column L has URLs
2. Re-publish sheet to web
3. Clear browser cache and reload
4. Run Apps Script if Column L is empty

### Apps Script Issues
- **Timeout**: Use "Fetch Missing Covers Only" for large libraries
- **No covers found**: Manually add URLs to Column L
- **Rate limited**: Increase delay in script (line 124: change 700 to 1000)

See [APPS-SCRIPT-SETUP.md](APPS-SCRIPT-SETUP.md) for detailed troubleshooting.

---

## Documentation

- **README.md** (this file) - Quick start and overview
- **APPS-SCRIPT-SETUP.md** - Detailed Apps Script installation guide
- **COVER-INTEGRATION-SUMMARY.md** - How the cover system works
- **MODERN-REDESIGN.md** - Design decisions and styling details
- **PERFORMANCE-FIX.md** - Performance optimization explanation
- **DESIGN-REFINEMENTS.md** - Visual polish and improvements
- **CORS-FIX.md** - Local testing setup

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Privacy & Data

- Your Google Sheet must be publicly viewable
- No personal data is collected by the widget
- All data fetching happens client-side in the user's browser
- Open Library API requests only happen during Apps Script execution (not on page load)

---

## Credits

- Book data and covers from [Open Library API](https://openlibrary.org/developers/api)
- System fonts for performance and crispness
- Built with vanilla JavaScript (no frameworks)

---

## FAQ

**Q: Can I use this offline?**
A: No, it requires internet access to load the CSV from Google Sheets and display cover images.

**Q: How many books can I add?**
A: Technically unlimited, but performance is best with under 500 books. The widget loads all data at once.

**Q: Do I need to run the Apps Script every time?**
A: No! Only run it when you add new books. Use "Fetch Missing Covers Only" to update just the new ones.

**Q: What if Open Library doesn't have my book?**
A: The widget will show a muted grey background. You can manually add a cover URL to Column L.

**Q: Can I change the font?**
A: Yes! Update the `font-family` in the CSS. The widget uses system fonts for performance.

**Q: Does this work with Excel/CSV?**
A: Not directly, but you can import your CSV into Google Sheets and use that.

**Q: Can I add custom fields?**
A: Yes! Add new columns to your sheet, update the `parseCSV` method, and modify the modal display.

---

## Need Help?

1. Check the documentation files (listed above)
2. Review the browser console for errors (F12)
3. Verify your Google Sheet structure matches the examples
4. Ensure all setup steps are complete

---

**Enjoy your instant-loading, beautiful bookshelf!** 📚⚡
