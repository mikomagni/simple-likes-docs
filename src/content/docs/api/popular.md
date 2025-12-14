---
title: Popular Entries
description: Get entries sorted by like count.
---

Get the most popular entries sorted by total like count.

```http
GET /!/simple-likes/popular
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 5 | Maximum entries to return (1-100) |
| `collection` | (all) | Filter by collection handle |

## Response

```json
[
    {
        "entry_id": "abc-123",
        "title": "My Most Popular Post",
        "url": "/blog/my-most-popular-post",
        "collection": "blog",
        "likes_count": 156
    },
    {
        "entry_id": "def-456",
        "title": "Another Great Post",
        "url": "/blog/another-great-post",
        "collection": "blog",
        "likes_count": 98
    }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `entry_id` | string | Statamic entry ID |
| `title` | string | Entry title |
| `url` | string | Entry URL |
| `collection` | string | Collection handle |
| `likes_count` | integer | Total likes |

## Examples

### Get Top 5 (Default)

```bash
curl "https://your-site.com/!/simple-likes/popular"
```

### Get Top 10 from News Collection

```bash
curl "https://your-site.com/!/simple-likes/popular?limit=10&collection=news"
```

### JavaScript

```javascript
async function getPopular(limit = 5, collection = null) {
    const params = new URLSearchParams({ limit });
    if (collection) params.append('collection', collection);

    const response = await fetch(`/!/simple-likes/popular?${params}`);
    return response.json();
}

// Usage
const popular = await getPopular(10, 'blog');
popular.forEach(entry => {
    console.log(`${entry.title}: ${entry.likes_count} likes`);
});
```

## Alpine.js Component

```html
<div x-data="popularEntries()" x-init="fetch()">
    <h3>Most Popular</h3>
    <template x-if="loading">
        <div>Loading...</div>
    </template>
    <ul x-show="!loading">
        <template x-for="entry in entries" :key="entry.entry_id">
            <li>
                <a :href="entry.url" x-text="entry.title"></a>
                <span x-text="entry.likes_count + ' likes'"></span>
            </li>
        </template>
    </ul>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('popularEntries', (limit = 5, collection = null) => ({
        entries: [],
        loading: true,

        async fetch() {
            const params = new URLSearchParams({ limit });
            if (collection) params.append('collection', collection);

            const response = await fetch(`/!/simple-likes/popular?${params}`);
            this.entries = await response.json();
            this.loading = false;
        }
    }));
});
</script>
```

## Antlers Equivalent

```antlers
{{ simple_like:popular limit="5" collection="blog" }}
    <a href="{{ url }}">{{ title }}</a> - {{ likes_count }} likes
{{ /simple_like:popular }}
```

## Caching

Results are cached for 30 minutes. Cache key includes limit and collection parameters.
