import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{St as t,i as n,n as r,r as i,t as a,xt as o}from"./pretty-source-CS7MQ53Z.js";import{n as s,t as c}from"./sample-image-CH99-D1x.js";var l;function u(){return(u=e((()=>{l=`/**
 * Media — core molecule (.c-media).
 * Figma Web-ODS Shared Library page 3412:17329 / Spec 3443:11387.
 *
 * Fixed 16:9 surface; Type swaps img / video / iframe; Width is parent-relative.
 */

.c-media {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  aspect-ratio: 16 / 9;
  background-color: var(--color-bg-subtle, #fafafc);
  border-radius: var(--border-radius-l, 8px);
  inline-size: 100%;
  max-inline-size: 100%;
}

.c-media--width-full {
  inline-size: 100%;
}

.c-media--width-half {
  inline-size: 100%;

  @media (min-width: 768px) {
    inline-size: 50%;
  }
}

.c-media__media {
  position: absolute;
  inset: 0;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  border: 0;
  object-position: center;
}

.c-media--fit-cover .c-media__media { object-fit: cover; }
.c-media--fit-contain .c-media__media { object-fit: contain; }
.c-media--fit-fill .c-media__media { object-fit: fill; }
.c-media--fit-none .c-media__media { object-fit: none; }
.c-media--fit-scale-down .c-media__media { object-fit: scale-down; }

/* iframes ignore object-fit; keep absolute fill */
.c-media--type-youtube .c-media__media {
  object-fit: unset;
}

.c-media__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.c-media__placeholder-glyph {
  display: block;
  inline-size: 18%;
  max-inline-size: 115px;
  block-size: auto;
}
`})))()}function d(e){let t=(e.type||`image`).toLowerCase();return f({type:t,width:e.width||`full`,objectFit:e.objectFit||`cover`,aspectRatio:e.aspectRatio||``,src:t===`youtube`?``:e.src??``,alt:e.alt??``,poster:e.poster||``,controls:e.controls!==!1,autoPlay:!!e.autoPlay,muted:!!e.muted,loop:!!e.loop,url:t===`youtube`?e.url||e.videoId||_:``,videoId:t===`youtube`&&e.videoId||``,title:e.title||`YouTube video`,allowFullScreen:e.allowFullScreen!==!1,className:e.className||``})}var f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{n(),r(),u(),o(),s(),f=i.default.compile(t),p=[`image`,`video`,`youtube`],m=[`full`,`half`],h=[`cover`,`contain`,`fill`,`none`,`scale-down`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3412-17329&m=dev`,_=`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,v={type:`image`,width:`full`,objectFit:`cover`,aspectRatio:``,src:c,alt:`Sample editorial still`,poster:``,controls:!0,autoPlay:!1,muted:!1,loop:!1,url:``,videoId:``,title:`Sample YouTube video`,allowFullScreen:!0,className:``},y={title:`Molecules/Media`,tags:[`autodocs`],parameters:{docs:{description:{component:`16:9 media viewport inherited from core. Glyphs from this package's assets/media/. Distinct from Image Wrapper. [Figma](${g}).`}}},argTypes:{type:{control:{type:`inline-radio`},options:p,name:`Type`},width:{control:{type:`inline-radio`},options:m,name:`Width`},objectFit:{control:{type:`select`},options:h,name:`objectFit`},aspectRatio:{control:`text`,name:`aspectRatio`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},poster:{control:`text`,name:`poster`},controls:{control:`boolean`,name:`controls`},autoPlay:{control:`boolean`,name:`autoPlay`},muted:{control:`boolean`,name:`muted`},loop:{control:`boolean`,name:`loop`},url:{control:`text`,name:`url (YouTube)`},videoId:{control:`text`,name:`videoId`},title:{control:`text`,name:`title (iframe)`},allowFullScreen:{control:`boolean`,name:`allowFullScreen`},className:{control:`text`,name:`className`}},args:v},b={name:`Demo`,render:e=>d(e),parameters:a(d(v),{unit:`media`,scss:l})},x={name:`AllTypes`,render:()=>`<div style="display:flex;flex-direction:column;gap:24px;padding:16px;">${[{type:`image`,src:c,alt:`Sample`,label:`Type=image`},{type:`video`,src:``,label:`Type=video (placeholder)`},{type:`youtube`,url:_,title:`Sample YouTube`,label:`Type=youtube`}].map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:min(100%,640px);">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          ${e.label}
        </figcaption>
        ${d({...v,...e,width:`full`})}
      </figure>`).join(`
`)}</div>`},S={name:`WidthCompare`,render:()=>`<div style="display:flex;flex-direction:column;gap:24px;padding:16px;max-inline-size:960px;">${m.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:100%;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Width=${e} · Type=image
        </figcaption>
        ${d({...v,type:`image`,width:e,src:c})}
      </figure>`).join(`
`)}</div>`},C={name:`Placeholders`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">${p.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:min(100%,480px);">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Type=${e} (no src / url)
        </figcaption>
        ${d({...v,type:e,src:``,url:``,videoId:``,alt:``})}
      </figure>`).join(`
`)}</div>`},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'media',
    scss: scssSource
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'AllTypes',
  render: () => {
    const cards = [{
      type: 'image',
      src: SAMPLE_IMAGE,
      alt: 'Sample',
      label: 'Type=image'
    }, {
      type: 'video',
      src: '',
      label: 'Type=video (placeholder)'
    }, {
      type: 'youtube',
      url: SAMPLE_YOUTUBE,
      title: 'Sample YouTube',
      label: 'Type=youtube'
    }].map(row => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:min(100%,640px);">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          \${row.label}
        </figcaption>
        \${render({
      ...defaultArgs,
      ...row,
      width: 'full'
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-direction:column;gap:24px;padding:16px;">\${cards}</div>\`;
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'WidthCompare',
  render: () => {
    const cards = WIDTH_OPTIONS.map(width => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:100%;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Width=\${width} · Type=image
        </figcaption>
        \${render({
      ...defaultArgs,
      type: 'image',
      width,
      src: SAMPLE_IMAGE
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-direction:column;gap:24px;padding:16px;max-inline-size:960px;">\${cards}</div>\`;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Placeholders',
  render: () => {
    const cards = TYPE_OPTIONS.map(type => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:min(100%,480px);">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Type=\${type} (no src / url)
        </figcaption>
        \${render({
      ...defaultArgs,
      type,
      src: '',
      url: '',
      videoId: '',
      alt: ''
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">\${cards}</div>\`;
  }
}`,...C.parameters?.docs?.source}}},w=[`Demo`,`AllTypes`,`WidthCompare`,`Placeholders`]})))()}T();export{x as AllTypes,b as Demo,C as Placeholders,S as WidthCompare,w as __namedExportsOrder,y as default};