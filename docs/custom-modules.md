# Custom Modules

LuciaCore gives you three ways to extend behavior, in increasing order of power:

| Level | Where it lives | Best for |
|---|---|---|
| **Component** | Inside `content.json`, under `components` | Composing existing types/primitives into a reusable JSON template |
| **Render module** | A `.js` file on your own server | A `type` that needs real DOM/JS (charts, editors, canvas, 3rd-party widgets) |
| **Action module** | A `.js` file on your own server | An `action` whose logic is too complex for the built-in action language |

This file covers the last two — the actual function contracts, file placement rules, and end-to-end examples. For the first one, see [content-json.md](content-json.md#components).

## How LuciaCore decides where a `type` or `action` comes from

**For `type`** (in `renderNode`), in order:

1. Does it match a name in `components`? → expand that component's `layout`.
2. Does it match a built-in layout (`row`, `column`, `grid`, `card`)? → built-in renderer.
3. Does it match a built-in primitive (`button`, `text`, `image`, `input`, `divider`, `loading`)? → built-in renderer.
4. Otherwise → **treated as a render module.** LuciaCore turns the type into a file path and dynamically imports it.

**For `action`** (in `dispatchActionAsync`), in order:

1. Contains `|>` → pipeline.
2. Contains `?=> :=>` → condition.
3. Matches a system prefix (`go::page::`, `go::to::`, `set::`, `get::`, `dom::`, ...) → built-in handler.
4. Matches a name in the internal `ActionRegistry` (a small JS object inside the engine, kept for backward compatibility — not something you edit from `content.json`) → that handler.
5. Otherwise, if it contains `::` → **treated as an action module.** LuciaCore turns the string into a file path and dynamically imports it.
6. Otherwise → does nothing.

This means: a render module can have any name, but an **action module's string must contain `::`** to be recognized as one.

## Path resolution rule

Both cases use the same conversion:

```
"foo::bar::baz"  →  "/foo/bar/baz.js"
```

Every `::` becomes a `/`, and `.js` is appended. The resulting path is **absolute, resolved against your own site's origin** — not the CDN that serves the LuciaCore engine itself. That means the file must physically exist in your own project, at that exact path:

```
"assets::js::module::button::button_2"   →   /assets/js/module/button/button_2.js
"checkout::validate::form"                →   /checkout/validate/form.js
```

Project layout example:

```
my-app/
├── index.html
├── content.json
├── assets/
│   └── js/
│       └── module/
│           └── button/
│               └── button_2.js      ← render module
└── checkout/
    └── validate/
        └── form.js                  ← action module
```

Note: each module is imported once and cached in memory for the session. If you edit a `.js` module file, a full page reload is required to see the change — this is different from `content.json`, which hot-reloads on focus when `system.debug` is `true`.

## Render module contract

A render module must export an async (or sync) function named **`render`** that takes the fully-resolved node and returns `{ html, css }`.

```js
// signature
export function render(node) {
  return { html: "<div>...</div>", css: "" };
}
```

By the time `render(node)` runs, LuciaCore has already resolved all `props:` / `item:` tokens on this node's own fields — `node.label`, `node.style`, `node.action`, `node.props`, and any custom fields you declared in `content.json` are plain, real values. You don't need to parse tokens yourself.

Always scope your CSS using `node._runtimeId` (the id LuciaCore assigned this node) so styles don't leak into other components:

```js
// /assets/js/module/button/button_2.js
export function render(node) {
  const id = node._runtimeId;
  const label = node.label || "Buy";
  const price = node.price || "";
  const action = node.action || "";

  const html = `
    <button id="${id}" data-action="${action}" class="lucia-button custom-buy-button">
      ${label}
      ${price ? `<span class="price-tag">${price}</span>` : ""}
    </button>
  `;

  const css = `
    #${id}.custom-buy-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #16a34a;
    }
    #${id} .price-tag {
      font-weight: 700;
      opacity: 0.9;
    }
  `;

  return { html, css };
}
```

This matches the `content.json` entry that calls it:

```json
{
  "type": "assets::js::module::button::button_2",
  "label": "props:buyLabel",
  "price": "props:price",
  "action": "props:buyAction"
}
```

Important: your `<button>`/element must carry `data-action="${action}"` (and `data-params`/`data-id` if you use them) yourself if you want clicks on it to trigger LuciaCore's action dispatcher — a render module gives you the HTML string, LuciaCore doesn't rewrite it for you.

If the import fails (bad path, syntax error, missing `render` export used incorrectly), LuciaCore renders a visible red-dashed error box in place of the node instead of crashing the whole page — useful for spotting typos in `type` strings during development.

## Action module contract

An action module must export an async function named **`execute`**, taking exactly two arguments:

```js
// signature
export async function execute(event, context) {
  // do the work...
  return someValue; // becomes `context.prev` for the next step in a pipeline
}
```

- `event` — the original DOM click event.
- `context` — one flat, merged object: the clicked element's `data-*` attributes plus the parsed `data-params` JSON, plus `prev` if this module is called mid-pipeline. There's no separate `dataset`/`params` split at runtime — everything you need is on `context`.

```js
// /checkout/validate/form.js
export async function execute(event, context) {
  const email = document.querySelector("#login-email")?.value?.trim();
  const password = document.querySelector("#login-password")?.value?.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return false;
  }
  if (!email.includes("@")) {
    alert("Please enter a valid email.");
    return false;
  }
  return true; // pipeline continues only if the next step checks this
}
```

Wire it into a node, optionally as one step of a pipeline:

```json
{
  "type": "button",
  "label": "Log in",
  "action": "checkout::validate::form |> api::call |> go::page::home",
  "params": { "url": "/v1/api/login", "method": "POST" }
}
```

Return values chain: `checkout::validate::form`'s return becomes `context.prev` for the `api::call` step, and so on down the pipeline.

## Choosing between a component and a module

Ask: *"Am I just arranging existing types with different data, or do I need real logic/DOM?"*

- Arranging `row`/`column`/`card`/`button`/`text` with different `props` → **component** in `content.json`. No `.js` file, no deploy step, hot-reloads with `debug: true`.
- Need a canvas, a chart library, a rich text editor, direct `IntersectionObserver` usage, or any imperative DOM work → **render module**.
- Need branching logic, external validation, math beyond `compute::`, or a fetch sequence too complex for `api::call` + pipelines → **action module**.

When in doubt, start with a component — it's the cheapest to write and the easiest to hot-reload. Reach for a module only when JSON genuinely can't express what you need.

Back to [syntax-reference.md](syntax-reference.md) or [actions.md](actions.md).