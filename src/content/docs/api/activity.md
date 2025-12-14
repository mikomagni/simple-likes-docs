---
title: Recent Activity
description: Get recent like activity.
---

Get a feed of recent like activity.

```http
GET /!/simple-likes/activity
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 10 | Maximum items to return (1-100) |
| `hours` | 24 | Time window in hours |

## Response

```json
[
    {
        "entry_id": "abc-123",
        "entry_title": "My Post Title",
        "entry_url": "/blog/my-post",
        "user_type": "authenticated",
        "time_ago": "2 minutes ago",
        "created_at": "2025-01-15T10:30:00+00:00"
    },
    {
        "entry_id": "def-456",
        "entry_title": "Another Post",
        "entry_url": "/blog/another-post",
        "user_type": "guest",
        "time_ago": "5 minutes ago",
        "created_at": "2025-01-15T10:27:00+00:00"
    }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `entry_id` | string | Statamic entry ID |
| `entry_title` | string | Entry title |
| `entry_url` | string | Entry URL |
| `user_type` | string | `authenticated` or `guest` |
| `time_ago` | string | Human-readable time (e.g., "2 minutes ago") |
| `created_at` | string | ISO 8601 timestamp |

## Examples

### Last 10 Likes in 24 Hours (Default)

```bash
curl "https://your-site.com/!/simple-likes/activity"
```

### Last 20 Likes in Past Week

```bash
curl "https://your-site.com/!/simple-likes/activity?limit=20&hours=168"
```

### JavaScript

```javascript
async function getActivity(limit = 10, hours = 24) {
    const params = new URLSearchParams({ limit, hours });
    const response = await fetch(`/!/simple-likes/activity?${params}`);
    return response.json();
}

// Usage
const activity = await getActivity(20, 168); // Last week
activity.forEach(item => {
    console.log(`${item.entry_title} liked by ${item.user_type} ${item.time_ago}`);
});
```

## Alpine.js Component

```html
<div x-data="recentActivity()" x-init="fetch()">
    <h3>Recent Activity</h3>
    <template x-if="loading">
        <div>Loading...</div>
    </template>
    <ul x-show="!loading">
        <template x-for="item in activity" :key="item.created_at">
            <li class="flex items-center gap-2">
                <span x-show="item.user_type === 'authenticated'" title="Member">👤</span>
                <span x-show="item.user_type === 'guest'" title="Guest">👻</span>
                <a :href="item.entry_url" x-text="item.entry_title"></a>
                <span class="text-gray-500" x-text="item.time_ago"></span>
            </li>
        </template>
    </ul>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('recentActivity', (limit = 10, hours = 24) => ({
        activity: [],
        loading: true,

        async fetch() {
            const params = new URLSearchParams({ limit, hours });
            const response = await fetch(`/!/simple-likes/activity?${params}`);
            this.activity = await response.json();
            this.loading = false;
        }
    }));
});
</script>
```

## Antlers Equivalent

```antlers
{{ simple_like:activity limit="10" hours="24" }}
    {{ if user_type == 'guest' }}👻{{ else }}👤{{ /if }}
    <a href="{{ entry_url }}">{{ entry_title }}</a>
    <span>{{ time_ago }}</span>
{{ /simple_like:activity }}
```

## Notes

- Activity is sorted newest first
- Deleted entries are automatically filtered out
- User identity is not exposed (privacy-friendly)

## Caching

Results are cached for 1 minute by default (configurable via `activity_ttl`). The short TTL ensures the "time ago" values stay accurate. Cache key includes limit and hours parameters.
