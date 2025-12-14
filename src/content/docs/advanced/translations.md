---
title: Translations
description: Translating Simple Likes into other languages.
---

Simple Likes is developed in English. However, we are working on creating language files to support multiple languages.

## Current Status

:::note
Translation support is in progress and unreleased.
:::

## Contributing Translations

If you speak another language, you're more than welcome to contribute translations back to Simple Likes.

### How to Contribute

1. Fork the [Simple Likes repository](https://github.com/mikomagni/simple-likes)
2. Create a new language file in `resources/lang/{locale}/`
3. Translate the strings from the English file
4. Submit a pull request

### Language File Structure

```
resources/lang/
├── en/
│   └── messages.php
├── es/
│   └── messages.php
└── de/
    └── messages.php
```

## Publishing Language Files

To customise the translations for your site, publish the language files:

```bash
php artisan vendor:publish --tag=simple-likes-lang
```

This will copy the language files to `resources/lang/vendor/simple-likes/` where you can modify them.

## Requesting a Language

If you'd like to request support for a specific language, please open a [GitHub Discussion](https://github.com/mikomagni/simple-likes/discussions) and let us know.
