# content.json Structure

`content.json` has four top-level keys. None are required to exist, but a real app usually uses all four.

```json
{
  "system": { ... },
  "pages": [ ... ],
  "contents": [ ... ],
  "components": [ ... ]
}
```

## `system`

Engine-level configuration. All fields are optional.

| Field | Type | Description |
|---|---|---|
| `version` | string | Free-text version label, useful for your own tracking. |
| `debug` | boolean | `true` = re-sync on window focus (fast local iteration). `false`/omitted = poll on an interval (production mode). |
| `versionCheckInterval` | number (ms) | How often LuciaCore re-fetches `content.json` when `debug` is off. Default `5000`. |
| `sw` | object | Service Worker settings, see below. |

```json
"system": {
  "version": "2.2.1",
  "debug": true,
  "versionCheckInterval": 2000,
  "sw": {
    "enabled": true,
    "path": "sw",
    "cacheExtensions": [".html", ".js", ".css", ".json", ".svg", ".png", ".jpg", ".jpeg"]
  }
}
```

- `sw.enabled` — registers a Service Worker for offline support.
- `sw.path` — path segments joined with `::`, converted to a real path. `"path": "sw"` registers `/sw.js`; `"path": "workers::sw"` would register `/workers/sw.js`.
- `sw.cacheExtensions` — file extensions the Service Worker is told to cache.

If the network is unreachable, LuciaCore automatically falls back to a cached copy of `content.json` (from the Service Worker, then from the browser Cache Storage) and routes users to a page named `"offline"` if one exists.

## `pages`

An array of routes. Each page is:

```json
{
  "name": "home",
  "loading": "loading",
  "layout": { "type": "...", "...": "..." }
}
```

| Field | Description |
|---|---|
| `name` | Route identifier. Navigate to it with `go::page::home`. |
| `loading` | (optional) The `type` of a node to show while this page compiles. Defaults to the built-in `loading` spinner. |
| `toast` | (optional) The `type` of a component to use for `sys::toast::` notifications triggered while this page is active. Defaults to the built-in `toast` primitive. Point it at your own component in `components` to fully re-skin toasts per page. |
| `layout` | The root node of the page — see [syntax-reference.md](syntax-reference.md) for everything a node can contain. |

The first page in the array is used as the fallback home route. A page named `"offline"` (if present) is shown automatically when the app cannot reach the server.

## `contents`

Reusable **prop presets** — named bundles of data you can attach to any node instead of repeating the same `props` object everywhere.

```json
"contents": [
  {
    "name": "template_header",
    "props": {
      "src": "https://picsum.photos/id/1005/100/100",
      "action": "go::page::home",
      "list": [ { "label": "[icon:Bell]", "action": "go::page::inbox" } ]
    }
  }
]
```

Attach it to a node with `"content": "template_header"`:

```json
{ "type": "custom_header", "content": "template_header" }
```

The content's `props` are merged in as **defaults** — any `props` you also set directly on the node override the matching keys from `content`. This is the recommended way to keep pages short: put the real data in `contents`, and reference it by name from `pages` or `components`.

`content` also accepts an inline object instead of a string name, if you'd rather define the data on the spot.

## `components`

Reusable **UI templates** — the closest thing LuciaCore has to a component in a JS framework.

```json
"components": [
  {
    "type": "custom_button_icon",
    "layout": {
      "type": "button",
      "label": "props:label",
      "action": "props:action",
      "style": "background:#f3f4f6; border-radius:32px; props:style;"
    }
  }
]
```

Once declared, use `custom_button_icon` anywhere as if it were a built-in type:

```json
{
  "type": "custom_button_icon",
  "props": { "label": "[icon:Bell]", "action": "go::page::inbox", "style": "" }
}
```

Rules:

- `layout` can be a single node **or** an array of nodes (a component can render as a sibling group with no wrapper).
- Components can be nested and can wrap other components — `component -> component -> primitive` chains work.
- The `props` you pass in are only visible inside the component through `props:xxx` tokens (see [syntax-reference.md](syntax-reference.md)); a component never automatically inherits its parent page's props.
- Components are matched by exact `type` string, so pick clear, collision-free names (a common convention is prefixing with `custom_`).

Continue to [syntax-reference.md](syntax-reference.md) for the full node vocabulary, or [actions.md](actions.md) for the click-action language.