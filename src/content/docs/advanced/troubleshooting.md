---
title: Troubleshooting
description: Common issues and how to fix them.
---

Solutions to common problems with Simple Likes.

## "CSRF token not found" Error

**Cause:** The `<meta name="csrf-token">` tag is missing from your layout.

**Fix:** Add this to your layout's `<head>`:

```html
<meta name="csrf-token" content="{{ csrf_token }}">
```

---

## Like Button Doesn't Work (No Response)

**Cause:** JavaScript not loaded or error in console.

**Fix:**
1. Open browser developer tools (F12)
2. Check the Console tab for errors
3. Check the Network tab for failed requests
4. Ensure the JS file is imported in your site.js:

```javascript
// For Alpine.js
import '../vendor/simple-likes/js/simple-likes.js';

// For Vanilla JS
import '../vendor/simple-likes/js/simple-likes-vanilla.js';
```

5. Rebuild assets: `npm run build`

---

## "Please refresh the page" Error

**Cause:** CSRF token expired and auto-refresh failed.

**Fix:**
- Make sure you're using the latest JS component (with auto-refresh)
- Check that the page is returning proper HTML (not a redirect)
- Verify the meta tag exists and is accessible

---

## Likes Not Persisting

**Cause:** Database table doesn't exist or isn't writable.

**Fix:**

```bash
# Check migration status
php artisan migrate:status

# Run migrations
php artisan migrate
```

If using a custom database connection, ensure:
1. The connection is defined in `config/database.php`
2. `SIMPLE_LIKES_DB_CONNECTION` is set in `.env`
3. The database credentials are correct

---

## Guest Likes Not Working

**Cause:** Guest likes are disabled.

**Fix:** Either:

1. Set `allow_guest_likes: true` in your blueprint:

```yaml
simple_likes:
  type: simple_likes
  display: Likes
  allow_guest_likes: true
```

2. Or add the `simple_likes_guest_allowed` toggle field and enable it per-entry

---

## Widget Not Showing Data

**Cause:** No likes in the database yet.

**Fix:** Create some test likes:

```bash
php artisan tinker
```

```php
\Mikomagni\SimpleLikes\Models\SimpleLike::create([
    'entry_id' => 'your-entry-id',
    'user_id' => 'guest_test',
    'user_type' => 'guest',
    'ip_hash' => 'test'
]);
```

---

## 429 Too Many Requests

**Cause:** Rate limit exceeded.

**Fix:** Either:
- Wait a minute and try again
- Increase rate limits in config:

```env
SIMPLE_LIKES_TOGGLE_LIMIT=60
SIMPLE_LIKES_USER_MAX_PER_MINUTE=20
```

---

## Heart Icon Not Filling

**Cause:** CSS or JavaScript issue.

**Fix for Alpine.js:**
Check that the SVG has the correct `:fill` binding:

```html
<svg :fill="liked ? 'currentColor' : 'none'" ...>
```

**Fix for Vanilla JS:**
Ensure the SVG has the `simple-likes-heart` class:

```html
<svg class="simple-likes-heart" fill="none" ...>
```

---

## Count Shows Wrong Number

**Cause:** Cache is stale or boost value changed.

**Fix:**

```bash
php artisan cache:clear
```

---

## Fieldtype Not Appearing in Blueprint

**Cause:** Addon not properly installed.

**Fix:**

```bash
# Clear caches
php artisan cache:clear
php artisan config:clear

# Republish assets
php artisan vendor:publish --tag=simple-likes-assets --force
```

---

## JavaScript Console Error: "simpleLikes is not defined"

**Cause:** Alpine.js component not registered before use.

**Fix:** Ensure the import is before Alpine starts:

```javascript
// site.js
import '../vendor/simple-likes/js/simple-likes.js';

// Then Alpine starts (usually automatic in Statamic)
```

---

## Clear All Caches

When in doubt, clear everything:

```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
npm run build
```

---

## Still Having Issues?

1. **Check the logs**: `storage/logs/laravel.log`
2. **Enable debug mode**: Set `APP_DEBUG=true` in `.env`
3. **Check browser console**: F12 → Console tab
4. **Check network requests**: F12 → Network tab
5. **Report an issue**: [GitHub Issues](https://github.com/mikomagni/simple-likes/issues)
