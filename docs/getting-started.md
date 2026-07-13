# Getting Started

## 1. Folder structure

A minimal LuciaCore project looks like this:

```
my-app/
├── index.html        ← loads the engine, stays empty otherwise
└── content.json       ← your whole app: pages, components, data
```

That's the minimum. As your app grows you can add:

```
my-app/
├── index.html
├── content.json
├── sw.js              ← optional, only if you enable offline caching
└── assets/
    └── js/
        └── module/     ← optional, only if you write custom action/render modules
```

## 2. Create `index.html`

Create a blank HTML page and load the LuciaCore engine from the CDN inside `<head>`. Leave `<body>` empty — LuciaCore injects its own `<main>` container and `<style>` tag automatically at runtime.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App powered by Lucia</title>
    <script defer src="https://cdn.jsdelivr.net/gh/thuangf45/luciacore.assets@master/luciacore.engine.js"></script>
</head>
<body>
</body>
</html>
```

That's the only HTML you will ever write.

## 3. Create `content.json`

`content.json` must live at the root of your site (LuciaCore fetches it from `/content.json`). It has four top-level sections:

```json
{
  "system": { "version": "1.0.0", "debug": true },
  "pages": [
    {
      "name": "home",
      "layout": {
        "type": "column",
        "style": "padding: 40px; gap: 16px; align-items: center;",
        "children": [
          { "type": "text", "level": "h1", "label": "Hello LuciaCore" },
          { "type": "button", "label": "Click me", "action": "alert::It works!" }
        ]
      }
    }
  ],
  "contents": [],
  "components": []
}
```

Save that, serve the two files with any static file server, and open `index.html` in the browser. You should see a page with a heading and a working button.

> `system`, `pages`, `contents`, and `components` are explained in detail in [content-json.md](content-json.md). Every field you can put on a node (`type`, `style`, `props`, `action`, `loop`, `api`...) is explained in [syntax-reference.md](syntax-reference.md).

## 4. Turn on fast iteration (optional)

Set `"system.debug": true` and LuciaCore will re-fetch and re-render `content.json` automatically every time the browser tab regains focus — so you can edit your JSON, alt-tab back, and see the result immediately, without a manual reload.

```json
"system": {
  "debug": true
}
```

Turn `debug` off (or omit it) for production; LuciaCore will instead poll for changes on a fixed interval (`system.versionCheckInterval`, in ms) so returning users pick up new content in the background.

## 5. Add more pages

Add another object to the `pages` array and navigate to it with the built-in `go::page::` action:

```json
{ "type": "button", "label": "Go to About", "action": "go::page::about" }
```

```json
{ "name": "about", "layout": { "type": "text", "label": "About us" } }
```

## 6. Next steps

- Learn the full node vocabulary (layouts, primitives, tokens, loops, API binding) → [syntax-reference.md](syntax-reference.md)
- Learn every click action available out of the box → [actions.md](actions.md)
- Learn how `pages`, `contents`, and `components` fit together → [content-json.md](content-json.md)
- Download the example `content.json` from this repo to see a full login/signup/product-grid/offline demo in action.