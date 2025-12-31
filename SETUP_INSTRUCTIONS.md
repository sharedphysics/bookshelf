# 🔧 Bookshelf Widget Setup Instructions

## Problem: Widget Not Loading Data

If you're seeing "Loading your bookshelf..." forever and no books appear, the issue is that your Google Sheet needs to be **published to the web**.

**Note:** "Sharing" and "Publishing" are different things in Google Sheets!

## ✅ Solution: Publish Your Google Sheet

### Step-by-Step Guide:

1. **Open your Google Sheet:**
   - Go to: https://docs.google.com/spreadsheets/d/1_nxJgOBMiBLm8CiJfoYoZK2O4_we_8bWrjOtcUDcc4k/edit

2. **Publish to Web:**
   - Click **File** in the top menu
   - Select **Share → Publish to web**
   - You'll see a dialog box

3. **Configure Publishing:**
   - **Link tab:** Make sure this is selected
   - **First dropdown:** Select your sheet name (probably "Sheet1")
   - **Second dropdown:** Select **"Comma-separated values (.csv)"**
   - Click the **"Publish"** button
   - Click **"OK"** on the confirmation

4. **Copy the Published URL:**
   - After publishing, you'll see a URL that looks like:
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-XXXXXXXXX/pub?output=csv
   ```
   - **Important:** Note the `/e/` and `2PACX` in the URL - this is different from your edit URL!

5. **Update the Widget Configuration:**
   - Open `bookshelf-widget.html` or `bookshelf-embedded.html`
   - Find the `CONFIG` section (around line 410 or 347)
   - You have two options:

   **Option A: Use the full published URL (RECOMMENDED)**
   ```javascript
   const CONFIG = {
       publishedUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-XXXXXXXXX/pub?output=csv',
       // Comment out or remove sheetId and sheetName
   };
   ```

   **Option B: Keep the current format**
   ```javascript
   const CONFIG = {
       sheetId: '1_nxJgOBMiBLm8CiJfoYoZK2O4_we_8bWrjOtcUDcc4k',
       sheetName: 'Sheet1'
   };
   ```
   (This should work once the sheet is published, but Option A is more reliable)

## 🧪 Testing

### Method 1: Use the Diagnostic Page

1. Open `test-sheet-access.html` in your browser
2. Click "Run Tests"
3. Look for green ✅ success messages
4. If you see red ❌ errors, the sheet isn't published correctly

### Method 2: Direct URL Test

Open this URL in your browser (replace with your published URL):
```
https://docs.google.com/spreadsheets/d/1_nxJgOBMiBLm8CiJfoYoZK2O4_we_8bWrjOtcUDcc4k/gviz/tq?tqx=out:csv&sheet=Sheet1
```

**What you should see:**
- ✅ Good: CSV data (comma-separated text with your books)
- ❌ Bad: Login page or error message

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or CORS error

**Cause:** Sheet is not published to the web
**Fix:** Follow the "Publish Your Google Sheet" steps above

### Issue: "HTTP 403 Forbidden"

**Cause:** Sheet permissions are too restrictive
**Fix:**
1. Go to **File → Share → Publish to web** (not just "Share")
2. Ensure it's published with CSV output
3. Also check **Share** button → "Anyone with the link" can view

### Issue: "HTTP 404 Not Found"

**Cause:** Wrong sheet ID or sheet name
**Fix:**
1. Check your sheet URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
2. The sheet ID is the long string between `/d/` and `/edit`
3. Check the tab name at the bottom of your sheet (default is "Sheet1")

### Issue: Data loads but no books appear

**Cause:** Column structure doesn't match expected format
**Fix:** Ensure your columns are in this order:
- A: Recommended? (⭐, yes, y, or blank)
- B: Title
- C: Author
- D: Published Year
- E: Type (Print/Digital/Audio)
- F: Year Read
- G: Genre
- H: Rating (1-5)
- I: Thoughts

### Issue: Dropdowns are empty

**Cause:** Missing data in Genre or Year Read columns
**Fix:**
1. Add genres to column G for your books
2. Add year read to column F for your books
3. Reload the page

## 📊 Recommended Data Format

For best results, fill in these columns for each book:

### Required:
- **Title** (Column B) - Must have this!
- **Author** (Column C) - Highly recommended

### Optional but Recommended:
- **Recommended** (Column A) - Use ⭐ or "yes" for recommended books
- **Year Read** (Column F) - Needed for year filter and shelf grouping
- **Genre** (Column G) - Needed for genre filter
- **Rating** (Column H) - Shows stars in modal (1-5)
- **Thoughts** (Column I) - Your review/notes

### Less Important:
- **Published Year** (Column D) - Will auto-fetch from Open Library if missing
- **Type** (Column E) - Print, Digital, or Audio

## 🔄 Alternative: Use Google Sheets API (Advanced)

If publishing to web doesn't work (corporate/school restrictions), you can use the Google Sheets API:

1. Get a Google Cloud API key
2. Enable Google Sheets API
3. Update the widget to use the API endpoint

This is more complex but works in restricted environments.

## ✉️ Still Having Issues?

1. Run the diagnostic test page: `test-sheet-access.html`
2. Check your browser's console for errors (F12 → Console tab)
3. Verify your sheet structure matches the expected format
4. Ensure the sheet is published (not just shared)

## 📝 Quick Checklist

- [ ] Google Sheet is published to web (File → Share → Publish to web)
- [ ] CSV format selected in publish settings
- [ ] Sheet has data in columns A-I
- [ ] At least Title (column B) is filled for each book
- [ ] Widget CONFIG section has correct sheet ID
- [ ] Test page (`test-sheet-access.html`) shows ✅ success
- [ ] Browser console shows no CORS errors
