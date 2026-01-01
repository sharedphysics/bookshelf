/**
 * Google Apps Script to Fetch Book Data from Open Library with Base64 Covers
 *
 * This script populates book metadata from Open Library API:
 * - Column D: Published Year
 * - Column G: Genre (primary subject)
 * - Column I: Page Count
 * - Column L: Cover URL (fallback)
 * - Column M: Cover as Base64 Data URI (preferred, self-contained)
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
 * NOTE: This version fetches actual images and converts to base64 for offline use.
 * Images are stored directly in your spreadsheet, making it fully self-contained.
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
    .addItem('🧹 Clear All Cover Data', 'clearAllCovers')
    .addItem('🧹 Clear All Fetched Data', 'clearAllFetchedData')
    .addToUi();
}

/**
 * Fetches ALL book data for ALL books (covers, pages, genres, years)
 * Overwrites existing data
 */
function fetchAllBookData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Fetch All Book Data',
      'This will fetch covers as base64 images, page counts, genres, and published years for all books. May take several minutes. Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
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
 * Fetches only cover images as base64
 */
function fetchCoversOnly() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Fetch Cover Images',
      'This will fetch and convert cover images to base64 (Column L). This may take some time. Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
    Logger.log('Running from script editor - proceeding without confirmation');
  }

  processBooks(sheet, {
    skipExisting: false,
    coversOnly: true
  });
}

/**
 * Clears all cover data from Column L
 */
function clearAllCovers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Clear All Cover Data',
      'This will delete all cover images from Column L. Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
    Logger.log('Running from script editor - proceeding without confirmation');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 12, lastRow - 1, 1).clearContent(); // Column L (URL)
    sheet.getRange(2, 13, lastRow - 1, 1).clearContent(); // Column M (Base64)
    try {
      SpreadsheetApp.getActiveSpreadsheet().toast('All cover data cleared!', 'Success', 3);
    } catch (e) {
      Logger.log('All cover data cleared!');
    }
  }
}

/**
 * Clears all auto-fetched data (Published Year, Genre, Pages, Cover)
 */
function clearAllFetchedData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Clear All Fetched Data',
      'This will delete Published Year (D), Genre (G), Pages (I), and Cover images (L). Your Title, Author, and manual entries will remain. Continue?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  } catch (e) {
    Logger.log('Running from script editor - proceeding without confirmation');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 4, lastRow - 1, 1).clearContent();  // Column D (Published Year)
    sheet.getRange(2, 7, lastRow - 1, 1).clearContent();  // Column G (Genre)
    sheet.getRange(2, 9, lastRow - 1, 1).clearContent();  // Column I (Pages)
    sheet.getRange(2, 12, lastRow - 1, 1).clearContent(); // Column L (Cover URL)
    sheet.getRange(2, 13, lastRow - 1, 1).clearContent(); // Column M (Cover Base64)
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
  const coverUrlColumn = sheet.getRange(2, 12, lastRow - 1, 1).getValues();  // Column L
  const coverBase64Column = sheet.getRange(2, 13, lastRow - 1, 1).getValues(); // Column M

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
    const existingCoverUrl = coverUrlColumn[i][0];
    const existingCoverBase64 = coverBase64Column[i][0];

    // Skip empty rows
    if (!title || title.toString().trim() === '') {
      continue;
    }

    // Check if we should skip (when fetching missing only)
    if (options.skipExisting) {
      const hasAllData = existingYear && existingGenre && existingPages && (existingCoverUrl || existingCoverBase64);
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
      if (bookData.coverUrl && (!options.skipExisting || !existingCoverUrl)) {
        sheet.getRange(rowNum, 12).setValue(bookData.coverUrl);
        updated = true;
      }

      // Update Cover as Base64 (Column M)
      if (bookData.coverBase64 && (!options.skipExisting || !existingCoverBase64)) {
        sheet.getRange(rowNum, 13).setValue(bookData.coverBase64);
        updated = true;
      }

      if (updated) {
        processed++;
        Logger.log(`Row ${rowNum}: ✓ ${title}`);
      } else {
        skipped++;
      }
    } else {
      failed++;
      Logger.log(`Row ${rowNum}: ✗ No data found for "${title}"`);
    }

    // Rate limiting - Open Library allows ~100 req/min
    if (i < titleColumn.length - 1) {
      Utilities.sleep(800); // 800ms delay for image fetching
    }

    // Update progress every 5 books
    if ((i + 1) % 5 === 0) {
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
 * Fetches cover image and converts to base64 data URI
 * @param {string} coverUrl - The Open Library cover URL
 * @returns {string|null} Base64 data URI or null if failed
 */
function fetchCoverAsBase64(coverUrl) {
  if (!coverUrl) return null;

  try {
    // Fetch the image
    const response = UrlFetchApp.fetch(coverUrl, {
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'BookshelfWidget/1.0 (Google Apps Script)'
      }
    });

    if (response.getResponseCode() !== 200) {
      return null;
    }

    // Get the binary image data
    const imageBlob = response.getBlob();
    const imageBytes = imageBlob.getBytes();

    // Convert to base64
    const base64 = Utilities.base64Encode(imageBytes);

    // Create data URI
    const dataUri = `data:image/jpeg;base64,${base64}`;

    // Check size (Google Sheets cell limit is ~50,000 characters)
    if (dataUri.length > 45000) {
      Logger.log(`⚠️  Image too large (${dataUri.length} chars), skipping`);
      return null;
    }

    return dataUri;

  } catch (error) {
    Logger.log(`Error fetching cover: ${error.message}`);
    return null;
  }
}

/**
 * Tries multiple methods to find a cover URL for a book
 * Uses -S (small) size to keep base64 data manageable
 * @param {Object} book - Book object from Open Library search API
 * @returns {string|null} Cover URL or null if not found
 */
function findCoverUrl(book) {
  // Method 1: Direct cover_i from search results (most common)
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`;
  }

  // Method 2: Try ISBN (very reliable for published books)
  if (book.isbn && book.isbn.length > 0) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-S.jpg`;
  }

  // Method 3: Try Open Library ID (OLID) from edition_key
  if (book.edition_key && book.edition_key.length > 0) {
    return `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-S.jpg`;
  }

  // Method 4: Try LCCN (Library of Congress Control Number)
  if (book.lccn && book.lccn.length > 0) {
    return `https://covers.openlibrary.org/b/lccn/${book.lccn[0]}-S.jpg`;
  }

  // Method 5: Try OCLC (Online Computer Library Center number)
  if (book.oclc && book.oclc.length > 0) {
    return `https://covers.openlibrary.org/b/oclc/${book.oclc[0]}-S.jpg`;
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
      const skipTerms = ['accessible book', 'protected daisy', 'in library', 'lending library'];
      const genres = book.subject.filter(s => {
        const lower = s.toLowerCase();
        return s.length < 30 && !skipTerms.some(term => lower.includes(term));
      });

      if (genres.length > 0) {
        result.genre = genres[0];
      }
    }

    // Extract Page Count
    if (book.number_of_pages_median) {
      result.pages = Math.round(book.number_of_pages_median);
    } else if (book.num_pages && book.num_pages.length > 0) {
      result.pages = book.num_pages[0];
    }

    // Extract Cover URL and convert to base64
    const coverUrl = findCoverUrl(book);
    if (coverUrl) {
      // Store the URL as fallback
      result.coverUrl = coverUrl;

      // Try to fetch and convert to base64
      const base64Cover = fetchCoverAsBase64(coverUrl);
      if (base64Cover) {
        result.coverBase64 = base64Cover;
      }
    }

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
 * Test function: Fetch data for a single book with detailed logging
 */
function testSingleBook() {
  const title = "The Hitchhiker's Guide to the Galaxy";
  const author = "Douglas Adams";

  Logger.log(`\n========================================`);
  Logger.log(`Testing: "${title}" by ${author}`);
  Logger.log(`========================================\n`);

  const bookData = fetchBookData(title, author);

  if (bookData) {
    Logger.log('✅ Extracted data:');
    Logger.log(`  Published Year: ${bookData.publishedYear || 'N/A'}`);
    Logger.log(`  Genre: ${bookData.genre || 'N/A'}`);
    Logger.log(`  Pages: ${bookData.pages || 'N/A'}`);
    Logger.log(`  Cover URL: ${bookData.coverUrl || 'N/A'}`);
    Logger.log(`  Cover Base64: ${bookData.coverBase64 ? `✓ (${bookData.coverBase64.length} chars)` : 'N/A'}`);

    if (bookData.coverUrl && bookData.coverBase64) {
      Logger.log(`\n🎨 Both URL and Base64 available!`);
      Logger.log(`   URL: ${bookData.coverUrl}`);
      Logger.log(`   Base64 size: ${bookData.coverBase64.length} characters`);
    } else if (bookData.coverUrl) {
      Logger.log(`\n⚠️  URL only (base64 conversion failed or too large)`);
    }
  } else {
    Logger.log('✗ No data found');
  }
}
