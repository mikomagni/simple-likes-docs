---
title: How It Works
description: Technical architecture and design decisions behind Simple Likes.
---

Understanding how Simple Likes works under the hood.

## Dual-Field Architecture

Simple Likes uses a clever separation between "boost" likes and real interactions:

| Storage | Field | Description |
|---------|-------|-------------|
| **Entry Field** | `simple_likes` | Boost Count - editable by admins |
| **Database Table** | `simple_likes` rows | Real interactions from users |

**Total Likes = Boost Count + Database Row Count**

### Why This Design?

1. **Seeding**: Admins can give entries a starting count without fake database rows
2. **Analytics**: Real likes are tracked separately for accurate engagement metrics
3. **Flexibility**: Changing boost doesn't affect real like history
4. **Transparency**: Control Panel shows both values distinctly

## Guest Identification

Guests are identified by a hash of their IP address + User Agent:

```php
'guest_' . hash('sha256', $request->ip() . '|' . $request->userAgent())
```

### Why IP + User Agent?

- **IP Only Problem**: Family/office members share IPs, would see each other's likes
- **Cookie Problem**: Requires consent banners, can be cleared, doesn't work cross-device
- **Our Solution**: Different devices/browsers get unique identifiers, even on same network

### Privacy Benefits

- No cookies required
- No tracking scripts
- IP addresses are hashed, never stored raw
- Works on first page load
- GDPR-friendly (no personal data stored)

## CSRF Token Handling

The JavaScript automatically handles expired CSRF tokens:

```
1. User clicks like button
2. Request fails with 419 (Token Expired)
3. JS fetches current page to get fresh token
4. JS extracts token from HTML meta tag
5. JS retries original request with new token
6. User sees success - no "please refresh" error
```

### Token Refresh Code

```javascript
async refreshCsrfToken() {
    const response = await fetch(window.location.href, {
        method: 'GET',
        credentials: 'same-origin'
    });
    const html = await response.text();
    const match = html.match(/<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/i);
    if (match && match[1]) {
        document.querySelector('meta[name="csrf-token"]')
            ?.setAttribute('content', match[1]);
        return match[1];
    }
    return null;
}
```

## Optimistic UI Updates

The JavaScript updates the UI immediately before the server responds:

```javascript
// 1. Save current state
const wasLiked = this.liked;

// 2. Optimistically update UI
this.liked = !this.liked;
this.count += this.liked ? 1 : -1;

// 3. Send request to server
try {
    const response = await fetch(...);
    // 4a. On success: sync with server data
    this.liked = data.user_has_liked;
    this.count = data.likes_count;
} catch (error) {
    // 4b. On error: rollback to saved state
    this.liked = wasLiked;
    this.count += wasLiked ? 1 : -1;
}
```

### Benefits

- Instant feedback (no waiting for server)
- Graceful error handling (automatic rollback)
- Server is source of truth (final state synced)

## Rate Limiting Layers

Simple Likes uses multiple layers of protection:

### Layer 1: Route Throttling
```php
Route::post('{id}/toggle', [Controller::class, 'toggle'])
    ->middleware("throttle:30,1"); // 30/minute per IP
```

### Layer 2: Rapid-Fire Protection
```php
// Max 5 likes in 10 seconds
$recentLikes = SimpleLike::where('ip_hash', $ipHash)
    ->where('created_at', '>=', now()->subSeconds(10))
    ->count();

if ($recentLikes >= 5) {
    return response()->json(['error' => 'Too fast'], 429);
}
```

### Layer 3: Toggle Spam Prevention
```php
// Max 3 toggles per entry in 60 seconds
$toggles = Cache::get("like_toggles:{$entryId}:{$userId}", 0);

if ($toggles >= 3) {
    return response()->json(['error' => 'Too many toggles'], 429);
}
```

## Static Caching Compatibility

Simple Likes works with Statamic's static caching, but requires different approaches for each strategy.

### Half Measure (Application Cache)

With half measure caching, Simple Likes works out of the box:

- Pages still run through Statamic on each request
- Like counts are always fresh
- User's "has liked" state is accurate
- No special configuration needed

### Full Measure (File-based Cache)

With full measure caching, the entire HTML is saved as a static file. This means:

- The like button HTML is frozen at cache time
- Like counts become stale
- User's "has liked" state won't reflect reality

**Solution: Wrap the tag with `{{ nocache }}`**

```blade
{{ nocache }}
    {{ simple_like }}
{{ /nocache }}
```

This tells Statamic to keep the like button dynamic while the rest of the page remains cached.

### In Collection Loops

When displaying likes in a loop, wrap each button:

```blade
{{ collection:articles }}
    <article>
        <h2>{{ title }}</h2>
        {{ content }}
        {{ nocache }}
            {{ simple_like }}
        {{ /nocache }}
    </article>
{{ /collection:articles }}
```

### Performance Consideration

Using `{{ nocache }}` means that section is rendered on every request. For high-traffic sites with full static caching, consider:

1. **Client-side hydration**: Load initial count from cache, then fetch fresh data via AJAX
2. **Shorter cache TTL**: Balance freshness vs. performance
3. **Half measure**: If most content needs to be dynamic anyway

:::tip
The `{{ nocache }}` tag only affects full measure caching. With half measure or no caching, it has no impact on performance.
:::

## Internal Caching Strategy

### Entry-Level Caching
```php
Cache::remember("simple_likes:{$entryId}", $ttl, function () use ($entryId) {
    return [
        'count' => SimpleLike::forEntry($entryId)->count(),
        'users' => SimpleLike::forEntry($entryId)->pluck('user_id'),
    ];
});
```

### Cache Invalidation
Caches are cleared when:
- A like is added or removed
- An entry is updated in the CP
- Manual cache clear via artisan

### Widget Caching
Dashboard widgets cache their results for 2-5 minutes to reduce database load.

## Database Indexes

The `simple_likes` table has these indexes for performance:

```sql
INDEX idx_entry_id (entry_id)          -- Fast entry lookups
INDEX idx_user_id (user_id)            -- Fast user lookups
INDEX idx_ip_hash (ip_hash)            -- Abuse detection
INDEX entry_created_index (entry_id, created_at)  -- Analytics queries
UNIQUE unique_entry_user_like (entry_id, user_id) -- Prevent duplicates
```

## Security Measures

### Input Validation
```php
// Entry IDs must be alphanumeric with hyphens/underscores
if (!preg_match('/^[a-zA-Z0-9_-]+$/', $entryId)) {
    return response()->json(['error' => 'Invalid entry ID'], 400);
}
```

### Transaction Locking
```php
DB::transaction(function () use ($entryId, $userId) {
    // Lock row to prevent race conditions
    $existing = SimpleLike::where('entry_id', $entryId)
        ->where('user_id', $userId)
        ->lockForUpdate()
        ->first();

    // ... toggle logic
});
```

### Hash Storage
```php
// Never store raw IP addresses
$ipHash = hash('sha256', $request->ip() . '|' . $request->userAgent());
```
