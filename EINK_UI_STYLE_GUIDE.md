# E-Ink UI Style Guide

A style guide for building web UIs that run on E-Ink e-readers (Onyx Boox, Kindle, Kobo, Tolino). Principles are research-first; a reference implementation exists in this repo but is **not** canonical — its gaps are flagged in §12.

---

## 1. Philosophy

An e-ink screen is reflective paper with slow, visible refreshes — not a dimmed-down phone screen. Design like print:

- **Content is the product; chrome disappears.** (Kindle fades all toolbars on book open.)
- **Every repaint is expensive.** EinkBro's two engineering rules: *fewer repaints, smaller repaint area.*
- **Every interaction must be deliberate and legible.** No hidden tap zones, no "edges to the active areas" (Craig Mod's Kindle critique). Bounded, explicit affordances.
- **The UI must survive without color, motion, hover, or shadows.** If a state only reads through any of those, it doesn't exist.

## 2. Hard constraints (why everything below)

1. **Slow refresh** — full panel ~200–800 ms with a visible flash; partial ~30–80 ms. Motion renders as smearing ghosts.
2. **Ghosting** — incomplete particle movement leaves faint remnants; accumulates over partial refreshes; cleared only by full refresh. Mid-tones dither inconsistently *between* refreshes.
3. **Grayscale** — Boox panels are 16-level grayscale. "High-contrast colors may render as uniform dark grey." Color is unreliable for meaning.
4. **No sub-pixel anti-aliasing, high-DPI grayscale** — 1px hairlines can vanish; thin fonts dither to grey mush; font anti-aliasing itself washes glyphs toward grey.
5. **No hover** — capacitive touch reports contact, not proximity. Many devices use physical page-turn buttons.
6. **User-controlled refresh modes** — users will put your app in Boox A2/Fast mode to scroll; don't rely on subtle tonal differences that vanish there.

## 3. Color

- Core palette: **near-black on near-white** — text `#000`–`#222`, background `#FFF`–`#FAFAFA` (pure `#000`/`#FFF` is fine and safest; slight softening reduces 300ppi bloom).
- **One** secondary grey for meta text (`#555`–`#666` on light; nothing between ~25–75% luminance may carry meaning). Boox's own dev guide: black-and-white main colors, max contrast.
- Accent color allowed (e.g., a single link blue, Kindle's orange) but **never required** — the UI must work in pure grayscale. Never encode state in color alone; pair with shape/label/pattern. Status colors must always co-occur with text.
- Boox users will run "Dark Color Enhancement" filters that push foregrounds toward black — if your text isn't near-black, they'll notice. Keep DOM semantic so contrast filters (Boox App Optimization, EinkBro force-white/bold) can fix your page if you got it wrong.

## 4. Depth = borders, never shadows

- **Zero** `box-shadow`, `text-shadow`, gradients, opacity-for-state, blur, elevation. Shadows render as dirty dithered blobs; gradients band or disappear.
- Hierarchy via border weight: primary `2px solid #000`, secondary `1px solid #555`, subtle `1px solid #ccc`; dividers `border-top: 1px`.
- Separation is **whitespace + 1–2px rules**, not cards floating on shadow (Kindle: "separation is by tone, not depth").
- Avoid overlapping layers, FABs, and sticky/fixed headers (sticky chrome causes checkerboarding artifacts during refresh on Kindle's browser). Chrome should auto-hide and restore on tap.
- Dialogs are distinguished by heavy border, not drop shadow.

## 5. Buttons & states

The signature e-ink pattern (Onyx Boox native UI, controller-era Kindle):

- **Flat outlined buttons**: transparent/white background, **1px black border**, black text, **square corners**, no shadows.
- **No primary/secondary distinction** — one button style; rank actions by layout (position, full-width), not decoration.
- **Pressed (`:active`) = inversion**: background flips to solid black, text to white. This is the "click" feedback — maximal contrast, survives grayscale and fast refresh modes.
- **No `:hover` styles at all.** If you must soften hover on desktop, gate it behind `(hover: hover) and (pointer: fine)` — but even then prefer a light grey fill (`#f5f5f5`), text stays black.
- **Focus (`:focus-visible`)** = 2–3px solid black outline with 2px offset. Apply to *every* interactive element — this is the most commonly missed state.
- **Disabled** = 50% opacity, or better: diagonal hatch fill (`repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 4px)` — two flat colors, not a blended gradient).
- Feedback must survive render delay: the pressed state may render *after* the action completes. Confirm by **outcome** (persistent marks, inline status text, page change), not transient flashes. Inline `aria-live="polite"` status instead of toasts.

## 6. Active / selected states

Kindle's idioms, in order of preference:

1. **Inverted fill** (flat black bg + white text) — for nav items, sort pills, tabs.
2. **Underline / bold underline** — Kindle's TOC "current page" and menu-selection marker.
3. **Icon swap** (filled vs outline glyph, e.g. solid vs outline star) with `aria-pressed`.
4. Border upgrade — editing/selected cards get `border-black` instead of grey.

Grey tinting alone is not a selected state on e-ink.

## 7. Motion

- None. Kill transitions and animations globally: `* { transition: none !important; animation: none !important; }` plus `scroll-behavior: auto`. No spinners — static "Loading…" text or skeleton bars.
- Discrete page swaps, not smooth scrolling. Honor `prefers-reduced-motion`, but don't rely on it for e-ink detection — ship a manual "paper mode" toggle; detection of e-ink browsers is unreliable.
- If you absolutely need one animated element (e.g., a switch knob), keep it under 200ms and expect it to smear on some devices. Prefer instant state flips.

## 8. Typography

- **UI chrome = medium/bold sans.** "Bold is the new regular" — thin/hairline weights dither away. Body text ≥16px (Boox minimum: 14sp); headings ~20px; normal-to-medium weights.
- **Reading surface = serif, distinct from chrome** (Bookerly convention): generous line-height (`1.5–1.7`, fluid `clamp()` is fine), `max-w-prose`, `text-pretty`.
- Prefer **system fonts / self-hosted bundles**. `@font-face`/Google-Fonts imports cause drastic render delay and are banned outright on Kindle's experimental browser (which also caps at ES2019 — no web fonts, no emojis, no modern syntax if Kindle is a target).
- Anti-aliasing washes glyphs grey on grayscale panels; compensate with `#000` text and heavier weights.

## 9. Layout & navigation

- **Paginate over scroll** (Onyx dev guide #3; universal consensus). If you must scroll, offer edge tap zones (~32% width) for discrete page-by-page movement.
- **Tap targets ≥ 44–48px** (Boox: 36dp center / 48dp edges). Universal `min-height: 44px` on all interactive elements.
- Narrow content column (600–1200px max); mobile-first, small screens are the primary target.
- Respect safe-area insets (`env(safe-area-inset-*)`) — e-readers have thick bezels and odd viewports.
- Text labels alongside icons — icon-only affordances are hard to read on e-ink.
- Progress as text ("38% · 14 min left", `tabular-nums`), not bars/badges.
- Confirmation flows: **inline two-step** (danger action → inline Cancel/Confirm), not modals. Native `<details>/<summary>` for disclosures (free keyboard accessibility).

## 10. Dark mode

Hazardous on e-ink: inverted panels ghost and flicker more (Regal mode flickers on dark backgrounds); grey-on-black text becomes illegible; grey layers between 25–75% break. Options, in order:

1. Light-first only.
2. Strict **two-tone inversion** (pure `#000`/`#FFF` swapped) — never "soft" dark greys. Bootstrap the theme pre-paint (inline script, no flash) and update `meta theme-color`.

## 11. Engineering checklist (CSS)

```css
/* core rules */
* { transition: none !important; animation: none !important; }
scroll-behavior: auto;
/* palette */
--ink-fg: #000; --ink-bg: #fff; --ink-meta: #555; --ink-border: #000;
/* state idioms */
button:active   { background: var(--ink-fg); color: var(--ink-bg); }
:focus-visible  { outline: 2px solid #000; outline-offset: 2px; }
/* disabled hatch (flat, not blended) */
background: repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 4px);
```

- Tailwind users: define a `can-hover: (hover: hover) and (pointer: fine)` variant and gate *all* hover styles behind it.
- Minimize repaint count and repaint area; avoid layout thrash between refreshes.
- Images: high-contrast, grayscale-friendly, SVG/line art; dither rasters.
- Semantic DOM + ARIA (`aria-pressed`, `aria-expanded`, `aria-checked`, `aria-live`, `aria-busy`) — it's also what lets Boox/EinkBro accessibility filters operate.

## 12. Reference implementation (this repo) — what to copy, what to fix

**Copy:**
- Outlined square buttons, identical variants, `active:bg-black active:text-white` inversion (§5).
- `can-hover:` gating of all hover fills so touch/stylus never gets ghost hover states.
- 44px (`min-h-11`) universal touch targets + safe-area padding.
- Borders-not-shadows: flat 1px card/panel borders; editing state upgrades border to full black.
- Inline two-step confirmations, `aria-live` status, native `<details>` disclosures, skeleton loaders with `aria-busy`.
- Reading typography as the hero: serif (Literata) + fluid clamp line-height + `max-w-prose`, distinct from sans chrome.
- Pre-paint theme bootstrap + dynamic `meta theme-color`.

**Do not copy (known gaps):**
- `primary`/`secondary` button variants are byte-identical strings — dead abstraction.
- Most inputs, card-option triggers, sort pills, and nav buttons **lack `:focus-visible` outlines**.
- Some "Load more" buttons use ungated `hover:` and ignore the component system.
- Body has a 0.3s background transition; roadmap itself wants it removed (§7).
- Only one element has a border-radius (skeleton) — keep it that way; square corners everywhere.
- Hover styles are duplicated inline across components rather than componentized.

## 13. Sources

- Onyx official: `onyx-intl/OnyxAndroidDemo` → `doc/Eink-Develop-Guide.md` (canonical Boox guidelines); Boox Help Center (Refresh Modes, E Ink Center).
- Kindle: User's Guides (bold-underline/inverted-bar selection, dashed underline = Popular Highlights); Pentagram/Squero case study; Craig Mod, "Reconsidering the Hardware Kindle Interface."
- Practitioner essays: Morbius, "E-Ink Design Principles for Web and Applications"; WithIntent, "How to Design for E-Ink Devices"; VP0 e-ink UI kit.
- Prior art: EinkBro (repaint-count rules), `marcomattes/epaper-components` (state-encoding CSS spec), ReKindleOS COMPATIBILITY.md (Kindle browser limits), ezink-pwa, eink-ui (vuink), KOReader/Readest issues, CrossInk #627/#630 (anti-aliasing grey-wash).
