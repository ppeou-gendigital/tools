import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,gt as r,ht as i,n as a,t as o}from"./pretty-source-C_TZ5wEY.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";import{n as l,o as u}from"./table-cell-story-helpers-CpVPwPPQ.js";function d(e={}){return{type:`body`,align:`left`,background:!0,borders:!0,topBorder:!0,rightBorder:!0,bottomBorder:!0,leftBorder:!0,leadingIcon:!1,trailingIcon:!1,leadingIconName:l,trailingIconName:l,label:`Cell text`,contentHtml:``,width:`220px`,className:``,...e}}function f(){return[{cells:[d({type:`header`,label:`Header`,leadingIcon:!1}),d({type:`header`,label:`Header`,leadingIcon:!1}),d({type:`header`,label:`Header`,leadingIcon:!1})]},{cells:[d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0})]},{cells:[d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0})]},{cells:[d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0})]}]}function p(e={}){return{rows:e.rows&&e.rows.length?e.rows:f(),slotHtml:e.slotHtml||``,className:e.className||``}}function m(e,t){return t(p(e))}var h;function g(){return(g=e((()=>{u(),h={rows:f(),slotHtml:``,className:``}})))()}var _,v,y,b,x;function S(){return(S=e((()=>{t(),i(),a(),s(),g(),_=n.default.compile(r),v={title:`Patterns/Table block`,tags:[`autodocs`,`shared-library`],render:e=>m(e,_),args:h,argTypes:{rows:{control:`object`,name:`Rows`,description:"Array of `{ cells: [table-cell args] }` rows."}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Table block · content slot — 5914:53`,`5914:53`],[`Spec — 6032:729`,`6032:729`]]),docs:{description:{component:"Composed table from [Table block · content slot](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5914-53&m=dev) (Spec [`6032:729`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6032-729&m=dev)). Stacks `table-cell` with `-1px` border collapse. Deprecated boards are out of scope."}}}},y={parameters:o(m(h,_),{unit:`table-block`,extra:{design:c(`5914:53`)}})},b={parameters:{contentWidth:`fluid`,design:c(`5914:53`),docs:{description:{story:`Canonical demo (header + 3 body × 3 cols) plus a compact alignment band.`}}},render:()=>{let e={rows:[{cells:[d({type:`header`,align:`left`,label:`Left`,leadingIcon:!1}),d({type:`header`,align:`center`,label:`Center`,leadingIcon:!1}),d({type:`header`,align:`right`,label:`Right`,leadingIcon:!1})]},{cells:[d({type:`body`,align:`left`,leadingIcon:!0,label:`Left body`}),d({type:`body`,align:`center`,leadingIcon:!0,label:`Center body`}),d({type:`body`,align:`right`,leadingIcon:!0,label:`Right body`})]}]};return`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Default demo (matches Figma 5914:53)</h3>
        <div class="sbd-doc__stack">
          <div class="sbd-doc__stack-item">
            <div class="sbd-doc__stack-item-canvas">${m({rows:f()},_)}</div>
          </div>
        </div>
        <h3 class="sbd-doc__group-title">Header / body · Align band</h3>
        <div class="sbd-doc__stack">
          <div class="sbd-doc__stack-item">
            <div class="sbd-doc__stack-item-canvas">${m(e,_)}</div>
          </div>
        </div>
      </div>
    `}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTableBlockArgs(defaultTableBlockArgs, compiled), {
    unit: 'table-block',
    extra: {
      design: figmaDesign('5914:53')
    }
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    contentWidth: 'fluid',
    design: figmaDesign('5914:53'),
    docs: {
      description: {
        story: 'Canonical demo (header + 3 body × 3 cols) plus a compact alignment band.'
      }
    }
  },
  render: () => {
    const alignBand = {
      rows: [{
        cells: [cell({
          type: 'header',
          align: 'left',
          label: 'Left',
          leadingIcon: false
        }), cell({
          type: 'header',
          align: 'center',
          label: 'Center',
          leadingIcon: false
        }), cell({
          type: 'header',
          align: 'right',
          label: 'Right',
          leadingIcon: false
        })]
      }, {
        cells: [cell({
          type: 'body',
          align: 'left',
          leadingIcon: true,
          label: 'Left body'
        }), cell({
          type: 'body',
          align: 'center',
          leadingIcon: true,
          label: 'Center body'
        }), cell({
          type: 'body',
          align: 'right',
          leadingIcon: true,
          label: 'Right body'
        })]
      }]
    };
    return \`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Default demo (matches Figma 5914:53)</h3>
        <div class="sbd-doc__stack">
          <div class="sbd-doc__stack-item">
            <div class="sbd-doc__stack-item-canvas">\${compileTableBlockArgs({
      rows: defaultDemoRows()
    }, compiled)}</div>
          </div>
        </div>
        <h3 class="sbd-doc__group-title">Header / body · Align band</h3>
        <div class="sbd-doc__stack">
          <div class="sbd-doc__stack-item">
            <div class="sbd-doc__stack-item-canvas">\${compileTableBlockArgs(alignBand, compiled)}</div>
          </div>
        </div>
      </div>
    \`;
  }
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllStyles`]})))()}S();export{b as AllStyles,y as Demo,x as __namedExportsOrder,v as default};