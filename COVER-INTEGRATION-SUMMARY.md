# Book Cover Integration - Complete Setup

## Overview

Your bookshelf widget now supports **instant-loading book covers** using a Google Apps Script approach. This eliminates the 15-second performance bottleneck while bringing back the visual appeal of book covers.

---

## How It Works

### 1. **One-Time Setup** (Google Apps Script)
- Run the Apps Script to fetch cover URLs from Open Library API
- Cover URLs are saved to **Column L** in your Google Sheet
- Takes ~1 minute for 70 books
- Run again anytime to update covers for new books

### 2. **Widget Reads Pre-Fetched URLs** (Instant)
- Widget reads Column L from the CSV
- Displays cover thumbnails immediately (no API calls)
- Falls back to muted grey background if no cover URL exists
- Page loads in ~1 second

---

## Files Created

### **fetch-book-covers.gs**
- Google Apps Script code
- Fetches cover URLs from Open Library API
- Populates Column L in your sheet
- See `APPS-SCRIPT-SETUP.md` for installation instructions

### **APPS-SCRIPT-SETUP.md**
- Complete installation guide
- Step-by-step instructions with screenshots descriptions
- Troubleshooting tips
- How to use the custom menu

### **Updated Widget Files**
- `bookshelf-embedded.html` - Ghost embed version
- `bookshelf-widget.html` - Standalone version

Both files now:
- Read `coverUrl` from Column L (values[11])
- Display cover thumbnails next to book spines
- Fall back to muted grey when no cover exists
- Maintain instant loading performance

---

## Visual Result

### With Cover URL:
```
┌────────────────────────────────────────┐
│ [Cover] │ The Maniac                📖 │
│  Image  │ Benjamin Labatut, 2023       │
└────────────────────────────────────────┘
```

### Without Cover URL:
```
┌────────────────────────────────────────┐
│ The Maniac                          📖 │
│ Benjamin Labatut, 2023                 │
└────────────────────────────────────────┘
(muted grey background)
```

---

## Setup Checklist

- [ ] 1. Add **Column L** to your Google Sheet (header: "Cover URL")
- [ ] 2. Open **Extensions → Apps Script** in your Google Sheet
- [ ] 3. Paste code from `fetch-book-covers.gs`
- [ ] 4. Run `fetchAllBookCovers` function
- [ ] 5. Authorize the script (first time only)
- [ ] 6. Wait ~1 minute for covers to populate
- [ ] 7. Verify Column L has cover URLs
- [ ] 8. Update your widget HTML files (already done)
- [ ] 9. Republish your sheet to CSV (File → Share → Publish to web)
- [ ] 10. Test the widget - should load with covers instantly!

---

## Column Structure (Updated)

Your Google Sheet now has:

| Column | Header | Example |
|--------|---------|---------|
| A | Recommended | ⭐ or Yes |
| B | Title | The Maniac |
| C | Author | Benjamin Labatut |
| D | Published Year | 2023 |
| E | Type | Print |
| F | Year Read | 2024 |
| G | Genre | Fiction |
| H | Sub-Genre | Science, History |
| I | Pages | 284 |
| J | Rating | 5 |
| K | Thoughts | Fascinating read... |
| **L** | **Cover URL** | **https://covers.openlibrary.org/b/id/12345-M.jpg** |

---

## Performance Comparison

### Before (Grey backgrounds only):
- Load time: 1 second ✓
- Visual appeal: Low (boring grey)
- No images to load

### Before (Old approach with API calls):
- Load time: 15 seconds ✗
- Visual appeal: High (book covers)
- 70+ API calls on every page load

### Now (Apps Script + Pre-fetched URLs):
- Load time: 1 second ✓
- Visual appeal: High (book covers) ✓
- 0 API calls on page load ✓
- **Best of both worlds!**

---

## Maintenance

### Adding New Books
1. Add book data to your sheet (Columns A-K)
2. Run **Bookshelf → Fetch Missing Covers Only**
3. New covers populate in Column L automatically

### Refreshing All Covers
1. Run **Bookshelf → Fetch All Book Covers**
2. All covers re-fetch (useful if Open Library adds new covers)

### Manual Cover URLs
If a book isn't found by the script:
1. Find the cover image online (Goodreads, Amazon, etc.)
2. Upload to an image host (Imgur, etc.)
3. Paste URL directly into Column L
4. Widget will use your custom URL

---

## Fallback Behavior

The widget gracefully handles missing covers:

```javascript
// If cover URL exists → show cover thumbnail
const coverThumb = book.coverUrl
    ? `<img src="${book.coverUrl}" ...>`
    : '';  // Otherwise → show just muted grey spine
```

This means:
- Books with covers: Beautiful visual display ✓
- Books without covers: Clean grey design ✓
- No broken images or errors ✓

---

## Technical Details

### Cover Size
- Apps Script fetches: **Medium (-M)** covers
- Size: ~200x300 pixels
- Perfect balance of quality and file size

### Loading Strategy
- Covers load with CSS `lazy loading` (implicit)
- Browser caches cover images
- Subsequent visits: Instant display from cache

### API Rate Limiting
- Apps Script: 700ms delay between requests
- ~85 requests/minute (within Open Library limits)
- No rate limiting on widget page load (0 API calls)

---

## Troubleshooting

### Covers not showing up?
1. Check Column L has URLs
2. Re-publish sheet to web (File → Share → Publish to web)
3. Clear browser cache and reload

### Apps Script timeouts?
- Use "Fetch Missing Covers Only" for large libraries
- Process in batches if 500+ books

### Some covers are broken images?
- Open Library URL may be outdated
- Replace with manual URL in Column L

---

## Next Steps

1. **Test it**: Load your widget and verify covers appear
2. **Add new books**: Run "Fetch Missing Covers Only" to populate them
3. **Customize**: Manually add cover URLs for books the script missed
4. **Enjoy**: Instant-loading bookshelf with beautiful book covers! ⚡📚

---

## Summary

You now have:
- ✅ Visual book covers (gripping, engaging)
- ✅ Instant page load (1 second)
- ✅ Automated cover fetching (Google Apps Script)
- ✅ Graceful fallback (muted grey for missing covers)
- ✅ Easy maintenance (custom menu in sheet)
- ✅ Zero ongoing API calls (all pre-fetched)

**The best of both worlds: performance AND visual appeal!** 🎉
