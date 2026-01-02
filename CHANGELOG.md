# Changelog

All notable changes to the Interactive Bookshelf project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-01

### Added
- Initial public release
- Interactive bookshelf widget with stack and grid views
- Google Sheets integration via published CSV
- Apps Script for automatic book cover fetching from Open Library
- Reading analytics with charts and metrics
- Filter by year, genre, and recommendation status
- Responsive mobile design
- Both standalone and embeddable versions
- Sub-genre analytics with bar chart
- Book type distribution (Print/Digital/Audio) pie chart
- "The Library" section with 4-column filter controls
- Footer attribution
- Comprehensive documentation (README, SETUP, SECURITY)
- MIT License
- Contributing guidelines

### Features
- Beautiful book covers from Open Library API
- Fast loading with pre-fetched cover URLs
- Reading analytics dashboard with multiple chart types
- Genre trends over time
- Books by decade published
- Smart filtering and sorting
- Mobile-responsive layout
- Privacy-focused (no tracking, no cookies)
- Fully customizable styling

### Technical Details
- Vanilla JavaScript (no frameworks)
- CSS Grid layout
- SVG chart rendering
- CSV data parsing
- Responsive breakpoint at 768px
- Greyscale color scheme
- Apps Script integration with Open Library API

### Security
- Documented XSS vulnerability in SECURITY.md
- Provided fix instructions for sanitizing user input
- Content Security Policy recommendations
- Privacy and compliance information

---

## Future Considerations

Potential features for future releases:
- Search functionality
- Additional chart types
- Export reading data
- Dark mode toggle
- Accessibility improvements (WCAG compliance)
- Multiple sheet support
- Reading goals and challenges

---

**Note:** This is the first public release. Previous development was private.
