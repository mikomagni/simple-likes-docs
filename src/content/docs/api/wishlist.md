---
title: Wishlist
description: Retrieve the current user's liked entries via API.
---

Returns the current user's wishlist (liked entries). Works for both guests and authenticated users.

## Endpoint

```
GET /!/simple-likes/wishlist
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 10 | Maximum number of items to return (max: 50) |
| `collection` | string | null | Filter by collection handle |

## Response

```json
{
  "items": [
    {
      "entry_id": "abc123",
      "title": "My Favorite Article",
      "url": "/blog/my-favorite-article",
      "collection": "articles",
      "liked_at": "2025-01-15T10:30:00+00:00",
      "liked_ago": "4 days ago"
    },
    {
      "entry_id": "def456",
      "title": "Another Great Post",
      "url": "/blog/another-great-post",
      "collection": "articles",
      "liked_at": "2025-01-10T14:22:00+00:00",
      "liked_ago": "9 days ago"
    }
  ],
  "count": 2,
  "is_authenticated": false
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `items` | array | Array of liked entries |
| `items[].entry_id` | string | Entry UUID |
| `items[].title` | string | Entry title |
| `items[].url` | string | Entry URL |
| `items[].collection` | string | Collection handle |
| `items[].liked_at` | string | ISO 8601 timestamp |
| `items[].liked_ago` | string | Human-readable time (e.g., "2 days ago") |
| `count` | integer | Total number of items in wishlist |
| `is_authenticated` | boolean | Whether the user is logged in |

## Examples

### Basic Request

```javascript
fetch('/!/simple-likes/wishlist')
    .then(res => res.json())
    .then(data => {
        console.log(data.items);           // Array of wishlist items
        console.log(data.count);           // Number of items
        console.log(data.is_authenticated); // true if logged in
    });
```

### With Parameters

```javascript
// Get up to 20 products
fetch('/!/simple-likes/wishlist?limit=20&collection=products')
    .then(res => res.json())
    .then(data => console.log(data));
```

### Async/Await

```javascript
async function fetchWishlist(limit = 10, collection = null) {
    const params = new URLSearchParams({ limit });
    if (collection) params.append('collection', collection);

    const response = await fetch(`/!/simple-likes/wishlist?${params}`);
    return await response.json();
}

// Usage
const wishlist = await fetchWishlist(10, 'products');
```

### Alpine.js Component

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

## Guest vs Authenticated Users

| User Type | Identification | Persistence |
|-----------|---------------|-------------|
| Authenticated | User ID | Permanent, syncs across devices |
| Guest | IP + Browser fingerprint | Device/browser specific |

Guest users are identified by a hash of their IP address and user agent. This means:
- No cookies required
- Different devices show different wishlists
- Clearing browser data may affect identification

:::tip
Show a login prompt for guests to encourage account creation:
```javascript
if (!data.is_authenticated) {
    // Show "Log in to sync your wishlist across devices" message
}
```
:::

## Refreshing After Like/Unlike

To update the wishlist display after a user toggles a like:

```javascript
// Using Alpine.js store
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

// Call after toggle
await fetch(`/!/simple-likes/${entryId}/toggle`, { method: 'POST', ... });
Alpine.store('wishlist').refresh();
```
