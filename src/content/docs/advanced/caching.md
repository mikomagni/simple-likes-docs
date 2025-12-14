---
title: Static Caching
description: How Simple Likes works seamlessly with Statamic's static caching.
---

Simple Likes is designed to work with Statamic's static caching out of the box. The like button uses **client-side hydration** to ensure correct state regardless of caching strategy.

## How It Works

1. **Page renders** - Like buttons show a loading state (grey heart)
2. **JavaScript initialises** - All buttons register with a batch manager
3. **One API call** - After 50ms debounce, ONE request fetches all statuses
4. **Buttons hydrate** - Each shows correct liked state and count for current user

This pattern is used by social media sites like Twitter, Instagram, and YouTube. It enables full static caching while ensuring user-specific state is always correct.

### Batched Requests

If you have 20 like buttons on a page:
- **One request**: `GET /!/simple-likes/status?ids=entry-1,entry-2,...,entry-20`
- **Not 20 requests**: Each button doesn't make its own call

This is critical for performance on large sites with many like buttons per page.

```
┌─────────────────────────────────────────────────────────┐
│  Static Cache (same for all users)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  <div x-data="simpleLikes({ entryId: 'abc' })">   │  │
│  │      [Loading state - grey heart]                 │  │
│  │  </div>                                           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓
                   Page loads
                         ↓
┌─────────────────────────────────────────────────────────┐
│  JavaScript (per-user)                                  │
│  fetch('/!/simple-likes/status?ids=abc')                │
│  → { "abc": { "count": 42, "liked": true } }            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Hydrated Button (user-specific)                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ❤️ 42  (red filled heart, user has liked)        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## No Configuration Needed

The like button works with:
- **No caching** - Works normally
- **Half measure** - Works normally
- **Full static** - Works via client-side hydration

You don't need `{{ nocache }}` tags around like buttons.

---

## Stats Tags and Caching

Statistics displayed via Antlers tags (`{{ simple_like:stats }}`, etc.) are server-rendered and will show stale data on cached pages.

### Option 1: Nocache Tags

Wrap stats in Statamic's `{{ nocache }}` tags:

```antlers
{{ nocache }}
    {{ simple_like:stats }}
        <div>Total likes: {{ total_likes }}</div>
        <div>Today: {{ today_likes }}</div>
    {{ /simple_like:stats }}
{{ /nocache }}
```

Use this when:
- SEO matters for the stats content
- You're using half measure caching
- 30-minute staleness is acceptable

### Option 2: JavaScript + API

Fetch stats via API for real-time updates:

```html
<div x-data="globalStats()" x-init="fetch()">
    <template x-if="!loading">
        <div>
            <span x-text="data.total_likes"></span> total likes
        </div>
    </template>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('globalStats', () => ({
        data: null,
        loading: true,
        async fetch() {
            const response = await fetch('/!/simple-likes/global-stats');
            this.data = await response.json();
            this.loading = false;
        }
    }));
});
</script>
```

Use this when:
- Using full static caching
- Stats should update without page refresh
- Building SPAs or heavily cached sites

---

## API Endpoints for JavaScript

| Antlers Tag | API Endpoint |
|-------------|--------------|
| `{{ simple_like:stats }}` | `GET /!/simple-likes/global-stats` |
| `{{ simple_like:popular }}` | `GET /!/simple-likes/popular` |
| `{{ simple_like:activity }}` | `GET /!/simple-likes/activity` |
| `{{ simple_like:weekly }}` | `GET /!/simple-likes/weekly` |
| `{{ simple_like:top_users }}` | `GET /!/simple-likes/top-users` |
| Like status | `GET /!/simple-likes/status?ids=...` |

See [API Overview](/api/overview) for full documentation.

---

## Cache Invalidation

Simple Likes automatically invalidates its internal cache when likes change. Statamic's static cache is separate.

To clear static cache:

```bash
php please static:clear
```

Or configure short TTLs if you want stats to refresh periodically.

---

## Summary

| Component | Caching Behaviour |
|-----------|-------------------|
| Like buttons | ✅ Works with all caching (client-side hydration) |
| Stats Antlers tags | ⚠️ Stale on cached pages (use nocache or JS) |
| API endpoints | ✅ Always return fresh data |
