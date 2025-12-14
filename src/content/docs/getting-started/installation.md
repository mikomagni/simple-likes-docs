---
title: Installation
description: How to install and set up Simple Likes in your Statamic project.
---

## Install via Composer

### Step 1: Install the addon

Install from the Statamic Marketplace or via Composer:

```bash
composer require mikomagni/simple-likes
```

### Step 2: Run the install command

Run the interactive install command:

```bash
php please simple-likes:install
```

This will:
- Create the database table
- Optionally publish the config file
- Optionally publish the view templates

:::tip
You can also run this via Artisan: `php artisan simple-likes:install`
:::

The addon will automatically:
- Register routes, tags, fieldtypes, and widgets
- Publish required assets to `public/vendor/simple-likes/`

### Step 3: Add CSRF Token Meta Tag

Open your main layout file (usually `resources/views/layout.antlers.html`) and add this line inside the `<head>` section:

```html
<head>
    <!-- Other head content -->
    <meta name="csrf-token" content="{{ csrf_token }}">
</head>
```

:::note
Laravel requires CSRF tokens to protect against cross-site request forgery attacks. The JavaScript component reads this token and sends it with like requests.
:::

### Step 4: Add the JavaScript Component

**Option A: Alpine.js (Recommended)**

If your site already uses Alpine.js, add the component using one of these methods:

*Import in your `resources/js/site.js` (with bundler like Vite):*

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes.js';
```

*Or include via script tag in your layout:*

```html
<script src="/vendor/simple-likes/js/simple-likes.js" defer></script>
```

**Option B: Vanilla JavaScript**

If your site doesn't use Alpine.js:

*Import in your `resources/js/site.js` (with bundler like Vite):*

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes-vanilla.js';
```

*Or include via script tag in your layout:*

```html
<script src="/vendor/simple-likes/js/simple-likes-vanilla.js" defer></script>
```

### Step 5: Add the CSS (Optional)

The addon includes optional styling. Choose one method:

*Option 1: Import in your CSS file:*

```css
@import '/vendor/simple-likes/css/simple-likes.css';
```

*Option 2: Import in your JS (with Vite/bundler):*

```javascript
import '../../vendor/mikomagni/simple-likes/resources/css/simple-likes.css';
```

*Option 3: Link tag in HTML:*

```html
<link rel="stylesheet" href="/vendor/simple-likes/css/simple-likes.css">
```

### Step 6: Add Fieldtype to Blueprint

Edit your blueprint (e.g., `resources/blueprints/collections/articles/article.yaml`) and add:

```yaml
fields:
  -
    handle: simple_likes
    field:
      type: simple_likes
      display: Likes
      allow_guest_likes: true
```

### Step 7: Rebuild Your Site's Assets

```bash
npm run build
```

:::tip
The Control Panel fieldtype assets are pre-compiled and published automatically. You don't need to build any Vue components - just your site's JavaScript bundle that includes the Alpine.js or Vanilla JS component.
:::

**That's it!** The database table is created automatically when you first use the addon.

## Quick Start Example

Here's a complete example of setting up Simple Likes in your `resources/js/site.js`:

```javascript
import Alpine from 'alpinejs';

// Import Simple Likes CSS and JS
import '../../vendor/mikomagni/simple-likes/resources/css/simple-likes.css';
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes.js';

Alpine.start();
```

Then in your Antlers template:

```blade
{{ simple_like }}
```

## Optional: Publish Config

The install command will ask if you want to publish the config file. You can also do this manually:

```bash
php artisan vendor:publish --tag=simple-likes-config
```

This creates `config/simple-likes.php` where you can adjust:
- Database connection
- Cache TTL
- Rate limiting settings
- Widget display limits

See [Configuration Options](/reference/configuration/) for all available settings.

## Optional: Publish Views

The install command will ask if you want to publish the view templates. You can also do this manually:

```bash
php artisan vendor:publish --tag=simple-likes-views
```

This copies templates to `resources/views/vendor/simple-likes/` for customisation.

## Optional: Publish Assets

For addon developers or manual asset management, you can publish specific asset groups:

```bash
# Publish JavaScript files
php artisan vendor:publish --tag=simple-likes-js

# Publish frontend CSS
php artisan vendor:publish --tag=simple-likes-frontend-css

# Publish all CSS (includes widget CSS)
php artisan vendor:publish --tag=simple-likes-css

# Force overwrite existing files
php artisan vendor:publish --tag=simple-likes-js --force
```

## Next Steps

Now that you've installed Simple Likes, let's [display your first like button](/getting-started/quick-start/).
