Print_JB_Ver_19Jan2026 - Standalone build

Steps to build local assets (run in this folder):

1. Install dev dependencies

```bash
npm install
```

2. Build Tailwind CSS and bundle JS

```bash
npm run build
```

3. Open `index.html` in a static server or directly in browser.

Notes:
- `dist/css/tailwind.css` will be produced by Tailwind CLI.
- `dist/js/app.js` will be produced by esbuild bundling `js/main.js`.
- This repository copy omits binary images; copy `images/` from the reference folder if needed.