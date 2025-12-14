---
title: Default Templates
description: Understanding the built-in like button templates.
---

Simple Likes includes four default templates to cover different setups:

| Template | JS Version | Use Case |
|----------|------------|----------|
| `like-button` | Alpine (cached) | Sites with static caching |
| `like-button-static` | Alpine (static) | Sites without caching |
| `like-button-vanilla` | Vanilla (cached) | No Alpine, with caching |
| `like-button-vanilla-static` | Vanilla (static) | No Alpine, no caching |

## Quick Reference

```html
{{# Alpine + Static Caching (default) #}}
{{ simple_like }}

{{# Alpine + No Caching #}}
{{ simple_like template_from="simple-likes::like-button-static" }}

{{# Vanilla JS + Static Caching #}}
{{ simple_like template_from="simple-likes::like-button-vanilla" }}

{{# Vanilla JS + No Caching #}}
{{ simple_like template_from="simple-likes::like-button-vanilla-static" }}
```

---

## Cached vs Static Templates

### Cached Templates (`like-button`, `like-button-vanilla`)

Best for sites using Statamic's static caching or a CDN.

**How they work:**
1. Page loads with a loading state (grey heart at 50% opacity)
2. JavaScript fetches the real liked state from `/!/simple-likes/status`
3. Button hydrates with the correct state

**Why?** Cached pages serve the same HTML to all users. The `{{ user_has_liked }}` value would be wrong for subsequent visitors.

### Static Templates (`like-button-static`, `like-button-vanilla-static`)

Best for sites WITHOUT static caching where pages render fresh for each user.

**How they work:**
1. Page loads with the correct liked state already rendered via `{{ user_has_liked }}`
2. No additional API call needed
3. Simpler and slightly faster

---

## Alpine Templates

### Default Template (like-button)

For sites with static caching. Uses API hydration.

```html
{{ simple_like }}
```

**Required JS:** `simple-likes.js`

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes.js';
```

### Static Template (like-button-static)

For sites without caching. Uses server-rendered state.

```html
{{ simple_like template_from="simple-likes::like-button-static" }}
```

**Required JS:** `simple-likes-alpine-static.js`

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes-alpine-static.js';
```

---

## Vanilla Templates

### Cached Template (like-button-vanilla)

For sites without Alpine.js but with static caching.

```html
{{ simple_like template_from="simple-likes::like-button-vanilla" }}
```

**Required JS:** `simple-likes-vanilla.js`

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes-vanilla.js';
```

### Static Template (like-button-vanilla-static)

For sites without Alpine.js and without caching.

```html
{{ simple_like template_from="simple-likes::like-button-vanilla-static" }}
```

**Required JS:** `simple-likes-vanilla-static.js`

```javascript
import '../../vendor/mikomagni/simple-likes/resources/js/simple-likes-vanilla-static.js';
```

---

## Key Differences

| Aspect | Alpine | Vanilla |
|--------|--------|---------|
| State initialisation | `x-data` directive | `data-*` attributes |
| Conditional rendering | `<template x-if>` | `{{ if }}` Antlers tags |
| Click handling | `@click` | JS finds `.simple-likes-btn` |
| Dynamic updates | Alpine reactivity | JS manipulates DOM directly |
| Required classes | None specific | `.simple-likes-btn`, `.simple-likes-count`, `.simple-likes-heart`, `.simple-likes-error` |

| Aspect | Cached | Static |
|--------|--------|--------|
| Initial render | Loading state | Correct state |
| API call on load | Yes (hydration) | No |
| Works with caching | Yes | No (stale state) |
| Complexity | Slightly more | Simpler |

## Which Should I Use?

```
Do you use static caching?
├─ Yes → Do you use Alpine.js?
│        ├─ Yes → like-button (default)
│        └─ No  → like-button-vanilla
└─ No  → Do you use Alpine.js?
         ├─ Yes → like-button-static
         └─ No  → like-button-vanilla-static
```
