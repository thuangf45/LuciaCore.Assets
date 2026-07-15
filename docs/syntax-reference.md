# Syntax Reference

Everything in a LuciaCore page is a **node**: a plain JSON object with a `type` and a handful of optional fields. This page lists every field a node can have, every built-in `type`, and the token language (`props:`, `item:`) used to bind data.

## Node fields

| Field | Type | Purpose |
|---|---|---|
| `type` | string | Which layout, primitive, custom component, or module to render. Required. |
| `id` | string | DOM id. Also the target for programmatic `appendNode` / `replaceNode` / `removeNode` calls. |
| `class` | string | Extra CSS class appended to the node's default class. |
| `style` | string | Raw CSS declarations, scoped automatically to this node (`#id{ ...your css... }`). Supports nested `&:hover{}` / `&:active{}` and `@media(){}` blocks written inline. |
| `label` | string | Visible text for `text` and `button`. Supports `[icon:Name]` tokens (see Icons below). |
| `action` | string | What to run on click. See [actions.md](actions.md). |
| `params` | object | Extra static data merged alongside the node's `data-*` attributes into the action's `context`. |
| `props` | object or string | Data available to this node and its children via `props:key` tokens. |
| `content` | string or object | Name of a `contents` entry (or an inline object) whose `props` are merged in as defaults. |
| `children` | array or string | Child nodes, or a `item:` / `props:` token that resolves to an array/object of nodes. |
| `loop` | string | A `props:key` token pointing at an array/object; repeats `children` once per element, binding `item:xxx`. |
| `api` | string | A URL (may itself contain `props:` tokens) to fetch and bind into this node's data. |
| `skeleton` | object | `{ width, height, minItems }` — placeholder shown while an `api` node is being statically compiled/hydrated. |
| `position` | string | Spatial shortcut: `relative`, `absolute`, `fixed`, `sticky`, `static`, `center`, `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right`. |

Type-specific fields (`src`, `alt`, `level`, `inputType`, `placeholder`, `value`, `disabled`) are listed under Primitives below.

## Built-in Layouts

Layouts render as a `<div>` and always accept `children`.

| `type` | Behavior |
|---|---|
| `row` | Flexbox row. Children are laid out horizontally, vertically centered by default. |
| `column` | Flexbox column. Grows to fill available horizontal space in a parent `row`. |
| `grid` | CSS grid, auto-fit columns (min 240px), collapses to 1 column under 480px automatically. |
| `card` | Padded, rounded, shadowed box. Direct children stack full-width automatically; a `row` child inside a `card` spreads its own children to opposite edges. |

```json
{
  "type": "row",
  "style": "gap: 16px; padding: 24px;",
  "children": [
    { "type": "text", "label": "Left" },
    { "type": "text", "label": "Right" }
  ]
}
```

## Built-in Primitives

Primitives render a concrete HTML element and never take `children`.

| `type` | Renders | Extra fields |
|---|---|---|
| `text` | `<h1>/<h2>/<h3>/<span>/<p>` | `level` (`h1`, `h2`, `h3`, `span`; anything else falls back to `p`), `label` |
| `button` | `<button>` | `label` |
| `image` | `<img>` | `src`, `alt` (lazy-loaded automatically) |
| `input` | `<input>` | `inputType` (default `text`), `placeholder`, `value`, `disabled` |
| `divider` | `<div>` separator | — |
| `loading` | Built-in animated spinner | — |
| `textarea` | `<textarea>` | `rows` (default `4`), `placeholder`, `value`, `disabled` |
| `select` | `<select>` | `options` — array of `{ value, label }`, rendered as `<option>`s; `disabled` |
| `checkbox` | `<input type="checkbox">` wrapped in a `<label>` | `label`, `checked`, `name` (useful for grouping) |
| `radio` | `<input type="radio">` wrapped in a `<label>` | `label`, `checked`, `name` (required to form a radio group) |
| `switch` | Toggle-styled `<input type="checkbox">` wrapped in a `<label>` | `label` (optional), `checked`, `name` |
| `video` | `<video>` | `src`, `poster`, `autoplay`, `muted`, `loop`, `controls` (default `true`, set `false` to hide) |
| `progress` | `<div>` progress bar | `value` — percentage `0`–`100` |
| `badge` | `<span>` pill/tag | `label` |
| `link` | `<a>` | `label`, `href` (defaults to `javascript:void(0)`), `target` |
| `toast` | Dismissible notification card | `label` (title), `subLabel`, `toastType` (`info`/`success`/`warning`/`error`), `icon` (overrides the default `[icon:...]` per type). Usually you don't declare this node by hand — trigger it with `sys::toast::` (see [actions.md](actions.md)); the `id` it's given is what `sys::toast::close` targets. |

```json
{ "type": "text", "level": "h2", "label": "Welcome back" }
{ "type": "input", "inputType": "email", "placeholder": "you@example.com" }
{ "type": "select", "options": [{ "value": "us", "label": "United States" }, { "value": "vn", "label": "Vietnam" }] }
{ "type": "checkbox", "label": "Remember me", "name": "remember" }
{ "type": "switch", "label": "Dark mode", "checked": true }
{ "type": "video", "src": "/media/intro.mp4", "poster": "/media/intro-poster.jpg", "controls": true }
{ "type": "progress", "value": 65 }
{ "type": "badge", "label": "New" }
{ "type": "link", "label": "Terms of Service", "href": "/terms", "target": "_blank" }
```

## Icons

Any `label` (or generated HTML) can embed an icon token, which LuciaCore replaces with an inline SVG fetched from the icon CDN:

```json
{ "type": "button", "label": "[icon:Bell] Notifications" }
{ "type": "button", "label": "[icon:brand:github] Star us" }
```

`[icon:Name]` pulls from the outline icon set; `[icon:brand:name]` pulls from the brand icon set.

## Custom Components & Modules

- Any `type` matching an entry in `content.json`'s `components` array is expanded using that component's `layout`, with your node's `props` visible inside as `props:xxx`.
- Any `type` containing `::` that is **not** a registered component is treated as an external render module: `"type": "assets::js::module::button::button_2"` loads `/assets/js/module/button/button_2.js` and calls its exported `render(node)` function, which must return `{ html, css }`. Use this for one-off custom widgets you'd rather write in plain JS than JSON.

## Tokens: `props:` and `item:`

Any string field can contain a token that gets replaced with real data at render time:

- `props:key` — reads `key` from the node's resolved `props`.
- `item:key` — reads `key` from the current loop element (only valid inside a node with an active `loop`, or inside a list expanded by `api`).

Tokens work inside `type`, `style`, `label`, `action`, `src`, `children`, and inside nested objects passed as `props`. If the resolved value is an object, it is rendered as a full sub-node and inlined as HTML; if it's a plain string/number, it's inserted as text.

```json
{
  "type": "custom_button_icon",
  "props": { "label": "props:buttonLabel", "action": "props:buttonAction" }
}
```

```json
{
  "type": "text",
  "level": "h3",
  "label": "item:name",
  "style": "color: item:accentColor;"
}
```

A `type` token can also resolve to a whole node object, which is a common pattern for page slots:

```json
{ "type": "props:header" },
{ "type": "props:sidebar" }
```

If a page passes `"header": { "type": "custom_header", "content": "template_header" }` as a prop, `{"type": "props:header"}` renders that entire header component in place.

## `props` object vs `props` string

`props` can be written two ways on the **parent** that's about to render a child:

```json
{ "type": "custom_card", "props": { "title": "Hello", "price": 10 } }
```

or, if you already have the whole object under a token:

```json
{ "type": "custom_card", "props": "props:cardData" }
```

Both end up as the same resolved `props` available to `custom_card`'s internal `props:title` / `props:price` tokens.

## `loop`

`loop` repeats a node's `children` template once per element of an array (or once, for a single object), binding each element as `item:xxx`:

```json
{
  "type": "grid",
  "loop": "props:list",
  "children": [
    {
      "type": "card",
      "children": [
        { "type": "text", "level": "h3", "label": "item:name" },
        { "type": "text", "label": "item:price" }
      ]
    }
  ]
}
```

If `props.list` is `[{ "name": "Chair", "price": "$40" }, { "name": "Lamp", "price": "$20" }]`, this renders two cards.

## `api`

`api` fetches JSON from a URL and binds it automatically — no manual `loop` needed for the common case:

```json
{
  "type": "custom_product_grid",
  "api": "props:api",
  "props": { "list": "props:list", "action": "props:action" }
}
```

Behavior:

- If the response is an **array**, it's bound as the loop source for this node's `children` (same mechanics as `loop`, using `item:xxx`), and the first element's fields are also merged into `props` for convenience.
- If the response is an **object**, its fields are merged directly into `props`.
- If the URL contains `?page=N&size=M` query parameters, the array is sliced client-side to that page automatically (hybrid pagination).
- During static compilation, an `api` node is rendered as a placeholder "island" with a shimmering `skeleton`, then hydrated with real data in the background once the page paints — so first paint is never blocked on the network.

```json
{
  "type": "custom_product_detail_section",
  "api": "/v1/api/product",
  "content": "product_detail_content"
}
```

```json
"skeleton": { "width": "100%", "height": 120, "minItems": 3 }
```

## `position`

Shortcut for common positioning without writing raw CSS:

```json
{ "type": "row", "position": "sticky", "style": "top: 0;" }
{ "type": "button", "position": "bottom-right" }
```

`center` absolutely centers the node in its nearest positioned ancestor; the corner/edge keywords (`top-left`, `bottom-right`, etc.) pin it to that edge.

## Reusable layout components (`row3` / `column3` / `row_center` / `column_center`)

The example `content.json` ships a small set of layout helper components built from the primitives above — handy patterns worth copying into your own project:

- `row3` / `column3` — three-slot layout (`left`/`center`/`right` or `top`/`center`/`bottom`) for headers, toolbars, and forms.
- `row_center` / `column_center` — single-slot shortcut that centers one child.
- `form` — a `card` wrapping a `column3` of `topChildren` / `centerChildren` / `bottomChildren`, used for every login/signup/forgot-password screen in the demo.

Copy these into your own `components` array as a starting point, then adapt the `style` to match your design.

Next: [actions.md](actions.md) for everything a click can do.