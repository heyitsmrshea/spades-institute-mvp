# Spades Institute — The Ready Room (MVP)

Hi-fi single-page prototype for Spades Institute, deployed via GitHub Pages.

This is a parallel MVP deployment alongside the existing
[`SpadesInstitute`](https://github.com/heyitsmrshea/SpadesInstitute) site.

## Stack

Static site — no build step:

- `index.html` — entry point
- `app.jsx` / `tweaks-panel.jsx` — React components transpiled in-browser via `@babel/standalone`
- `styles.css` — design tokens and component styles
- `assets/` — logos, headshots, blog imagery

React 18 and Babel Standalone are loaded from `unpkg.com` via `<script>` tags
(see `index.html`). No bundler, no Node runtime required.

## Local preview

Any static server works, e.g.:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment

GitHub Pages serves `main` branch, root directory.
