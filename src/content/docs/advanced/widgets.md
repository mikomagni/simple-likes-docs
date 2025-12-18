---
title: Dashboard Widgets
description: Add analytics widgets to your Statamic Control Panel dashboard.
---

Simple Likes includes 4 dashboard widgets for the Statamic Control Panel that provide real-time analytics on likes, popular content, and user engagement.

:::tip[See it in action]
The [live demo](https://demo.simplelikes.com/cp) shows all four widgets with real data from 30 days of activity.
:::

## Adding Widgets

Add widgets to `config/statamic/cp.php`:

```php
'widgets' => [
    ['type' => 'overview', 'width' => 50],
    ['type' => 'top_users', 'width' => 50],
    ['type' => 'recent_activity', 'width' => 100],
    ['type' => 'popular_entries', 'width' => 100],
],
```

## Available Widgets

### Overview Widget

Shows total statistics and breakdowns.

```php
['type' => 'overview', 'width' => 50]
```

**Displays:**
- Total likes count
- Boost vs Real breakdown
- Member vs Anonymous breakdown
- Today's likes
- This week's likes
- This month's likes


### Top Users Widget

Shows users who have liked the most.

```php
['type' => 'top_users', 'width' => 50]
```

**Displays:**
- User name/email (clickable for members)
- Total likes given
- Member vs Guest indicator

**Configuration:**
```php
// config/simple-likes.php
'widget' => [
    'top_users_limit' => 5,
],
```

### Recent Activity Widget

Shows the latest like activity.

```php
['type' => 'recent_activity', 'width' => 50]
```

**Displays:**
- Last 24 hours of likes
- Entry title (clickable)
- Time ago
- User type (member/anonymous)

**Configuration:**
```php
// config/simple-likes.php
'widget' => [
    'recent_activity_limit' => 5, // Number of items to show
],
```

### Popular Entries Widget

Shows most liked entries.

```php
['type' => 'popular_entries', 'width' => 50]
```

**Displays:**
- Entry title (clickable)
- Total like count
- Boost vs Real breakdown

**Configuration:**
```php
// config/simple-likes.php
'widget' => [
    'popular_entries_limit' => 5,
    'popular_entries_sort_by' => 'total', // 'total' or 'interactions'
],
```

**Sorting Options:**
- `'total'`: Sort by total likes (boost + real)
- `'interactions'` or `'real'`: Sort by real interactions only


## Widget Sizes

Widgets support standard Statamic sizes:

| Width | Description |
|-------|-------------|
| `25` | Quarter width |
| `33` | Third width |
| `50` | Half width (recommended) |
| `66` | Two-thirds width |
| `75` | Three-quarters width |
| `100` | Full width |

## Example Configurations

### Minimal Setup

```php
'widgets' => [
    ['type' => 'overview', 'width' => 100],
],
```

### Full Dashboard

```php
'widgets' => [
    ['type' => 'overview', 'width' => 50],
    ['type' => 'top_users', 'width' => 50],
    ['type' => 'recent_activity', 'width' => 100],
    ['type' => 'popular_entries', 'width' => 100],
],
```

### With Other Widgets

```php
'widgets' => [
    // Statamic default widgets
    ['type' => 'getting_started'],
    ['type' => 'collection', 'collection' => 'articles', 'width' => 50],

    // Simple Likes widgets
    ['type' => 'overview', 'width' => 50],
    ['type' => 'popular', 'width' => 50],
],
```

## Widget Caching

Widgets cache their data for performance:

| Widget | Cache Duration |
|--------|----------------|
| Overview | 5 minutes |
| Recent Activity | 2 minutes |
| Popular Entries | 5 minutes |
| Top Users | 5 minutes |

Cache is automatically invalidated when likes are added or removed.

## Terminology

The widgets use consistent terminology:

| Term | Description |
|------|-------------|
| **Total Likes** | Combined count: Boost + Real Interactions |
| **Boost Count** | Base number manually set in the field (seed/fake likes) |
| **Real Interactions** | Actual clicks from real users |
| **Member Likes** | Likes from logged-in/authenticated users |
| **Anonymous Likes** | Likes from guest visitors |
