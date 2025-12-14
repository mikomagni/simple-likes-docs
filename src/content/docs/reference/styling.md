---
title: Styling & CSS
description: CSS classes and styling options for Simple Likes components.
---

Simple Likes includes optional CSS that you can use or customise.

## Including the CSS

Choose one of these methods to include the Simple Likes styles:

**Option 1: Import in your CSS file**

```css
@import '/vendor/simple-likes/css/simple-likes.css';
```

**Option 2: Import in your JS (with Vite/bundler)**

```javascript
import '../../vendor/mikomagni/simple-likes/resources/css/simple-likes.css';
```

**Option 3: Link tag in HTML**

```html
<link rel="stylesheet" href="/vendor/simple-likes/css/simple-likes.css">
```

## Available CSS Classes

The CSS provides styling for all component elements:

### Animation

| Class | Description |
|-------|-------------|
| `.simple-likes-pulse` | Apply pulse animation to element (useful for like feedback) |

### Button

| Class | Description |
|-------|-------------|
| `.simple-likes-btn` | Base button styles (removes default button styling) |

### Heart Icon

| Class | Description |
|-------|-------------|
| `.simple-likes-heart` | Base heart icon styles |
| `.simple-likes-heart--liked` | Filled heart state (red) |
| `.simple-likes-heart--unliked` | Empty heart state (gray) |

### Count Display

| Class | Description |
|-------|-------------|
| `.simple-likes-count` | Base count text styles |
| `.simple-likes-count--liked` | Red text when liked |
| `.simple-likes-count--unliked` | Gray text when not liked |

### Error Messages

| Class | Description |
|-------|-------------|
| `.simple-likes-error` | Base error message styles |
| `.simple-likes-error--error` | Red error message styling |
| `.simple-likes-error--warning` | Orange/yellow warning message styling |

## Custom Styling

You can override any of these classes in your own CSS. For example:

```css
/* Custom heart colors */
.simple-likes-heart--liked {
    color: #ff6b6b;
    fill: currentColor;
}

/* Custom button styling */
.simple-likes-btn {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    transition: transform 0.2s;
}

.simple-likes-btn:hover {
    transform: scale(1.05);
}

/* Custom pulse animation */
.simple-likes-pulse {
    animation: custom-pulse 0.3s ease-out;
}

@keyframes custom-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}
```

## Tailwind CSS Integration

If you're using Tailwind CSS, you can skip the provided CSS entirely and use utility classes directly in your templates:

```html
<button class="flex items-centre gap-2 p-2 hover:scale-105 transition-transform"
        @click="toggleLike()">
    <svg class="w-6 h-6 transition-colors"
         :class="liked ? 'text-red-500 fill-current' : 'text-gray-400'"
         ...>
    </svg>
    <span :class="liked ? 'text-red-500' : 'text-gray-500'"
          x-text="count"></span>
</button>
```

See [Custom Templates](/templates/custom/) for more customisation options.
