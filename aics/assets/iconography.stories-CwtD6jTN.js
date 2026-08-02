import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./_icon-catalog-CXVEZSzC.js";function a(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function o(e){let[t,n=``]=e.split(`/`);return{category:t,file:n,style:n.startsWith(`detailed-`)?`detailed`:`simple`,shortName:n.replace(/^(simple|detailed)-/,``)}}function s(e){let{category:t,style:n,shortName:r}=o(e);return[t,n,r,e].join(` `).toLowerCase()}function c(e){return e.replace(/-/g,` `)}function l({brandLabel:e=`White Label`,catalog:t}){let{ICON_NAMES:n,ICON_CATEGORIES:r,iconUrl:i}=t,l=n.length,f={};for(let e of r)f[e]=[];for(let e of n){let{category:t}=o(e);f[t]&&f[t].push(e)}let p=r.map(e=>{let t=f[e]?.length||0;return`
      <li class="icon-gallery__category-item">
        <label class="icon-gallery__category-label" data-category-row="${a(e)}">
          <input class="icon-gallery__category-check"
                 type="checkbox"
                 data-icon-category
                 value="${a(e)}">
          <span class="icon-gallery__category-name">${a(c(e))}</span>
          <span class="icon-gallery__category-count" data-category-count="${a(e)}">${t}</span>
        </label>
      </li>
    `}).join(``),m=r.map(e=>{let t=f[e]||[],n=t.map(t=>{let{style:n,shortName:r}=o(t),c=i(t);return`
          <button type="button"
                  class="icon-gallery__card"
                  data-icon-card
                  data-icon-key="${a(t)}"
                  data-icon-category="${a(e)}"
                  data-icon-search-key="${a(s(t))}"
                  title="${a(t)} — click to copy">
            <span class="icon-gallery__glyph-well" aria-hidden="true">
              <span class="icon-gallery__glyph"
                    style="--icon-source: url('${a(c)}')"></span>
            </span>
            <span class="icon-gallery__meta">
              <span class="icon-gallery__name">${a(r)}</span>
              <span class="icon-gallery__style">${a(n)}</span>
              <span class="icon-gallery__key">${a(t)}</span>
            </span>
            <span class="icon-gallery__copied" data-icon-copied hidden>
              <span class="icon-gallery__copied-label">Copied</span>
              <span class="icon-gallery__copied-key" data-icon-copied-key></span>
            </span>
          </button>
        `}).join(``);return`
      <section class="icon-gallery__section"
               data-icon-section="${a(e)}"
               aria-labelledby="icon-gallery-heading-${a(e)}">
        <header class="icon-gallery__section-head">
          <p class="icon-gallery__section-title"
             id="icon-gallery-heading-${a(e)}"
             role="heading"
             aria-level="2">
            ${a(c(e))}
          </p>
          <span class="icon-gallery__section-count"
                data-section-count="${a(e)}">${t.length} icons</span>
        </header>
        <div class="icon-gallery__grid" data-icon-grid="${a(e)}">
          ${n}
        </div>
      </section>
    `}).join(``),h=document.createElement(`div`);return h.className=`icon-gallery`,h.innerHTML=`
    <header class="icon-gallery__hero">
      <div class="icon-gallery__hero-text">
        <p class="icon-gallery__eyebrow">Design System</p>
        <p class="icon-gallery__title">${a(e)} icon catalog</p>
        <p class="icon-gallery__intro">
          Catalog key shape
          <code>&lt;category&gt;/&lt;simple|detailed&gt;-&lt;name&gt;</code>
          — e.g. <code>actions/simple-search</code>.
          Click a card to copy the full catalog key
          (e.g. <code>arrows-navigation/simple-cloud-transfers</code>).
        </p>
      </div>
      <div class="icon-gallery__hero-meta">
        <span class="icon-gallery__badge" data-icon-total>${l} icons</span>
        <a class="icon-gallery__figma"
           href="${d}"
           target="_blank"
           rel="noopener noreferrer">Web-ODS-Icons · Iconography</a>
      </div>
    </header>
    <div class="icon-gallery__layout">
      <aside class="icon-gallery__sidebar" aria-label="Icon categories">
        <p class="icon-gallery__sidebar-title">Icon categories</p>
        <ul class="icon-gallery__category-list">
          <li class="icon-gallery__category-item">
            <label class="icon-gallery__category-label is-active" data-category-row="all">
              <input class="icon-gallery__category-check"
                     type="checkbox"
                     data-icon-category-all
                     checked>
              <span class="icon-gallery__category-name">All</span>
              <span class="icon-gallery__category-count" data-category-count-all>${l}</span>
            </label>
          </li>
          ${p}
        </ul>
      </aside>
      <div class="icon-gallery__main">
        <div class="icon-gallery__toolbar">
          <label class="icon-gallery__search">
            <span class="icon-gallery__search-label">Search</span>
            <span class="icon-gallery__search-field">
              <span class="icon-gallery__search-icon" aria-hidden="true"></span>
              <input class="icon-gallery__search-input"
                     type="search"
                     data-icon-search
                     placeholder="Filter by name, category, or style…"
                     autocomplete="off"
                     spellcheck="false">
            </span>
          </label>
          <button class="icon-gallery__reset" type="button" data-icon-reset hidden>Reset</button>
          <p class="icon-gallery__tally" data-icon-tally>
            <span data-icon-shown-count>${l}</span> icons
          </p>
        </div>
        <div class="icon-gallery__chips" data-icon-chips></div>
        <p class="icon-gallery__empty" data-icon-empty hidden>No icons match that filter.</p>
        <div class="icon-gallery__sections" data-icon-sections>
          ${m}
        </div>
      </div>
    </div>
  `,u(h,{ICON_CATEGORIES:r}),h}function u(e,{ICON_CATEGORIES:t}){let n=e.querySelector(`[data-icon-search]`),r=e.querySelector(`[data-icon-reset]`),i=e.querySelector(`[data-icon-chips]`),o=e.querySelector(`[data-icon-empty]`),s=e.querySelector(`[data-icon-sections]`),l=e.querySelector(`[data-icon-shown-count]`),u=e.querySelector(`[data-icon-category-all]`),d=e.querySelector(`[data-category-row="all"]`),f=Array.from(e.querySelectorAll(`[data-icon-category]`)),p=Array.from(e.querySelectorAll(`[data-icon-section]`)),m=Array.from(e.querySelectorAll(`[data-icon-card]`)),h=new Set,g=null;function _(){let e=h.size===0;u&&(u.checked=e),d&&d.classList.toggle(`is-active`,e);for(let e of f){let t=e.closest(`[data-category-row]`),n=h.has(e.value);e.checked=n,t&&t.classList.toggle(`is-active`,n)}}function v(){if(!i)return;let e=[...h].sort((e,n)=>t.indexOf(e)-t.indexOf(n));i.innerHTML=e.map(e=>`
        <span class="icon-gallery__chip">
          <span class="icon-gallery__chip-label">Category</span>
          ${a(c(e))}
          <button type="button"
                  class="icon-gallery__chip-remove"
                  data-chip-remove="${a(e)}"
                  aria-label="Remove ${a(c(e))} filter">×</button>
        </span>
      `).join(``)}function y(){let i=(n?.value||``).trim().toLowerCase(),a=i?i.split(/\s+/):[],c=h,u=c.size===0,d=0,f=Object.fromEntries(t.map(e=>[e,0]));for(let e of m){let t=e.getAttribute(`data-icon-search-key`)||``,n=e.getAttribute(`data-icon-category`)||``,r=!0;for(let e of a)if(!t.includes(e)){r=!1;break}let i=u||c.has(n),o=r&&i;e.hidden=!o,r&&f[n]!==void 0&&(f[n]+=1),o&&(d+=1)}for(let e of p){let t=e.getAttribute(`data-icon-section`)||``;e.hidden=!((u||c.has(t))&&(f[t]||0)>0);let n=e.querySelector(`[data-section-count="${t}"]`);if(n){let e=f[t]||0;n.textContent=`${e} icon${e===1?``:`s`}`}}for(let n of t){let t=e.querySelector(`[data-category-count="${n}"]`);t&&(t.textContent=String(f[n]||0))}let g=e.querySelector(`[data-category-count-all]`);if(g){let e=t.reduce((e,t)=>e+(f[t]||0),0);g.textContent=String(e)}l&&(l.textContent=String(d)),o&&(o.hidden=d!==0),s&&(s.hidden=d===0),r&&(r.hidden=i.length===0&&c.size===0),v(),_()}let b=!1;function x(){if(b)return;b=!0;let e=typeof window<`u`&&window.requestAnimationFrame;e?e(()=>{b=!1,y()}):setTimeout(()=>{b=!1,y()},16)}u&&u.addEventListener(`change`,e=>{e.stopPropagation(),h=new Set;for(let e of f)e.checked=!1;x()});for(let e of f)e.addEventListener(`change`,t=>{t.stopPropagation(),e.checked?h.add(e.value):h.delete(e.value),h.size>0&&u&&(u.checked=!1),x()});n?.addEventListener(`input`,x),n?.addEventListener(`keydown`,e=>{e.key===`Escape`&&n.value&&(n.value=``,x(),e.stopPropagation())}),r?.addEventListener(`click`,()=>{n&&(n.value=``),h=new Set;for(let e of f)e.checked=!1;n?.focus(),x()}),i?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-chip-remove]`);if(!t)return;let n=t.getAttribute(`data-chip-remove`);n&&h.delete(n),x()});function S(e){return navigator?.clipboard?.writeText?navigator.clipboard.writeText(e).catch(()=>C(e)):Promise.resolve(C(e))}function C(e){let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();try{document.execCommand(`copy`)}finally{document.body.removeChild(t)}}for(let e of m)e.addEventListener(`click`,async()=>{let t=e.getAttribute(`data-icon-key`)||``;if(!t||!t.includes(`/`))return;try{await S(t)}catch{}let n=e.querySelector(`[data-icon-copied]`),r=e.querySelector(`[data-icon-copied-key]`);r&&(r.textContent=t),e.classList.add(`is-copied`),n&&(n.hidden=!1),g&&clearTimeout(g),g=setTimeout(()=>{e.classList.remove(`is-copied`),n&&(n.hidden=!0)},1600)});y()}var d;function f(){return(f=e((()=>{d=`https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-2583&m=dev`})))()}var p,m,h;function g(){return(g=e((()=>{f(),t(),p={title:`Design System/Iconography`,parameters:{layout:`padded`,docs:{description:{component:"White Label icon catalog browser — multi-select categories, search, click-to-copy catalog key. Shared renderer from `@aics/storybook-core`; SVGs from this package’s `assets/icons/`."}}}},m={name:`Iconography`,render:()=>l({brandLabel:`White Label`,catalog:{ICON_NAMES:n,ICON_CATEGORIES:i,iconUrl:r}})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Iconography',
  render: () => renderIconGallery({
    brandLabel: 'White Label',
    catalog: {
      ICON_NAMES,
      ICON_CATEGORIES,
      iconUrl
    }
  })
}`,...m.parameters?.docs?.source}}},h=[`Default`]})))()}g();export{m as Default,h as __namedExportsOrder,p as default};