# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please email the maintainer directly instead of using the issue tracker.

## Known Security Considerations

### HTML Injection by Design

The `addSheet(contentHtml)` method in `SheetListController` accepts raw HTML and injects it into the DOM. This is **by design** to allow maximum flexibility in content.

**Location:** `src/controllers/sheet_list_controller.ts:66`

**Why this exists:**
- The library is designed to display dynamic HTML content in sheet panels
- This allows integration with server-rendered HTML, forms, and rich content
- Similar to how modals and dialogs work in most frameworks

### Security Best Practices

#### 1. Use Trusted Sources Only

The `addSheet()` method should only be used with HTML from **trusted sources**:

✅ **Safe:**
```javascript
// Server-rendered content
await sheetList.addSheetFromUrl('/api/forms/user');

// Static content you control
sheetList.addSheet('<div>Your content</div>');

// Content from your templates
sheetList.addSheet(myTemplate.render(data));
```

❌ **Unsafe:**
```javascript
// User input directly injected
sheetList.addSheet(userInputFromTextarea); // DANGEROUS!

// Untrusted API response
const response = await fetch(untrustedUrl);
sheetList.addSheet(await response.text()); // DANGEROUS!
```

#### 2. Sanitize User-Generated Content

If you must display user-generated content, **always sanitize** it first:

```javascript
import DOMPurify from 'dompurify';

// Sanitize before injecting
const userContent = getUserInput();
const clean = DOMPurify.sanitize(userContent);
sheetList.addSheet(clean);
```

#### 3. Use addSheetFromUrl() for Dynamic Content

The recommended approach for dynamic content is to use `addSheetFromUrl()`:

```javascript
// Load from your own server
await sheetList.addSheetFromUrl('/sheets/user-profile');
```

This ensures:
- Content comes from your server
- You control what HTML is returned
- Server-side validation and sanitization
- CSRF protection (when using frameworks like Symfony)

#### 4. Content Security Policy (CSP)

Consider implementing a Content Security Policy to limit XSS risks:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

#### 5. Framework Integration

When using with frameworks like Symfony, leverage built-in security:

```php
// Symfony Controller
#[Route('/sheets/form')]
public function sheetForm(): Response {
    // CSRF protection is automatic
    $form = $this->createForm(UserType::class, $user);
    
    // Twig escapes by default
    return $this->render('sheet_form.html.twig', [
        'form' => $form
    ]);
}
```

### CodeQL Findings

**Alert:** `js/html-constructed-from-input`  
**Status:** Known and documented  
**Mitigation:** 
- Comprehensive documentation added
- Security warnings in README
- `addSheetFromUrl()` method for safe async loading
- Example sanitization code provided

This is a false positive in the context of a UI component library designed to display HTML content, similar to how modal libraries, CMS systems, and rich text editors work.

### Comparison with Other Libraries

This security consideration is common in UI component libraries:

- **React:** `dangerouslySetInnerHTML` (similar warning)
- **Vue:** `v-html` directive (similar warning)
- **jQuery:** `.html()` method (similar risk)
- **Modal libraries:** All accept HTML content

The key is **proper documentation and developer responsibility**, which we provide.

## Security Checklist for Developers

When using stimulus-sheet in your application:

- [ ] Only use `addSheet()` with trusted, controlled HTML
- [ ] Use `addSheetFromUrl()` for server-rendered content
- [ ] Sanitize any user-generated content with DOMPurify
- [ ] Implement Content Security Policy
- [ ] Use CSRF protection for forms
- [ ] Validate and escape data server-side
- [ ] Review all sheet content sources
- [ ] Test with security scanning tools
- [ ] Follow framework-specific security best practices

## Dependencies

This package has minimal dependencies:

- **Runtime:** None (peer dependency on @hotwired/stimulus only)
- **Development:** Rollup, TypeScript, tslib (all reputable packages)

All dependencies are kept up to date and scanned for vulnerabilities.

## Updates

- **2024-11-06:** Initial security documentation
- **2024-11-06:** Added `addSheetFromUrl()` for safe async loading
- **2024-11-06:** Updated Rollup to v3.29.5 (fixes XSS vulnerability in bundler)

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify - HTML Sanitizer](https://github.com/cure53/DOMPurify)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Stimulus Security](https://stimulus.hotwired.dev)
