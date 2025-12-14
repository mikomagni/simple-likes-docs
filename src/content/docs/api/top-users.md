---
title: Top Users
description: Get users who have liked the most content.
---

Get authenticated users ranked by how many likes they've given.

```http
GET /!/simple-likes/top-users
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 10 | Maximum users to return (1-50) |

## Response

```json
[
    {
        "user_id": "user-abc-123",
        "name": "John Doe",
        "avatar": "https://your-site.com/assets/avatars/john.jpg",
        "initials": "JD",
        "likes_count": 47
    },
    {
        "user_id": "user-def-456",
        "name": "Jane Smith",
        "avatar": null,
        "initials": "JS",
        "likes_count": 35
    }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | string | Statamic user ID |
| `name` | string | User's name (shows "Anonymous" if not set) |
| `avatar` | string\|null | Avatar URL if user has custom avatar uploaded |
| `initials` | string | User's initials from Statamic (for fallback display) |
| `likes_count` | integer | Total likes given by user |

:::note
Only authenticated users are included. Guest likes are anonymous and cannot be attributed.
:::

## Examples

### Top 10 Users (Default)

```bash
curl "https://your-site.com/!/simple-likes/top-users"
```

### Top 5 Users

```bash
curl "https://your-site.com/!/simple-likes/top-users?limit=5"
```

### JavaScript

```javascript
async function getTopUsers(limit = 10) {
    const response = await fetch(`/!/simple-likes/top-users?limit=${limit}`);
    return response.json();
}

// Usage
const users = await getTopUsers(5);
users.forEach((user, index) => {
    console.log(`#${index + 1} ${user.name}: ${user.likes_count} likes`);
});
```

## Alpine.js Leaderboard

```html
<div x-data="topUsers()" x-init="fetch()">
    <h3>Top Contributors</h3>
    <template x-if="loading">
        <div>Loading...</div>
    </template>
    <ol x-show="!loading" class="space-y-2">
        <template x-for="(user, index) in users" :key="user.user_id">
            <li class="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <span class="text-lg font-bold text-gray-400" x-text="'#' + (index + 1)"></span>
                <template x-if="user.avatar">
                    <img :src="user.avatar" class="w-10 h-10 rounded-full" :alt="user.name">
                </template>
                <template x-if="!user.avatar">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
                         x-text="user.initials"></div>
                </template>
                <div class="flex-1">
                    <div class="font-medium" x-text="user.name"></div>
                </div>
                <div class="text-rose-500 font-bold flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                    </svg>
                    <span x-text="user.likes_count"></span>
                </div>
            </li>
        </template>
    </ol>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('topUsers', (limit = 10) => ({
        users: [],
        loading: true,

        async fetch() {
            const response = await fetch(`/!/simple-likes/top-users?limit=${limit}`);
            this.users = await response.json();
            this.loading = false;
        }
    }));
});
</script>
```

## Antlers Equivalent

```antlers
{{ simple_like:top_users limit="5" }}
    <li>
        {{ if avatar }}
            <img src="{{ avatar }}" alt="{{ name }}">
        {{ else }}
            <div class="avatar-initials">{{ initials }}</div>
        {{ /if }}
        <span>{{ name }}</span>
        <span>{{ likes_count }} likes</span>
    </li>
{{ /simple_like:top_users }}
```

## Use Cases

- Community leaderboards
- Gamification features
- Identifying engaged users
- Rewarding active members

## Privacy Note

This endpoint only returns users who have liked content. It does not expose:
- What specific content they liked
- When they liked it
- Any private user data

## Caching

Results are cached for 30 minutes. Cache key includes the limit parameter.
