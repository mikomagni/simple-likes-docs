---
title: Blueprint Configuration
description: How to add Simple Likes to your Statamic blueprints.
---

Configure the Simple Likes fieldtype in your blueprints.

## Basic Setup

Add the fieldtype to any blueprint:

```yaml
fields:
  -
    handle: simple_likes
    field:
      type: simple_likes
      display: Likes
      allow_guest_likes: false  # Set to true to allow anonymous likes
```

## Fieldtype Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `display` | string | "Likes" | Label shown in Control Panel |
| `allow_guest_likes` | boolean | false | Whether anonymous visitors can like |

## Control Panel Display

The fieldtype displays two values in the Control Panel:

- **Boost** (♡ orange outline): Editable "seed" likes count
- **Real** (❤️ red filled): Read-only count of actual user interactions
- **Total**: Combined count shown at bottom

Admins can edit the Boost value to seed entries with a starting like count. The Real count is read-only and reflects actual user interactions stored in the database.

## Per-Entry Permission Overrides

Add these optional toggle fields to allow per-entry control:

```yaml
fields:
  -
    handle: simple_likes
    field:
      type: simple_likes
      display: Likes
      allow_guest_likes: false
  -
    handle: simple_likes_guest_allowed
    field:
      type: toggle
      display: Allow Guest Likes
      instructions: Override the default guest likes setting for this entry
  -
    handle: simple_likes_locked
    field:
      type: toggle
      display: Lock Likes
      instructions: Prevent new likes (display-only mode)
```

## Permission Priority

When determining if a user can like:

1. **Entry-level** (`simple_likes_guest_allowed` field) - Highest priority
2. **Fieldtype config** (`allow_guest_likes` in blueprint) - Default fallback
3. **System default** - `false` (require authentication)

## Example: Articles Blueprint

```yaml
# resources/blueprints/collections/articles/article.yaml
title: Article
sections:
  main:
    display: Main
    fields:
      -
        handle: title
        field:
          type: text
          required: true
      -
        handle: content
        field:
          type: markdown
  sidebar:
    display: Sidebar
    fields:
      -
        handle: simple_likes
        field:
          type: simple_likes
          display: Likes
          allow_guest_likes: true
      -
        handle: simple_likes_locked
        field:
          type: toggle
          display: Lock Likes
          instructions: Disable liking for this article
```

## Example: Products Blueprint (Members Only)

```yaml
# resources/blueprints/collections/products/product.yaml
title: Product
sections:
  main:
    display: Main
    fields:
      -
        handle: title
        field:
          type: text
          required: true
      -
        handle: price
        field:
          type: integer
  engagement:
    display: Engagement
    fields:
      -
        handle: simple_likes
        field:
          type: simple_likes
          display: Favorites
          allow_guest_likes: false  # Members only
```
