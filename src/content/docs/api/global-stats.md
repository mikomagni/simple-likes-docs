---
title: Global Stats
description: Get site-wide statistics across all entries.
---

Get aggregated statistics across all entries on your site.

```http
GET /!/simple-likes/global-stats
```

## Response

```json
{
    "total_likes": 1542,
    "total_entries": 87,
    "today_likes": 23,
    "week_likes": 156,
    "month_likes": 487
}
```

| Field | Type | Description |
|-------|------|-------------|
| `total_likes` | integer | Total likes across all entries (boost + real) |
| `total_entries` | integer | Entries with at least one like |
| `today_likes` | integer | Likes received today |
| `week_likes` | integer | Likes in last 7 days |
| `month_likes` | integer | Likes in last 30 days |

## Example

### JavaScript

```javascript
async function getGlobalStats() {
    const response = await fetch('/!/simple-likes/global-stats');
    return response.json();
}

// Usage
const stats = await getGlobalStats();
console.log(`Total likes: ${stats.total_likes}`);
console.log(`Today: ${stats.today_likes}`);
```

### cURL

```bash
curl "https://your-site.com/!/simple-likes/global-stats"
```

## Alpine.js Component

```html
<div x-data="globalStats()" x-init="fetch()">
    <template x-if="loading">
        <div>Loading stats...</div>
    </template>
    <template x-if="!loading">
        <div class="grid grid-cols-4 gap-4">
            <div>
                <div class="text-2xl font-bold" x-text="stats.total_likes"></div>
                <div class="text-sm text-gray-600">Total Likes</div>
            </div>
            <div>
                <div class="text-2xl font-bold" x-text="stats.total_entries"></div>
                <div class="text-sm text-gray-600">Entries</div>
            </div>
            <div>
                <div class="text-2xl font-bold" x-text="stats.today_likes"></div>
                <div class="text-sm text-gray-600">Today</div>
            </div>
            <div>
                <div class="text-2xl font-bold" x-text="stats.week_likes"></div>
                <div class="text-sm text-gray-600">This Week</div>
            </div>
        </div>
    </template>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('globalStats', () => ({
        stats: null,
        loading: true,

        async fetch() {
            const response = await fetch('/!/simple-likes/global-stats');
            this.stats = await response.json();
            this.loading = false;
        }
    }));
});
</script>
```

## Antlers Equivalent

This endpoint provides the same data as the `{{ simple_like:stats }}` tag:

```antlers
{{ simple_like:stats }}
    Total: {{ total_likes }}
    Entries: {{ total_entries }}
    Today: {{ today_likes }}
    This Week: {{ week_likes }}
{{ /simple_like:stats }}
```

Use the API when you need fresh data on statically cached pages. See [Static Caching](/advanced/caching) for details.

## Caching

Results are cached for 30 minutes (configurable via `cache_ttl`). Cache is shared with the Antlers tag.
