import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,S as n,Z as r,gn as i,hn as a,n as o,t as s,x as c}from"./pretty-source-CA3IhMc4.js";import{n as l,t as u}from"./sample-image-Dtm7bd3B.js";function d(e){let t=(e.type||`image`).toLowerCase();return f({type:t,width:e.width||`full`,objectFit:e.objectFit||`cover`,aspectRatio:e.aspectRatio||``,src:t===`youtube`?``:e.src??``,alt:e.alt??``,poster:e.poster||``,controls:e.controls!==!1,autoPlay:!!e.autoPlay,muted:!!e.muted,loop:!!e.loop,url:t===`youtube`?e.url||e.videoId||_:``,videoId:t===`youtube`&&e.videoId||``,title:e.title||`YouTube video`,allowFullScreen:e.allowFullScreen!==!1,className:e.className||``})}var f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{t(),o(),c(),a(),l(),f=r.default.compile(i),p=[`image`,`video`,`youtube`],m=[`full`,`half`],h=[`cover`,`contain`,`fill`,`none`,`scale-down`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3412-17329&m=dev`,_=`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,v={type:`image`,width:`full`,objectFit:`cover`,aspectRatio:``,src:u,alt:`Sample editorial still`,poster:``,controls:!0,autoPlay:!1,muted:!1,loop:!1,url:``,videoId:``,title:`Sample YouTube video`,allowFullScreen:!0,className:``},y={title:`Molecules/Media`,tags:[`autodocs`],parameters:{docs:{description:{component:`16:9 media viewport (Image / Video / YouTube). Width full or half from md. Distinct from Image Wrapper (flexible Ratio × Fit). [Figma](${g}).`}}},argTypes:{type:{control:{type:`inline-radio`},options:p,name:`Type`},width:{control:{type:`inline-radio`},options:m,name:`Width`},objectFit:{control:{type:`select`},options:h,name:`objectFit`},aspectRatio:{control:`text`,name:`aspectRatio`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},poster:{control:`text`,name:`poster`},controls:{control:`boolean`,name:`controls`},autoPlay:{control:`boolean`,name:`autoPlay`},muted:{control:`boolean`,name:`muted`},loop:{control:`boolean`,name:`loop`},url:{control:`text`,name:`url (YouTube)`},videoId:{control:`text`,name:`videoId`},title:{control:`text`,name:`title (iframe)`},allowFullScreen:{control:`boolean`,name:`allowFullScreen`},className:{control:`text`,name:`className`}},args:v},b={name:`Demo`,render:e=>d(e),parameters:s(d(v),{unit:`media`,scss:n})},x={name:`AllTypes`,render:()=>`<div style="display:flex;flex-direction:column;gap:24px;padding:16px;">${[{type:`image`,src:u,alt:`Sample`,label:`Type=image`},{type:`video`,src:``,label:`Type=video (placeholder)`},{type:`youtube`,url:_,title:`Sample YouTube`,label:`Type=youtube`}].map(e=>`
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
        ${d({...v,type:`image`,width:e,src:u})}
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