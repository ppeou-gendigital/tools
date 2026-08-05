import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-DD6QebcQ.js";function r(e){return typeof document>`u`?``:getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(e){return(n.tokens||[]).some(t=>t?.name===e)}function o(e){return a(e)?i(r(e)||`—`):`—`}function s(e){return`
    <tr>
      <td class="grid-table__bp">${i(e)}</td>
      <td class="grid-table__val">${o(`--breakpoint-${e}`)}</td>
      <td class="grid-table__val">${o(`--grid-content-${e}`)}</td>
      <td class="grid-table__val">${o(`--grid-columns-${e}`)}</td>
      <td class="grid-table__val">${o(`--grid-gutter-${e}`)}</td>
      <td class="grid-table__val">${o(`--grid-margin-${e}`)}</td>
      <td class="grid-table__val">${o(`--grid-column-width-${e}`)}</td>
    </tr>`}function c(e={}){let t=e.brandLabel||`White Label`,n=o(`--grid-max-width`);return`
${u}
<section class="grid-gallery">
  <p class="grid-gallery__intro">
    <strong>${i(t)} grid &amp; breakpoints</strong> — SM / MD / LG / XL
    from Web-ODS-Theme <code>18086:2008</code>
    (<code>themes/contract.yaml</code>). Values from this package’s
    <code>themes/default/_grid.scss</code>.
    <code>--grid-max-width</code> = ${n}.
  </p>
  <table class="grid-table">
    <thead>
      <tr>
        <th>Breakpoint</th>
        <th>Width viewport</th>
        <th>Width content</th>
        <th>Columns</th>
        <th>Gutter</th>
        <th>Margin (outer)</th>
        <th>Column width</th>
      </tr>
    </thead>
    <tbody>
      ${l.map(s).join(`
`)}
    </tbody>
  </table>
</section>`}var l,u;function d(){return(d=e((()=>{t(),l=[`sm`,`md`,`lg`,`xl`],u=`
<style>
.grid-gallery { padding: 24px; color: var(--color-text-primary, #1a1a1a); background: var(--color-bg-subtle, #f8f8f7); }
.grid-gallery__intro { margin: 0 0 24px; max-width: 72ch; line-height: 1.5; }
.grid-gallery__intro code { font-size: 0.9em; }
.grid-table {
  width: 100%;
  border-collapse: collapse;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}
.grid-table th,
.grid-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.grid-table th {
  background: var(--color-bg-muted, #f0f0ef);
  font-weight: 600;
  color: #181818;
}
.grid-table tr:last-child td { border-bottom: none; }
.grid-table__bp { font-weight: 700; text-transform: uppercase; }
.grid-table__val { font-variant-numeric: tabular-nums; color: rgba(0,0,0,0.75); }
</style>
`})))()}var f,p,m;function h(){return(h=e((()=>{d(),f={title:`Design System/Grid`,parameters:{docs:{description:{component:"Norton grid & breakpoints gallery. Shared renderer from `@aics/storybook-core`; values from `themes/default/_grid.scss`."}}}},p={name:`Grid`,render:()=>c({brandLabel:`Norton`})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Grid',
  render: () => renderGridGallery({
    brandLabel: 'Norton'
  })
}`,...p.parameters?.docs?.source}}},m=[`Default`]})))()}h();export{p as Default,m as __namedExportsOrder,f as default};