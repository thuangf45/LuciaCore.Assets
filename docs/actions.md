# Actions

Any node with an `action` field becomes clickable. LuciaCore attaches one global click listener and parses the `action` string to decide what to do — you never write `addEventListener` yourself.

```json
{ "type": "button", "label": "Save", "action": "alert::Saved!" }
```

Every action receives, internally, the click `event`, the node's `dataset` (its `data-*` attributes, including anything you put in `params`), and `params` itself. You won't need to touch these directly for built-in actions — they matter mainly for custom modules and `compute::`.

## System actions

These prefixes are recognized out of the box. Everything after the prefix is the argument.

| Action | Example | Effect |
|---|---|---|
| `navigate::to::` | `navigate::to::home` | Switch to another page. |
| `alert::` | `alert::Please fill the form` | Browser `alert()`. |
| `console::` | `console::warn::Low stock` | Logs to console (`log`, `warn`, `error`...). Defaults to `log` if no type given. |
| `go::to::` | `go::to::https://example.com` | Navigate the current tab to a URL. |
| `go::new::` | `go::new::https://example.com` | Open a URL in a new tab. |
| `go::replace::` | `go::replace::/checkout` | Replace the current URL (no back-button entry). |
| `go::mailto::` | `go::mailto::support@example.com` | Open the user's mail client. |
| `go::tel::` | `go::tel::+1234567890` | Open the user's phone dialer. |
| `copy::text::` | `copy::text::DISCOUNT10` | Copy text to clipboard. |
| `scroll::to::` | `scroll::to::#pricing` | Smooth-scroll to a CSS selector. |
| `download::url::` | `download::url::/files/invoice.pdf` | Trigger a file download. |
| `dom::click::` | `dom::click::#hidden-input` | Programmatically click another element. |
| `dom::toggle::` | `dom::toggle::#menu::open` | Toggle a class on an element. |
| `dom::add::` | `dom::add::#menu::open` | Add a class to an element. |
| `dom::remove::` | `dom::remove::#menu::open` | Remove a class from an element. |
| `dom::attr::set::` | `dom::attr::set::#img::src::/a.png` | Set an attribute on an element. |
| `dom::attr::get::` | `dom::attr::get::#img::src` | Read an attribute (useful inside a pipeline/condition). |
| `wait::` | `wait::500` or `wait::500::alert::Done` | Pause, optionally then run another action. |
| `storage::set::` | `storage::set::theme::dark` | Save to `localStorage`. |
| `storage::get::` | `storage::get::theme` | Read from `localStorage`. |
| `storage::remove::` | `storage::remove::theme` | Delete a `localStorage` key. |
| `compute::` | `compute::price * qty` | Evaluate a JS expression against the node's `dataset`, returns the result. |
| `api::call` | `"action": "api::call", "params": { "url": "...", "method": "POST", "body": {...} }` | Fire an HTTP request. See below. |

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
    "headers": { "Authorization": "Bearer props:token" }
  }
}
```

- `body` as an object maps `field name -> CSS selector`; LuciaCore reads `.value` from each matching input and sends it as JSON automatically.
- `body` as a `FormData` or plain string is sent as-is.
- `headers`, `url`, and string values inside `body` all support `${...}` variable interpolation (see below).
- `method`, `mode`, `credentials`, `cache`, `redirect`, `referrerPolicy` all map directly to `fetch()` options, with sane defaults if omitted.

## Pipelines: `|>`

Chain multiple actions in sequence with `|>`. Each step's return value becomes available as `dataset.prev` to the next step:

```json
"action": "compute::document.querySelector('#email').value |> storage::set::lastEmail::${prev} |> navigate::to::home"
```

Steps run one after another and wait for each to finish (`wait::` and `api::call` included), so a pipeline is a simple way to sequence validation → request → navigation without writing a script.

## Conditions: `?=> :=>`

`condition?=>actionIfTrue:=>actionIfFalse` runs one of two actions based on a condition:

```json
"action": "compute::password.length >= 8 ?=> navigate::to::home:=>alert::Password too short"
```

The condition itself can use a comparison operator directly, comparing the result of an action on the left against a literal on the right:

```json
"action": "storage::get::theme==\"dark\" ?=> dom::add::body::dark-mode:=>dom::remove::body::dark-mode"
```

Supported operators: `===`, `!==`, `==`, `!=`, `>=`, `<=`, `>`, `<`. If no operator is present, the left side's result is coerced to a boolean.

## Variables: `${...}`

Anywhere in an action string, `${expression}` is evaluated against the node's `dataset` (which includes `prev` from a pipeline, and any `params`/`data-*` you set):

```json
"action": "console::log::Total is ${price * qty}"
```

## Custom action modules

Any action string containing `::` that doesn't match a system prefix or a name in the internal `ActionRegistry` is treated as an external module path:

```json
"action": "checkout::validate::form"
```

This loads `/checkout/validate/form.js` and calls its exported `async function execute(event, dataset, params)`. Return a value from `execute` to make it available as `prev` in a pipeline. Use this for logic too complex for the built-in action language — form validation, cart math, anything you'd rather write as real JavaScript.

## Choosing an approach

- Simple, one-off interactions (navigate, alert, toggle a class) → a single system action.
- Multi-step flows (validate then submit then redirect) → a pipeline (`|>`).
- Branching behavior (different action depending on state) → a condition (`?=> :=>`).
- Non-trivial logic (loops, complex validation, third-party SDK calls) → a custom module.

Back to [content-json.md](content-json.md) or [syntax-reference.md](syntax-reference.md).
