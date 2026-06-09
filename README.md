# data-app-template

Starter template for building Metabase **data-apps** — single-bundle
React apps that admins upload and embed inside Metabase via an isolated
iframe. Designed to be cloned by a coding agent (the `create-data-app`
skill in the [Metabase repo](https://github.com/metabase/metabase))
instead of generated file-by-file; humans can also clone it directly via
"Use this template".

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

### Two modes, same source

| | Source loaded | Output | Used for |
|---|---|---|---|
| `npm run dev` | `src/dev.tsx` (wraps `<App/>` in the SDK's `<MetabaseProvider authConfig={…}>` and mounts it) | http://localhost:5174 with HMR | Iterating visually against a real Metabase |
| `npm run build` | `src/index.tsx` (factory returns `{ component, theme }`; host wraps with `DataAppProvider`) | `dist/index.js` (single IIFE) | Uploading to Metabase |

### `index.html` is part of the contract

The dev shell mirrors the production iframe's hard-coded document. Do
**not** change `lang`, `<meta charset>`, `<meta name=viewport>`, the
`html, body, #root { height: 100%; margin: 0 }` reset, or the body
font-family — diverging means the bundle looks one way in dev and a
different way in production. Bundle-specific styling belongs in
components (CSS modules / `<style>` / `<link>`), not here.

### SDK version

`package.json` requests `@metabase/embedding-sdk-react: *`. Pin to the
exact version of the Metabase you're targeting (e.g.
`"^63.0.0"`) before you commit — v63 is the floor (earlier versions
don't ship the data-app contract surface).

## Author's checklist

After cloning:

1. Edit `package.json` `name` (used as the npm-package name; cosmetic).
2. Pin `@metabase/embedding-sdk-react` to the target Metabase version.
3. Replace `src/App.tsx` with your screens.
4. Customize `src/theme.ts` to your brand.
5. `npm run build` and upload `dist/index.js`.

## What `App.tsx` may import

Only `@metabase/embedding-sdk-react` (components + hooks),
`@metabase/embedding-sdk-react/data-app` (routing primitives), and
`react`. All three are externalized in `vite.config.ts` — production
resolves to host-realm globals; dev resolves to the real npm package.

The bundle runs inside a Near Membrane sandbox in production. Raw
network (`fetch`, `XMLHttpRequest`, `WebSocket`), storage
(`localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`), UI
dialogs (`alert`, `confirm`, `prompt`), `window.open` / `history.*`, and
most `navigator.*` device APIs throw at runtime — use the SDK's data
hooks / `useAction` / routing primitives instead.

## License

MIT (see `LICENSE`).
