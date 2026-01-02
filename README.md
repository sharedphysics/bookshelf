# Interactive Bookshelf

A beautiful, fast-loading interactive bookshelf widget that displays your reading list from Google Sheets.

![Demo](https://img.shields.io/badge/demo-live-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- 📚 **Beautiful book covers** from Open Library
- ⚡ **Instant loading** - pre-fetched covers load in ~1 second
- 📊 **Reading analytics** - charts, metrics, and insights
- 🎯 **Smart filtering** - by year, genre, and recommendation status
- 📱 **Fully responsive** - works on desktop, tablet, and mobile
- 🔒 **Privacy-focused** - no tracking, no cookies, no external analytics
- 🎨 **Customizable** - easy to style and modify

## Quick Start

### 1. Create Your Google Sheet

Create a Google Sheet with these columns:

| Column | Name | Example | Required |
|--------|------|---------|----------|
| A | Recommended | ⭐ or Yes | No |
| B | Title | The Maniac | **Yes** |
| C | Author | Benjamin Labatut | **Yes** |
| D | Published Year | 2023 | No |
| E | Type | Print/Digital/Audio | No |
| F | Year Read | 2024 | No |
| G | Genre | Fiction | No |
| H | Sub-Genre | Science | No |
| I | Pages | 284 | No |
| J | Rating | 5 | No |
| K | Thoughts | Fascinating! | No |
| L | Cover URL | *(auto-filled)* | No |

### 2. Publish Your Sheet

1. **File → Share → Publish to web**
2. Select your sheet and choose **CSV** format
3. Click **Publish**
4. Copy the published URL (starts with `https://docs.google.com/spreadsheets/d/e/...`)

### 3. Fetch Book Covers

1. In your sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Copy and paste the code from [`fetch-book-covers.gs`](fetch-book-covers.gs)
4. Save the script
5. Click **Run** → Select `fetchAllBookData`
6. Authorize the script when prompted
7. Wait ~1 minute for covers to populate in Column L

See [SETUP.md](SETUP.md) for detailed instructions.

### 4. Use the Widget

**Option A: Standalone Page**
1. Download [`bookshelf-widget.html`](bookshelf-widget.html)
2. Open it in a text editor
3. Scroll to the top - find the **CONFIGURATION** section (lines 1-20)
4. Replace `YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE` with your actual URL
5. Upload to GitHub Pages, Netlify, or any web host

**Option B: Embed in Website**
1. Use [`bookshelf-embedded.html`](bookshelf-embedded.html) instead
2. Scroll to the top - find the **CONFIGURATION** section (lines 1-30)
3. Replace `YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE` with your actual URL
4. Optionally set filters: `defaultYear: '2024'`, `defaultGenre: 'Fiction'`, etc.
5. Copy the entire file contents and paste into your website's HTML

**Need help with configuration?** See [`example-config.js`](example-config.js) for detailed examples and instructions.

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup guide
- **[SECURITY.md](SECURITY.md)** - Security considerations
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

## Customization

### Change Colors

Edit the CSS variables in the `<style>` section:

```css
.metrics-title {
    color: #666; /* Change to your preferred color */
}

.toggle-btn.active {
    background: #1a1a1a; /* Active button color */
    color: #fff;
}
```

### Adjust Book Heights

In the `createBookElement` method, find:

```javascript
const height = Math.min(maxHeight, Math.max(minHeight, (book.pageCount || 300) * 0.25));
```

Change the `0.25` multiplier to make books taller or shorter.

### Modify Charts

All chart rendering happens in the `renderMetrics()` method. You can:
- Add new charts by adding HTML to the `metricsContainer.innerHTML`
- Modify existing charts by editing the bar/pie chart generation code
- Change chart colors by editing the CSS or inline styles

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

- Book data and covers from [Open Library](https://openlibrary.org)
- Built with vanilla JavaScript (no frameworks)
- Created by [Your Name]

## FAQ

**Q: Do I need to run the Apps Script every time?**
No! Only when you add new books. Use the "Fetch Missing Data Only" menu option.

**Q: What if a book cover isn't found?**
The widget shows a placeholder. You can manually add a cover URL to Column L.

**Q: Can I make my sheet private?**
No, the sheet must be published to web as CSV. Don't include sensitive information.

**Q: How many books can I add?**
Tested with 500+ books. Performance may degrade with 1000+ books.

**Q: Can I customize the layout?**
Yes! All HTML and CSS is in the widget files. Modify as needed.

## Support

- 📖 Read the [setup guide](SETUP.md)
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/bookshelf/issues)
- 💡 Request features via [GitHub Discussions](https://github.com/yourusername/bookshelf/discussions)

---

**Enjoy your bookshelf!** 📚✨
