---
title: Configuration Options
description: All available configuration options for Simple Likes.
---

Customise Simple Likes behaviour through configuration.

## Publish the Config

```bash
php artisan vendor:publish --tag=simple-likes-config
```

This creates `config/simple-likes.php`.

## Full Configuration

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Template
    |--------------------------------------------------------------------------
    |
    | Set a default template for the {{ simple_like }} tag.
    | When set, all like buttons will use this template unless overridden.
    |
    */
    'default_template' => env('SIMPLE_LIKES_DEFAULT_TEMPLATE', null),

    /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    |
    | The database connection to use for storing likes.
    | Set to null to use Laravel's default connection.
    |
    */
    'connection' => env('SIMPLE_LIKES_DB_CONNECTION', null),

    /*
    |--------------------------------------------------------------------------
    | Auto Migration
    |--------------------------------------------------------------------------
    |
    | Automatically run migration when the addon boots.
    | Set to false if you prefer to publish and run migrations manually.
    |
    */
    'auto_migrate' => env('SIMPLE_LIKES_AUTO_MIGRATE', true),

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Configure caching behavior for different types of data.
    | All values are in seconds. Set to 0 to disable caching.
    |
    */
    'cache' => [
        'default_ttl' => env('SIMPLE_LIKES_CACHE_TTL', 1800),
        'entry_ttl' => env('SIMPLE_LIKES_CACHE_ENTRY_TTL', 300),
        'global_ttl' => env('SIMPLE_LIKES_CACHE_GLOBAL_TTL', 1800),
        'activity_ttl' => env('SIMPLE_LIKES_CACHE_ACTIVITY_TTL', 60),
        'popular_ttl' => env('SIMPLE_LIKES_CACHE_POPULAR_TTL', 1800),
        'weekly_ttl' => env('SIMPLE_LIKES_CACHE_WEEKLY_TTL', 1800),
        'top_users_ttl' => env('SIMPLE_LIKES_CACHE_TOP_USERS_TTL', 1800),
        'stats_all_ttl' => env('SIMPLE_LIKES_CACHE_STATS_ALL_TTL', 60),

        // CP Widget TTLs (shorter for fresher admin data)
        'widget_overview_ttl' => env('SIMPLE_LIKES_WIDGET_OVERVIEW_TTL', 300),
        'widget_popular_ttl' => env('SIMPLE_LIKES_WIDGET_POPULAR_TTL', 300),
        'widget_activity_ttl' => env('SIMPLE_LIKES_WIDGET_ACTIVITY_TTL', 120),
        'widget_top_users_ttl' => env('SIMPLE_LIKES_WIDGET_TOP_USERS_TTL', 300),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limiting to prevent spam and bot attacks.
    |
    */
    'rate_limiting' => [
        // Max toggle requests per minute per IP
        'like_toggle_limit' => env('SIMPLE_LIKES_TOGGLE_LIMIT', 60),

        // Max stats requests per minute per IP
        'stats_limit' => env('SIMPLE_LIKES_STATS_LIMIT', 120),

        // Max status requests per minute per IP (higher - called on every page load)
        'status_limit' => env('SIMPLE_LIKES_STATUS_LIMIT', 300),

        // Rapid-fire protection
        'rapid_fire' => [
            'max_likes' => env('SIMPLE_LIKES_RAPID_FIRE_MAX', 10),
            'time_window' => env('SIMPLE_LIKES_RAPID_FIRE_WINDOW', 10), // seconds
        ],

        // Per-user limits
        'user_limits' => [
            'max_likes_per_minute' => env('SIMPLE_LIKES_USER_MAX_PER_MINUTE', 30),
            'max_toggles_per_entry' => env('SIMPLE_LIKES_MAX_TOGGLES_PER_ENTRY', 10),
            'toggle_time_window' => env('SIMPLE_LIKES_TOGGLE_WINDOW', 60), // seconds
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Widget Configuration
    |--------------------------------------------------------------------------
    |
    | Configure dashboard widget display limits.
    |
    */
    'widget' => [
        'recent_activity_limit' => env('SIMPLE_LIKES_RECENT_ACTIVITY_LIMIT', 5),
        'popular_entries_limit' => env('SIMPLE_LIKES_POPULAR_ENTRIES_LIMIT', 5),
        'popular_entries_sort_by' => env('SIMPLE_LIKES_POPULAR_ENTRIES_SORT_BY', 'total'),
        'top_users_limit' => env('SIMPLE_LIKES_TOP_USERS_LIMIT', 5),
    ],
];
```

## Quick Reference

The most common settings you'll want to customise in your `.env`:

```env
# Widget display limits
SIMPLE_LIKES_RECENT_ACTIVITY_LIMIT=7
SIMPLE_LIKES_POPULAR_ENTRIES_LIMIT=7
SIMPLE_LIKES_TOP_USERS_LIMIT=7

# Sort popular entries by 'total' (boost + real) or 'real' (interactions only)
SIMPLE_LIKES_POPULAR_ENTRIES_SORT_BY=real

# Use a custom template for all like buttons
SIMPLE_LIKES_DEFAULT_TEMPLATE=simple-likes/one
```

## All Environment Variables

Add to your `.env` file to customise without editing the config file:

```env
# Default template (leave empty to use built-in template)
SIMPLE_LIKES_DEFAULT_TEMPLATE=

# Database connection (leave empty to use Laravel's default)
SIMPLE_LIKES_DB_CONNECTION=

# Auto migration (set to false to run migrations manually)
SIMPLE_LIKES_AUTO_MIGRATE=true

# Cache settings (all values in seconds)
SIMPLE_LIKES_CACHE_TTL=1800
SIMPLE_LIKES_CACHE_ENTRY_TTL=300
SIMPLE_LIKES_CACHE_GLOBAL_TTL=1800
SIMPLE_LIKES_CACHE_ACTIVITY_TTL=60
SIMPLE_LIKES_CACHE_POPULAR_TTL=1800
SIMPLE_LIKES_CACHE_WEEKLY_TTL=1800
SIMPLE_LIKES_CACHE_TOP_USERS_TTL=1800
SIMPLE_LIKES_CACHE_STATS_ALL_TTL=60

# CP Widget cache TTLs (shorter for fresher admin data)
SIMPLE_LIKES_WIDGET_OVERVIEW_TTL=300
SIMPLE_LIKES_WIDGET_POPULAR_TTL=300
SIMPLE_LIKES_WIDGET_ACTIVITY_TTL=120
SIMPLE_LIKES_WIDGET_TOP_USERS_TTL=300

# Rate limiting
SIMPLE_LIKES_TOGGLE_LIMIT=60
SIMPLE_LIKES_STATS_LIMIT=120
SIMPLE_LIKES_STATUS_LIMIT=300
SIMPLE_LIKES_RAPID_FIRE_MAX=10
SIMPLE_LIKES_RAPID_FIRE_WINDOW=10
SIMPLE_LIKES_USER_MAX_PER_MINUTE=30
SIMPLE_LIKES_MAX_TOGGLES_PER_ENTRY=10
SIMPLE_LIKES_TOGGLE_WINDOW=60

# Widget settings
SIMPLE_LIKES_RECENT_ACTIVITY_LIMIT=5
SIMPLE_LIKES_POPULAR_ENTRIES_LIMIT=5
SIMPLE_LIKES_POPULAR_ENTRIES_SORT_BY=total
SIMPLE_LIKES_TOP_USERS_LIMIT=5
```

## Configuration Options Explained

### Default Template

```php
'default_template' => null,
```

Set a default custom template for all `{{ simple_like }}` tags. This saves you from adding `template_from` to every tag.

**Examples:**

```php
// Use your own custom template
'default_template' => 'partials.my-like-button',

// Use the addon's vanilla JS template (no Alpine.js)
'default_template' => 'simple-likes::like-button-vanilla',
```

**Priority order:**
1. `template_from` parameter on the tag (highest)
2. `default_template` config option
3. Built-in addon template (lowest)

This means you can set a site-wide default but still override it on specific pages:

```blade
{{# Uses your default_template from config #}}
{{ simple_like }}

{{# Override with a different template just for this page #}}
{{ simple_like template_from="partials.special-button" }}
```

### Database Connection

```php
'connection' => null,
```

- `null` (default): Uses Laravel's `DB_CONNECTION` setting
- `'mysql'`: Use a specific connection from `config/database.php`
- `'simple_likes'`: Use a custom dedicated connection

See [Database Setup](/reference/database/) for more details.

### Auto Migration

```php
'auto_migrate' => true,
```

When `true`, Simple Likes automatically creates the database table on first boot. Set to `false` if you prefer to:
- Run migrations manually via `php artisan migrate`
- Have more control over your database schema
- Use a custom migration

### Cache Configuration

Simple Likes provides granular control over caching for different types of data:

```php
'cache' => [
    'default_ttl' => 1800,     // 30 min - fallback for any unspecified cache
    'entry_ttl' => 300,        // 5 min - per-entry stats
    'global_ttl' => 1800,      // 30 min - site-wide totals
    'activity_ttl' => 60,      // 1 min - recent activity feed
    'popular_ttl' => 1800,     // 30 min - popular entries ranking
    'weekly_ttl' => 1800,      // 30 min - weekly chart data
    'top_users_ttl' => 1800,   // 30 min - top users leaderboard
    'stats_all_ttl' => 60,     // 1 min - combined stats endpoint

    // CP Widget TTLs
    'widget_overview_ttl' => 300,    // 5 min - overview widget
    'widget_popular_ttl' => 300,     // 5 min - popular entries widget
    'widget_activity_ttl' => 120,    // 2 min - recent activity widget
    'widget_top_users_ttl' => 300,   // 5 min - top users widget
],
```

#### Cache Types Explained

**API Endpoint Cache TTLs:**

| Type | Default | Description |
|------|---------|-------------|
| `entry_ttl` | 5 min | Per-entry like counts and user status |
| `global_ttl` | 30 min | Total likes, total entries, today/week/month counts |
| `activity_ttl` | 1 min | Recent activity feed (time-sensitive) |
| `popular_ttl` | 30 min | Popular entries ranking |
| `weekly_ttl` | 30 min | Daily counts for charts |
| `top_users_ttl` | 30 min | Top users leaderboard |
| `stats_all_ttl` | 1 min | Combined stats endpoint |

**Control Panel Widget Cache TTLs:**

| Type | Default | Description |
|------|---------|-------------|
| `widget_overview_ttl` | 5 min | Overview stats widget |
| `widget_popular_ttl` | 5 min | Popular entries widget |
| `widget_activity_ttl` | 2 min | Recent activity widget (shorter for freshness) |
| `widget_top_users_ttl` | 5 min | Top users widget |

#### High-Traffic Site Recommendations

For busy sites, use shorter TTLs for time-sensitive data and longer TTLs for stable data:

```env
# Near real-time activity (updates every 30 seconds)
SIMPLE_LIKES_CACHE_ACTIVITY_TTL=30
SIMPLE_LIKES_CACHE_STATS_ALL_TTL=30

# Stable data can cache longer (reduces DB load)
SIMPLE_LIKES_CACHE_GLOBAL_TTL=3600
SIMPLE_LIKES_CACHE_POPULAR_TTL=3600
SIMPLE_LIKES_CACHE_TOP_USERS_TTL=3600
```

#### Low-Traffic Site / Development

For development or low-traffic sites where you want instant updates:

```env
# Disable caching entirely
SIMPLE_LIKES_CACHE_TTL=0
SIMPLE_LIKES_CACHE_ENTRY_TTL=0
SIMPLE_LIKES_CACHE_ACTIVITY_TTL=0
```

#### Why Activity Uses Short TTL

The activity feed shows "2 minutes ago", "just now", etc. Long cache times would show stale relative times. The 60-second default balances freshness with performance.

The `stats_all` endpoint defaults to 60 seconds because it includes activity data. Increase this if you don't need near-real-time activity updates.

### Rate Limiting

#### Toggle Limit
```php
'like_toggle_limit' => 60,
```
Maximum like/unlike requests per minute per IP address.

#### Stats Limit
```php
'stats_limit' => 120,
```
Maximum stats API requests per minute per IP address.

#### Status Limit
```php
'status_limit' => 300,
```
Maximum status API requests per minute per IP address. This is higher than other limits because the status endpoint is called on every page load to hydrate like buttons with the current user's like state.

#### Rapid-Fire Protection
```php
'rapid_fire' => [
    'max_likes' => 10,
    'time_window' => 10,
],
```
Prevents spamming by limiting to 10 likes in any 10-second window.

#### User Limits
```php
'user_limits' => [
    'max_likes_per_minute' => 30,
    'max_toggles_per_entry' => 10,
    'toggle_time_window' => 60,
],
```
- `max_likes_per_minute`: Total likes a user can make per minute
- `max_toggles_per_entry`: How many times a user can toggle the same entry
- `toggle_time_window`: Time window for toggle limit (seconds)

### Widget Settings

#### Popular Entries Sort
```php
'popular_entries_sort_by' => 'total',
```

- `'total'`: Sort by total likes (boost + real)
- `'interactions'` or `'real'`: Sort by real interactions only
