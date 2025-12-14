---
title: Status
description: Get like count and liked state for entries (supports batching).
---

Get the like count and whether the current user has liked one or more entries. Designed for client-side hydration with static caching.

```http
GET /!/simple-likes/status?ids={entry_id}
GET /!/simple-likes/status?ids={id1},{id2},{id3}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ids` | string | **Required.** Comma-separated list of entry IDs (max 50) |

## Response

Returns an object keyed by entry ID:

```json
{
    "home": {
        "count": 343,
        "liked": false
    },
    "news-005": {
        "count": 173,
        "liked": true
    }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `count` | integer | Total likes (boost + real combined) |
| `liked` | boolean | Whether the current user has liked this entry |

## Use Case

This endpoint enables **static cache compatibility**. The like button can be fully cached, then JavaScript fetches the real user-specific state on page load:

1. Page renders with cached HTML (generic loading state)
2. All like buttons register with a batch manager
3. One batched API call fetches all statuses
4. Each button updates to show correct liked state and count

This pattern is used by social media sites like Twitter, Instagram, and YouTube.

### Automatic Batching

The built-in JavaScript automatically batches all like buttons on a page into a single request. If you have 20 buttons, only ONE API call is made - not 20 separate calls.

## Errors

| Status | Description |
|--------|-------------|
| `400` | Missing `ids` parameter or too many IDs (max 50) |
| `429` | Rate limit exceeded |

## Example

### Single Entry

```bash
curl "https://your-site.com/!/simple-likes/status?ids=my-entry-id"
```

```json
{
    "my-entry-id": {
        "count": 42,
        "liked": false
    }
}
```

### Multiple Entries (Batched)

Ideal for listing pages with multiple like buttons:

```bash
curl "https://your-site.com/!/simple-likes/status?ids=post-1,post-2,post-3"
```

```json
{
    "post-1": { "count": 15, "liked": true },
    "post-2": { "count": 8, "liked": false },
    "post-3": { "count": 23, "liked": true }
}
```

### JavaScript

```javascript
async function getStatus(entryIds) {
    const ids = Array.isArray(entryIds) ? entryIds.join(',') : entryIds;
    const response = await fetch(`/!/simple-likes/status?ids=${ids}`);
    return response.json();
}

// Single entry
const status = await getStatus('my-entry-id');
console.log(status['my-entry-id'].liked); // true/false

// Multiple entries
const statuses = await getStatus(['post-1', 'post-2', 'post-3']);
Object.entries(statuses).forEach(([id, data]) => {
    console.log(`${id}: ${data.count} likes, liked: ${data.liked}`);
});
```

## Alpine.js Integration

The built-in `simpleLikes` Alpine component automatically calls this endpoint on init. You don't need to manually fetch status if using the default templates.

```html
<!-- This automatically hydrates from /status on init -->
{{ simple_like }}
```

For custom implementations:

```html
<div x-data="{ liked: false, count: 0 }" x-init="
    fetch('/!/simple-likes/status?ids={{ id }}')
        .then(r => r.json())
        .then(data => {
            liked = data['{{ id }}'].liked;
            count = data['{{ id }}'].count;
        })
">
    <button @click="toggleLike()">
        <span x-text="liked ? '❤️' : '🤍'"></span>
        <span x-text="count"></span>
    </button>
</div>
```

## Batching for Performance

On listing pages, batch all entry IDs into a single request:

```javascript
// Collect all entry IDs on the page
const buttons = document.querySelectorAll('[data-entry-id]');
const ids = [...buttons].map(b => b.dataset.entryId);

// One request for all entries
const statuses = await getStatus(ids);

// Update each button
buttons.forEach(button => {
    const id = button.dataset.entryId;
    if (statuses[id]) {
        button.dataset.liked = statuses[id].liked;
        button.dataset.count = statuses[id].count;
    }
});
```
