---
title: Example Templates
description: Ready-to-use example templates for stats widgets and counters.
---

Simple Likes includes example templates for dashboard widgets like stats overviews, popular entries, activity feeds, and charts. These are separate from the [like button templates](/templates/default/) which live at the root level.

## Quick Reference

```html
{{ partial src="simple-likes::examples/stats-overview" }}
{{ partial src="simple-likes::examples/popular-entries" }}
{{ partial src="simple-likes::examples/recent-activity" }}
{{ partial src="simple-likes::examples/weekly-chart" }}
{{ partial src="simple-likes::examples/monthly-chart" }}
{{ partial src="simple-likes::examples/top-users" }}
{{ partial src="simple-likes::examples/simple-counters" }}
```

---

## API vs Antlers Tags

The example templates use **JavaScript + API endpoints** to fetch data. This is the recommended approach for most sites.

### Why API-based templates?

| Benefit | Description |
|---------|-------------|
| **Cache-friendly** | Works perfectly with static caching - data loads fresh via JS |
| **Always current** | Stats update without page refresh or cache invalidation |
| **Better UX** | Shows loading states while data fetches |
| **Consistent** | Same pattern as the like buttons use |

### When to use Antlers tags instead

The [display tags](/reference/tags/) (`{{ simple_like:stats }}`, `{{ simple_like:popular }}`, etc.) are still available if you need server-rendered output:

| Use Case | Recommendation |
|----------|----------------|
| Sites without JavaScript | Use Antlers tags |
| SEO for stats content | Use Antlers tags (rare need) |
| Sites without static caching | Either works, but API is still cleaner |
| Simpler debugging | Antlers tags show values in view source |

:::tip
For most sites, the API-based example templates are the best choice. Use the Antlers tags directly (documented in [Display Tags](/reference/tags/)) only if you have a specific need for server-rendered stats.
:::

---

## Stats Overview

Shows total likes, liked entries count, today's likes, and this week's likes.

```html
{{ partial src="simple-likes::examples/stats-overview" }}
```

**API endpoint:** `GET /!/simple-likes/global-stats`

**Antlers equivalent:** `{{ simple_like:stats }}`

---

## Popular Entries

Lists the most liked content with titles, collections, and like counts.

```html
{{ partial src="simple-likes::examples/popular-entries" }}
```

**API endpoint:** `GET /!/simple-likes/popular?limit=5`

**Antlers equivalent:** `{{ simple_like:popular limit="5" }}`

---

## Recent Activity

Shows recent like activity with user type indicators and timestamps.

```html
{{ partial src="simple-likes::examples/recent-activity" }}
```

**API endpoint:** `GET /!/simple-likes/activity?limit=8&hours=24`

**Antlers equivalent:** `{{ simple_like:activity limit="8" hours="24" }}`

---

## Weekly Chart

Bar chart showing likes per day for the last 7 days.

```html
{{ partial src="simple-likes::examples/weekly-chart" }}
```

**API endpoint:** `GET /!/simple-likes/weekly?days=7`

**Antlers equivalent:** `{{ simple_like:weekly days="7" }}`

---

## Monthly Chart

Bar chart showing likes per day for the last 30 days.

```html
{{ partial src="simple-likes::examples/monthly-chart" }}
```

**API endpoint:** `GET /!/simple-likes/weekly?days=30`

**Antlers equivalent:** `{{ simple_like:weekly days="30" }}`

---

## Top Users

Leaderboard of users who have liked the most content.

```html
{{ partial src="simple-likes::examples/top-users" }}
```

**API endpoint:** `GET /!/simple-likes/top-users?limit=10`

**Antlers equivalent:** `{{ simple_like:top_users limit="10" }}`

---

## Simple Counters

Inline counters for total likes, entry likes, or collection likes.

```html
{{ partial src="simple-likes::examples/simple-counters" }}
```

**API endpoints:** Various (`/!/simple-likes/global-stats`, `/!/simple-likes/status`, `/!/simple-likes/stats-all`)

**Antlers equivalent:** `{{ simple_like:count }}`, `{{ simple_like:count collection="blog" }}`

---

## Customising Examples

These templates are meant as starting points. To customise:

1. **Publish the views:**
   ```bash
   php artisan vendor:publish --tag=simple-likes-views
   ```

2. **Copy and modify:**
   Templates will be in `resources/views/vendor/simple-likes/examples/`

3. **Or create your own** using the API endpoints or Antlers tags directly.

## Combining Multiple Widgets

For a full dashboard, use the `stats-all` endpoint to fetch everything in one request:

```html
<div x-data="{ data: null, loading: true }" x-init="
    fetch('/!/simple-likes/stats-all?popular_limit=5&activity_limit=8&weekly_days=7&top_users_limit=5')
        .then(r => r.json())
        .then(d => { data = d; loading = false; })
">
    {{# Access data.global, data.popular, data.activity, data.weekly, data.top_users #}}
</div>
```

This is more efficient than making separate requests for each widget.
