# Security

## Overview

This widget is designed with security in mind, but there are important considerations when deploying it publicly.

**TL;DR:** Safe to use if only you edit your Google Sheet. Apply the XSS fix if sharing edit access.

---

## Security Status

**Risk Level:** 🟡 LOW-MEDIUM

✅ **Safe:**
- No tracking or analytics
- No cookies or local storage
- No user authentication
- Read-only data access
- No server-side code
- No dangerous JavaScript patterns

⚠️ **Potential Risk:**
- Cross-Site Scripting (XSS) if malicious data is added to your sheet

---

## The XSS Vulnerability

### What is it?

User-controlled data from your Google Sheet is inserted directly into HTML without sanitization. If someone adds malicious HTML/JavaScript to your sheet, it could execute in visitors' browsers.

### Example Attack

If someone adds this as a book title:
```
My Book<script>alert('XSS')</script>
```

The script would execute when visitors view your bookshelf.

### Current Risk: LOW

This is only a problem if:
- ✅ Someone else has edit access to your Google Sheet
- ✅ Your Google account is compromised
- ✅ You accidentally paste malicious content

If only **you** edit your sheet → **Risk is minimal**

### Potential Impact

If exploited, an attacker could:
- Steal session cookies (if your site uses them)
- Redirect visitors to malicious sites
- Deface your bookshelf
- Inject tracking pixels

---

## The Fix

Add this method to the `BookshelfWidget` class (after `rgbToHsl` method):

```javascript
escapeHtml(unsafe) {
    if (!unsafe) return '';
    const text = String(unsafe);
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

Then wrap all user data in templates with `this.escapeHtml()`:

```javascript
// Before
<div class="book-title">${book.title}</div>

// After
<div class="book-title">${this.escapeHtml(book.title)}</div>
```

**Apply to:**
- `book.title`
- `book.author`
- `book.genre`
- `book.subGenre`
- `book.thoughts`
- `book.type`
- Chart labels

---

## Additional Security Measures

### 1. Content Security Policy (Recommended)

Add this to the `<head>` section:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://covers.openlibrary.org data:;
    connect-src 'self' https://docs.google.com https://openlibrary.org;
    frame-ancestors 'none';
">
```

**Note:** `'unsafe-inline'` is needed for the inline script. For maximum security, move scripts to external files.

### 2. Enable HTTPS

Ensure your deployment uses HTTPS:
- ✅ GitHub Pages (automatic)
- ✅ Netlify (automatic)
- ✅ Vercel (automatic)
- ⚠️ Custom hosting (configure SSL certificate)

### 3. Secure Your Google Account

- ✅ Enable 2-factor authentication
- ✅ Use a strong, unique password
- ✅ Review third-party app access regularly
- ✅ Monitor your Google Sheet edit history

---

## What CAN'T Be Attacked

These attack vectors **don't apply** to this widget:

- ✅ SQL Injection (no database)
- ✅ CSRF (no form submissions)
- ✅ Session hijacking (no sessions)
- ✅ File upload attacks (no uploads)
- ✅ Server-side attacks (no server)
- ✅ Authentication bypass (no auth)
- ✅ Data breaches (no user data stored)

---

## Privacy Considerations

### What Data is Public?

When you publish your Google Sheet:
- ✅ Book titles and authors
- ✅ Your ratings and reviews
- ✅ Reading dates and genres
- ❌ Your name (unless you add it)
- ❌ Your email
- ❌ Visitor data

**Important:** Don't include personal information in your book notes/thoughts.

### Tracking

This widget does **NOT**:
- Track visitors
- Use analytics
- Set cookies
- Store local data
- Report usage statistics
- Connect to external services (except Open Library for covers)

### Third-Party Requests

The widget makes requests to:
1. **Google Sheets** - To fetch your book list (via published CSV URL)
2. **Open Library CDN** - To load book cover images

Both use HTTPS. No data is sent to these services beyond standard HTTP requests.

---

## Compliance

### GDPR (EU Privacy)
- ✅ No personal data collected
- ✅ No cookies used
- ✅ No tracking
- ✅ Data controller is you (Google Sheet owner)

### COPPA (Children's Privacy)
- ✅ No data collection
- ✅ Safe for all ages

### Accessibility
- 🟡 Not WCAG compliant by default
- Consider adding ARIA labels if accessibility is important

---

## Reporting Security Issues

Found a security vulnerability? Please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. Open a security advisory via GitHub's private reporting feature
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

We'll respond within 48 hours.

---

## Security Checklist

Before deploying:

- [ ] Applied XSS fix (if sharing sheet edit access)
- [ ] Enabled HTTPS on your deployment
- [ ] Set up 2FA on Google account
- [ ] Removed any personal information from book notes
- [ ] Reviewed Google Sheet permissions
- [ ] (Optional) Added Content Security Policy
- [ ] Tested with different browsers

For production use:

- [ ] Monitor Google Sheet edit history monthly
- [ ] Keep book data appropriate for public viewing
- [ ] Review this security guide when adding new features
- [ ] Update to latest version when security patches are released

---

## Frequently Asked Questions

**Q: Is it safe to use this publicly?**
A: Yes, if only you edit the Google Sheet and you use 2FA.

**Q: Should I apply the XSS fix?**
A: If you share edit access with others, yes. Otherwise, it's optional but recommended.

**Q: Can someone hack my Google account through this?**
A: No. The widget only reads your published sheet data.

**Q: What if someone finds my published CSV URL?**
A: That's expected - it's public. They can read your book list but can't edit it.

**Q: Can I use this for sensitive data?**
A: No. Only use it for information you're comfortable sharing publicly.

**Q: Does this work with private sheets?**
A: No. The sheet must be published to web for the widget to access it.

---

**Last Updated:** January 2026
