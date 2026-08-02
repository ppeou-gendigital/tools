import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n,n as r,o as i,r as a,t as o}from"./pretty-source-DwSPc3lY.js";var s;function c(){return(c=e((()=>{s=`/**
 * Components/PaginationDots — horizontal row of small dots with one
 * expanding active pill. Presentational only.
 *
 * Mirrors Web-ODS Shared Library master \`1278:1668\` + the light/dark
 * preview composition \`1278:1877\` under the LifeLock mode pick.
 *
 * Inline-axis sizing uses logical properties so the row reads natively
 * under \`dir="rtl"\`.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 */

.c-pagination-dots {
  --c-pagination-dots-size:        8px;
  --c-pagination-dots-active-w:    24px;
  --c-pagination-dots-gap:         var(--space-3);

  --c-pagination-dots-inactive:    var(--color-border-subtle);
  --c-pagination-dots-active:      var(--color-text-primary);

  display: inline-flex;
  align-items: center;
}

.c-pagination-dots__list {
  display: inline-flex;
  align-items: center;
  gap: var(--c-pagination-dots-gap);
  list-style: none;
  margin: 0;
  padding: 0;
}

.c-pagination-dots__dot {
  display: inline-block;
  inline-size: var(--c-pagination-dots-size);
  block-size:  var(--c-pagination-dots-size);
  background-color: var(--c-pagination-dots-inactive);
  border-radius: var(--border-radius-pill);
  transition: inline-size 180ms ease, background-color 180ms ease;
}

.c-pagination-dots__dot--active {
  inline-size: var(--c-pagination-dots-active-w);
  background-color: var(--c-pagination-dots-active);
}

/* --- Dark appearance ----------------------------------------- */

/* Inactive dots paint \`--color-text-inverse\` at 40 % opacity; the
   active pill paints the surface (\`--color-bg-default\`) so it reads
   on a dark backdrop. See spec.md § "Notes & open questions" for the
   token-substitution rationale. */
.c-pagination-dots--dark {
  --c-pagination-dots-inactive:    color-mix(in srgb, var(--color-text-inverse) 40%, transparent);
  --c-pagination-dots-active:      var(--color-bg-default);
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-pagination-dots__dot {
    transition: none;
  }
}
`})))()}function l(e,t,n,r){return Math.max(t,Math.min(n,Number.isFinite(e)?Math.round(e):r))}function u(e){let t=l(e.count,2,8,5),n=l(e.current,1,t,1),r=Array.from({length:t},(e,t)=>({active:t+1===n}));return{...e,count:t,current:n,dots:r}}var d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),r(),c(),t(),d=a.default.compile(i),f=[`light`,`dark`],p=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1278-1668&m=dev`,m={count:5,current:3,appearance:`light`,accessibleLabel:``},h={title:`Molecules/Controls/Pagination dots`,tags:[`autodocs`],parameters:{docs:{description:{component:`Pagination expanding dots. Inherited from core. [Figma](${p}).`}}},argTypes:{count:{control:{type:`number`,min:2,max:8,step:1},name:`Count`},current:{control:{type:`number`,min:1,step:1},name:`Current`},appearance:{control:{type:`inline-radio`},options:f,name:`Appearance`},accessibleLabel:{control:`text`,name:`Accessible label`}},args:m,render:e=>d(u(e))},g={name:`Demo`,parameters:o(d(u(m)),{scss:s})},_={name:`AllStyles`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:20px;">
        ${f.flatMap(e=>[2,5,8].map(t=>{let n=d(u({count:t,current:Math.ceil(t/2),appearance:e}));return`
          <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
            <div style="${e===`dark`?`background:var(--color-text-primary,#111);padding:16px;border-radius:8px;`:`padding:16px;`}">${n}</div>
            <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · count=${t}</figcaption>
          </figure>
        `})).join(``)}
      </div>
    `},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    scss: scssSource
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const cards = APPEARANCE_OPTIONS.flatMap(appearance => [2, 5, 8].map(count => {
      const html = compiled(buildArgs({
        count,
        current: Math.ceil(count / 2),
        appearance
      }));
      const bg = appearance === 'dark' ? 'background:var(--color-text-primary,#111);padding:16px;border-radius:8px;' : 'padding:16px;';
      return \`
          <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
            <div style="\${bg}">\${html}</div>
            <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">\${appearance} · count=\${count}</figcaption>
          </figure>
        \`;
    }));
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:20px;">
        \${cards.join('')}
      </div>
    \`;
  }
}`,..._.parameters?.docs?.source}}},v=[`Demo`,`AllStyles`]})))()}y();export{_ as AllStyles,g as Demo,v as __namedExportsOrder,h as default};