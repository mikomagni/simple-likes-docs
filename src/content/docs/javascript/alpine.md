---
title: Alpine.js Component
description: Full documentation for the Alpine.js simpleLikes component.
---

The recommended way to use Simple Likes if your site uses Alpine.js (which is included with Statamic by default).

## Choose Your Version

Simple Likes provides two Alpine.js versions:

| File | Use Case | How It Works |
|------|----------|--------------|
| `simple-likes.js` | Sites with static caching | Fetches liked state from API on page load |
| `simple-likes-alpine-static.js` | Sites without caching | Uses server-rendered Antlers values directly |

**Which should I use?**
- Using Statamic's static caching or a CDN? Use `simple-likes.js`
- No caching, pages always render fresh? Use `simple-likes-alpine-static.js` (simpler, no extra API call)

---

## Cached Version (simple-likes.js)

Best for sites using static caching. Fetches the real liked state via API after page load.

### How to Include

**Option 1: Import in your site.js (with bundler like Vite)**

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes.js';
```

**Option 2: Include via script tag**

```html
<script src="/vendor/simple-likes/js/simple-likes.js" defer></script>
```

### Usage

The cached version doesn't need the `liked` value from Antlers - it fetches it from the API:

```html
{{ simple_like }}
    <div x-data="simpleLikes({
        entryId: '{{ id }}',
        count: {{ likes_count }},
        canInteract: {{ can_interact ? 'true' : 'false' }},
        isLocked: {{ is_locked ? 'true' : 'false' }}
    })">
        <!-- Loading state while hydrating -->
        <template x-if="!hydrated">
            <div style="opacity: 0.5;">
                <span>🤍</span>
                <span x-text="count"></span>
            </div>
        </template>

        <!-- Interactive state after hydration -->
        <template x-if="hydrated">
            <button @click="toggleLike()" :disabled="loading">
                <span x-text="liked ? '❤️' : '🤍'"></span>
                <span x-text="count"></span>
            </button>
        </template>

        <span x-show="errorMessage" x-text="errorMessage"></span>
    </div>
{{ /simple_like }}
```

### How Batching Works

The cached version automatically batches status requests for performance:

1. All like buttons on the page register their entry IDs
2. After 50ms, a single API request fetches all statuses: `/!/simple-likes/status?ids=a,b,c`
3. Results are cached for the page session

20 like buttons = 1 API request instead of 20.

### Additional Properties (Cached Version)

| Property | Type | Description |
|----------|------|-------------|
| `loading` | boolean | True while hydrating or toggling |
| `hydrated` | boolean | True once status has been fetched from API |

---

## Static Version (simple-likes-alpine-static.js)

Best for sites without static caching. Uses server-rendered values directly - no API hydration needed.

### How to Include

**Option 1: Import in your site.js**

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes-alpine-static.js';
```

**Option 2: Include via script tag**

```html
<script src="/vendor/simple-likes/js/simple-likes-alpine-static.js" defer></script>
```

### Usage

Pass all values from Antlers, including the `liked` state:

```html
{{ simple_like }}
    <div x-data="simpleLikes({
        entryId: '{{ id }}',
        liked: {{ user_has_liked ? 'true' : 'false' }},
        count: {{ likes_count }},
        canInteract: {{ can_interact ? 'true' : 'false' }},
        isLocked: {{ is_locked ? 'true' : 'false' }},
        isAuthenticated: {{ is_authenticated ? 'true' : 'false' }},
        allowGuestLikes: {{ allow_guest_likes ? 'true' : 'false' }}
    })">
        <button @click="toggleLike()" :disabled="loading">
            <span x-text="liked ? '❤️' : '🤍'"></span>
            <span x-text="count"></span>
        </button>
        <span x-show="errorMessage" x-text="errorMessage"></span>
    </div>
{{ /simple_like }}
```

---

## Component Properties

| Property | Type | Description |
|----------|------|-------------|
| `entryId` | string | The Statamic entry ID |
| `liked` | boolean | Whether the current user has liked this entry |
| `count` | number | Total like count |
| `loading` | boolean | True while a request is in progress |
| `canInteract` | boolean | Whether the user can click (has permission) |
| `isLocked` | boolean | Whether likes are disabled for this entry |
| `isAuthenticated` | boolean | Whether the current user is logged in |
| `allowGuestLikes` | boolean | Whether guest likes are enabled for this entry |
| `errorMessage` | string | Current error message (empty if none) |
| `errorType` | string | Either 'error' or 'warning' |

## Component Methods

| Method | Description |
|--------|-------------|
| `toggleLike()` | Toggle the like state. Call this on button click. |
| `showError(message, type)` | Display an error message. Auto-hides after 5 seconds. |

## Features

Both versions include:

- **Optimistic UI** - Button updates immediately, reverts on error
- **CSRF token refresh** - Automatically refreshes expired tokens and retries
- **Rate limit handling** - Shows friendly message when rate limited
- **Error handling** - Displays errors with auto-hide after 5 seconds
