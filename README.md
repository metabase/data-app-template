# data-app-template

Starter template for building Metabase **data-apps** — single-bundle
React apps that admins upload and embed inside Metabase via an isolated
iframe.

## Quick start

```bash
gh repo create my-data-app --template metabase/data-app-template --private --clone
cd my-data-app
npm install                           # or yarn / pnpm / bun — no lockfile shipped
cp .env.local.example .env.local      # set VITE_MB_URL + VITE_MB_API_KEY
npm run dev                           # preview at http://localhost:5174
npm run build                         # produces dist/index.js for upload
```

To upload: Metabase → Admin → Data apps → **Add**, pick a short `name`
(it appears in the `/data-app/<name>` URL), upload `dist/index.js`.

If the dev preview hits CORS, add `http://localhost:5174` under
Admin → Embedding → Embedded analytics SDK → CORS.

## What's in the box

```
.
├── package.json            ← @metabase/embedding-sdk-react + react/react-dom
├── vite.config.ts          ← lib mode → IIFE; externalizes SDK + react
├── tsconfig.json
├── index.html              ← dev preview shell (do not edit — see note)
├── src/
│   ├── index.tsx           ← PRODUCTION entry — factory returns { component, theme }
│   ├── dev.tsx             ← DEV entry — wraps App with MetabaseProvider + authConfig
│   ├── theme.ts            ← MetabaseTheme, shared by dev + prod entries
│   ├── App.tsx             ← edit this; pure content, no MetabaseProvider wrap
│   └── vite-env.d.ts       ← Vite env-var types
├── .env.local.example
└── .gitignore
```

`src/App.tsx` and anything you add under `src/` is shared between dev
and prod. The two modes only diverge at the entry layer.
