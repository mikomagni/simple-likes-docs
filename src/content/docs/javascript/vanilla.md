---
title: Vanilla JavaScript
description: Use Simple Likes without Alpine.js using pure JavaScript.
---

Use this if your site doesn't have Alpine.js.

## Choose Your Version

Simple Likes provides two vanilla JavaScript versions:

| File | Use Case | How It Works |
|------|----------|--------------|
| `simple-likes-vanilla.js` | Sites with static caching | Fetches liked state from API on page load |
| `simple-likes-vanilla-static.js` | Sites without caching | Uses server-rendered data attributes directly |

**Which should I use?**
- Using Statamic's static caching or a CDN? Use `simple-likes-vanilla.js`
- No caching, pages always render fresh? Use `simple-likes-vanilla-static.js` (simpler, no extra API call)

---

## Cached Version (simple-likes-vanilla.js)

Best for sites using static caching. Fetches the real liked state via API after page load.

### How to Include

**Option 1: Import in your site.js (with bundler like Vite)**

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes-vanilla.js';
```

**Option 2: Include via script tag**

```html
<script src="/vendor/simple-likes/js/simple-likes-vanilla.js" defer></script>
```

### Usage

The cached version fetches the liked state from the API - don't pass `data-liked`:

```html
{{ simple_like }}
    <div data-simple-likes
         data-entry-id="{{ id }}"
         data-count="{{ likes_count }}"
         data-can-interact="{{ can_interact ? 'true' : 'false' }}"
         data-is-locked="{{ is_locked ? 'true' : 'false' }}">

        <button class="simple-likes-btn">
            <svg class="simple-likes-heart" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="simple-likes-count"></span>
        </button>

        <span class="simple-likes-error"></span>
    </div>
{{ /simple_like }}
```

The component will:
1. Show a grey heart at 50% opacity while loading
2. Fetch the real status from `/!/simple-likes/status?ids=...`
3. Update to show the correct liked state

---

## Static Version (simple-likes-vanilla-static.js)

Best for sites without static caching. Uses server-rendered values directly - no API hydration needed.

### How to Include

**Option 1: Import in your site.js**

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes-vanilla-static.js';
```

**Option 2: Include via script tag**

```html
<script src="/vendor/simple-likes/js/simple-likes-vanilla-static.js" defer></script>
```

### Usage

Pass all values as data attributes, including the liked state:

```html
{{ simple_like }}
    <div data-simple-likes
         data-entry-id="{{ id }}"
         data-liked="{{ user_has_liked ? 'true' : 'false' }}"
         data-count="{{ likes_count }}"
         data-can-interact="{{ can_interact ? 'true' : 'false' }}"
         data-is-locked="{{ is_locked ? 'true' : 'false' }}"
         data-is-authenticated="{{ is_authenticated ? 'true' : 'false' }}"
         data-allow-guest-likes="{{ allow_guest_likes ? 'true' : 'false' }}">

        <button class="simple-likes-btn">
            <svg class="simple-likes-heart" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="simple-likes-count"></span>
        </button>

        <span class="simple-likes-error"></span>
    </div>
{{ /simple_like }}
```

---

## Data Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-simple-likes` | Yes | Identifies the component (value not needed) |
| `data-entry-id` | Yes | The Statamic entry ID |
| `data-liked` | Static only | "true" or "false" (cached version fetches this) |
| `data-count` | Yes | Current like count as a number |
| `data-can-interact` | No | "true" or "false" (default: "true") |
| `data-is-locked` | No | "true" or "false" (default: "false") |
| `data-is-authenticated` | No | "true" or "false" - whether the user is logged in |
| `data-allow-guest-likes` | No | "true" or "false" - whether guest likes are enabled |

## Required CSS Classes

| Class | Element | Description |
|-------|---------|-------------|
| `.simple-likes-btn` | Button | The clickable button element |
| `.simple-likes-count` | Span | Displays the like count |
| `.simple-likes-heart` | SVG | The heart icon (fill attribute is toggled) |
| `.simple-likes-error` | Div | Container for error messages |

## Global API

### Cached Version

```javascript
// Re-initialize all components
window.SimpleLikes.init();

// Initialize a specific element
window.SimpleLikes.initComponent(document.querySelector('#my-like-button'));
```

### Static Version

```javascript
// Re-initialize all components
window.SimpleLikesStatic.init();

// Initialize a specific element
window.SimpleLikesStatic.initComponent(document.querySelector('#my-like-button'));
```

### Accessing Component State

Each initialized element has a `.simpleLikes` property:

```javascript
const container = document.querySelector('[data-simple-likes]');

// Access state
console.log(container.simpleLikes.getState());
// Returns: { liked, count, loading, canInteract, isLocked, ... }

// Programmatically toggle the like
container.simpleLikes.toggleLike();
```

## Using the Built-in Template

```html
{{ simple_like template_from="simple-likes::like-button-vanilla" }}
```

This renders the correct HTML structure with all required data attributes and classes.

## Features

Both versions include:

- **Optimistic UI** - Button updates immediately, reverts on error
- **CSRF token refresh** - Automatically refreshes expired tokens and retries
- **Rate limit handling** - Shows friendly message when rate limited
- **Error handling** - Displays errors with auto-hide after 5 seconds
