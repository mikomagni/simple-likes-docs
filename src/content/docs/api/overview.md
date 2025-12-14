---
title: API Overview
description: Introduction to the Simple Likes REST API.
---

Simple Likes provides a REST API for toggling likes and retrieving statistics. All endpoints are prefixed with `/!/simple-likes/`.

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/!/simple-likes/{id}/toggle` | Toggle like/unlike for an entry |
| GET | `/!/simple-likes/status` | Get count and liked state (supports batching) |
| GET | `/!/simple-likes/global-stats` | Get site-wide statistics |
| GET | `/!/simple-likes/popular` | Get popular entries |
| GET | `/!/simple-likes/activity` | Get recent activity |
| GET | `/!/simple-likes/weekly` | Get daily counts for charts |
| GET | `/!/simple-likes/top-users` | Get top users by likes given |
| GET | `/!/simple-likes/stats-all` | **Combined** - All stats in one request |

## Authentication

POST endpoints require a CSRF token. GET endpoints are public (read-only).

### CSRF Token

Include the token from your meta tag in POST requests:

```html
<meta name="csrf-token" content="{{ csrf_token }}">
```

```javascript
fetch('/!/simple-likes/abc-123/toggle', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    }
});
```

### Token Expiry

If the CSRF token expires (419 response), the built-in JavaScript components automatically:
1. Fetch the current page to get a fresh token
2. Update the meta tag
3. Retry the original request

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

| Endpoint Type | Default Limit |
|---------------|---------------|
| POST `/toggle` | 60 requests/minute per IP |
| GET `/status` | 300 requests/minute per IP |
| All other GET endpoints | 120 requests/minute per IP |

When rate limited:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

```json
{
    "error": "Too many requests. Please slow down."
}
```

Configure limits in `config/simple-likes.php`:

```php
'rate_limiting' => [
    'like_toggle_limit' => 60,
    'stats_limit' => 120,
    'status_limit' => 300,
],
```

## Caching

All GET endpoints are cached for performance with configurable TTLs:

| Endpoint | Default TTL |
|----------|-------------|
| `/global-stats` | 30 minutes |
| `/popular` | 30 minutes |
| `/weekly` | 30 minutes |
| `/top-users` | 30 minutes |
| `/activity` | 1 minute |
| `/stats-all` | 1 minute |
| `/status` | 5 minutes |

```php
// config/simple-likes.php
'cache' => [
    'default_ttl' => 1800,    // 30 minutes
    'entry_ttl' => 300,       // 5 minutes
    'global_ttl' => 1800,     // 30 minutes
    'activity_ttl' => 60,     // 1 minute
    'stats_all_ttl' => 60,    // 1 minute
],
```

The toggle endpoint automatically invalidates relevant caches.

## Entry ID Validation

Entry IDs are validated to prevent injection attacks. Valid IDs contain only:
- Alphanumeric characters (a-z, A-Z, 0-9)
- Hyphens (-)
- Underscores (_)

Invalid IDs return:

```json
{
    "error": "Invalid entry ID format"
}
```

## Error Responses

| Status | Description |
|--------|-------------|
| `400` | Invalid entry ID format |
| `401` | Not authenticated (when guest likes disabled) |
| `403` | Likes are locked for this entry |
| `404` | Entry not found |
| `419` | CSRF token expired |
| `429` | Rate limit exceeded |
