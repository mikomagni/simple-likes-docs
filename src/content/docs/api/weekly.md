---
title: Weekly Activity
description: Get daily like counts for charts and graphs.
---

Get daily like counts, useful for building charts and visualizations.

```http
GET /!/simple-likes/weekly
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `days` | 7 | Number of days to include (1-30) |

## Response

```json
[
    {
        "date": "Dec 5",
        "full_date": "2025-12-05",
        "day_name": "Friday",
        "likes_count": 12,
        "percentage": 60,
        "max_count": 20
    },
    {
        "date": "Dec 6",
        "full_date": "2025-12-06",
        "day_name": "Saturday",
        "likes_count": 20,
        "percentage": 100,
        "max_count": 20
    },
    {
        "date": "Dec 7",
        "full_date": "2025-12-07",
        "day_name": "Sunday",
        "likes_count": 8,
        "percentage": 40,
        "max_count": 20
    }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Short date format (M j) |
| `full_date` | string | ISO date (Y-m-d) |
| `day_name` | string | Day of week |
| `likes_count` | integer | Likes on this day |
| `percentage` | integer | Percentage relative to max day (0-100) |
| `max_count` | integer | Highest count in the period |

The `percentage` field is pre-calculated for easy chart rendering - the day with the most likes is always 100%.

## Examples

### Last 7 Days (Default)

```bash
curl "https://your-site.com/!/simple-likes/weekly"
```

### Last 14 Days

```bash
curl "https://your-site.com/!/simple-likes/weekly?days=14"
```

### JavaScript

```javascript
async function getWeeklyData(days = 7) {
    const response = await fetch(`/!/simple-likes/weekly?days=${days}`);
    return response.json();
}

// Usage
const data = await getWeeklyData(14);
data.forEach(day => {
    console.log(`${day.date}: ${day.likes_count} likes (${day.percentage}%)`);
});
```

## Alpine.js Bar Chart

```html
<div x-data="weeklyChart()" x-init="fetch()">
    <h3>Weekly Activity</h3>
    <template x-if="loading">
        <div>Loading...</div>
    </template>
    <div x-show="!loading" class="space-y-2">
        <template x-for="day in data" :key="day.full_date">
            <div class="flex items-center gap-2">
                <div class="w-12 text-sm text-gray-600" x-text="day.date"></div>
                <div class="flex-1 bg-gray-200 rounded h-4">
                    <div
                        class="bg-blue-500 h-4 rounded transition-all"
                        :style="`width: ${day.percentage}%`"
                    ></div>
                </div>
                <div class="w-8 text-right text-sm" x-text="day.likes_count"></div>
            </div>
        </template>
    </div>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('weeklyChart', (days = 7) => ({
        data: [],
        loading: true,

        async fetch() {
            const response = await fetch(`/!/simple-likes/weekly?days=${days}`);
            this.data = await response.json();
            this.loading = false;
        }
    }));
});
</script>
```

## Antlers Equivalent

```antlers
{{ simple_like:weekly days="7" }}
    <div class="flex items-center">
        <span>{{ date }}</span>
        <div class="bg-blue-500 h-4" style="width: {{ percentage }}%"></div>
        <span>{{ likes_count }}</span>
    </div>
{{ /simple_like:weekly }}
```

## Use Cases

- Dashboard activity charts
- Engagement trend visualization
- Identifying peak activity days
- Content strategy insights

## Caching

Results are cached for 30 minutes. Cache key includes the days parameter.
