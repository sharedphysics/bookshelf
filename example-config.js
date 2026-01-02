/**
 * Example Configuration for Interactive Bookshelf
 *
 * Copy these configuration examples into your HTML files
 * and update with your actual Google Sheet URL.
 */

// ============================================
// STANDALONE VERSION (bookshelf-widget.html)
// ============================================

const STANDALONE_CONFIG = {
    // Your published Google Sheet CSV URL
    // Get this from: File → Share → Publish to web → CSV format
    publishedUrl: 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID_HERE/pub?output=csv'
};


// ============================================
// EMBEDDED VERSION (bookshelf-embedded.html)
// ============================================

const EMBEDDED_CONFIG = {
    // Your published Google Sheet CSV URL
    publishedUrl: 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID_HERE/pub?output=csv',

    // Default filters (optional - these filter the display without UI controls)
    // Leave empty to show all books, or set values to filter the display

    // Show all books or only recommended ones
    defaultFilter: 'all',          // Options: 'all' or 'recommended'

    // Filter by year read (leave empty for all years)
    defaultYear: '',               // Example: '2024' to show only books read in 2024

    // Filter by genre (leave empty for all genres)
    defaultGenre: ''               // Example: 'Fiction' to show only Fiction books
};


// ============================================
// EXAMPLE FILTER CONFIGURATIONS
// ============================================

// Example 1: Show only recommended books from 2024
const EXAMPLE_RECOMMENDED_2024 = {
    publishedUrl: 'YOUR_URL_HERE',
    defaultFilter: 'recommended',
    defaultYear: '2024',
    defaultGenre: ''
};

// Example 2: Show only Fiction books
const EXAMPLE_FICTION_ONLY = {
    publishedUrl: 'YOUR_URL_HERE',
    defaultFilter: 'all',
    defaultYear: '',
    defaultGenre: 'Fiction'
};

// Example 3: Show all books (no filters)
const EXAMPLE_ALL_BOOKS = {
    publishedUrl: 'YOUR_URL_HERE',
    defaultFilter: 'all',
    defaultYear: '',
    defaultGenre: ''
};


// ============================================
// GETTING YOUR PUBLISHED URL
// ============================================

/*
 * STEP 1: Open your Google Sheet
 *
 * STEP 2: Publish to web
 *   - Click: File → Share → Publish to web
 *   - Under "Link", select your specific sheet (e.g., "Sheet1")
 *   - Choose "Comma-separated values (.csv)" from the dropdown
 *   - Click "Publish"
 *   - Click "OK" to confirm
 *
 * STEP 3: Copy the URL
 *   - The URL will look like this:
 *     https://docs.google.com/spreadsheets/d/e/2PACX-1vXXXXXXXXX.../pub?output=csv
 *   - Copy this entire URL
 *
 * STEP 4: Update your config
 *   - Paste the URL into the publishedUrl field above
 *   - Replace 'YOUR_SHEET_ID_HERE' or 'YOUR_URL_HERE' with your actual URL
 */
