# Simple Likes Documentation

Documentation site for [Simple Likes](https://github.com/mikomagni/simple-likes), a lightweight likes system addon for Statamic CMS.

Built with [Starlight](https://starlight.astro.build/) and [Astro](https://astro.build/).

## Development

```bash
# Install dependencies
npm install

# Start dev server at localhost:4321
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Live site:** https://simplelikes.com

## Structure

```
src/content/docs/
├── index.mdx                    # Home page
├── getting-started/
│   ├── introduction.md
│   ├── installation.md
│   └── quick-start.md
├── javascript/
│   ├── alpine.md
│   └── vanilla.md
├── templates/
│   ├── default.md
│   └── custom.md
├── reference/
│   ├── tags.md
│   ├── blueprint.md
│   ├── configuration.md
│   ├── database.md
│   └── api.md
└── advanced/
    ├── architecture.md
    ├── widgets.md
    └── troubleshooting.md
```

## Contributing

1. Fork this repository
2. Create a branch for your changes
3. Make your edits in `src/content/docs/`
4. Submit a pull request

## License

MIT
