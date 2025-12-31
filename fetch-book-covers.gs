/**
 * Google Apps Script to Fetch Book Data from Open Library
 *
 * This script populates book metadata from Open Library API:
 * - Column D: Published Year
 * - Column G: Genre (primary subject)
 * - Column I: Page Count
 * - Column L: Cover URL
 *
 * INSTALLATION:
 * 1. Open your Google Sheet
 * 2. Click Extensions > Apps Script
 * 3. Delete any existing code in the editor
 * 4. Paste this entire script
 * 5. Click the disk icon to save (or Cmd/Ctrl + S)
 * 6. Name it "Fetch Book Data"
 *
 * USAGE:
 * 1. In Apps Script editor, select "fetchAllBookData" from the function dropdown
 * 2. Click the Run button (▶️)
 * 3. First time: Click "Review permissions" and authorize the script
 * 4. Watch the execution log or check your sheet - metadata will populate
 *
 * MENU OPTION (Recommended):
 * After saving, refresh your Google Sheet and you'll see a custom "Bookshelf" menu
 */

/**
 * Creates a custom menu in Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Bookshelf')
    .addItem('📚 Fetch All Book Data', 'fetchAllBookData')
    .addItem('🔄 Fetch Missing Data Only', 'fetchMissingData')
    .addItem('🖼️ Fetch Covers Only', 'fetchCoversOnly')
    .addSeparator()
    .addItem('🧹 Clear All Cover URLs', 'clearAllCovers')
    .addItem('🧹 Clear All Fetched Data', 'clearAllFetchedData')
    .addToUi();
}

/**
 * Fetches ALL book data for ALL books (covers, pages, genres, years)
 * Overwrites existing data
 */
function fetchAllBookData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Try to show confirmation dialog if running from UI, skip if running from script editor
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Fetch All Book Data',
      'This will fetch covers, page counts, genres, and published years for all books. May take several minutes. Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
    // Not in UI context (running from script editor), proceed without confirmation
    Logger.log('Running from script editor - proceeding without confirmation');
  }

  processBooks(sheet, {
    skipExisting: false,
    coversOnly: false
  });
}

/**
 * Fetches data only for books missing information
 * Preserves existing data
 */
function fetchMissingData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  processBooks(sheet, {
    skipExisting: true,
    coversOnly: false
  });
}

/**
 * Fetches only cover URLs (original behavior)
 */
function fetchCoversOnly() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Try to show confirmation dialog if running from UI, skip if running from script editor
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Fetch Cover URLs',
      'This will only fetch cover URLs (Column L). Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
    // Not in UI context (running from script editor), proceed without confirmation
    Logger.log('Running from script editor - proceeding without confirmation');
  }

  processBooks(sheet, {
    skipExisting: false,
    coversOnly: true
  });
}

/**
 * Clears all cover URLs from Column L
 */
function clearAllCovers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Try to show confirmation dialog if running from UI, skip if running from script editor
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Clear All Cover URLs',
      'This will delete all cover URLs from Column L. Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
    // Not in UI context (running from script editor), proceed without confirmation
    Logger.log('Running from script editor - proceeding without confirmation');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 12, lastRow - 1, 1).clearContent(); // Column L = 12
    try {
      SpreadsheetApp.getActiveSpreadsheet().toast('All cover URLs cleared!', 'Success', 3);
    } catch (e) {
      Logger.log('All cover URLs cleared!');
    }
  }
}

/**
 * Clears all auto-fetched data (Published Year, Genre, Pages, Cover URL)
 */
function clearAllFetchedData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Try to show confirmation dialog if running from UI, skip if running from script editor
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Clear All Fetched Data',
      'This will delete Published Year (D), Genre (G), Pages (I), and Cover URLs (L). Your Title, Author, and manual entries will remain. Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
    // Not in UI context (running from script editor), proceed without confirmation
    Logger.log('Running from script editor - proceeding without confirmation');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 4, lastRow - 1, 1).clearContent();  // Column D (Published Year)
    sheet.getRange(2, 7, lastRow - 1, 1).clearContent();  // Column G (Genre)
    sheet.getRange(2, 9, lastRow - 1, 1).clearContent();  // Column I (Pages)
    sheet.getRange(2, 12, lastRow - 1, 1).clearContent(); // Column L (Cover URL)
    try {
      SpreadsheetApp.getActiveSpreadsheet().toast('All fetched data cleared!', 'Success', 3);
    } catch (e) {
      Logger.log('All fetched data cleared!');
    }
  }
}

/**
 * Core processing function
 * @param {Sheet} sheet - The active sheet
 * @param {Object} options - Processing options
 */
function processBooks(sheet, options) {
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    try {
      SpreadsheetApp.getActiveSpreadsheet().toast('No books found in sheet', 'Error', 3);
    } catch (e) {
      Logger.log('No books found in sheet');
    }
    return;
  }

  // Get all data at once (more efficient)
  const titleColumn = sheet.getRange(2, 2, lastRow - 1, 1).getValues();      // Column B
  const authorColumn = sheet.getRange(2, 3, lastRow - 1, 1).getValues();     // Column C
  const yearColumn = sheet.getRange(2, 4, lastRow - 1, 1).getValues();       // Column D
  const genreColumn = sheet.getRange(2, 7, lastRow - 1, 1).getValues();      // Column G
  const pagesColumn = sheet.getRange(2, 9, lastRow - 1, 1).getValues();      // Column I
  const coverColumn = sheet.getRange(2, 12, lastRow - 1, 1).getValues();     // Column L

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  // Process each book
  for (let i = 0; i < titleColumn.length; i++) {
    const rowNum = i + 2; // +2 because we start at row 2
    const title = titleColumn[i][0];
    const author = authorColumn[i][0];

    const existingYear = yearColumn[i][0];
    const existingGenre = genreColumn[i][0];
    const existingPages = pagesColumn[i][0];
    const existingCover = coverColumn[i][0];

    // Skip empty rows
    if (!title || title.toString().trim() === '') {
      continue;
    }

    // Check if we should skip (when fetching missing only)
    if (options.skipExisting) {
      const hasAllData = existingYear && existingGenre && existingPages && existingCover;
      if (hasAllData) {
        skipped++;
        continue;
      }
    }

    // Fetch book data from API
    const bookData = fetchBookData(title, author);

    if (bookData) {
      let updated = false;

      // Update Published Year (Column D)
      if (bookData.publishedYear && (!options.skipExisting || !existingYear)) {
        sheet.getRange(rowNum, 4).setValue(bookData.publishedYear);
        updated = true;
      }

      // Update Genre (Column G) - only if not doing covers-only
      if (!options.coversOnly && bookData.genre && (!options.skipExisting || !existingGenre)) {
        sheet.getRange(rowNum, 7).setValue(bookData.genre);
        updated = true;
      }

      // Update Pages (Column I) - only if not doing covers-only
      if (!options.coversOnly && bookData.pages && (!options.skipExisting || !existingPages)) {
        sheet.getRange(rowNum, 9).setValue(bookData.pages);
        updated = true;
      }

      // Update Cover URL (Column L)
      if (bookData.coverUrl && (!options.skipExisting || !existingCover)) {
        sheet.getRange(rowNum, 12).setValue(bookData.coverUrl);
        updated = true;
      }

      if (updated) {
        processed++;
        Logger.log(`Row ${rowNum}: ✓ ${title} - ${JSON.stringify(bookData)}`);
      } else {
        skipped++;
      }
    } else {
      failed++;
      Logger.log(`Row ${rowNum}: ✗ No data found for "${title}"`);
    }

    // Rate limiting - Open Library allows ~100 req/min
    if (i < titleColumn.length - 1) {
      Utilities.sleep(700); // 700ms delay = ~85 requests/minute
    }

    // Update progress every 10 books
    if ((i + 1) % 10 === 0) {
      SpreadsheetApp.flush(); // Save changes
      try {
        SpreadsheetApp.getActiveSpreadsheet().toast(
          `Processing: ${i + 1}/${titleColumn.length} books...`,
          'Progress',
          2
        );
      } catch (e) {
        Logger.log(`Processing: ${i + 1}/${titleColumn.length} books...`);
      }
    }
  }

  // Final summary
  SpreadsheetApp.flush();
  const message = `Complete!\n✓ ${processed} books updated\n✗ ${failed} not found${options.skipExisting ? `\n⊘ ${skipped} skipped` : ''}`;
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(message, 'Done', 5);
  } catch (e) {
    // Not in UI context, just log
  }
  Logger.log(message);
}

/**
 * Tries multiple methods to find a cover URL for a book
 * @param {Object} book - Book object from Open Library search API
 * @returns {string|null} Cover URL or null if not found
 */
function findCoverUrl(book) {
  // Method 1: Direct cover_i from search results (most common)
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  }

  // Method 2: Try ISBN (very reliable for published books)
  if (book.isbn && book.isbn.length > 0) {
    // Try first ISBN (usually the most common edition)
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
  }

  // Method 3: Try Open Library ID (OLID) from edition_key
  if (book.edition_key && book.edition_key.length > 0) {
    return `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-M.jpg`;
  }

  // Method 4: Try LCCN (Library of Congress Control Number)
  if (book.lccn && book.lccn.length > 0) {
    return `https://covers.openlibrary.org/b/lccn/${book.lccn[0]}-M.jpg`;
  }

  // Method 5: Try OCLC (Online Computer Library Center number)
  if (book.oclc && book.oclc.length > 0) {
    return `https://covers.openlibrary.org/b/oclc/${book.oclc[0]}-M.jpg`;
  }

  return null;
}

/**
 * Fetches book data from Open Library API
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @returns {Object|null} Book data object or null if not found
 */
function fetchBookData(title, author) {
  try {
    // Strategy 1: Try with full title first
    let searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`;
    let response = UrlFetchApp.fetch(searchUrl, {
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'BookshelfWidget/1.0 (Google Apps Script)'
      }
    });

    if (response.getResponseCode() !== 200) {
      Logger.log(`API error for "${title}": ${response.getResponseCode()}`);
      return null;
    }

    let data = JSON.parse(response.getContentText());

    // Strategy 2: If no results, try with simplified title (remove subtitle)
    if (!data.docs || data.docs.length === 0) {
      const simplifiedTitle = title.split(':')[0].split('—')[0].split(' - ')[0].trim();

      // Only try if the simplified title is different and not too short
      if (simplifiedTitle !== title && simplifiedTitle.length > 3) {
        searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(simplifiedTitle)}&author=${encodeURIComponent(author)}&limit=1`;
        response = UrlFetchApp.fetch(searchUrl, {
          muteHttpExceptions: true,
          headers: {
            'User-Agent': 'BookshelfWidget/1.0 (Google Apps Script)'
          }
        });

        if (response.getResponseCode() === 200) {
          data = JSON.parse(response.getContentText());
        }
      }
    }

    if (!data.docs || data.docs.length === 0) {
      return null;
    }

    const book = data.docs[0];
    const result = {};

    // Extract Published Year
    if (book.first_publish_year) {
      result.publishedYear = book.first_publish_year;
    }

    // Extract Genre (take first subject that looks like a genre)
    if (book.subject && book.subject.length > 0) {
      // Filter out very long subjects (likely not genres) and common non-genre subjects
      const skipTerms = ['accessible book', 'protected daisy', 'in library', 'lending library'];
      const genres = book.subject.filter(s => {
        const lower = s.toLowerCase();
        return s.length < 30 && !skipTerms.some(term => lower.includes(term));
      });

      if (genres.length > 0) {
        result.genre = genres[0]; // Take the first viable genre
      }
    }

    // Extract Page Count
    if (book.number_of_pages_median) {
      result.pages = Math.round(book.number_of_pages_median);
    } else if (book.num_pages && book.num_pages.length > 0) {
      // Fallback to first reported page count
      result.pages = book.num_pages[0];
    }

    // Extract Cover URL - try multiple methods
    result.coverUrl = findCoverUrl(book);

    // Return result only if we found at least something
    if (Object.keys(result).length > 0) {
      return result;
    }

    return null;

  } catch (error) {
    Logger.log(`Error fetching data for "${title}": ${error.message}`);
    return null;
  }
}

/**
 * Test function to diagnose why books aren't being found
 * Tests multiple search strategies
 */
function testFailedBooks() {
  const failedBooks = [
    { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams" },
    { title: "Masters of Doom: How Two Guys Created an Empire and Transformed Pop Culture", author: "David Kushner" },
    { title: "No Filter: The Inside Story of Instagram", author: "Sarah Frier" },
    { title: "Same As Ever: A Guide to What Never Changes", author: "Morgan Housel" }
  ];

  for (const book of failedBooks) {
    Logger.log(`\n${'='.repeat(60)}`);
    Logger.log(`Testing: "${book.title}"`);
    Logger.log(`Author: ${book.author}`);
    Logger.log('='.repeat(60));

    // Test 1: Search with both title and author (current method)
    try {
      const url1 = `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&limit=1`;
      Logger.log(`\n📍 Method 1: Title + Author`);
      Logger.log(`URL: ${url1}`);
      const resp1 = UrlFetchApp.fetch(url1, { muteHttpExceptions: true });
      const data1 = JSON.parse(resp1.getContentText());
      Logger.log(`Results: ${data1.numFound || 0} found`);
      if (data1.docs && data1.docs.length > 0) {
        Logger.log(`First result: "${data1.docs[0].title}" by ${data1.docs[0].author_name ? data1.docs[0].author_name[0] : 'Unknown'}`);
      }
    } catch (e) {
      Logger.log(`Error: ${e.message}`);
    }

    // Test 2: Search with title only
    try {
      const url2 = `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&limit=3`;
      Logger.log(`\n📍 Method 2: Title Only (top 3 results)`);
      Logger.log(`URL: ${url2}`);
      const resp2 = UrlFetchApp.fetch(url2, { muteHttpExceptions: true });
      const data2 = JSON.parse(resp2.getContentText());
      Logger.log(`Results: ${data2.numFound || 0} found`);
      if (data2.docs && data2.docs.length > 0) {
        data2.docs.slice(0, 3).forEach((doc, i) => {
          Logger.log(`  ${i + 1}. "${doc.title}" by ${doc.author_name ? doc.author_name[0] : 'Unknown'} (${doc.first_publish_year || 'N/A'})`);
        });
      }
    } catch (e) {
      Logger.log(`Error: ${e.message}`);
    }

    // Test 3: Search with simplified title (remove subtitle)
    const simplifiedTitle = book.title.split(':')[0].split('—')[0].trim();
    if (simplifiedTitle !== book.title) {
      try {
        const url3 = `https://openlibrary.org/search.json?title=${encodeURIComponent(simplifiedTitle)}&author=${encodeURIComponent(book.author)}&limit=1`;
        Logger.log(`\n📍 Method 3: Simplified Title + Author`);
        Logger.log(`Simplified: "${simplifiedTitle}"`);
        Logger.log(`URL: ${url3}`);
        const resp3 = UrlFetchApp.fetch(url3, { muteHttpExceptions: true });
        const data3 = JSON.parse(resp3.getContentText());
        Logger.log(`Results: ${data3.numFound || 0} found`);
        if (data3.docs && data3.docs.length > 0) {
          Logger.log(`First result: "${data3.docs[0].title}" by ${data3.docs[0].author_name ? data3.docs[0].author_name[0] : 'Unknown'}`);
        }
      } catch (e) {
        Logger.log(`Error: ${e.message}`);
      }
    }

    Utilities.sleep(1000); // Rate limiting
  }
}

/**
 * Test function: Fetch data for a single book with detailed logging
 * Modify the title/author and run this to test
 */
function testSingleBook() {
  const title = "The Hitchhiker's Guide to the Galaxy";
  const author = "Douglas Adams";

  Logger.log(`\n========================================`);
  Logger.log(`Testing: "${title}" by ${author}`);
  Logger.log(`========================================\n`);

  try {
    // Fetch raw search results
    const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`;
    const response = UrlFetchApp.fetch(searchUrl);
    const data = JSON.parse(response.getContentText());

    if (!data.docs || data.docs.length === 0) {
      Logger.log('✗ No results found from Open Library API');
      return;
    }

    const book = data.docs[0];

    Logger.log('📖 Search result found:');
    Logger.log(`  Title: ${book.title || 'N/A'}`);
    Logger.log(`  Author: ${book.author_name ? book.author_name.join(', ') : 'N/A'}`);
    Logger.log(`\n🔍 Available identifiers:`);
    Logger.log(`  cover_i: ${book.cover_i || 'N/A'}`);
    Logger.log(`  isbn: ${book.isbn ? book.isbn.slice(0, 3).join(', ') + '...' : 'N/A'}`);
    Logger.log(`  edition_key: ${book.edition_key ? book.edition_key[0] : 'N/A'}`);
    Logger.log(`  lccn: ${book.lccn ? book.lccn[0] : 'N/A'}`);
    Logger.log(`  oclc: ${book.oclc ? book.oclc[0] : 'N/A'}`);

    // Now fetch using our function
    const bookData = fetchBookData(title, author);

    Logger.log(`\n✅ Extracted data:`);
    Logger.log(`  Published Year: ${bookData.publishedYear || 'N/A'}`);
    Logger.log(`  Genre: ${bookData.genre || 'N/A'}`);
    Logger.log(`  Pages: ${bookData.pages || 'N/A'}`);
    Logger.log(`  Cover URL: ${bookData.coverUrl || 'N/A'}`);

    if (bookData.coverUrl) {
      Logger.log(`\n🎨 Cover found! Test it here:`);
      Logger.log(`  ${bookData.coverUrl}`);
    } else {
      Logger.log(`\n⚠️  No cover URL found. Book may not have cover in Open Library.`);
    }

  } catch (error) {
    Logger.log(`\n❌ Error: ${error.message}`);
  }
}
