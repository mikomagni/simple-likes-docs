---
title: Toggle Like
description: Toggle the like state for an entry.
---

Toggle the like/unlike state for an entry. Creates a like if the user hasn't liked, removes it if they have.

```http
POST /!/simple-likes/{entry_id}/toggle
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `X-CSRF-TOKEN` | Yes | CSRF token from meta tag |

## Response

```json
{
    "likes_count": 42,
    "user_has_liked": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `likes_count` | integer | Total likes (boost + real combined) |
| `user_has_liked` | boolean | Whether current user has liked |

## Errors

| Status | Message | Description |
|--------|---------|-------------|
| `400` | Invalid request | Invalid entry ID format |
| `401` | Please log in | Guest likes disabled, user not authenticated |
| `403` | Likes disabled | Entry has likes locked |
| `404` | Content not found | Entry doesn't exist |
| `419` | CSRF mismatch | Token expired |
| `429` | Too many requests | Rate limit exceeded |

## Example

### JavaScript

```javascript
async function toggleLike(entryId) {
    const response = await fetch(`/!/simple-likes/${entryId}/toggle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}

// Usage
const result = await toggleLike('my-entry-id');
console.log(result.user_has_liked); // true or false
console.log(result.likes_count);    // 42
```

### cURL

```bash
curl -X POST "https://your-site.com/!/simple-likes/my-entry-id/toggle" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token"
```

## Notes

- Each user can only like an entry once
- Calling toggle again removes the like (unlike)
- Guest users are identified by IP + User Agent hash
- The response always includes the current total count
