import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n}from"./figma-links-DrHwXaYQ.js";import{a as r,c as i,i as a,l as o,n as s,o as c,r as l,s as u}from"./_spec-md-xTOD2TWI.js";var d;function f(){return(f=e((()=>{d='---\ntype: token\nname: shadow\nfigmaFileKey: Nshd9ukxIzpeUnzOXiWxUP\nfigmaNodeId: 18014:754\nstatus: published\nlastSyncedAt: ""\nlastSyncedFigmaFingerprint: ""\nlastSyncedSpecFingerprint: ""\nbrand: LifeLock\n---\n\n# Shadow tokens\n\n## Figma source\n\n- Canonical Foundations table (Web-ODS-Theme — Shadow): https://www.figma.com/design/Nshd9ukxIzpeUnzOXiWxUP/Web-ODS-Theme?node-id=18014-754&m=dev\n\n## Summary\n\nShadow foundation with **3 composite Shadow Effect Styles** (`shadow/elevation/{default,hover,pressed}`) plus state-keyed atom primitives (`shadow/{x,y,blur,spread}/{default,hover,pressed}`). CSS exposes the 3 composites as `--shadow-{default,hover,pressed}` and the per-dimension atoms as `--shadow-raw-{x,y,blur,spread}-{state}` — canonical in `themes/default/_shadow.scss` (re-exported by [`_shadow.scss`](./_shadow.scss)). Shadow color is composed as `rgb(0 0 0 / var(--opacity-10))` against opacity primitives; there is no `color/alpha/*` rgba primitive layer.\n\nSingle theme — every shadow has exactly one value, no per-mode override.\n\n**Architectural decisions:**\n\n1. **Shadow color = `rgba(0, 0, 0, var(--opacity-N))`** composed inline. No pre-mixed alpha primitives. Shadow consumers compose black + opacity at the call site, where `--opacity-N` is supplied by `opacity.md`. Visually approximates the legacy `#e3e3e2` opaque-gray shadow at ~10% black opacity.\n2. **Composite shadow Effects live in the Figma Effect Styles panel**, not the Variables collection (parallel to Fill Styles for gradients and TextStyles for typography — Figma Variables only support Color / Number / String / Boolean primitives, not composite Effects).\n3. **`default ≡ hover` collision preserved verbatim** — the design intent is that hover lift comes from a Y-translate on the element, not from a shadow change.\n4. **State-keyed atom primitives** — the project ships one atom per (dimension × state) tuple even when the value duplicates across states. Matches `_tokens.scss` (12 atoms over 3 states), trades a small amount of duplication for one-token-per-binding clarity in Figma.\n\n## Layered model\n\n```mermaid\ngraph LR\n  primAtoms["Primitive (shadow/{x,y,blur,spread}/{default,hover,pressed})"]\n  effectStyles["Effect Styles (shadow/elevation/*)"]\n  cssAliases["CSS --shadow-{default,hover,pressed}"]\n  opacityTicket["opacity.md (sibling spec)"]\n\n  primAtoms --> effectStyles\n  effectStyles --> cssAliases\n  opacityTicket -.->|"composed inline as rgba alpha"| cssAliases\n```\n\nCounts at a glance:\n\n- **12 atom Number primitives** — 4 dimensions (`x / y / blur / spread`) × 3 states (`default / hover / pressed`)\n- **3 composite Effect Styles** — `shadow/elevation/{default,hover,pressed}`\n- **3 composed CSS aliases** — `--shadow-{default,hover,pressed}`\n- **0 rgba primitives** — shadow color composed inline at the consumer\n\n## Token values\n\n> **Figma type primer:** Atom primitives are stored as Figma **Number** Variables, one per `(dimension × state)` tuple. The 3 composite shadows are Figma **Effect Styles** (Effect Styles panel — *not* a Variable collection). Effect Styles are composite "looks" that bind atom Variables and a color value, parallel to the way Fill Styles work for gradients. CSS exposes the composite shadow as a single `--shadow-*` custom property whose value is the full `box-shadow` string.\n\n### Atom primitives (Primitive collection — state-keyed)\n\n| Figma name | Value | CSS custom property | Figma type |\n|---|---|---|---|\n| `shadow/x/default` | 0 | `--shadow-raw-x-default` | Number |\n| `shadow/y/default` | 6 | `--shadow-raw-y-default` | Number |\n| `shadow/blur/default` | 24 | `--shadow-raw-blur-default` | Number |\n| `shadow/spread/default` | 0 | `--shadow-raw-spread-default` | Number |\n| `shadow/x/hover` | 0 | `--shadow-raw-x-hover` | Number |\n| `shadow/y/hover` | 6 | `--shadow-raw-y-hover` | Number |\n| `shadow/blur/hover` | 24 | `--shadow-raw-blur-hover` | Number |\n| `shadow/spread/hover` | 0 | `--shadow-raw-spread-hover` | Number |\n| `shadow/x/pressed` | 0 | `--shadow-raw-x-pressed` | Number |\n| `shadow/y/pressed` | 2 | `--shadow-raw-y-pressed` | Number |\n| `shadow/blur/pressed` | 6 | `--shadow-raw-blur-pressed` | Number |\n| `shadow/spread/pressed` | 0 | `--shadow-raw-spread-pressed` | Number |\n\nThat\'s 12 atom Number primitives total — one per `(dimension × state)` tuple. State-keyed naming matches `_tokens.scss` and keeps each Effect Style binding to its own primitives, even when values duplicate across states (e.g. `default` and `hover` Y / Blur are equal by design — see decision 3).\n\n### Intentionally not in spec (referenced by legacy but not carried forward)\n\n| Legacy Figma name | Why intentionally not in spec |\n|---|---|\n| `Color/Shadow/primary` (= `#e3e3e2` / `#e6e6e6`) | Replaced by inline `rgba(0, 0, 0, var(--opacity-10))` composition. |\n\n### Composite shadow Effects (Figma Effect Styles panel — not a Variable collection)\n\n| Figma name (Effect Style) | Value (X / Y / Blur / Spread / color) | CSS custom property | Figma type | Notes |\n|---|---|---|---|---|\n| `shadow/elevation/default` | 0 / 6 / 24 / 0 / `rgba(0, 0, 0, 10%)` | `--shadow-default` | Effect Style (drop-shadow) | Resting elevation. |\n| `shadow/elevation/hover` | 0 / 6 / 24 / 0 / `rgba(0, 0, 0, 10%)` | `--shadow-hover` | Effect Style (drop-shadow) | Hover elevation. **Intentionally identical to `default`**. Lift comes from element-level Y-translate on the consumer. |\n| `shadow/elevation/pressed` | 0 / 2 / 6 / 0 / `rgba(0, 0, 0, 10%)` | `--shadow-pressed` | Effect Style (drop-shadow) | Pressed elevation. Visibly tighter than `default` (smaller Y, smaller blur). |\n\n## CSS implementation pattern\n\n```css\n:root {\n  /* Atom primitives — one per (dimension × state). The 0-valued atoms stay\n     unit-less; the px-valued atoms carry the `px` unit so var() substitutes\n     cleanly inside box-shadow shorthand. */\n  --shadow-raw-x-default:      0;\n  --shadow-raw-y-default:      6px;\n  --shadow-raw-blur-default:   24px;\n  --shadow-raw-spread-default: 0;\n\n  --shadow-raw-x-hover:      0;\n  --shadow-raw-y-hover:      6px;\n  --shadow-raw-blur-hover:   24px;\n  --shadow-raw-spread-hover: 0;\n\n  --shadow-raw-x-pressed:      0;\n  --shadow-raw-y-pressed:      2px;\n  --shadow-raw-blur-pressed:   6px;\n  --shadow-raw-spread-pressed: 0;\n\n  /* Composed shadows — color is inlined as rgba(0, 0, 0, opacity) per project\n     pattern. No Color variable for shadow. Opacity primitive comes from\n     opacity.md. */\n  --shadow-default: 0 6px 24px 0 rgb(0 0 0 / var(--opacity-10));\n  --shadow-hover:   0 6px 24px 0 rgb(0 0 0 / var(--opacity-10)); /* identical to default */\n  --shadow-pressed: 0 2px 6px  0 rgb(0 0 0 / var(--opacity-10));\n}\n```\n\nConcrete-value form (for visual reference):\n\n```css\n:root {\n  --shadow-default: 0 6px 24px 0 rgba(0, 0, 0, 0.10);\n  --shadow-hover:   0 6px 24px 0 rgba(0, 0, 0, 0.10);\n  --shadow-pressed: 0 2px 6px  0 rgba(0, 0, 0, 0.10);\n}\n```\n\nConsumer usage:\n\n```css\n.card {\n  box-shadow: var(--shadow-default);\n}\n.card:hover {\n  box-shadow: var(--shadow-hover);\n  transform: translateY(-2px); /* the actual "lift" cue, since shadow is identical */\n}\n.card:active {\n  box-shadow: var(--shadow-pressed);\n}\n```\n\n## Design decisions\n\n1. **`default ≡ hover` collision preserved verbatim** — `shadow/elevation/default` and `shadow/elevation/hover` have identical X / Y / Blur / Spread / color. Hover lift on a consumer element comes from a Y-translate (e.g. `transform: translateY(-2px)`) applied at the consumer\'s `:hover` state, NOT from a shadow change. The `--shadow-hover` token is retained as a separate semantic so any future stakeholder differentiation only requires changing the token, not every consumer.\n2. **State-keyed atom primitives** — primitives ship one per `(dimension × state)` tuple even when values duplicate (e.g. `--shadow-raw-x-{default,hover,pressed}` are all `0`). Matches the project\'s existing `_tokens.scss` naming and lets each Effect Style bind to its own primitives without aliasing across states.\n3. **Shadow color composed inline, no rgba primitives** — `box-shadow` consumers compose `rgba(0, 0, 0, var(--opacity-10))` inline at the call site, where `--opacity-10` is supplied by `opacity.md`. The legacy `Color/Shadow/primary` Color variable (= opaque hex `#e3e3e2`) is not carried forward; visually equivalent at ~10% black opacity on white. Project pattern locked across `colors.md`, `opacity.md`, and this spec.\n4. **Legacy "Shadow (TBC)" frame title is informational only** — the legacy spec frame heading reads "Shadow (TBC)" (original designer marked it as To-Be-Confirmed) and the HEX value column on the rendered spec frame is empty. The Variable values themselves (X / Y / Blur / Spread / color) are well-defined and the Figma Effect renders correctly on the example squares; only the spec frame\'s documentation column was unfinished.\n\n## Cross-spec dependencies\n\n- Depends on `opacity.md` for `--opacity-10` (the opacity scalar used in the inline rgba composition).\n- Independent of `colors.md` — does NOT consume any color primitive or any color semantic alias.\n'})))()}function p(e,t,n){let r=t.findIndex(e=>e.trim()===n);return r===-1?null:e[r]}function m(e,t){let n=p(e,t,`CSS custom property`),r=p(e,t,`Value (X / Y / Blur / Spread / color)`),s=p(e,t,`Notes`),u=p(e,t,`Figma name (Effect Style)`),d=i(n),f=d?l(d):null;return`
    <div class="shadow-elevation__card">
      <div class="shadow-elevation__demo" style="box-shadow: var(${d});"></div>
      <div class="shadow-elevation__token">${c(n||u)}</div>
      <div class="shadow-elevation__value">${a(f||o(r)||`—`)}</div>
      ${s?`<div class="shadow-elevation__notes">${c(s)}</div>`:``}
    </div>
  `}function h(e,t){let n=p(e,t,`CSS custom property`),r=p(e,t,`Value`),s=p(e,t,`Figma name`),u=i(n),d=u?l(u):null,f=d&&d!==``?d:o(r)||`0`;return`
    <div class="shadow-atoms__chip">
      <div class="shadow-atoms__token">${c(n||s)}</div>
      <div class="shadow-atoms__value">${a(f)}</div>
    </div>
  `}function g({subsection:e,table:t}){return e&&/^Composite shadow Effects/i.test(e)?`
      ${v}
      <div class="shadow-elevation">
        ${t.rows.map(e=>m(e,t.headers)).join(``)}
      </div>
    `:e&&/^Atom primitives/i.test(e)?`
      ${v}
      <div class="shadow-atoms">
        ${t.rows.map(e=>h(e,t.headers)).join(``)}
      </div>
    `:null}var _,v,y,b,x;function S(){return(S=e((()=>{r(),t(),f(),_=s(d),v=`
<style>
.shadow-elevation {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  padding: 24px 16px;
  background: var(--color-canvas-subtle, #f6f6f4);
  border-radius: 8px;
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
}
.shadow-elevation__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.shadow-elevation__demo {
  width: 160px;
  height: 96px;
  background: var(--color-canvas-default, #fff);
  border-radius: 8px;
}
.shadow-elevation__token {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #181818);
}
.shadow-elevation__value {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--color-text-secondary, rgba(0,0,0,0.60));
  word-break: break-word;
}
.shadow-elevation__notes {
  font-size: 11px;
  color: var(--color-text-secondary, rgba(0,0,0,0.55));
  line-height: 1.4;
  max-width: 240px;
}
.shadow-atoms {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}
.shadow-atoms__chip {
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  border-radius: 6px;
  padding: 8px 12px;
  background: var(--color-canvas-default, #fff);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.shadow-atoms__token {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--color-text-primary, #181818);
  font-weight: var(--font-weight-semibold, 600);
}
.shadow-atoms__value {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--color-text-secondary, rgba(0,0,0,0.60));
}
</style>
`,y={title:`Design System/Shadow`,parameters:{contentWidth:`fluid`,design:n(_.frontmatter.figmaNodeId||`18014:754`),docs:{description:{component:"Shadow tokens (composite Effects + state-keyed atom primitives) sourced from `storybook-lifelock/src/tokens/shadow/spec.md`. The Composite-shadow sub-table renders as elevation cards driven by the live `--shadow-{default,hover,pressed}` tokens; the atom-primitives sub-table renders as a value-chip grid."}}}},b={name:`Shadow`,render:()=>u({storySpec:_,tableHook:g})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Shadow',
  render: () => renderSpecGallery({
    storySpec: SPEC,
    tableHook
  })
}`,...b.parameters?.docs?.source}}},x=[`Default`]})))()}S();export{b as Default,x as __namedExportsOrder,y as default};