import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,bn as r,n as i,t as a,yn as o}from"./pretty-source-C_TZ5wEY.js";function s(e,t,n,r){return Math.max(t,Math.min(n,Number.isFinite(e)?Math.round(e):r))}function c(e){let t=s(e.count,2,8,5),n=s(e.current,1,t,1),r=Array.from({length:t},(e,t)=>({active:t+1===n}));return{...e,count:t,current:n,dots:r}}var l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),i(),o(),l=n.default.compile(r),u=[`light`,`dark`],d=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1278-1668&m=dev`,f={count:5,current:3,appearance:`light`,accessibleLabel:``},p={title:`Molecules/Controls/Pagination dots`,tags:[`autodocs`],parameters:{docs:{description:{component:`Pagination expanding dots — presentational page indicator. [Figma](${d}).`}}},argTypes:{count:{control:{type:`number`,min:2,max:8,step:1},name:`Count`},current:{control:{type:`number`,min:1,step:1},name:`Current`},appearance:{control:{type:`inline-radio`},options:u,name:`Appearance`},accessibleLabel:{control:`text`,name:`Accessible label`}},args:f,render:e=>l(c(e))},m={name:`Demo`,parameters:a(l(c(f)),{unit:`pagination-dots`})},h={name:`AllStyles`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:20px;">
        ${u.flatMap(e=>[2,5,8].map(t=>{let n=l(c({count:t,current:Math.ceil(t/2),appearance:e}));return`
          <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
            <div style="${e===`dark`?`background:var(--color-text-primary,#111);padding:16px;border-radius:8px;`:`padding:16px;`}">${n}</div>
            <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · count=${t}</figcaption>
          </figure>
        `})).join(``)}
      </div>
    `},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'pagination-dots'
  })
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g=[`Demo`,`AllStyles`]})))()}_();export{h as AllStyles,m as Demo,g as __namedExportsOrder,p as default};