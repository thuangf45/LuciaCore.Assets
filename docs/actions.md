# Actions

Any node with an `action` field becomes clickable. LuciaCore attaches one global click listener and parses the `action` string to decide what to do — you never write `addEventListener` yourself.

```json
{ "type": "button", "label": "Save", "action": "alert::Saved!" }
```

Every action receives, internally, the click `event` and a single unified **`context`** object: the node's `dataset` (its `data-*` attributes) merged together with anything you put in `params`. There's no separate `dataset`/`params` split at runtime — everything lands in one flat `context` object, and `context.prev` holds the previous step's result inside a pipeline. You won't need to touch this directly for built-in actions — it matters mainly for custom modules, `compute::`, and `${...}`.

## System actions

These prefixes are recognized out of the box. Everything after the prefix is the argument.

| Action | Example | Effect |
|---|---|---|
| `go::page::` | `go::page::home` | Switch to another page (replaces the old `navigate::to::`). |
| `go::to::` | `go::to::https://example.com` | Navigate the current tab to a URL. |
| `go::new::` | `go::new::https://example.com` | Open a URL in a new tab. |
| `go::replace::` | `go::replace::/checkout` | Replace the current URL (no back-button entry). |
| `go::mailto::` | `go::mailto::support@example.com` | Open the user's mail client. |
| `go::tel::` | `go::tel::+1234567890` | Open the user's phone dialer. |
| `alert::` | `alert::Please fill the form` | Browser `alert()`. |
| `console::` | `console::warn::Low stock` | Logs to console (`log`, `warn`, `error`...). Defaults to `log` if no type given. |
| `scroll::to::` | `scroll::to::#pricing` | Smooth-scroll to a CSS selector. |
| `download::url::` | `download::url::/files/invoice.pdf` | Trigger a file download. |
| `dom::` | see below | Generic DOM read/write, plus two helper sub-actions (`gather`, `el`). |
| `get::` | see below | Read from `context`, `localStorage`, `sessionStorage`, or the clipboard. |
| `set::` | see below | Write to (or clear) `context`, `localStorage`, `sessionStorage`, or the clipboard. |
| `wait::` | `wait::500` or `wait::500::alert::Done` | Pause, optionally then run another action. |
| `compute::` | `compute::price * qty` | Evaluate a JS expression against `context`, returns the result. |
| `api::call` | `"action": "api::call", "params": { "url": "...", "method": "POST", "body": {...} }` | Fire an HTTP request. See below. |

> **Migration note:** `navigate::to::`, `storage::set::`/`storage::get::`/`storage::remove::`, and `copy::text::` no longer exist as their own prefixes. Use `go::page::`, `set::storage::`/`get::storage::`, and `set::clipboard::` instead (all covered below).

### `go::page::` (page navigation)

```json
{ "type": "button", "label": "Go home", "action": "go::page::home" }
```

Same behavior as the old `navigate::to::`: switches the active page and carries the current `context` along as the target page's props.

### `dom::` (generic DOM actions)

`dom::` no longer has a fixed list of sub-actions (`click`, `toggle`, `add`, `remove`, `attr::set`, `attr::get`). Instead it maps directly onto real DOM methods/properties:

```
dom::[method_or_property]::[selector]::[arg1]::[arg2]...
```

- If the resolved member is a **function**, it's called with the remaining args: `dom::classList.toggle::#menu::open` calls `menuEl.classList.toggle("open")`.
- If it's a **property** and you pass an arg, it's a **set**: `dom::value::#email::` sets `.value`; `dom::style.color::#title::red` sets `.style.color = "red"`.
- If it's a property and you pass **no** arg, it's a **get**: `dom::value::#email` returns the current value (useful in `compute::` or as a pipeline step).
- Nested paths work via dots: `dom::classList.add::#menu::open`, `dom::setAttribute::#img::src::/a.png`, `dom::getAttribute::#img::src`.

Common equivalents of the old shorthand:

| Old (removed) | New |
|---|---|
| `dom::click::#btn` | `dom::click::#btn` (still works — `click` is a real DOM method) |
| `dom::toggle::#menu::open` | `dom::classList.toggle::#menu::open` |
| `dom::add::#menu::open` | `dom::classList.add::#menu::open` |
| `dom::remove::#menu::open` | `dom::classList.remove::#menu::open` |
| `dom::attr::set::#img::src::/a.png` | `dom::setAttribute::#img::src::/a.png` |
| `dom::attr::get::#img::src` | `dom::getAttribute::#img::src` |

Two extra `dom::` helpers exist:

- `dom::gather::selector` — scans every `[name]`, `[data-id]`, or `[id]` element inside `selector`, reads its value (checkbox/radio → boolean, inputs → `.value`, everything else → trimmed `textContent`), and merges all of it into `context`. Handy as the first step of a pipeline before `api::call`.
- `dom::el::selector` — returns the raw `Element` for `selector` (or `null`), for cases where you need the element itself rather than a value.

### `get::` and `set::` (context, storage, session, clipboard)

```
get::target::key
set::target::key::value      (context / storage / session)
set::clipboard::text          (clipboard has no key — everything after "clipboard::" is the text)
```

`target` is one of `context`, `storage` (localStorage), `session` (sessionStorage), or `clipboard`.

| Example | Effect |
|---|---|
| `get::storage::theme` | Read `theme` from `localStorage`. |
| `set::storage::theme::dark` | Write `theme = "dark"` to `localStorage`. |
| `set::storage::theme` | **No value → deletes** the `theme` key from `localStorage`. |
| `get::session::draftId` | Read from `sessionStorage`. |
| `set::session::draftId::123` | Write to `sessionStorage`; omit the value to remove the key. |
| `get::context::userId` | Read `userId` straight from the current `context` (useful mid-pipeline instead of always relying on `prev`). |
| `set::context::userId::42` | Write `userId = 42` into the current `context`; omit the value to delete the key. |
| `get::clipboard` | Read text from the clipboard. |
| `set::clipboard::Hello` | Copy `"Hello"` to the clipboard. |
| `set::clipboard` | **No text → clears** the clipboard. |

> Note: for `context`/`storage`/`session`, the shape is `key::value` (a key, then a value) — omitting the value deletes/removes that key. For `clipboard` there's no key concept: everything after `clipboard::` is joined back together and copied as-is, e.g. `set::clipboard::https://example.com/a::b` copies `https://example.com/a::b`.

### `api::call`

Unlike node-level `api` (which binds display data on render), `api::call` is an **action** — it fires when the user clicks. Configure it through `params`:

```json
{
  "type": "button",
  "label": "Submit",
  "action": "api::call",
  "params": {
    "url": "/v1/api/login",
    "method": "POST",
    "body": { "email": "#login-email", "password": "#login-password" },
    "headers": { "Authorization": "Bearer ${token}" }
  }
}
```

- `body` as an object maps `field name -> CSS selector`; LuciaCore reads `.value` from each matching input and sends it as JSON automatically.
- `body` as a `FormData` or plain string is sent as-is.
- `headers`, `url`, and string values inside `body` all support `${...}` variable interpolation (see below).
- `method`, `mode`, `credentials`, `cache`, `redirect`, `referrerPolicy` all map directly to `fetch()` options, with sane defaults if omitted.

## Pipelines: `|>`

Chain multiple actions in sequence with `|>`. Each step's return value becomes available as `context.prev` to the next step:

```json
"action": "dom::value::#email |> set::context::lastEmail::${prev} |> go::page::home"
```

Steps run one after another and wait for each to finish (`wait::` and `api::call` included), so a pipeline is a simple way to sequence validation → request → navigation without writing a script.

## Conditions: `?=> :=>`

`condition?=>actionIfTrue:=>actionIfFalse` runs one of two actions based on a condition:

```json
"action": "compute::password.length >= 8 ?=> go::page::home:=>alert::Password too short"
```

The condition itself can use a comparison operator directly, comparing the result of an action on the left against a literal on the right:

```json
"action": "get::storage::theme==\"dark\" ?=> dom::classList.add::body::dark-mode:=>dom::classList.remove::body::dark-mode"
```

Supported operators: `===`, `!==`, `==`, `!=`, `>=`, `<=`, `>`, `<`. If no operator is present, the left side's result is coerced to a boolean.

## Variables: `${...}`

Anywhere in an action string, `${expression}` is evaluated against the current `context` (which includes `prev` from a pipeline, and any `params`/`data-*` you set):

```json
"action": "console::log::Total is ${price * qty}"
```

## Custom action modules

Any action string containing `::` that doesn't match a system prefix or a name in the internal `ActionRegistry` is treated as an external module path:

```json
"action": "checkout::validate::form"
```

This loads `/checkout/validate/form.js` and calls its exported `async function execute(event, context)`. Return a value from `execute` to make it available as `prev` in a pipeline. Use this for logic too complex for the built-in action language — form validation, cart math, anything you'd rather write as real JavaScript.

## Choosing an approach

- Simple, one-off interactions (navigate, alert, toggle a class) → a single system action.
- Multi-step flows (validate then submit then redirect) → a pipeline (`|>`).
- Branching behavior (different action depending on state) → a condition (`?=> :=>`).
- Non-trivial logic (loops, complex validation, third-party SDK calls) → a custom module.

Back to [content-json.md](content-json.md) or [syntax-reference.md](syntax-reference.md).