---
title: Combined Stats
description: Fetch all statistics in a single API request
---

The Combined Stats endpoint returns all analytics data in a single request, reducing multiple API calls to one. Ideal for dashboards and high-traffic pages.

## Endpoint

```
GET /!/simple-likes/stats-all
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `popular_limit` | integer | `5` | Number of popular entries to return |
| `activity_limit` | integer | `8` | Number of recent activity items |
| `activity_hours` | integer | `168` | Hours to look back for activity (168 = 1 week) |
| `weekly_days` | integer | `7` | Number of days for weekly chart |
| `top_users_limit` | integer | `5` | Number of top users to return |
| `collections` | string | - | Comma-separated collection handles for counts |

## Example Request

```bash
curl "https://yoursite.com/!/simple-likes/stats-all?popular_limit=5&activity_limit=8&activity_hours=168&weekly_days=7&top_users_limit=5&collections=news,houses,products,recipes"
```

## Response

```json
{
    "global": {
        "total_likes": 6959,
        "total_entries": 21,
        "today_likes": 5,
        "week_likes": 52,
        "month_likes": 64
    },
    "collections": {
        "news": 1245,
        "houses": 892,
        "products": 3421,
        "recipes": 1401
    },
    "popular": [
        {
            "entry_id": "product-001",
            "title": "Premium Widget",
            "url": "/products/premium-widget",
            "collection": "products",
            "likes_count": 847
        }
    ],
    "activity": [
        {
            "entry_id": "news-005",
            "entry_title": "Latest Update",
            "entry_url": "/news/latest-update",
            "user_type": "authenticated",
            "time_ago": "2 hours ago",
            "created_at": "2024-01-15T10:30:00+00:00"
        }
    ],
    "weekly": [
        {
            "date": "Mon",
            "full_date": "2024-01-08",
            "day_name": "Monday",
            "likes_count": 12,
            "percentage": 80,
            "max_count": 15
        }
    ],
    "top_users": [
        {
            "user_id": "user-123",
            "name": "John Doe",
            "avatar": "https://your-site.com/assets/avatars/john.jpg",
            "initials": "JD",
            "likes_count": 47
        }
    ]
}
```

## Response Fields

### `global`
Site-wide statistics (same as [Global Stats](/api/global-stats) endpoint).

### `collections`
Like counts per collection. Only included if `collections` parameter is provided.

### `popular`
Array of popular entries (same format as [Popular](/api/popular) endpoint).

### `activity`
Array of recent activity (same format as [Activity](/api/activity) endpoint).

### `weekly`
Array of daily counts (same format as [Weekly](/api/weekly) endpoint).

### `top_users`
Array of top users:
- `avatar` - Avatar URL if user has custom avatar (null otherwise)
- `initials` - User's initials from Statamic (for fallback display)

## Alpine.js Example

```html
<div x-data="statsSection()">
    <!-- Global Stats -->
    <div class="grid grid-cols-4 gap-4">
        <div>
            <span x-text="formatNumber(globalStats.total_likes)">-</span>
            <span>Total Likes</span>
        </div>
        <div>
            <span x-text="formatNumber(globalStats.total_entries)">-</span>
            <span>Entries</span>
        </div>
        <div>
            <span x-text="formatNumber(globalStats.today_likes)">-</span>
            <span>Today</span>
        </div>
        <div>
            <span x-text="formatNumber(globalStats.week_likes)">-</span>
            <span>This Week</span>
        </div>
    </div>

    <!-- Collection Counts -->
    <div class="grid grid-cols-4 gap-4">
        <template x-for="(count, name) in collectionCounts" :key="name">
            <div>
                <span x-text="count">-</span>
                <span x-text="name"></span>
            </div>
        </template>
    </div>

    <!-- Popular Entries -->
    <ul>
        <template x-for="entry in popular" :key="entry.entry_id">
            <li>
                <a :href="entry.url" x-text="entry.title"></a>
                <span x-text="entry.likes_count"></span>
            </li>
        </template>
    </ul>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('statsSection', () => ({
        globalStats: {},
        collectionCounts: {},
        popular: [],
        activity: [],
        weekly: [],
        topUsers: [],

        formatNumber(num) {
            if (num === undefined || num === null) return '-';
            return num.toLocaleString();
        },

        async init() {
            const res = await fetch('/!/simple-likes/stats-all?collections=news,products');
            const data = await res.json();

            this.globalStats = data.global;
            this.collectionCounts = data.collections;
            this.popular = data.popular;
            this.activity = data.activity;
            this.weekly = data.weekly;
            this.topUsers = data.top_users;
        }
    }));
});
</script>
```

## Why Use This Endpoint?

| Approach | Requests | Best For |
|----------|----------|----------|
| Individual endpoints | 6-10 | Single widgets, targeted data |
| Combined endpoint | 1 | Dashboards, homepages, high-traffic pages |

### Performance Benefits

- **Reduced latency**: 1 round-trip vs 6-10
- **Lower server load**: Single cache lookup vs multiple
- **Rate limit friendly**: Uses only 1 of your 120 requests/minute
- **Atomic data**: All stats from same cache snapshot

## Caching

Responses are cached server-side based on the query parameters. The cache key is generated from all parameters, so different parameter combinations are cached separately.

Default cache TTL: 1 minute (configurable via `stats_all_ttl`). The short TTL ensures activity and time-sensitive data stays fresh.

## Notes

- All individual endpoints remain available for targeted use cases
- The `collections` parameter is optional - omit it if you don't need per-collection counts
- Avatar fallback: If user has no custom avatar, `avatar` will be `null` and you can display `initials` instead
