# UI Updates - Bookshelf Widget

## Changes Made (2025-12-29)

### ✅ 1. Background Changed to White/Transparent

**Embedded Version (`bookshelf-embedded.html`):**
- Background changed from gradient to `transparent`
- Removed colored container styling
- Clean, minimal appearance suitable for Ghost embeds

**Standalone Version (`bookshelf-widget.html`):**
- Background changed from gradient to solid `white`
- Maintains header and filter UI

### ✅ 2. Books Now Stack Vertically

**Previous Layout:**
- Books displayed horizontally (side-by-side) like spines on a shelf
- Vertical text orientation (rotated 180°)
- Different heights based on page count

**New Layout:**
- Books stack vertically (one on top of another) like a pile
- Horizontal text orientation
- Fixed height (50px per book)
- Cover thumbnail on the left, spine extends to the right
- Full-width responsive design (max-width: 600-700px)

**Visual Structure:**
```
[Cover] [━━━━━━━━━━━ Book Title ━━━━━━━━━━━]
[Cover] [━━━━━━━━━━━ Book Title ━━━━━━━━━━━]
[Cover] [━━━━━━━━━━━ Book Title ━━━━━━━━━━━]
```

### ✅ 3. Single Stack Display

**Previous:** Books grouped by year read (2024, 2023, etc.)
**New:** All books in a single continuous stack

- Removed year section labels
- Removed year grouping logic
- Simpler, cleaner presentation

### ✅ 4. Filters - Embedded vs Standalone

**Embedded Version (`bookshelf-embedded.html`):**
- ❌ **NO visible filter UI**
- Filters are hardcoded in CONFIG:
  ```javascript
  const CONFIG = {
      publishedUrl: '...',
      defaultFilter: 'all',        // 'all' or 'recommended'
      defaultYear: '',             // e.g., '2024'
      defaultGenre: ''             // e.g., 'Fiction'
  };
  ```
- To create filtered embeds, change these values and paste different versions in Ghost

**Standalone Version (`bookshelf-widget.html`):**
- ✅ **Keeps all filter UI**
- Interactive buttons and dropdowns:
  - "All Books" button
  - "Recommended" button
  - Year dropdown
  - Genre dropdown
- Good for testing and full-featured standalone pages

## CSS Changes Summary

### Book Element Styling

```css
/* OLD: Horizontal shelf view */
.book {
    display: flex;
    flex-direction: column;  /* thumbnail above spine */
}
.book-spine {
    width: 45px;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    height: 150px-350px;  /* variable based on pages */
}
.book-cover-thumb {
    width: 40px;
    height: 60px;
    margin-bottom: 8px;
}

/* NEW: Vertical stack view */
.book {
    display: flex;
    flex-direction: row;     /* thumbnail left, spine right */
    width: 100%;
    max-width: 600-700px;
}
.book-spine {
    flex: 1;
    height: 50px;            /* fixed height */
    text-align: left;
    /* normal horizontal text */
}
.book-cover-thumb {
    width: 60px;
    height: 50px;
    flex-shrink: 0;
}
```

### Container Styling

```css
/* OLD: Wooden shelf appearance */
.shelf {
    background: linear-gradient(180deg, #8B4513 0%, #5d2d0f 100%);
    padding: 30px 20px;
    box-shadow: multiple shadows;
}
.books-row {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}

/* NEW: Clean, transparent */
.shelf {
    background: transparent;
    padding: 0;
}
.books-row {
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

## How to Use Different Filters in Ghost

Since the embedded version has no UI, you can create multiple embeds with different filters:

### Example 1: Show All Books
```html
<!-- Copy bookshelf-embedded.html and use as-is -->
<div id="interactive-bookshelf-root"></div>
<script>
const CONFIG = {
    publishedUrl: '...',
    defaultFilter: 'all',
    defaultYear: '',
    defaultGenre: ''
};
</script>
```

### Example 2: Show Only Recommended Books
```html
<!-- Copy bookshelf-embedded.html and change CONFIG -->
<div id="interactive-bookshelf-root-recommended"></div>
<script>
const CONFIG = {
    publishedUrl: '...',
    defaultFilter: 'recommended',  // ← Changed
    defaultYear: '',
    defaultGenre: ''
};
// Change all 'interactive-bookshelf-root' to 'interactive-bookshelf-root-recommended'
</script>
```

### Example 3: Show Only 2024 Fiction Books
```html
<!-- Copy bookshelf-embedded.html and change CONFIG -->
<div id="interactive-bookshelf-root-2024-fiction"></div>
<script>
const CONFIG = {
    publishedUrl: '...',
    defaultFilter: 'all',
    defaultYear: '2024',        // ← Changed
    defaultGenre: 'Fiction'     // ← Changed
};
// Change all 'interactive-bookshelf-root' to 'interactive-bookshelf-root-2024-fiction'
</script>
```

## Testing

**Local Testing:**
```bash
./start-server.sh
```
Then visit:
- http://localhost:8000/bookshelf-widget.html (standalone with filters)
- http://localhost:8000/bookshelf-embedded.html (embed preview)

**Ghost Testing:**
1. Copy entire contents of `bookshelf-embedded.html`
2. Paste into Ghost HTML card
3. Publish and verify

## Files Modified

- ✅ `bookshelf-embedded.html` - Embed version (no filters, transparent)
- ✅ `bookshelf-widget.html` - Standalone version (with filters, white bg)

## Breaking Changes

⚠️ **If you previously embedded the old version in Ghost:**
- The layout will look completely different
- Books now stack vertically instead of horizontally
- Year labels are gone
- Wooden shelf styling is removed

**Migration:** Simply copy the new `bookshelf-embedded.html` and paste it again in Ghost.

## Benefits of New Design

1. **Cleaner appearance** - Transparent background blends with any Ghost theme
2. **Better readability** - Horizontal text is easier to read than vertical
3. **More responsive** - Stacked books work better on mobile
4. **Simpler** - No visual clutter from shelf graphics or year labels
5. **Flexible filtering** - Create multiple embeds with different filters

## Configuration Reference

### Embedded Version
```javascript
const CONFIG = {
    // Required
    publishedUrl: 'YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL',

    // Optional filters (all default to 'all' / empty)
    defaultFilter: 'all' | 'recommended',
    defaultYear: '2024' | '2023' | '',
    defaultGenre: 'Fiction' | 'Non-Fiction' | ''
};
```

### Standalone Version
Same CONFIG options, but filters are controlled by UI instead of being hardcoded.
