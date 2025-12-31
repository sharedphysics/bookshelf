# Google Apps Script Setup Guide
## Auto-Populating Book Metadata from Open Library

This guide walks you through setting up automatic book data fetching using Google Apps Script.

---

## What This Script Does

**Automatically fetches from Open Library API:**
- ✅ **Column D**: Published Year
- ✅ **Column G**: Genre (primary subject)
- ✅ **Column I**: Page Count
- ✅ **Column L**: Cover URL

**You only need to provide:**
- Column B: Title (required)
- Column C: Author (required)

Everything else can be auto-populated!

---

## Performance

**Before:** Manual data entry for 70 books = hours of work

**After:** Run script once = ~1 minute, all data populated automatically

**Widget Load Time:** 1 second (vs 15 seconds with on-page API calls)

---

## Installation Steps

### Step 1: Verify Your Sheet Structure

Make sure you have these column headers in row 1:

| Column | Header | Auto-Populated? |
|--------|---------|-----------------|
| A | Recommended | ❌ (manual) |
| B | Title | ❌ (manual) |
| C | Author | ❌ (manual) |
| D | Published Year | ✅ (script fills this) |
| E | Type | ❌ (manual) |
| F | Year Read | ❌ (manual) |
| G | Genre | ✅ (script fills this) |
| H | Sub-Genre | ❌ (manual) |
| I | Pages | ✅ (script fills this) |
| J | Rating | ❌ (manual) |
| K | Thoughts | ❌ (manual) |
| L | Cover URL | ✅ (script fills this) |

---

### Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a code editor with a default `myFunction()`
3. **Select all existing code** and delete it
4. The editor should now be blank

---

### Step 3: Paste the Script

1. Open the file: `fetch-book-covers.gs` (in your bookshelf folder)
2. Copy the entire contents
3. Paste into the Apps Script editor
4. Click the **disk icon** to save (or `Cmd/Ctrl + S`)
5. Name the project: **"Bookshelf Data Fetcher"**

---

### Step 4: First-Time Authorization

1. In the Apps Script editor, select **`testSingleBook`** from the function dropdown (top center)
2. Click the **Run button (▶️)**
3. You'll see a popup: **"Authorization required"**
4. Click **Review permissions**
5. Choose your Google account
6. Click **Advanced** → **Go to Bookshelf Data Fetcher (unsafe)**
   - Don't worry, this is your own script - Google shows this warning for all custom scripts
7. Click **Allow**

---

### Step 5: Test the Script

Before running on all books, test with one book:

1. In the Apps Script editor, find the `testSingleBook()` function (line 352)
2. Modify the title and author to match a book in your sheet:
   ```javascript
   const title = "Your Book Title";
   const author = "Book Author";
   ```
3. Run `testSingleBook` from the dropdown
4. Check the execution log (bottom panel) - you should see:
   ```
   ✓ Data found:
     Published Year: 2023
     Genre: Fiction
     Pages: 284
     Cover URL: https://covers.openlibrary.org/b/id/12345-M.jpg
   ```

If the test works, you're ready to run on all books!

---

### Step 6: Run on All Books

**Option A: Run from Apps Script Editor**
1. Select `fetchAllBookData` from the dropdown
2. Click Run (▶️)
3. Click **Yes** to confirm
4. Watch the execution log at the bottom

**Option B: Run from Custom Menu (Easier)**
1. Close the Apps Script editor
2. **Refresh your Google Sheet** (reload the page)
3. You'll now see a **"Bookshelf"** menu in the menu bar
4. Click **Bookshelf** → **📚 Fetch All Book Data**
5. Click **Yes** to confirm
6. Watch the progress toasts in the bottom-right corner

---

## Menu Options Explained

After installation, you'll have these menu options:

### **📚 Fetch All Book Data**
Fetches **everything** for **all books**: covers, pages, genres, and published years.
- Overwrites existing data
- Use when: First run, or you want to refresh all metadata

### **🔄 Fetch Missing Data Only**
Only fills in **empty cells** - preserves your existing data.
- Skips books that already have all fields populated
- Use when: You've added new books and want to populate only those

### **🖼️ Fetch Covers Only**
Only fetches cover URLs (Column L).
- Doesn't touch genres or page counts
- Use when: You only want to update covers

### **🧹 Clear All Cover URLs**
Deletes all URLs from Column L.
- Use when: You want to re-fetch all covers

### **🧹 Clear All Fetched Data**
Deletes all auto-populated data (D, G, I, L).
- Keeps your manual entries (Title, Author, Rating, etc.)
- Use when: You want to start fresh

---

## What Happens When You Run It

1. **Script starts**: You'll see "Processing: 10/70 books..." toasts
2. **For each book**, the script:
   - Searches Open Library for the title + author
   - Extracts published year, genre, page count, and cover URL
   - Writes data to your sheet
   - Waits 700ms (rate limiting)
3. **Progress updates**: Every 10 books, you'll see an update
4. **Completion**: Final summary shows:
   - ✓ How many books were updated
   - ✗ How many failed (no data available)
   - ⊘ How many were skipped (when using "missing only" mode)

**Time:** ~1 minute for 70 books (700ms delay per book for API rate limiting)

---

## Viewing the Results

After the script completes, check your sheet:

### Column D (Published Year)
```
2023
1984
2019
...
```

### Column G (Genre)
```
Fiction
Science fiction
Biography
Historical fiction
...
```

### Column I (Pages)
```
284
328
256
412
...
```

### Column L (Cover URL)
```
https://covers.openlibrary.org/b/id/12345678-M.jpg
https://covers.openlibrary.org/b/id/87654321-M.jpg
...
```

---

## Smart Features

### 1. Preserves Your Manual Data

When using **"Fetch Missing Data Only"**, the script:
- ✅ Only fills empty cells
- ✅ Never overwrites your manual entries
- ✅ Smart enough to skip books you've already customized

### 2. Intelligent Genre Selection

The script filters out non-genre subjects like:
- ❌ "Accessible book"
- ❌ "Protected DAISY"
- ❌ "In library"
- ❌ Very long subjects (> 30 characters)

It picks the **first viable genre** from Open Library's subject list.

### 3. Page Count Accuracy

The script uses `number_of_pages_median` when available (most accurate), falling back to the first reported page count if median isn't available.

---

## Troubleshooting

### Some books don't have data?

**Reason:** Not all books are in Open Library's database, or the title/author doesn't match exactly.

**Solutions:**
1. **Manually enter the data** in your sheet
2. **Adjust the title/author** in your sheet to match Open Library's format
   - Example: "Harry Potter 1" → "Harry Potter and the Philosopher's Stone"
3. **Leave blank** - the widget will use default values (250 pages for height calculation)

---

### Genres seem wrong?

**Reason:** Open Library's subjects can be broad or specific.

**Solution:** Manually override Genre (Column G) for any book. The script won't overwrite it if you use "Fetch Missing Data Only."

---

### Script times out?

**Reason:** Google Apps Script has a 6-minute execution limit. If you have 500+ books, it may timeout.

**Solutions:**
1. Use **"Fetch Missing Data Only"** instead
2. Process in batches:
   - Delete rows below row 100
   - Run script
   - Re-add rows 101-200 and run again

---

### Script errors in execution log?

**Common errors:**
- `API error: 429` → Rate limited, increase delay (change `700` to `1000` on line 246)
- `API error: 503` → Open Library temporarily down, try again later
- `No books found` → Make sure row 1 is your header row
- `No data found for "Title"` → Book not in Open Library database

---

## Examples of What Gets Populated

### Fiction Book Example
```
Title: The Maniac
Author: Benjamin Labatut

Auto-populated:
Published Year: 2023
Genre: Fiction
Pages: 284
Cover URL: https://covers.openlibrary.org/b/id/12345-M.jpg
```

### Classic Book Example
```
Title: 1984
Author: George Orwell

Auto-populated:
Published Year: 1949
Genre: Dystopian fiction
Pages: 328
Cover URL: https://covers.openlibrary.org/b/id/98765-M.jpg
```

### Non-Fiction Example
```
Title: Sapiens
Author: Yuval Noah Harari

Auto-populated:
Published Year: 2011
Genre: History
Pages: 443
Cover URL: https://covers.openlibrary.org/b/id/45678-M.jpg
```

---

## Re-running the Script

**When to re-run:**
- You add new books to your sheet
- A book previously had no data, but now might
- You want to refresh all metadata

**How to re-run:**
- **Bookshelf** → **📚 Fetch All Book Data** (refresh everything)
- **Bookshelf** → **🔄 Fetch Missing Data Only** (new books only)

---

## Best Practices

### Starting Fresh
1. Add only **Title (B)** and **Author (C)** columns manually
2. Run **Bookshelf** → **📚 Fetch All Book Data**
3. Review auto-populated data
4. Manually correct any errors
5. Add your personal data (Rating, Thoughts, etc.)

### Adding New Books
1. Add new row with **Title** and **Author**
2. Run **Bookshelf** → **🔄 Fetch Missing Data Only**
3. Only the new row gets populated

### Correcting Data
1. Manually edit any field in your sheet
2. Future runs with **"Fetch Missing Data Only"** won't overwrite your changes
3. Use **"Fetch All Book Data"** only if you want to overwrite everything

---

## Advanced: Customizing What Gets Fetched

You can modify the script to customize genre selection:

### Change Genre Priority

In `fetch-book-covers.gs`, find line 305:

```javascript
// Current: takes first viable genre
result.genre = genres[0];

// Option: take multiple genres (comma-separated)
result.genre = genres.slice(0, 3).join(', ');

// Option: prefer certain genres
const priority = ['fiction', 'non-fiction', 'biography'];
const preferred = genres.find(g => priority.some(p => g.toLowerCase().includes(p)));
result.genre = preferred || genres[0];
```

---

## Summary

✅ **One-time setup**: 5 minutes
✅ **Execution time**: ~1 minute for 70 books
✅ **Data populated**: Published year, genre, page count, cover URL
✅ **Maintenance**: Run "Fetch Missing Data" when you add books
✅ **Manual control**: Override any field manually, script won't overwrite
✅ **Widget benefit**: Instant loading with complete book data

You now have a fully automated book metadata system! 🎉
