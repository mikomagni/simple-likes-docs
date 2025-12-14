---
title: Display Tags
description: Complete reference for all Simple Likes Antlers tags.
---

All available Antlers tags for displaying likes data.

## `{{ simple_like }}`

Renders a like button for the current entry.

```blade
{{# Basic usage #}}
{{ simple_like }}

{{# With custom template #}}
{{ simple_like template_from="partials.my-like-button" }}

{{# Using vanilla JS template #}}
{{ simple_like template_from="simple-likes::like-button-vanilla" }}
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `template_from` | `simple-likes::like-button` | Custom template path |

---

## `{{ simple_like:count }}`

Returns just the like count as a number. Useful for displaying counts without the button.

```blade
{{# Count for current entry (when inside an entry context) #}}
{{ simple_like:count }}

{{# Count for a specific entry by ID #}}
{{ simple_like:count id="abc-123" }}

{{# Total count for a specific collection #}}
{{ simple_like:count collection="articles" }}

{{# Total count across ALL entries (explicit) #}}
{{ simple_like:count collection="all" }}
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `id` | current entry | Specific entry ID to count |
| `collection` | all | Filter to a specific collection, or `"all"` for total |

---

## `{{ simple_like:stats }}`

Returns global statistics. Use as a tag pair to access variables.

```blade
{{ simple_like:stats }}
    <div class="stats-grid">
        <div>
            <h3>Total Likes</h3>
            <p>{{ total_likes }}</p>
        </div>
        <div>
            <h3>Entries with Likes</h3>
            <p>{{ total_entries }}</p>
        </div>
        <div>
            <h3>Today</h3>
            <p>{{ today_likes }}</p>
        </div>
        <div>
            <h3>This Week</h3>
            <p>{{ week_likes }}</p>
        </div>
        <div>
            <h3>This Month</h3>
            <p>{{ month_likes }}</p>
        </div>
        <div>
            <h3>Members vs Guests</h3>
            <p>{{ authenticated_likes }} / {{ guest_likes }}</p>
        </div>
    </div>
{{ /simple_like:stats }}
```

**Available Variables:**

| Variable | Description |
|----------|-------------|
| `total_likes` | Combined total across all entries |
| `total_entries` | Number of entries that have at least one like |
| `authenticated_likes` | Likes from logged-in users |
| `guest_likes` | Likes from guest visitors |
| `today_likes` | Likes created today |
| `week_likes` | Likes in the last 7 days |
| `month_likes` | Likes in the last 30 days |

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `cache` | 1800 | Cache time in seconds (0 to disable) |

---

## `{{ simple_like:popular }}`

Returns entries sorted by like count.

```blade
<h2>Most Popular Articles</h2>
<ul>
{{ simple_like:popular limit="10" collection="articles" }}
    <li>
        <a href="{{ url }}">{{ title }}</a>
        <span>{{ likes_count }} likes</span>
    </li>
{{ /simple_like:popular }}
</ul>
```

**Available Variables (per entry):**

| Variable | Description |
|----------|-------------|
| `entry_id` | Entry UUID |
| `title` | Entry title |
| `url` | Entry URL |
| `collection` | Collection handle |
| `likes_count` | Total likes |
| `entry` | Full entry object (for accessing other fields) |

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 5 | Number of entries to return |
| `collection` | all | Filter to specific collection |
| `cache` | 1800 | Cache time in seconds |

---

## `{{ simple_like:activity }}`

Returns recent like activity.

```blade
<h2>Recent Activity</h2>
{{ simple_like:activity limit="10" hours="48" }}
    <div class="activity-item">
        <span class="time">{{ time_ago }}</span>
        <a href="{{ entry_url }}">{{ entry_title }}</a>
        <span class="user-type">{{ user_type }}</span>
    </div>
{{ /simple_like:activity }}
```

**Available Variables (per activity):**

| Variable | Description |
|----------|-------------|
| `entry_title` | Title of the liked entry |
| `entry_url` | URL of the liked entry |
| `entry_id` | Entry UUID |
| `user_type` | "authenticated" or "guest" |
| `created_at` | Carbon date object |
| `time_ago` | Human-readable time (e.g., "2 hours ago") |
| `entry` | Full entry object |

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 10 | Number of activities to return |
| `hours` | 24 | Timeframe to look back |
| `cache` | 1800 | Cache time in seconds |

---

## `{{ simple_like:weekly }}`

Returns daily like counts for charting.

```blade
<h2>Likes This Week</h2>
<div class="chart">
{{ simple_like:weekly days="7" }}
    <div class="bar" style="height: {{ percentage }}%">
        <span class="label">{{ day_name }}</span>
        <span class="count">{{ likes_count }}</span>
    </div>
{{ /simple_like:weekly }}
</div>
```

**Available Variables (per day):**

| Variable | Description |
|----------|-------------|
| `date` | Formatted date (e.g., "Dec 8") |
| `full_date` | ISO date (e.g., "2025-12-08") |
| `day_name` | Day name (e.g., "Monday") |
| `likes_count` | Number of likes that day |
| `percentage` | Percentage of max day (for bar charts, 0-100) |
| `max_count` | Highest count in the period |

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `days` | 7 | Number of days to include |
| `cache` | 1800 | Cache time in seconds |

---

## `{{ simple_like:top_users }}`

Returns authenticated users ranked by total likes given. Useful for leaderboards or recognizing active community members.

```blade
<h2>Top Contributors</h2>
<ol>
{{ simple_like:top_users limit="10" }}
    <li>
        {{ if avatar }}
            <img src="{{ avatar }}" alt="{{ name }}">
        {{ else }}
            <div class="avatar-initials">{{ initials }}</div>
        {{ /if }}
        <span class="name">{{ name }}</span>
        <span class="count">{{ likes_count }} likes</span>
    </li>
{{ /simple_like:top_users }}
</ol>
```

**Available Variables (per user):**

| Variable | Description |
|----------|-------------|
| `user_id` | User ID |
| `likes_count` | Total likes given by this user |
| `name` | User's name (shows "Anonymous" if not set) |
| `avatar` | User's avatar URL if custom avatar uploaded (null otherwise) |
| `initials` | User's initials from Statamic (for fallback display) |
| `user` | Full user object (for accessing other fields) |

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 10 | Number of users to return |
| `cache` | 1800 | Cache time in seconds |

:::note
This tag only includes authenticated users. Guest likes are anonymous and cannot be attributed to specific users.
:::

---

## `{{ simple_like:my_likes }}`

Returns entries liked by the currently logged-in user. Perfect for building "My Favorites" or "Saved Items" pages in user account areas.

```blade
<h2>My Liked Articles</h2>
{{ simple_like:my_likes collection="articles" limit="10" }}
    <div class="liked-item">
        <a href="{{ url }}">{{ title }}</a>
        <span class="liked-time">Liked {{ liked_ago }}</span>
    </div>
{{ /simple_like:my_likes }}
```

**Handling Empty States:**

When the user hasn't liked any content, the tag returns an empty array. Use variable assignment to handle empty states gracefully:

```blade
{{ my_articles = {simple_like:my_likes collection="articles" limit="5"} }}
{{ if my_articles }}
    {{ my_articles }}
        <a href="{{ url }}">{{ title }}</a>
    {{ /my_articles }}
{{ else }}
    <p>You haven't liked any articles yet.</p>
{{ /if }}
```

**Available Variables (per entry):**

| Variable | Description |
|----------|-------------|
| `entry_id` | Entry UUID |
| `title` | Entry title |
| `url` | Entry URL |
| `collection` | Collection handle |
| `liked_at` | Carbon date object of when the like was created |
| `liked_ago` | Human-readable time (e.g., "2 hours ago") |
| `entry` | Full entry object (for accessing other fields) |

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `collection` | all | Filter to a specific collection |
| `limit` | 10 | Maximum number of entries to return |

:::note
This tag requires an authenticated user. Returns an empty array for guests.
:::

---

## `{{ simple_like:my_likes_count }}`

Returns the count of likes given by the currently logged-in user. Useful for displaying activity statistics in user profiles or dashboards.

```blade
{{# Total likes by the current user #}}
<p>You've liked {{ simple_like:my_likes_count }} items</p>

{{# Likes in a specific collection #}}
<p>Saved houses: {{ simple_like:my_likes_count collection="houses" }}</p>

{{# Likes within a time period #}}
<p>Liked today: {{ simple_like:my_likes_count period="today" }}</p>
<p>Liked this week: {{ simple_like:my_likes_count period="week" }}</p>
<p>Liked this month: {{ simple_like:my_likes_count period="month" }}</p>

{{# Combine collection and period filters #}}
<p>Articles liked this week: {{ simple_like:my_likes_count collection="articles" period="week" }}</p>
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `collection` | all | Filter to a specific collection |
| `period` | all time | Time filter: `today`, `week`, or `month` |

:::note
This tag requires an authenticated user. Returns `0` for guests.
:::
