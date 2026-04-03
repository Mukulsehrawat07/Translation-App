# Translation App (PollyGlot)

Simple client-side translation app with Netlify Functions for translation API calls.

**Live demo:** https://translation-app-m.netlify.app

**Features**
- Translate text to French, Spanish, or Japanese
- Chat-style interface and form interface
- Static site built with Vite
- Serverless translation backend in `netlify/functions`

**Tech**
- Vite
- Netlify (hosting + Functions)
- Plain HTML / CSS / JavaScript

**Prerequisites**
- Node.js (16+ recommended)
- Git

**Getting started (local)**

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
# or
npm start
```

Open http://localhost:5173 (Vite will show the exact URL).

**Build for production**

```bash
npm run build
```

A `dist` folder will be generated. Vite processes and copies assets into `dist/assets` and rewrites paths.

**Deploy to Netlify**

1. Ensure `netlify.toml` has the correct build settings:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[functions]
  directory = "netlify/functions"
```

2. Commit and push your repo to GitHub (or connect the repo in Netlify).
3. Netlify will run the build and publish the `dist` folder. If you change assets, make sure to run the build and push to trigger a new deploy.

**Netlify Functions**
- Serverless functions live in the `netlify/functions` folder. These are deployed as Netlify Functions and used by the client via `/api/*` endpoints.

**Assets and images**
- Images in `assets/` are imported in `index.js` so Vite includes them in the build. If you see 404s on deployed assets, confirm Netlify published the `dist` folder and that a fresh build ran after your changes.

**Project structure**
```
index.html
index.css
index.js
package.json
vite.config.js
netlify.toml
assets/
netlify/functions/
  api.js
```

**Contributing**
- Create an issue or PR. Keep changes small and focused.

**License**
- MIT (or add your preferred license)

**Notes**
- If you want me to commit and push the `README.md` for you, say so and I can run the git commands.
