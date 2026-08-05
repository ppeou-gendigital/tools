import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,c as n,d as r,i,l as a,n as o,o as s,r as c,s as l,u}from"./_spec-md-wF1y7HFP.js";var d;function f(){return(f=e((()=>{d='---\ntype: token\nname: spacing\nfigmaFileKey: Nshd9ukxIzpeUnzOXiWxUP\nfigmaNodeId: 18014:755\nstatus: published\nlastSyncedAt: ""\nlastSyncedFigmaFingerprint: ""\nlastSyncedSpecFingerprint: ""\nbrand: LifeLock\n---\n\n# Spacing tokens\n\n## Figma source\n\n- Canonical Foundations table (Web-ODS-Theme — Spacing): https://www.figma.com/design/Nshd9ukxIzpeUnzOXiWxUP/Web-ODS-Theme?node-id=18014-755&m=dev\n\n## Summary\n\nThe spacing scale is a primitive ladder rendered as Figma `Number` Variables and CSS custom properties under `--space-N` — **index-keyed**, mirrored verbatim in the sibling [`_spacing.scss`](./_spacing.scss). Primitives-only by design — components consume `--space-N` directly, no semantic alias layer.\n\n## Layered model\n\n```mermaid\ngraph LR\n  primAtoms["Primitive (space/0..space/20)"]\n  cssAliases["CSS --space-0 .. --space-20 (consumed directly by components)"]\n  primAtoms --> cssAliases\n```\n\nNo semantic role layer (`inset/*`, `stack/*`, `inline/*`, `block/*`, `content/*`). If a concrete component need emerges later, a separate spec adds the role split.\n\n## Token values\n\n> **Figma type primer.** All values below are stored as Figma `Number` Variables. Px-valued tokens carry a length, but Figma has no native length-with-unit type — the consumer (CSS / Figma constraint binding) treats the `Number` as px.\n\nThe 17-step ladder ships at the indices that match the project\'s full 0–20 scale; the four reserved indices (`4 = 12px`, `6 = 20px`, `10 = 44px`, `20 = 120px`) are project-wide carry-overs (see [Reserved indices](#reserved-indices) sub-section below) and are not part of the canonical design ladder authored here.\n\n| Figma name | Figma type | Value | CSS custom property | Notes |\n|---|---|---|---|---|\n| `space/0` | Number | `0` | `--space-0` | unit-less zero in length contexts |\n| `space/1` | Number | `2px` | `--space-1` | off-4-px-grid; reserved for hairline / 1-step nudges |\n| `space/2` | Number | `4px` | `--space-2` | — |\n| `space/3` | Number | `8px` | `--space-3` | — |\n| `space/5` | Number | `16px` | `--space-5` | — |\n| `space/7` | Number | `24px` | `--space-7` | — |\n| `space/8` | Number | `32px` | `--space-8` | — |\n| `space/9` | Number | `40px` | `--space-9` | — |\n| `space/11` | Number | `48px` | `--space-11` | — |\n| `space/12` | Number | `56px` | `--space-12` | — |\n| `space/13` | Number | `64px` | `--space-13` | — |\n| `space/14` | Number | `72px` | `--space-14` | — |\n| `space/15` | Number | `80px` | `--space-15` | — |\n| `space/16` | Number | `88px` | `--space-16` | — |\n| `space/17` | Number | `96px` | `--space-17` | — |\n| `space/18` | Number | `104px` | `--space-18` | — |\n| `space/19` | Number | `112px` | `--space-19` | — |\n\n### Reserved indices\n\nFour indices ship at the project\'s 0–20 scale to keep `--space-N` index-keyed without gaps that consumers would have to remember to skip. They are **carry-overs**, not part of the canonical 17-step ladder this spec authors — components SHOULD prefer one of the canonical primitives above when a value choice is open. They are first-class CSS custom properties in `_spacing.scss`, surface in the Storybook spacing gallery, and are valid `tokensConsumed:` references for components.\n\n| Figma name | Figma type | Value | CSS custom property | Notes |\n|---|---|---|---|---|\n| `space/4` | Number | `12px` | `--space-4` | reserved; project-wide carry-over |\n| `space/6` | Number | `20px` | `--space-6` | reserved; project-wide carry-over (consumed by `accordion`) |\n| `space/10` | Number | `44px` | `--space-10` | reserved; project-wide carry-over |\n| `space/20` | Number | `120px` | `--space-20` | reserved; project-wide carry-over |\n\n**Final counts:**\n\n- 17 canonical atom Number primitives (`space/0` … `space/19`, with reserved gaps)\n- 4 reserved atom Number primitives (`space/4`, `space/6`, `space/10`, `space/20`)\n- 21 CSS custom properties total (`--space-0` … `--space-20`, the union of both sets)\n- 0 semantic aliases (primitives-only)\n\n## CSS implementation pattern\n\n```css\n:root {\n  --space-0:  0;\n  --space-1:  2px;\n  --space-2:  4px;\n  --space-3:  8px;\n  --space-5:  16px;\n  --space-7:  24px;\n  --space-8:  32px;\n  --space-9:  40px;\n  --space-11: 48px;\n  --space-12: 56px;\n  --space-13: 64px;\n  --space-14: 72px;\n  --space-15: 80px;\n  --space-16: 88px;\n  --space-17: 96px;\n  --space-18: 104px;\n  --space-19: 112px;\n\n  /* Reserved indices carried forward for project-wide compatibility. */\n  --space-4:  12px;\n  --space-6:  20px;\n  --space-10: 44px;\n  --space-20: 120px;\n}\n```\n\nThe atom primitives carry their `px` unit in CSS (`--space-1: 2px`, … `--space-20: 120px`); `--space-0` stays unit-less since CSS allows unit-less zero in length contexts. Canonical source on disk: `themes/default/_spacing.scss` (re-exported by `src/tokens/spacing/_spacing.scss`).\n\n## Design decisions\n\n1. **Index-keyed scale matches the project\'s flat naming convention** — `_tokens.scss` ships `--space-0 … --space-20` (21 indices); this spec authors 17 of them as the canonical design ladder and the remaining 4 (`--space-4`, `--space-6`, `--space-10`, `--space-20`) as a segregated `### Reserved indices` sub-section (see design decision 4).\n2. **17-step ladder verbatim from legacy values** — `0, 2, 4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112`. The low end (`2`, `4`) and the upper-mid steps (`88`, `104`) are intentionally part of the ladder; the scale was not re-quantized to a strict 4 px or 8 px grid.\n3. **`space/1 = 2px` off-4-px-grid is intentional** — kept for hairline borders, focus-ring offsets, and 1-step nudges that the 4 px ladder cannot express.\n4. **Reserved indices stay segregated, not hidden** — `space/4`, `space/6`, `space/10`, `space/20` are project-wide carry-overs (12 / 20 / 44 / 120 px respectively) that exist alongside the canonical 17-step ladder rather than as part of it. They live in their own `### Reserved indices` sub-section below the main `## Token values` table so the canonical ladder stays unambiguous, but they are first-class CSS custom properties in `_spacing.scss` and are valid `tokensConsumed:` references for components (e.g. `accordion` consumes `--space-6`). When a value choice is open, components SHOULD prefer one of the 17 canonical primitives above.\n5. **Primitives-only** — no semantic alias layer (`inset/*`, `stack/*`, `inline/*`, `block/*`, `content/*`). Component consumers reference `--space-N` directly.\n'})))()}function p(e,t,n){let r=t.findIndex(e=>e.trim()===n);return r===-1?null:e[r]}function m(e,t){let r=p(e,t,`CSS custom property`),o=p(e,t,`Value`),l=p(e,t,`Figma name`),u=n(r),d=u?c(u):null,f=d&&d!==``?d:a(o)||`0`,m=f===`0`||f===`0px`;return`
    <div class="spacing-row">
      <div class="spacing-row__token">${s(r||l)}</div>
      <div class="spacing-row__value">${i(f)}</div>
      ${m?`<div class="spacing-row__bar--zero" title="0 — unit-less zero"></div>`:`<div class="spacing-row__bar" style="width: ${f};"></div>`}
    </div>
  `}function h({section:e,table:t}){return e===`Token values`?`
      ${_}
      <div class="spacing-list">
        ${t.rows.map(e=>m(e,t.headers)).join(``)}
      </div>
    `:null}var g,_,v,y,b;function x(){return(x=e((()=>{t(),r(),f(),g=o(d),_=`
<style>
.spacing-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  border-radius: 8px;
  background: var(--color-canvas-default, #fff);
  overflow: hidden;
}
.spacing-row {
  display: grid;
  grid-template-columns: 220px 90px 1fr;
  gap: 16px;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border-subtle, rgba(0,0,0,0.06));
}
.spacing-row:last-child { border-bottom: none; }
.spacing-row__token {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #181818);
}
.spacing-row__value {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--color-text-secondary, rgba(0,0,0,0.60));
  font-variant-numeric: tabular-nums;
}
.spacing-row__bar {
  height: 24px;
  background: var(--color-text-brand, #108389);
  border-radius: 4px;
  max-width: 100%;
}
.spacing-row__bar--zero {
  height: 24px;
  background: repeating-linear-gradient(45deg,
    var(--color-bg-subtle, rgba(0,0,0,0.06)) 0 4px,
    transparent 4px 8px);
  width: 24px;
  border: 1px dashed var(--color-border-subtle, rgba(0,0,0,0.20));
  border-radius: 4px;
}
</style>
`,v={title:`Design System/Spacing`,parameters:{contentWidth:`fluid`,design:u(g.frontmatter.figmaNodeId||`18014:755`),docs:{description:{component:"Spacing primitive ladder sourced from `storybook-lifelock/src/tokens/spacing/spec.md`. The `## Token values` table renders as a bar gallery scaled to each token's live px value; reserved indices and design decisions render from the spec verbatim."}}}},y={name:`Spacing`,render:()=>l({storySpec:g,tableHook:h})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Spacing',
  render: () => renderSpecGallery({
    storySpec: SPEC,
    tableHook
  })
}`,...y.parameters?.docs?.source}}},b=[`Default`]})))()}x();export{y as Default,b as __namedExportsOrder,v as default};