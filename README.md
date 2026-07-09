# LuciaCore

**LuciaCore** is a lightweight, JSON-driven UI engine for the web. You write one file — `content.json` — and LuciaCore turns it into a fully working, multi-page app: routing, layout, styling, data binding, API calls, and click actions, all without writing HTML, CSS, or JavaScript by hand.

Think of it as a tiny "server-side rendered React" that runs entirely in the browser, powered by a single CDN script and a config file.

## What LuciaCore does

- **Renders pages from JSON.** Every page is a tree of nodes (`type`, `style`, `props`, `children`...). LuciaCore compiles that tree into HTML + scoped CSS.
- **Routes between pages.** `navigate::to::pageName` switches pages instantly, with loading states, caching, and offline fallback built in.
- **Binds live data.** Add `"api": "/your/endpoint"` to any node and LuciaCore fetches it, binds the result into `props`, and loops your `children` template over the results automatically.
- **Handles clicks with a mini action language.** `data-action` strings like `go::mailto::support@example.com`, `storage::set::theme::dark`, or a whole pipeline like `validate |> api::call |> navigate::to::home` are parsed and executed by the engine — no click handlers to write.
- **Lets you build reusable components.** Define a component once in `components`, then reuse it everywhere with different `props`, the same way you'd use a component in a JS framework — but in plain JSON.
- **Works offline.** An optional Service Worker + cache layer keeps your last known `content.json` and assets available even with no network.

## What you need to get started

1. An `index.html` with the LuciaCore engine script in the `<head>`.
2. A `content.json` describing your `system` config, `pages`, `contents`, and `components`.

That's it — no build step, no bundler, no framework installation.

## Documentation

| File | What's inside |
|---|---|
| [docs/getting-started.md](docs/getting-started.md) | Folder structure, the two files you need, and your first page in under 5 minutes |
| [docs/content-json.md](docs/content-json.md) | The 4 sections of `content.json`: `system`, `pages`, `contents`, `components` |
| [docs/syntax-reference.md](docs/syntax-reference.md) | Every node field (`type`, `style`, `props`, `item`, `loop`, `api`, `action`, `position`...), all built-in layouts and primitives |
| [docs/actions.md](docs/actions.md) | The full action language: system actions, pipelines (`\|>`), conditions (`?=> :=>`), variables (`${}`), and custom action modules |
| [docs/custom-modules.md](docs/custom-modules.md) | Writing your own `.js` render/action modules: function contracts, file placement rules, real examples |

## Try it now

Grab the example `content.json` from this repository and drop it next to your `index.html` — you'll have a working multi-page demo (login, signup, product grid, offline fallback) with zero code.

## Feedback

LuciaCore is under active development. Bug reports, syntax suggestions, and real-world use cases are very welcome — they directly shape what gets built next. Open an issue or reach out through the contact links in the source files.