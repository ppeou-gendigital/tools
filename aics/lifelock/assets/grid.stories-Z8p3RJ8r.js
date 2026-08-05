import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,d as n,i as r,n as i,o as a,r as o,s,u as c}from"./_spec-md-wF1y7HFP.js";import"./_grid-a75DW6jA.js";var l;function u(){return(u=e((()=>{l='---\ntype: token\nname: grid\nfigmaFileKey: Nshd9ukxIzpeUnzOXiWxUP\nfigmaNodeId: 18086:2008\nstatus: published\nlastSyncedAt: ""\nlastSyncedFigmaFingerprint: ""\nlastSyncedSpecFingerprint: ""\nbrand: LifeLock\n---\n\n# Grid tokens\n\n## Summary\n\nThe grid system — container widths, column counts, gutters, outer margins, and derived column widths — encoded as primitive Figma `Number` Variables and CSS custom properties in the `--grid-*` namespace, plus the system-wide `--grid-max-width` semantic alias per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 7.3.\n\nThe four band thresholds (`--breakpoint-*`) and the underlying `@media` queries that select a band live in the sibling [`tokens/breakpoints/spec.md`](../breakpoints/spec.md). This unit owns everything that **happens inside** a band.\n\n## Container model\n\nThe container is **fluid in SM/MD/LG and capped in XL** — content width grows from `--grid-content-<bp>` at the band\'s lower bound up to `viewport − 2 × --grid-margin-<bp>` at the upper bound; XL caps inner content at `--grid-max-width` (= `--grid-content-xl` = 1312px) with auto-margins absorbing any excess viewport. Column count, gutter, and outer margin are sized per band; column tracks within SM/MD/LG resolve fluidly via `grid-template-columns: repeat(N, 1fr)`.\n\n```css\n@media (max-width: 767px) {\n  .container {\n    width: 100%;\n    margin-inline: auto;\n    padding-inline: var(--grid-margin-sm);\n    /* no max-width — container spans the viewport, content area is fluid */\n  }\n}\n@media (min-width: 768px) and (max-width: 1023px) {\n  .container {\n    width: 100%;\n    margin-inline: auto;\n    padding-inline: var(--grid-margin-md);\n    /* no max-width — container spans the viewport, content area is fluid */\n  }\n}\n@media (min-width: 1024px) and (max-width: 1439px) {\n  .container {\n    width: 100%;\n    margin-inline: auto;\n    padding-inline: var(--grid-margin-lg);\n    /* no max-width — container spans the viewport, content area is fluid */\n  }\n}\n@media (min-width: 1440px) {\n  .container {\n    width: 100%;\n    margin-inline: auto;\n    padding-inline: var(--grid-margin-xl);\n    max-width: var(--breakpoint-xl); /* caps inner content at --grid-content-xl (1312) */\n  }\n}\n```\n\nSpec rules:\n\n- Container is fluid in SM/MD/LG: width = viewport, inner content area = `viewport − 2 × --grid-margin-<bp>`. The per-band `--grid-content-<bp>` token values are canonical reference values at the band\'s lower bound, not the actual content width inside the band.\n- Within SM/MD/LG, column widths are derived from the fluid content area via `grid-template-columns: repeat(N, 1fr)`; the `--grid-column-width-<bp>` token values are canonical reference values at the band\'s lower bound (not the actual track width inside the band).\n- Outer margins (`--grid-margin-<bp>`) are guaranteed at every viewport within the band — they sit on the container as `padding-inline`, not on the parent as auto-margin.\n- At XL (vw ≥ 1440), the container caps at `max-width: var(--breakpoint-xl)` so inner content equals `--grid-content-xl` = `--grid-max-width` = 1312 px; auto-margins absorb excess viewport. Per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 7.3, layouts use `max-width: var(--grid-max-width)` as the canonical container max.\n- Below SM canonical (vw < 360), behavior is best-effort (container may overflow). 360 is the supported mobile floor.\n\n## Token values\n\n> **Figma type primer.** All values below are stored as Figma `Number` Variables. Px-valued tokens (container widths, gutters, margins) carry a length, but Figma has no native length-with-unit type — the consumer (CSS layer / Figma constraint binding) treats the `Number` as px. Column-count tokens are also `Number` (integer); the unit is "columns", not pixels.\n\nTrue column widths are **derived** ((content − (cols − 1) × gutter) / cols) but ALSO surfaced as tokens (`--grid-column-width-<bp>`) so consumer SCSS can read them directly without recomputing.\n\n### Container widths\n\n| Value | Figma name | Figma type | CSS custom property | Notes |\n|---|---|---|---|---|\n| 328 | `grid/content/sm` (Primitive) | Number | `--grid-content-sm` | 360 − 2 × 16; reference content width at SM canonical viewport (band content is fluid) |\n| 704 | `grid/content/md` (Primitive) | Number | `--grid-content-md` | 768 − 2 × 32 = 704; reference content width at MD canonical viewport (band content is fluid) |\n| 936 | `grid/content/lg` (Primitive) | Number | `--grid-content-lg` | 1024 − 2 × 44 = 936; reference content width at LG canonical viewport (band content is fluid) |\n| 1312 | `grid/content/xl` (Primitive) | Number | `--grid-content-xl` | 1440 − 2 × 64 = 1312; authoritative XL content cap |\n| 1312 | `grid/max` (Semantic, → `grid/content/xl`) | Number (alias) | `--grid-max-width` | canonical container max for templates per `code-conventions.mdc` § 7.3 |\n\n### Column counts (integer count, NOT a length)\n\n| Value | Figma name | Figma type | CSS custom property | Notes |\n|---|---|---|---|---|\n| 4 | `grid/columns/sm` (Primitive) | Number (integer) | `--grid-columns-sm` | unit = "columns", not px; consumed by `grid-template-columns: repeat(var(--grid-columns-sm), 1fr)` |\n| 12 | `grid/columns/md` (Primitive) | Number (integer) | `--grid-columns-md` | — |\n| 12 | `grid/columns/lg` (Primitive) | Number (integer) | `--grid-columns-lg` | — |\n| 12 | `grid/columns/xl` (Primitive) | Number (integer) | `--grid-columns-xl` | — |\n\n### Gutters\n\n| Value | Figma name | Figma type | CSS custom property |\n|---|---|---|---|\n| 12 | `grid/gutter/sm` (Primitive) | Number | `--grid-gutter-sm` |\n| 16 | `grid/gutter/md` (Primitive) | Number | `--grid-gutter-md` |\n| 24 | `grid/gutter/lg` (Primitive) | Number | `--grid-gutter-lg` |\n| 32 | `grid/gutter/xl` (Primitive) | Number | `--grid-gutter-xl` |\n\n### Outer margins\n\n| Value | Figma name | Figma type | CSS custom property | Notes |\n|---|---|---|---|---|\n| 16 | `grid/margin/sm` (Primitive) | Number | `--grid-margin-sm` | — |\n| 32 | `grid/margin/md` (Primitive) | Number | `--grid-margin-md` | — |\n| 44 | `grid/margin/lg` (Primitive) | Number | `--grid-margin-lg` | off-8px-grid (intentional) |\n| 64 | `grid/margin/xl` (Primitive) | Number | `--grid-margin-xl` | — |\n\n### Column widths (derived; surfaced as tokens for consumer ergonomics)\n\n| Value | Figma name | CSS custom property | Notes |\n|---|---|---|---|\n| 73 | `grid/column-width/sm` (Primitive) | `--grid-column-width-sm` | `(328 − 3 × 12) / 4 = 73` (rounding leftover; not 4-px-aligned — intentional); reference value at canonical vw, actual track width fluid via 1fr |\n| 44 | `grid/column-width/md` (Primitive) | `--grid-column-width-md` | `(704 − 11 × 16) / 12 = 44`; reference value at canonical vw, actual track width fluid via 1fr |\n| 56 | `grid/column-width/lg` (Primitive) | `--grid-column-width-lg` | `(936 − 11 × 24) / 12 = 56`; reference value at canonical vw, actual track width fluid via 1fr |\n| 80 | `grid/column-width/xl` (Primitive) | `--grid-column-width-xl` | `(1312 − 11 × 32) / 12 = 80`; authoritative — XL is fixed |\n\n## CSS implementation pattern\n\n```css\n:root {\n  --grid-content-sm: 328px;\n  --grid-content-md: 704px;\n  --grid-content-lg: 936px;\n  --grid-content-xl: 1312px;\n  --grid-max-width:  var(--grid-content-xl); /* canonical container max */\n\n  --grid-columns-sm: 4;\n  --grid-columns-md: 12;\n  --grid-columns-lg: 12;\n  --grid-columns-xl: 12;\n\n  --grid-gutter-sm: 12px;\n  --grid-gutter-md: 16px;\n  --grid-gutter-lg: 24px;\n  --grid-gutter-xl: 32px;\n\n  --grid-margin-sm: 16px;\n  --grid-margin-md: 32px;\n  --grid-margin-lg: 44px;\n  --grid-margin-xl: 64px;\n\n  --grid-column-width-sm: 73px;\n  --grid-column-width-md: 44px;\n  --grid-column-width-lg: 56px;\n  --grid-column-width-xl: 80px;\n}\n```\n\n## Page-layout helpers\n\nFive helper classes ship alongside the tokens and surface the\n**page-layout model** every Components / Layouts / Pages story (and\nevery production page) is built from (per\n[`grid-as-default-context.mdc`](../../../../.cursor/rules/grid-as-default-context.mdc)).\nThey are the only class family declared by a token unit that other\nunits may freely consume.\n\n**Body is full-bleed by default.** In Storybook,\n`storybook-lifelock/.storybook/preview.scss` declares\n`body { margin: 0; padding: 0; }` so every story renders at viewport\nedge-to-edge unless it opts in to content-width framing. The same\napplies in production code: the `<body>` element IS the page; there\nis no outer `.l-page` wrapper. Content-width framing is opt-in via\n`.l-fluid-width` (or `.l-static-width`); the grid quartet `.l-row` /\n`.l-col` carries the responsive grid; `.l-full-bleed` is an opt-in\nescape hatch for nested break-outs.\n\n| Class | Role | Authoring posture |\n|---|---|---|\n| `.l-fluid-width` | Fluid content-width section. Per-band `padding-inline: var(--grid-margin-<bp>)` caps content to the band\'s reference inner width. At XL adds `max-inline-size: var(--breakpoint-xl)` so inner content = `--grid-content-xl` (1312 px) with auto-margins absorbing excess viewport. Content width grows fluidly with the viewport between band edges. | Section root for content that should sit inside the page-content width. Stories opt in via `parameters: { contentWidth: \'fluid\' }` (which wraps the story) or by supplying their own `<div class="l-fluid-width">` per render. The canonical LifeLock posture. |\n| `.l-static-width` | Static content-width section. Per-band `max-inline-size: var(--grid-content-<bp>)` + auto-margins; no `padding-inline`. Outer spacing is fluid (stair-step) — the inner content cap is fixed pixels per band. | Available for portability — no LifeLock consumer uses this today. Surfaces the alternate "fixed content / fluid margins" posture other sites in the platform may adopt. Stories opt in via `parameters: { contentWidth: \'static\' }`. |\n| `.l-full-bleed` | Escape-hatch back to viewport edge-to-edge from inside a `.l-fluid-width` section. SM/MD/LG: `margin-inline: calc(-1 * var(--grid-margin-<bp>))` negates the parent\'s `padding-inline`. XL: `margin-inline: calc((var(--grid-content-xl) - 100dvw) / 2)` absorbs both the auto-margin and the padding. Uses dynamic viewport units (`dvw`) so the break-out tracks the visible viewport — see decision #7. | Use only when a child of a `.l-fluid-width` section needs to break out (e.g. a hero image inside an article body). Top-level full-bleed sections do NOT need this class — they sit as direct children of body and inherit the full-bleed default. |\n| `.l-row` | `display: grid` row; per-band `grid-template-columns: repeat(var(--grid-columns-<bp>), 1fr)` + `column-gap: var(--grid-gutter-<bp>)`. May live at body level (full-bleed), inside a `.l-fluid-width` / `.l-static-width`, or **co-declared on the same element** as `.l-fluid-width` for the compact `<div class="l-fluid-width l-row">` single-element form. | Wraps any group of children that should sit on the multi-column grid. |\n| `.l-col` | Grid item; defaults to `grid-column: 1 / -1` (full row). Per-band span modifiers `.l-col--<bp>--<N>` set `grid-column: span <N>`; per-band start modifiers `.l-col--<bp>--start--<N>` set `grid-column-start: <N>`. Bands are mutually exclusive (no cascade), so a layer that spans differently per band declares a modifier per band. | Direct child of `.l-row`. |\n\nPer-band CSS contract (mirrors `## CSS implementation pattern` in shape):\n\n```css\n/* sm — vw ≤ 767 (fluid) */\n.l-fluid-width {\n  width: 100%;\n  margin-inline: auto;\n  box-sizing: border-box;\n  padding-inline: var(--grid-margin-sm);   /* 16 — content grows fluidly inside the band */\n}\n.l-static-width {\n  margin-inline: auto;\n  box-sizing: border-box;\n  max-inline-size: var(--grid-content-sm); /* 328 — fixed cap; fluid outer auto-margins */\n}\n.l-full-bleed {\n  width: 100dvw;\n  margin-inline: calc(-1 * var(--grid-margin-sm)); /* negate parent .l-fluid-width padding */\n}\n.l-row {\n  display: grid;\n  grid-template-columns: repeat(var(--grid-columns-sm), 1fr);   /* 4 fluid tracks */\n  column-gap: var(--grid-gutter-sm);                            /* 12 */\n}\n.l-col              { grid-column: 1 / -1; }\n.l-col--sm--1       { grid-column: span 1; }\n/* … sm--2, sm--3, sm--4 */\n.l-col--sm--start--1 { grid-column-start: 1; }\n/* … sm--start--2, sm--start--3, sm--start--4 */\n\n/* md — 768 ≤ vw ≤ 1023 (fluid) and lg — 1024 ≤ vw ≤ 1439 (fluid)\n   follow the sm shape: padding-inline only on .l-fluid-width,\n   max-inline-size only on .l-static-width, .l-full-bleed uses\n   calc(-1 * var(--grid-margin-<bp>)) to negate the parent\'s padding,\n   .l-row uses 1fr tracks against the fluid content area, and .l-col\n   modifiers generate {1..12} + start--{1..12}. .l-fluid-width never\n   declares a max-inline-size in sm/md/lg. */\n\n/* xl — vw ≥ 1440 (.l-fluid-width caps at --breakpoint-xl so inner content = 1312) */\n.l-fluid-width {\n  width: 100%;\n  margin-inline: auto;\n  box-sizing: border-box;\n  padding-inline: var(--grid-margin-xl);   /* 64 */\n  max-inline-size: var(--breakpoint-xl);   /* 1440 — caps inner content at --grid-content-xl (1312) */\n}\n.l-static-width {\n  margin-inline: auto;\n  box-sizing: border-box;\n  max-inline-size: var(--grid-content-xl); /* 1312 — same authoritative cap as XL .l-fluid-width content */\n}\n.l-full-bleed {\n  width: 100dvw;\n  margin-inline: calc((var(--grid-content-xl) - 100dvw) / 2); /* absorbs parent auto-margin + padding */\n}\n.l-row {\n  display: grid;\n  grid-template-columns: repeat(var(--grid-columns-xl), 1fr); /* 12 tracks of fixed --grid-column-width-xl */\n  column-gap: var(--grid-gutter-xl);                          /* 32 */\n}\n```\n\nDesign rules consumers honor:\n\n- **Body is the page.** A unit that sits at the top level of a page (a hero band, a feature strip, a footer) needs NO wrapper — body is already full-bleed. Use `.l-fluid-width` (or `.l-static-width`) only when a section should be capped to the page-content width; use `.l-full-bleed` only as an escape-hatch from inside a capped section.\n- **Compact single-element form.** When a section is just a row of grid items inside the page-content width, declare both helpers on the same element: `<div class="l-fluid-width l-row">…</div>`. Two-element form (`<div class="l-fluid-width"><div class="l-row">…</div></div>`) is also valid when an author wants a non-grid wrapper around the grid.\n- **Fit-content components need no grid declaration.** Buttons, chips, badges, icons, brand logos, etc. sit fine as direct children of body (or of a `.l-fluid-width`), left-aligned to the inline-start. They do NOT need to be wrapped in `.l-row` or carry `.l-col--<bp>--<N>` modifiers.\n- **Layout-level units wrap children in `.l-row`.** A layout root that maps onto the multi-column grid declares `.l-row` and assigns each direct child a per-band span modifier. Layout-level units that span a fixed number of columns themselves (rather than wrapping a row) MAY also be styled as a grid item via `.l-col--<bp>--<N>` when they sit inside an outer row.\n- **Spacing tokens fill the gaps.** Anything that cannot be expressed via the grid (gaps between non-grid children, ad-hoc offsets) consumes the `--space-N` scale from [`tokens/spacing`](../spacing/spec.md) — never raw px.\n- **Snap tolerance: 2 px.** When mapping a Figma layer\'s L/R bounds to code, if a bound falls within 2 px of a grid line (margin edge or column boundary for the band), snap to the grid line. Document the snap with an SCSS comment per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 7.4.\n\n## Design decisions\n\n1. **Column-count split (SM = 4, MD/LG/XL = 12).** Mobile layouts target a 4-col grid at 360 px canonical viewport; tablet/desktop bands use the standard 12-col module.\n2. **LG outer margin = 44 px.** On the 4 px primitive scale, off the 8 px secondary scale. Kept as-is on `--grid-margin-lg`. Grid tokens live in their own `--grid-*` namespace and do **not** alias the general `--space-*` scale; the value is owned by this spec only.\n3. **`grid/max` Semantic alias.** Templates reference one canonical container max-width via `--grid-max-width` (= `--grid-content-xl` = 1312 px) per `code-conventions.mdc` § 7.3.\n4. **Fluid container in SM/MD/LG, capped at XL.** Content area grows with the viewport across the SM/MD/LG ranges; XL caps inner content at `--grid-max-width` (1312px) with auto-margins absorbing the excess. Mirrors the Figma frame-name ranges (`Mobile - 360-767`, `Tablet - 768-1023`, `Small Desktop - 1024-1439`, `Desktop - 1440-1920+`) which carry an explicit `+` cap only on XL. The per-band `--grid-content-<bp>` and `--grid-column-width-<bp>` token values are canonical reference values at each band\'s lower bound, not the actual content/track width inside the band.\n5. **Grid is a token, not a wrapper.** Per [`terminology.mdc`](../../../../.cursor/rules/terminology.mdc), `grid` is classified as a Token family. Layouts and pages consume `--grid-*` directly in their SCSS; there is no `c-grid` component or `.u-grid` utility class. A future `layouts/container/` unit may package the grid into a reusable wrapper, but the tokens themselves remain canonical.\n6. **Body-default full-bleed, opt-in content-width.** The page-layout model is "body is the page" — `<body>` carries no margin or padding and any direct child spans the viewport edge-to-edge. There is no outer `.l-page` wrapper. Content-width framing is **opt-in** via `.l-fluid-width` (fluid content area, fixed `padding-inline` per band; the LifeLock posture) or `.l-static-width` (fixed `max-inline-size` per band, fluid outer auto-margins; available for portability across the platform). The grid quartet `.l-row` + `.l-col` (plus per-band span / start modifiers) carries the responsive grid, and `.l-row` may be co-declared on the same element as `.l-fluid-width` for the compact `<div class="l-fluid-width l-row">` single-element form. `.l-full-bleed` is a separate escape-hatch for the rare case where a child of a `.l-fluid-width` section needs to break back out to viewport edges (e.g. a hero image inside an article body). All five helpers ship inside this unit\'s `_grid.scss` because their semantics are inseparable from the per-band tokens — every padding, max-inline-size, gutter, and column-count value the helpers emit resolves directly against `--grid-*` and `--breakpoint-*` declared on `:root`. They sit in the `l-*` taxonomy slot per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 1 and are the only non-utility class family other units may freely consume.\n7. **Dynamic viewport units (`dvw`) on `.l-full-bleed`.** The escape-hatch helper uses `100dvw` (and the XL formula uses `(--grid-content-xl - 100dvw) / 2`) instead of `100vw`. The legacy `vw` unit resolves against the **large** viewport — the area the page covers when mobile browser chrome (Safari address bar, Android URL bar) is collapsed — so a full-bleed section sized at `100vw` ends up wider than the actually visible viewport while the chrome is shown, producing a one-frame horizontal scrollbar flash as the page loads and again whenever the chrome dismisses. `dvw` resolves against the **dynamic** (currently visible) viewport, eliminating that flash on every browser in the support matrix (Safari 15.4+, Chrome 108+, Firefox 101+). No effect on desktop browsers — `vw` and `dvw` resolve identically when no UA chrome is auto-collapsing.\n'})))()}function d(e){for(let[t,{min:n,max:r}]of Object.entries(C))if(e>=n&&e<=r)return t;return null}function f(){if(typeof window>`u`||w)return;w=!0;let e=(e,t)=>{if(!e||!t)return`?`;let n=m(e);if(e===`xl`){let e=Math.max(0,t-2*n.margin);return`${Math.min(e,n.content)}px (capped at --grid-content-xl)`}return`${Math.max(0,t-2*n.margin)}px (fluid)`},t=()=>{let t=window.innerWidth,n=d(t);document.querySelectorAll(`[data-grid-live-width]`).forEach(e=>{e.textContent=`${t||`?`} px → ${n?n.toUpperCase():`unknown`}`}),document.querySelectorAll(`[data-grid-live-content]`).forEach(r=>{r.textContent=e(n,t)}),document.querySelectorAll(`[data-grid-live-ruler]`).forEach(e=>{let r=e.dataset.band,i=parseFloat(e.dataset.width)||0,a=!1;if(n===r&&t)if(r===`xl`)a=!0;else{let e=C[r],n=r===`sm`?360:e.min,o=e.max,s=Math.abs(i-n)<Math.abs(i-o),c=Math.abs(t-n),l=Math.abs(t-o);a=s?c<=l:c>l}e.classList.toggle(`is-active`,a)})};window.addEventListener(`resize`,t),requestAnimationFrame(t)}function p(e){return`
    <table class="grid-table">
      <thead><tr>${e.headers.map(e=>`<th>${r(e)}</th>`).join(``)}</tr></thead>
      <tbody>
        ${e.rows.map(e=>`
          <tr>${e.map((e,t)=>`
            <td class="${t===3?`grid-table__token`:``}">${a(e)}</td>
          `).join(``)}</tr>
        `).join(``)}
      </tbody>
    </table>
  `}function m(e){let t=e=>{let t=o(e);return t&&parseFloat(t)||0};return{band:e,content:t(`--grid-content-${e}`),columns:parseInt(o(`--grid-columns-${e}`)||`0`,10)||0,gutter:t(`--grid-gutter-${e}`),margin:t(`--grid-margin-${e}`),columnWidth:t(`--grid-column-width-${e}`),canonicalViewport:t(`--breakpoint-${e}`)}}function h(e,t,n,i){let a=m(e),o=t||a.canonicalViewport||a.content+2*a.margin||1,s=e!==`xl`,c=Math.max(0,o-2*a.margin),l=(a.columns-1)*a.gutter,u=a.columns>0?Math.max(0,(c-l)/a.columns):0,d=[];d.push({kind:`margin`,size:a.margin});for(let e=0;e<a.columns;e+=1)d.push({kind:`col`,size:u}),e<a.columns-1&&d.push({kind:`gutter`,size:a.gutter});d.push({kind:`margin`,size:a.margin});let f=d.map(e=>{let t=`flex-basis: ${e.size/o*100}%;`;return e.kind===`margin`?`<div class="grid-ruler__margin" style="${t}" title="margin ${a.margin}px"></div>`:e.kind===`gutter`?`<div class="grid-ruler__gutter" style="${t}" title="gutter ${a.gutter}px"></div>`:`<div class="grid-ruler__col" style="${t}" title="column ~${Math.round(e.size)}px"></div>`}).join(``),p=C[e].max,h=e===`sm`?360:C[e].min,g=h-2*a.margin,_=e===`xl`?a.content:p-2*a.margin,v=e===`xl`?`vw ≥ ${h}`:`vw ${h}–${p}`,y=e===`xl`?`content ${a.content}px (capped)`:`content ${g}–${_}px`,b=s?`${a.columns} cols × fluid track`:`${a.columns} cols × ${a.columnWidth}px track`,x=`${e.toUpperCase()} band: ${v}; ${y}; ${b}; gutter ${a.gutter}px; margin ${a.margin}px`;return`
    <div class="grid-ruler ${i?`is-active`:``}" data-grid-live-ruler data-band="${e}" data-width="${o}">
      <div class="grid-ruler__header">
        <span class="grid-ruler__band">${e.toUpperCase()}</span>
        <span class="grid-ruler__meta">${r(n)} · ${r(x)}</span>
      </div>
      <div class="grid-ruler__container">${f}</div>
    </div>
  `}function g(e,t){let n=[];for(let r of S)if(r===`xl`){let t=e===r;n.push(h(r,1440,`cap · ≥1440px → content 1312px`,t))}else{let i=C[r],a=r===`sm`?360:i.min,o=i.max,s=m(r),c=a-2*s.margin,l=o-2*s.margin,u=!1,d=!1;e===r&&t&&(Math.abs(t-a)<=Math.abs(t-o)?u=!0:d=!0),n.push(h(r,a,`canonical · ${a}px → content ${c}px`,u)),n.push(h(r,o,`upper · ${o}px → content ${l}px`,d))}return n.join(``)}function _(){f();let e=typeof window>`u`?0:window.innerWidth,t=d(e),n=g(t,e),i=`${e||`?`} px → ${t?t.toUpperCase():`unknown`}`;return`
    ${x}
    <div class="grid-active">
      <span class="grid-active__label">Active viewport:</span>
      <span class="grid-active__value" data-grid-live-width>${r(i)}</span>
    </div>
    <div class="grid-rulers">
      ${n}
    </div>
  `}function v({section:e,table:t}){return e===`Token values`?p(t):null}function y(){f();let e=typeof window>`u`?0:window.innerWidth,t=d(e),n=t?m(t):null,i=`?`;if(t&&n&&e)if(t===`xl`){let t=Math.max(0,e-2*n.margin);i=`${Math.min(t,n.content)}px (capped at --grid-content-xl)`}else i=`${Math.max(0,e-2*n.margin)}px (fluid)`;let a=`${e||`?`} px → ${t?t.toUpperCase():`unknown`}`;return`
    <div class="grid-active">
      <span class="grid-active__label">Active viewport:</span>
      <span class="grid-active__value" data-grid-live-width>${r(a)}</span>
      <span class="grid-active__label">Content area:</span>
      <span class="grid-active__value" data-grid-live-content>${r(i)}</span>
    </div>
  `}var b,x,S,C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{t(),n(),u(),b=i(l),x=`
<style>
.grid-rulers {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  border-radius: 8px;
  padding: 16px;
  background: var(--color-canvas-default, #fff);
}
.grid-ruler {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.grid-ruler__header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
}
.grid-ruler__band {
  font-weight: var(--font-weight-bold, 700);
  color: var(--color-text-primary, #181818);
}
.grid-ruler__meta {
  color: var(--color-text-secondary, rgba(0,0,0,0.55));
  font-variant-numeric: tabular-nums;
}
.grid-ruler__container {
  position: relative;
  height: 48px;
  background: var(--color-bg-subtle, rgba(0,0,0,0.04));
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}
.grid-ruler__margin {
  background: repeating-linear-gradient(45deg,
    rgba(208, 78, 87, 0.12) 0 4px,
    transparent 4px 8px);
  flex: 0 0 auto;
}
.grid-ruler__cols {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
}
.grid-ruler__col {
  flex: 1 1 auto;
  background: var(--color-mist-blue, #cce5e7);
  border: 1px solid var(--color-border-brand, rgba(16,131,137,0.30));
}
.grid-ruler__gutter {
  background: transparent;
  flex: 0 0 auto;
}
.grid-ruler.is-active .grid-ruler__container {
  outline: 2px solid var(--color-text-brand, #108389);
}
.grid-active {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: var(--color-canvas-subtle, #f6f6f4);
  border: 1px dashed var(--color-border-subtle, rgba(0,0,0,0.20));
  border-radius: 6px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
}
.grid-active__label {
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-secondary, rgba(0,0,0,0.65));
}
.grid-active__value {
  color: var(--color-text-primary, #181818);
}
.grid-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-body-sm, 14px);
}
.grid-table th {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 2px solid var(--color-border-subtle, rgba(0,0,0,0.18));
  background: var(--color-bg-subtle, rgba(0,0,0,0.03));
}
.grid-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  vertical-align: top;
}
.grid-table__token {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
}
</style>
`,S=[`sm`,`md`,`lg`,`xl`],C={sm:{min:0,max:767},md:{min:768,max:1023},lg:{min:1024,max:1439},xl:{min:1440,max:1/0}},w=!1,T={title:`Design System/Grid`,parameters:{contentWidth:`fluid`,design:c(b.frontmatter.figmaNodeId||`0:31`),docs:{description:{component:"Per-band grid module (container width, columns, gutter, margin, column width) sourced from `storybook-lifelock/src/tokens/grid/spec.md`. The container is **fluid in SM/MD/LG and capped at XL** — the gallery reflects this by drawing two rulers per fluid band (canonical lower bound + fluid upper bound) and one ruler at the XL cap (`--grid-max-width` = 1312 px). Each ruler's caption prints the band's vw range, content range, column-count × track-width (`fluid` for SM/MD/LG, literal px for XL), gutter, and margin. The ruler closest to the live Storybook viewport is outlined in brand colour."}}}},E={name:`Grid`,render:()=>s({storySpec:b,tableHook:v,trailingHtml:`
        <section class="spec-gallery__section">
          <h3 class="spec-gallery__section-heading">Live ruler</h3>
          ${_()}
        </section>
      `})},D=`
<style>
  .pf-section {
    margin-block-end: var(--space-8, 32px);
  }
  .pf-section__heading {
    margin-block: 0 var(--space-3, 12px);
    font: var(--font-headline-h5, 600 18px/1.4 system-ui);
    color: var(--color-text-primary, #181818);
  }
  .pf-section__caption {
    margin-block: 0 var(--space-4, 16px);
    color: var(--color-text-secondary, rgba(0,0,0,0.65));
    font-size: var(--font-size-body-sm, 14px);
  }
  .pf-block {
    background: var(--color-mist-blue, #cce5e7);
    border: 1px solid var(--color-border-brand, rgba(16,131,137,0.30));
    border-radius: 4px;
    padding: var(--space-3, 12px);
    font-family: ui-monospace, Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--color-text-primary, #181818);
    text-align: center;
  }
  .pf-fullbleed {
    background: var(--color-canvas-subtle, #f6f6f4);
    padding-block: var(--space-6, 24px);
    border-block: 1px solid var(--color-border-subtle, rgba(0,0,0,0.18));
  }
  .pf-fullbleed__label {
    text-align: center;
    font-family: ui-monospace, Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--color-text-secondary, rgba(0,0,0,0.65));
    margin: 0;
  }
  .pf-content-edge {
    outline: 1px dashed var(--color-text-brand, #108389);
    outline-offset: -1px;
    min-block-size: var(--space-6, 24px);
  }
  .pf-static-edge {
    outline: 1px dashed var(--color-text-secondary, rgba(0,0,0,0.55));
    outline-offset: -1px;
  }
</style>
`,O=e=>{let t=[];for(let n=1;n<=e;n+=1)t.push(`<div class="l-col l-col--sm--1 l-col--md--1 l-col--lg--1 l-col--xl--1 pf-block">${n}</div>`);return`<div class="l-row">${t.join(``)}</div>`},k=()=>`
  <div class="l-row">
    <div class="l-col l-col--sm--4 l-col--md--6 l-col--lg--6 l-col--xl--6 pf-block">
      6 cols at MD/LG/XL · full row at SM
    </div>
    <div class="l-col l-col--sm--4 l-col--md--6 l-col--lg--6 l-col--xl--6 pf-block">
      6 cols at MD/LG/XL · full row at SM
    </div>
  </div>
`,A=e=>{let t=[];for(let n=1;n<=e;n+=1)t.push(`<div class="l-col l-col--sm--1 l-col--md--1 l-col--lg--1 l-col--xl--1 pf-block">${n}</div>`);return`<div class="l-fluid-width l-row">${t.join(``)}</div>`},j={name:`Page-layout helpers`,parameters:{layout:`fullscreen`,contentWidth:!1,docs:{description:{story:"Demonstrates the five page-layout helper classes (`.l-fluid-width`, `.l-static-width`, `.l-full-bleed`, `.l-row`, `.l-col`) declared in `_grid.scss`. **Body is full-bleed by default** — direct children of `<body>` span the viewport edge-to-edge without any wrapper. Content-width framing is opt-in via `.l-fluid-width` (the LifeLock posture: fluid in SM/MD/LG, capped at XL) or `.l-static-width` (alternate posture: fixed inner cap per band, fluid outer margins). The grid quartet `.l-row` / `.l-col` composes on top and may be co-declared on the same element as `.l-fluid-width` for the compact single-element form. `.l-full-bleed` is an explicit escape-hatch back to viewport edges from inside a content-width section. Drag the Storybook viewport handle between SM / MD / LG / XL to watch the dashed content-width outline expand and contract within each band."}}},render:()=>`
    ${x}
    ${D}

    ${y()}

    <section class="pf-section">
      <h3 class="pf-section__heading">1. Body-default full-bleed · .l-row at body level</h3>
      <p class="pf-section__caption">
        A 12-col row sitting directly at body level — no content-width wrapper. The row spans the viewport edge-to-edge. At SM the grid collapses to 4 tracks; at MD/LG/XL all 12 cells fit on one row.
      </p>
      ${O(12)}
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">2. .l-fluid-width section wrapping a .l-row</h3>
      <p class="pf-section__caption">
        Two-element form: an outer \`.l-fluid-width\` caps the section to the page-content width, an inner \`.l-row\` lays out the grid. Useful when a non-grid wrapper is wanted around the grid.
      </p>
      <div class="l-fluid-width pf-content-edge">
        ${k()}
      </div>
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">3. .l-fluid-width.l-row · compact single-element form</h3>
      <p class="pf-section__caption">
        Same effect as Pattern 2 but with both helpers co-declared on one element — the canonical compact form when a section is just a row of grid items inside the page-content width.
      </p>
      ${A(12)}
    </section>

    <section class="pf-fullbleed pf-section">
      <p class="pf-fullbleed__label">
        4. Body-default full-bleed — direct child of body, no class needed
      </p>
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">5. .l-full-bleed nested inside .l-fluid-width</h3>
      <p class="pf-section__caption">
        The explicit escape-hatch case: a child of a \`.l-fluid-width\` section that needs to break back out to viewport edges (e.g. a hero image inside an article body).
      </p>
      <div class="l-fluid-width pf-content-edge">
        <div class="pf-block" style="margin-block-end: var(--space-4, 16px);">
          inside .l-fluid-width — content-width cap applies
        </div>
        <div class="l-full-bleed pf-fullbleed">
          <p class="pf-fullbleed__label">
            .l-full-bleed — escapes back to viewport edges from inside .l-fluid-width
          </p>
        </div>
        <div class="pf-block" style="margin-block-start: var(--space-4, 16px);">
          back inside .l-fluid-width
        </div>
      </div>
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">6. .l-static-width · alternate posture</h3>
      <p class="pf-section__caption">
        No padding-inline; per-band \`max-inline-size\` caps inner content and auto-margins absorb the rest. Outer spacing is fluid (stair-step). Available for portability across the platform; no LifeLock consumer uses this today.
      </p>
      <div class="l-static-width pf-static-edge">
        <div class="l-row">
          <div class="l-col l-col--sm--4 l-col--md--12 l-col--lg--12 l-col--xl--12 pf-block">
            I sit inside .l-static-width — fixed max-inline-size per band, fluid outer auto-margins
          </div>
        </div>
      </div>
    </section>
  `},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'Grid',
  render: () => renderSpecGallery({
    storySpec: SPEC,
    tableHook,
    trailingHtml: \`
        <section class="spec-gallery__section">
          <h3 class="spec-gallery__section-heading">Live ruler</h3>
          \${rulerStack()}
        </section>
      \`
  })
}`,...E.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: 'Page-layout helpers',
  parameters: {
    layout: 'fullscreen',
    contentWidth: false,
    docs: {
      description: {
        story: 'Demonstrates the five page-layout helper classes (\`.l-fluid-width\`, \`.l-static-width\`, \`.l-full-bleed\`, \`.l-row\`, \`.l-col\`) declared in \`_grid.scss\`. **Body is full-bleed by default** — direct children of \`<body>\` span the viewport edge-to-edge without any wrapper. Content-width framing is opt-in via \`.l-fluid-width\` (the LifeLock posture: fluid in SM/MD/LG, capped at XL) or \`.l-static-width\` (alternate posture: fixed inner cap per band, fluid outer margins). The grid quartet \`.l-row\` / \`.l-col\` composes on top and may be co-declared on the same element as \`.l-fluid-width\` for the compact single-element form. \`.l-full-bleed\` is an explicit escape-hatch back to viewport edges from inside a content-width section. Drag the Storybook viewport handle between SM / MD / LG / XL to watch the dashed content-width outline expand and contract within each band.'
      }
    }
  },
  render: () => \`
    \${SWATCH_STYLES}
    \${PAGE_FRAME_STYLES}

    \${pageFrameReadout()}

    <section class="pf-section">
      <h3 class="pf-section__heading">1. Body-default full-bleed · .l-row at body level</h3>
      <p class="pf-section__caption">
        A 12-col row sitting directly at body level — no content-width wrapper. The row spans the viewport edge-to-edge. At SM the grid collapses to 4 tracks; at MD/LG/XL all 12 cells fit on one row.
      </p>
      \${renderRow(12)}
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">2. .l-fluid-width section wrapping a .l-row</h3>
      <p class="pf-section__caption">
        Two-element form: an outer \\\`.l-fluid-width\\\` caps the section to the page-content width, an inner \\\`.l-row\\\` lays out the grid. Useful when a non-grid wrapper is wanted around the grid.
      </p>
      <div class="l-fluid-width pf-content-edge">
        \${renderMixedRow()}
      </div>
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">3. .l-fluid-width.l-row · compact single-element form</h3>
      <p class="pf-section__caption">
        Same effect as Pattern 2 but with both helpers co-declared on one element — the canonical compact form when a section is just a row of grid items inside the page-content width.
      </p>
      \${renderCompactRow(12)}
    </section>

    <section class="pf-fullbleed pf-section">
      <p class="pf-fullbleed__label">
        4. Body-default full-bleed — direct child of body, no class needed
      </p>
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">5. .l-full-bleed nested inside .l-fluid-width</h3>
      <p class="pf-section__caption">
        The explicit escape-hatch case: a child of a \\\`.l-fluid-width\\\` section that needs to break back out to viewport edges (e.g. a hero image inside an article body).
      </p>
      <div class="l-fluid-width pf-content-edge">
        <div class="pf-block" style="margin-block-end: var(--space-4, 16px);">
          inside .l-fluid-width — content-width cap applies
        </div>
        <div class="l-full-bleed pf-fullbleed">
          <p class="pf-fullbleed__label">
            .l-full-bleed — escapes back to viewport edges from inside .l-fluid-width
          </p>
        </div>
        <div class="pf-block" style="margin-block-start: var(--space-4, 16px);">
          back inside .l-fluid-width
        </div>
      </div>
    </section>

    <section class="pf-section">
      <h3 class="pf-section__heading">6. .l-static-width · alternate posture</h3>
      <p class="pf-section__caption">
        No padding-inline; per-band \\\`max-inline-size\\\` caps inner content and auto-margins absorb the rest. Outer spacing is fluid (stair-step). Available for portability across the platform; no LifeLock consumer uses this today.
      </p>
      <div class="l-static-width pf-static-edge">
        <div class="l-row">
          <div class="l-col l-col--sm--4 l-col--md--12 l-col--lg--12 l-col--xl--12 pf-block">
            I sit inside .l-static-width — fixed max-inline-size per band, fluid outer auto-margins
          </div>
        </div>
      </div>
    </section>
  \`
}`,...j.parameters?.docs?.source}}},M=[`Default`,`PageFrame`]})))()}N();export{E as Default,j as PageFrame,M as __namedExportsOrder,T as default};