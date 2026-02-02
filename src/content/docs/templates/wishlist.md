---
title: Wishlist
description: Build wishlists and saved items pages for guests and authenticated users.
---

The wishlist feature allows both guests and authenticated users to view their liked entries. Build "My Favorites", "Saved Items", or "Wishlist" pages with ease.

## How It Works

- **Authenticated users**: Wishlist is tied to their user account and persists across devices
- **Guest users**: Wishlist is identified by IP address + browser fingerprint (no cookies required)

Guest wishlists are browser/device specific. Users who want persistent wishlists across devices should authenticate.

## Server-Side (Antlers)

### Basic Wishlist

```antlers
{{ wishlist = {simple_like:wishlist limit="10"} }}
{{ if wishlist | is_empty }}
    <p>Your wishlist is empty.</p>
{{ else }}
    <ul>
        {{ wishlist }}
            <li>
                <a href="{{ url }}">{{ title }}</a>
                <span>{{ liked_ago }}</span>
            </li>
        {{ /wishlist }}
    </ul>
{{ /if }}
```

### With Guest Login Prompt

```antlers
<div class="wishlist-page">
    <h1>My Wishlist</h1>

    {{ if {simple_like:is_guest} }}
        <div class="notice">
            Browsing as guest. <a href="/login">Log in</a> to sync across devices.
        </div>
    {{ /if }}

    <p>{{ simple_like:wishlist_count }} items saved</p>

    {{ wishlist = {simple_like:wishlist limit="20"} }}
    {{ if wishlist | is_empty }}
        <p>No items in your wishlist yet.</p>
    {{ else }}
        <div class="wishlist-grid">
            {{ wishlist }}
                <article>
                    <a href="{{ url }}">
                        <h2>{{ title }}</h2>
                        <span>{{ collection }}</span>
                        <time>Added {{ liked_ago }}</time>
                    </a>
                </article>
            {{ /wishlist }}
        </div>
    {{ /if }}
</div>
```

### Filter by Collection

```antlers
{{# Only show products #}}
{{ wishlist = {simple_like:wishlist limit="20" collection="products"} }}

{{# Count for specific collection #}}
<span>{{ simple_like:wishlist_count collection="products" }} products saved</span>
```

## Client-Side (API + Alpine.js)

For dynamic updates without page reloads, use the API endpoint.

### API Endpoint

```
GET /!/simple-likes/wishlist
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | int | 10 | Maximum items (capped at 50) |
| `collection` | string | null | Filter by collection handle |

**Response:**

```json
{
  "items": [
    {
      "entry_id": "abc123",
      "title": "Article Title",
      "url": "/blog/article",
      "collection": "articles",
      "liked_at": "2025-01-15T10:30:00+00:00",
      "liked_ago": "4 days ago"
    }
  ],
  "count": 1,
  "is_authenticated": false
}
```

### Alpine.js Example

```html
<div x-data="{ items: [], count: 0, isGuest: true, loading: true }" x-init="
    fetch('/!/simple-likes/wishlist?limit=10')
        .then(r => r.json())
        .then(data => {
            items = data.items;
            count = data.count;
            isGuest = !data.is_authenticated;
            loading = false;
        })
">
    <h2>My Wishlist</h2>

    <template x-if="isGuest">
        <p>Browsing as guest. <a href="/login">Log in</a> to sync across devices.</p>
    </template>

    <p><span x-text="count"></span> items saved</p>

    <div x-show="loading">Loading...</div>

    <template x-if="!loading && items.length === 0">
        <p>Your wishlist is empty.</p>
    </template>

    <ul x-show="!loading && items.length > 0">
        <template x-for="item in items" :key="item.entry_id">
            <li>
                <a :href="item.url" x-text="item.title"></a>
                <span x-text="item.liked_ago"></span>
            </li>
        </template>
    </ul>
</div>
```

### Refreshing After Like/Unlike

To refresh the wishlist after a user likes or unlikes an entry:

```javascript
// Store wishlist state globally
document.addEventListener('alpine:init', () => {
    Alpine.store('wishlist', {
        items: [],
        count: 0,

        async refresh() {
            const res = await fetch('/!/simple-likes/wishlist');
            const data = await res.json();
            this.items = data.items;
            this.count = data.count;
        }
    });
});

// After toggling a like, refresh the wishlist
async function toggleLike(entryId) {
    await fetch(`/!/simple-likes/${entryId}/toggle`, { method: 'POST' });
    Alpine.store('wishlist').refresh();
}
```

## Vanilla JavaScript

```javascript
async function fetchWishlist(limit = 10, collection = null) {
    const params = new URLSearchParams({ limit });
    if (collection) params.append('collection', collection);

    const response = await fetch(`/!/simple-likes/wishlist?${params}`);
    return await response.json();
}

// Usage
const wishlist = await fetchWishlist(10, 'products');
console.log(wishlist.items);        // Array of wishlist items
console.log(wishlist.count);        // Number of items
console.log(wishlist.is_authenticated); // true if logged in
```

## Example Templates

Three example templates are included with the addon:

| Template | Description |
|----------|-------------|
| `simple-likes::examples/wishlist` | Server-rendered Antlers template |
| `simple-likes::examples/wishlist-alpine` | Alpine.js + API version |
| `simple-likes::examples/wishlist-debug` | Debug template for troubleshooting |

**Usage:**

```antlers
{{# Server-rendered wishlist #}}
{{ partial:simple-likes::examples/wishlist }}

{{# With parameters #}}
{{ partial:simple-likes::examples/wishlist limit="20" collection="products" }}

{{# Alpine.js version (requires Alpine.js) #}}
{{ partial:simple-likes::examples/wishlist-alpine }}

{{# Debug template - shows raw data for troubleshooting #}}
{{ partial:simple-likes::examples/wishlist-debug }}
```

### Debug Template

Use the debug template to troubleshoot wishlist issues. It displays:
- Whether the current user is a guest
- The wishlist count
- All wishlist items with their entry IDs

```antlers
{{ partial:simple-likes::examples/wishlist-debug }}
```

Output example:

```
Wishlist Debug Info
Is Guest: 1
Wishlist Count: 1
Wishlist Items:
    home - Article Title (pages) - 2 seconds ago
```

## Database Cleanup

Guest likes can accumulate over time. Use the prune command to remove old guest data:

```bash
# Delete guest likes older than 30 days (default)
php please simple-likes:prune-guests

# Delete guest likes older than 7 days
php please simple-likes:prune-guests --days=7

# Preview what would be deleted (dry run)
php please simple-likes:prune-guests --days=30 --dry-run
```

### Scheduled Cleanup

Add to your `routes/console.php` to run automatically:

```php
use Illuminate\Support\Facades\Schedule;

// Prune guest likes older than 30 days, weekly
Schedule::command('simple-likes:prune-guests --days=30')
    ->weekly();
```

See [Artisan Commands](/reference/commands/) for more details.
