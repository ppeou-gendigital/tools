import{n as e}from"./rolldown-runtime-DkW27tQK.js";function t(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function n(e){let[t,n=``]=e.split(`/`),r,i;return n.startsWith(`detailed-`)?(r=`detailed`,i=n.slice(9)):n.startsWith(`simple-`)?(r=`simple`,i=n.slice(7)):(r=`full-color`,i=n),{category:t,file:n,style:r,shortName:i}}function r(e){let{category:t,style:r,shortName:i}=n(e);return[t,r,i,e].join(` `).toLowerCase()}function i(e){return e.replace(/-/g,` `)}function a(e,n,r){return n===`img`?`
      <img class="icon-gallery__glyph icon-gallery__glyph--img"
           src="${t(e)}"
           alt=""
           loading="lazy"
           decoding="async">
    `:`
    <span class="icon-gallery__glyph"
          style="--icon-source: url('${t(e)}')"></span>
  `}function o({brandLabel:e=`White Label`,paintMode:o=`mask`,figmaUrl:c,figmaLinkLabel:d,title:f,introHtml:p,catalog:m}){let{ICON_NAMES:h,ICON_CATEGORIES:g,iconUrl:_}=m,v=h.length,y=o===`img`,b=c||(y?u:l),x=d||(y?`Web-ODS-Icons · Other Brands and apps`:`Web-ODS-Icons · Iconography`),S=f||(y?`${e} 3rd party marks`:`${e} icon catalog`),C=p||(y?`
          Full-color brand marks from
          <code>other-brands</code>, <code>other-apps</code>,
          <code>social</code>, and <code>payment</code>.
          Catalog key shape <code>&lt;category&gt;/&lt;name&gt;</code>
          — e.g. <code>payment/visa-large</code>.
          Prefer <code>&lt;img src="{{iconUrl 'payment/visa-large'}}"&gt;</code>
          — do <strong>not</strong> paint through <code>.c-icon</code> mask.
          Click a card to copy the catalog key.
        `:`
          Catalog key shape
          <code>&lt;category&gt;/&lt;simple|detailed&gt;-&lt;name&gt;</code>
          — e.g. <code>actions/simple-search</code>.
          Click a card to copy the full catalog key
          (e.g. <code>arrows-navigation/simple-cloud-transfers</code>).
        `),w={};for(let e of g)w[e]=[];for(let e of h){let{category:t}=n(e);w[t]&&w[t].push(e)}let T=g.map(e=>{let n=w[e]?.length||0;return`
      <li class="icon-gallery__category-item">
        <label class="icon-gallery__category-label" data-category-row="${t(e)}">
          <input class="icon-gallery__category-check"
                 type="checkbox"
                 data-icon-category
                 value="${t(e)}">
          <span class="icon-gallery__category-name">${t(i(e))}</span>
          <span class="icon-gallery__category-count" data-category-count="${t(e)}">${n}</span>
        </label>
      </li>
    `}).join(``),E=y?`marks`:`icons`,D=g.map(e=>{let s=w[e]||[],c=s.map(i=>{let{style:s,shortName:c}=n(i),l=_(i),u=s===`full-color`?``:`<span class="icon-gallery__style">${t(s)}</span>`;return`
          <button type="button"
                  class="icon-gallery__card"
                  data-icon-card
                  data-icon-key="${t(i)}"
                  data-icon-category="${t(e)}"
                  data-icon-search-key="${t(r(i))}"
                  title="${t(i)} — click to copy">
            <span class="icon-gallery__glyph-well${y?` icon-gallery__glyph-well--img`:``}" aria-hidden="true">
              ${a(l,o,c)}
            </span>
            <span class="icon-gallery__meta">
              <span class="icon-gallery__name">${t(c)}</span>
              ${u}
              <span class="icon-gallery__key">${t(i)}</span>
            </span>
            <span class="icon-gallery__copied" data-icon-copied hidden>
              <span class="icon-gallery__copied-label">Copied</span>
              <span class="icon-gallery__copied-key" data-icon-copied-key></span>
            </span>
          </button>
        `}).join(``);return`
      <section class="icon-gallery__section"
               data-icon-section="${t(e)}"
               aria-labelledby="icon-gallery-heading-${t(e)}">
        <header class="icon-gallery__section-head">
          <p class="icon-gallery__section-title"
             id="icon-gallery-heading-${t(e)}"
             role="heading"
             aria-level="2">
            ${t(i(e))}
          </p>
          <span class="icon-gallery__section-count"
                data-section-count="${t(e)}">${s.length} ${E}</span>
        </header>
        <div class="icon-gallery__grid" data-icon-grid="${t(e)}">
          ${c}
        </div>
      </section>
    `}).join(``),O=document.createElement(`div`);return O.className=`icon-gallery${y?` icon-gallery--img`:``}`,O.innerHTML=`
    <header class="icon-gallery__hero">
      <div class="icon-gallery__hero-text">
        <p class="icon-gallery__eyebrow">Design System</p>
        <p class="icon-gallery__title">${t(S)}</p>
        <p class="icon-gallery__intro">
          ${C}
        </p>
      </div>
      <div class="icon-gallery__hero-meta">
        <span class="icon-gallery__badge" data-icon-total>${v} ${E}</span>
        <a class="icon-gallery__figma"
           href="${t(b)}"
           target="_blank"
           rel="noopener noreferrer">${t(x)}</a>
      </div>
    </header>
    <div class="icon-gallery__layout">
      <aside class="icon-gallery__sidebar" aria-label="Icon categories">
        <p class="icon-gallery__sidebar-title">Categories</p>
        <ul class="icon-gallery__category-list">
          <li class="icon-gallery__category-item">
            <label class="icon-gallery__category-label is-active" data-category-row="all">
              <input class="icon-gallery__category-check"
                     type="checkbox"
                     data-icon-category-all
                     checked>
              <span class="icon-gallery__category-name">All</span>
              <span class="icon-gallery__category-count" data-category-count-all>${v}</span>
            </label>
          </li>
          ${T}
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
                     placeholder="Filter by name or category…"
                     autocomplete="off"
                     spellcheck="false">
            </span>
          </label>
          <button class="icon-gallery__reset" type="button" data-icon-reset hidden>Reset</button>
          <p class="icon-gallery__tally" data-icon-tally>
            <span data-icon-shown-count>${v}</span> ${E}
          </p>
        </div>
        <div class="icon-gallery__chips" data-icon-chips></div>
        <p class="icon-gallery__empty" data-icon-empty hidden>No ${E} match that filter.</p>
        <div class="icon-gallery__sections" data-icon-sections>
          ${D}
        </div>
      </div>
    </div>
  `,s(O,{ICON_CATEGORIES:g,noun:E}),O}function s(e,{ICON_CATEGORIES:n,noun:r=`icons`}){let a=e.querySelector(`[data-icon-search]`),o=e.querySelector(`[data-icon-reset]`),s=e.querySelector(`[data-icon-chips]`),c=e.querySelector(`[data-icon-empty]`),l=e.querySelector(`[data-icon-sections]`),u=e.querySelector(`[data-icon-shown-count]`),d=e.querySelector(`[data-icon-category-all]`),f=e.querySelector(`[data-category-row="all"]`),p=Array.from(e.querySelectorAll(`[data-icon-category]`)),m=Array.from(e.querySelectorAll(`[data-icon-section]`)),h=Array.from(e.querySelectorAll(`[data-icon-card]`)),g=new Set,_=null;function v(){let e=g.size===0;d&&(d.checked=e),f&&f.classList.toggle(`is-active`,e);for(let e of p){let t=e.closest(`[data-category-row]`),n=g.has(e.value);e.checked=n,t&&t.classList.toggle(`is-active`,n)}}function y(){if(!s)return;let e=[...g].sort((e,t)=>n.indexOf(e)-n.indexOf(t));s.innerHTML=e.map(e=>`
        <span class="icon-gallery__chip">
          <span class="icon-gallery__chip-label">Category</span>
          ${t(i(e))}
          <button type="button"
                  class="icon-gallery__chip-remove"
                  data-chip-remove="${t(e)}"
                  aria-label="Remove ${t(i(e))} filter">×</button>
        </span>
      `).join(``)}function b(){let t=(a?.value||``).trim().toLowerCase(),i=t?t.split(/\s+/):[],s=g,d=s.size===0,f=0,p=Object.fromEntries(n.map(e=>[e,0]));for(let e of h){let t=e.getAttribute(`data-icon-search-key`)||``,n=e.getAttribute(`data-icon-category`)||``,r=!0;for(let e of i)if(!t.includes(e)){r=!1;break}let a=d||s.has(n),o=r&&a;e.hidden=!o,r&&p[n]!==void 0&&(p[n]+=1),o&&(f+=1)}for(let e of m){let t=e.getAttribute(`data-icon-section`)||``;e.hidden=!((d||s.has(t))&&(p[t]||0)>0);let n=e.querySelector(`[data-section-count="${t}"]`);if(n){let e=p[t]||0;n.textContent=`${e} ${e===1?r.replace(/s$/,``):r}`}}for(let t of n){let n=e.querySelector(`[data-category-count="${t}"]`);n&&(n.textContent=String(p[t]||0))}let _=e.querySelector(`[data-category-count-all]`);if(_){let e=n.reduce((e,t)=>e+(p[t]||0),0);_.textContent=String(e)}u&&(u.textContent=String(f)),c&&(c.hidden=f!==0),l&&(l.hidden=f===0),o&&(o.hidden=t.length===0&&s.size===0),y(),v()}let x=!1;function S(){if(x)return;x=!0;let e=typeof window<`u`&&window.requestAnimationFrame;e?e(()=>{x=!1,b()}):setTimeout(()=>{x=!1,b()},16)}d&&d.addEventListener(`change`,e=>{e.stopPropagation(),g=new Set;for(let e of p)e.checked=!1;S()});for(let e of p)e.addEventListener(`change`,t=>{t.stopPropagation(),e.checked?g.add(e.value):g.delete(e.value),g.size>0&&d&&(d.checked=!1),S()});a?.addEventListener(`input`,S),a?.addEventListener(`keydown`,e=>{e.key===`Escape`&&a.value&&(a.value=``,S(),e.stopPropagation())}),o?.addEventListener(`click`,()=>{a&&(a.value=``),g=new Set;for(let e of p)e.checked=!1;a?.focus(),S()}),s?.addEventListener(`click`,e=>{let t=e.target.closest(`[data-chip-remove]`);if(!t)return;let n=t.getAttribute(`data-chip-remove`);n&&g.delete(n),S()});function C(e){return navigator?.clipboard?.writeText?navigator.clipboard.writeText(e).catch(()=>w(e)):Promise.resolve(w(e))}function w(e){let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();try{document.execCommand(`copy`)}finally{document.body.removeChild(t)}}for(let e of h)e.addEventListener(`click`,async()=>{let t=e.getAttribute(`data-icon-key`)||``;if(!t||!t.includes(`/`))return;try{await C(t)}catch{}let n=e.querySelector(`[data-icon-copied]`),r=e.querySelector(`[data-icon-copied-key]`);r&&(r.textContent=t),e.classList.add(`is-copied`),n&&(n.hidden=!1),_&&clearTimeout(_),_=setTimeout(()=>{e.classList.remove(`is-copied`),n&&(n.hidden=!0)},1600)});b()}var c,l,u;function d(){return(d=e((()=>{c=[`other-brands`,`other-apps`,`social`,`payment`],l=`https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-2583&m=dev`,u=`https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-2094&m=dev`})))()}export{d as n,o as r,c as t};