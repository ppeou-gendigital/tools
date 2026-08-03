import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{l as t,n,t as r,u as i}from"./pretty-source-BJE7KmyR.js";var a;function o(){return(o=e((()=>{a=`{{!--
  Molecules/Award Wrapper — BEM root .c-award-wrapper
  Figma: Web-ODS Shared Library 3762:246 (Image ratio axis).

  Axes:
    imageRatio  1:1 | 16:9 | 9:16  →  .c-award-wrapper--ratio-{1-1|16-9|9-16}

  Slots:
    src + alt  → native <img> filling the box
    (no src)   → documentation placeholder (not shipped to users)
--}}
<div
  class="c-award-wrapper c-award-wrapper--ratio-{{#if (eq imageRatio "16:9")}}16-9{{else}}{{#if (eq imageRatio "9:16")}}9-16{{else}}1-1{{/if}}{{/if}}{{#if className}} {{className}}{{/if}}"
>
  {{#if src}}
    <img
      class="c-award-wrapper__image"
      src="{{src}}"
      alt="{{#if alt}}{{alt}}{{/if}}"
    />
  {{else}}
    <div class="c-award-wrapper__placeholder" aria-hidden="true">
      <span class="c-award-wrapper__placeholder-label">
        Placeholder award<br />logo {{#if imageRatio}}{{imageRatio}}{{else}}1:1{{/if}}
      </span>
    </div>
  {{/if}}
</div>
`})))()}function s(e){return c({imageRatio:e.imageRatio||`1:1`,src:e.src||``,alt:e.alt??``,className:e.className||``})}var c,l,u,d,f,p,m;function h(){return(h=e((()=>{i(),n(),o(),c=t.default.compile(a),l=[`1:1`,`16:9`,`9:16`],u=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3721-3904&m=dev`,d={title:`Molecules/Award Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Fixed-aspect award logo frame (Image ratio 1:1 / 16:9 / 9:16). [Figma](${u}).`}}},argTypes:{imageRatio:{control:{type:`inline-radio`},options:l,name:`Image ratio`,description:`Locks the fixed box size: 88×88, 246×138, or 90×160.`},src:{control:`text`,name:`src`,description:`Award logo URL. Empty → documentation placeholder.`},alt:{control:`text`,name:`alt`,description:`Descriptive alt naming the award, or empty when named nearby.`},className:{control:`text`,name:`className`,description:`Optional class on the outer box only.`}},args:{imageRatio:`1:1`,src:``,alt:``,className:``}},f={name:`Demo`,render:e=>s(e),parameters:r(s({imageRatio:`1:1`,src:``,alt:``,className:``}),{unit:`award-wrapper`})},p={name:`AllRatios`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${l.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Image ratio=${e}
        </figcaption>
        ${s({imageRatio:e,src:``,alt:``})}
      </figure>`).join(`
`)}
      </div>`},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    imageRatio: '1:1',
    src: '',
    alt: '',
    className: ''
  }), {
    unit: 'award-wrapper'
  })
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'AllRatios',
  render: () => {
    const cards = RATIO_OPTIONS.map(imageRatio => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Image ratio=\${imageRatio}
        </figcaption>
        \${render({
      imageRatio,
      src: '',
      alt: ''
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...p.parameters?.docs?.source}}},m=[`Demo`,`AllRatios`]})))()}h();export{p as AllRatios,f as Demo,m as __namedExportsOrder,d as default};