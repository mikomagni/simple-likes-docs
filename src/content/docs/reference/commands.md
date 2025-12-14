---
title: Commands
description: CLI commands for installing and managing Simple Likes.
---

Simple Likes provides commands for installation, cache management, and maintenance. All commands are available via Statamic's `please` command.

## simple-likes:install

Interactive command to install Simple Likes. Creates the database table and optionally publishes assets.

### Basic Usage

```bash
php please simple-likes:install
```

The command will:
1. Check your database connection
2. Create the `simple_likes` table
3. Ask if you want to publish the config file
4. Ask if you want to publish the view templates
5. Ask if you want to publish the JavaScript files
6. Ask if you want to publish the CSS files

### Options

| Option | Description |
|--------|-------------|
| `--force` | Force reinstall even if the table already exists (drops and recreates) |

### Non-Interactive Mode

For CI/CD pipelines or scripts, use the `--no-interaction` flag:

```bash
php please simple-likes:install --no-interaction
```

This will create the table without prompting for publishing assets.

### Example Output

```
  ❤ Simple Likes

 Installing...

 ⠋ Creating database table...
 Database table created successfully.

 ┌ Would you like to publish the config file? ────────────────┐
 │ Lets you customise templates, caching, and rate limiting.  │
 └─────────────────────────────────────────────────────────────┘

 ┌ Would you like to publish the view templates? ─────────────┐
 │ Lets you customise the like button templates.              │
 └─────────────────────────────────────────────────────────────┘

 ┌ Would you like to publish the JavaScript files? ───────────┐
 │ Copies JS to public/vendor/simple-likes/js.                │
 └─────────────────────────────────────────────────────────────┘

 ┌ Would you like to publish the CSS files? ──────────────────┐
 │ Copies CSS to public/vendor/simple-likes/css.              │
 └─────────────────────────────────────────────────────────────┘

 Simple Likes installed successfully!

 ┌─────────────────────────────────────────────┐
 │  Next Steps                                 │
 ├─────────────────────────────────────────────┤
 │  1. Add {{ simple_like }} to your templates │
 │  2. Docs: https://simplelikes.com           │
 └─────────────────────────────────────────────┘
```

---

## simple-likes:warm-cache

Pre-populates the cache with like counts for faster page loads. This avoids database queries on first page visits by warming the cache ahead of time.

### Basic Usage

```bash
# Warm cache for top 50 most popular entries (default)
php please simple-likes:warm-cache

# Warm more entries
php please simple-likes:warm-cache --limit=100

# Warm ALL entries that have likes
php please simple-likes:warm-cache --all

# Also warm global statistics cache
php please simple-likes:warm-cache --stats
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--limit=N` | 50 | Number of popular entries to warm (ignored if `--all` is used) |
| `--all` | false | Warm cache for all entries with likes instead of just the most popular |
| `--stats` | false | Also warm the global statistics cache |

### What Gets Cached

**Per-entry cache** (for each entry, cached for 1 hour):
- Like count (`simple_likes_count_{entryId}`)

**Global statistics** (with `--stats` flag, cached for 30 minutes):
- Total likes (including starting counts from entries)
- Count of authenticated vs guest likes
- Today's likes and this week's likes

### When to Use

| Scenario | Recommended Command |
|----------|---------------------|
| After deploying to production | `php please simple-likes:warm-cache --all --stats` |
| Daily scheduled task | `php please simple-likes:warm-cache --limit=100` |
| After importing/migrating data | `php please simple-likes:warm-cache --all --stats` |
| Quick refresh of popular content | `php please simple-likes:warm-cache` |

### Scheduling

Add to `routes/console.php` to run automatically:

```php
use Illuminate\Support\Facades\Schedule;

// Warm cache daily at 4 AM
Schedule::command('simple-likes:warm-cache --limit=100')
    ->dailyAt('04:00');

// Or warm all entries weekly
Schedule::command('simple-likes:warm-cache --all --stats')
    ->weekly();
```

### Example Output

Default run:

```
Starting Simple Likes cache warming...
Warming cache for top 50 popular entries...
 50/50 [============================] 100%
Successfully warmed cache for 50 entries.
```

With `--all --stats`:

```
Starting Simple Likes cache warming...
Warming cache for all 234 entries with likes...
 234/234 [============================] 100%
Warming global statistics cache...
Global statistics cache warmed.
Successfully warmed cache for 234 entries.
```

