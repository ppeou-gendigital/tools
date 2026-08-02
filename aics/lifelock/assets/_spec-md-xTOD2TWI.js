import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,i as n}from"./figma-links-DrHwXaYQ.js";function r(e){let{storySpec:t,tableHook:n,trailingHtml:r=``,skipSections:a=[]}=e,o=new Set([...E,...a]),s=t.sections.filter(e=>!o.has(e.title)).map(e=>u(e,{tableHook:n,parent:null})).join(``);return`
    ${N}
    <article class="spec-gallery">
      ${i(t)}
      ${s}
      ${r}
    </article>
  `}function i(e){let t=e.frontmatter||{},n=e.h1||t.name||`Tokens`,r=l(e,`Summary`),i=a(t),o=s(e);return`
    <header class="spec-gallery__hero">
      ${i?`<p class="spec-gallery__eyebrow">${x(i)}</p>`:``}
      <h1 class="spec-gallery__title">${x(n)}</h1>
      ${r?`<p class="spec-gallery__lede">${b(r)}</p>`:``}
      ${o?`<div class="spec-gallery__meta">${o}</div>`:``}
    </header>
  `}function a(e){return!e||!e.type?``:{token:`Design System · Token`,component:`Components · Component`,layout:`Layouts · Layout`,page:`Pages · Page`}[e.type]||``}function o(e){return e?e===`Nshd9ukxIzpeUnzOXiWxUP`?`Web-ODS-Theme`:e===`0o8SL5BEk8wHtgud00dRyg`?`Web-ODS Shared Library`:e===`OKdhUs9kW8rEP4TnBDU8Se`?`Foundations-Iconography`:``:``}function s(e){let t=e.frontmatter||{},r=[],i=n(t.figmaFileKey,t.figmaNodeId),a=o(t.figmaFileKey);if(i&&r.push(`
      <a class="spec-gallery__pill spec-gallery__pill--accent spec-gallery__pill--link"
         href="${S(i)}"
         target="_blank"
         rel="noreferrer noopener"
         title="Open this node in Figma Dev Mode">
        <svg class="spec-gallery__pill-icon" aria-hidden="true" viewBox="0 0 38 57" focusable="false">
          <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z"/>
          <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z"/>
          <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z"/>
          <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5Z"/>
          <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5Z"/>
        </svg>
        <span>View on Figma${a?` · ${x(a)}`:``}</span>
      </a>
    `),t.figmaNodeId&&r.push(`<span class="spec-gallery__pill spec-gallery__pill--mono">node ${x(String(t.figmaNodeId))}</span>`),t.type&&r.push(`<span class="spec-gallery__pill">${x(String(t.type))}</span>`),t.status){let e=t.status===`published`?`spec-gallery__pill--success`:t.status===`deprecated`?`spec-gallery__pill--anomaly`:``;r.push(`<span class="spec-gallery__pill ${e}">${x(String(t.status))}</span>`)}t.brand&&r.push(`<span class="spec-gallery__pill">brand: ${x(String(t.brand))}</span>`);let s=c(e);return s!==null&&r.push(`<span class="spec-gallery__pill">Tokens: ${s}</span>`),r.join(``)}function c(e){let t=e.sections.find(e=>e.title===`Token values`);if(!t)return null;let n=0,r=e=>{for(let t of e||[])t&&t.type===`table`&&Array.isArray(t.rows)&&(n+=t.rows.length)};r(t.blocks);for(let e of t.subsections||[])r(e.blocks);return n>0?n:null}function l(e,t){let n=e.sections.find(e=>e.title===t);if(!n)return null;let r=n.blocks.find(e=>e.type===`paragraph`);return r?r.text:null}function u(e,t){let n=`<h2 class="spec-gallery__section-heading">${b(e.title)}</h2>`,r={...t,section:e,subsection:null},i=e.title===`Summary`,a=i?e.blocks.filter((e,t)=>t!==0||e.type!==`paragraph`):e.blocks,o=``,s=a;!i&&a[0]&&a[0].type===`paragraph`&&(o=`<p class="spec-gallery__section-lede">${b(a[0].text)}</p>`,s=a.slice(1));let c=s.map(e=>f(e,r)).join(``),l=(e.subsections||[]).map(e=>d(e,r)).join(``);return`
    <section class="spec-gallery__section" data-spec-section="${C(e.title)}">
      ${n}
      ${o}
      ${c}
      ${l}
    </section>
  `}function d(e,t){let n=`<h3 class="spec-gallery__sub-heading">${b(e.title)}</h3>`,r={...t,subsection:e},i=e.blocks.map(e=>f(e,r)).join(``);return`
    <section class="spec-gallery__sub-section" data-spec-subsection="${C(e.title)}">
      ${n}
      ${i}
    </section>
  `}function f(e,t){switch(e.type){case`paragraph`:return`<p class="spec-gallery__paragraph">${b(e.text)}</p>`;case`subheading`:return`<h${e.level+1} class="spec-gallery__inline-heading">${b(e.text)}</h${e.level+1}>`;case`quote`:return p(e);case`list`:return m(e);case`code`:return h(e);case`table`:return g(e,t);default:return``}}function p(e){let t=D.exec(e.text||``);if(!t)return`<blockquote class="spec-gallery__quote">${b(e.text)}</blockquote>`;let n=t[1].toLowerCase(),r=t[2];return`
    <aside class="spec-gallery__callout ${n===`warning`?`spec-gallery__callout--anomaly`:n===`tip`?`spec-gallery__callout--tip`:`spec-gallery__callout--info`}">
      <p class="spec-gallery__callout-title">${x(n===`warning`?`Warning`:n===`tip`?`Tip`:`Note`)}</p>
      <p class="spec-gallery__callout-body">${b(r)}</p>
    </aside>
  `}function m(e){let t=e.ordered?`ol`:`ul`;return`<${t} class="spec-gallery__list">${e.items.map(e=>`<li>${b(e.text)}</li>`).join(``)}</${t}>`}function h(e){let t=e.lang||``;return t===`mermaid`?`
      <pre class="spec-gallery__code spec-gallery__code--mermaid" data-lang="mermaid"><code>${x(e.body)}</code></pre>
    `:`
    <pre class="spec-gallery__code" data-lang="${x(t)}"><code>${x(e.body)}</code></pre>
  `}function g(e,t){if(typeof t.tableHook==`function`)try{let n=t.tableHook({section:t.section?t.section.title:null,subsection:t.subsection?t.subsection.title:null,table:e});if(typeof n==`string`)return n}catch(e){console.warn(`[spec-story] tableHook threw:`,e)}return _(e)}function _(e){return`
    <div class="spec-gallery__table-wrap">
      <table class="spec-gallery__table">${`
    <thead>
      <tr>${e.headers.map(e=>`<th>${b(e)}</th>`).join(``)}</tr>
    </thead>
  `}${`
    <tbody>
      ${e.rows.map(e=>`
        <tr>${e.map(e=>`<td>${b(e)}</td>`).join(``)}</tr>
      `).join(``)}
    </tbody>
  `}</table>
    </div>
  `}function v(e){let t=String(e).split(`#`)[0],n=A.exec(t);if(n)return`./?path=/story/design-system-${n[1].toLowerCase()}--default`;let r=j.exec(t);return r?`./?path=/story/${k[r[1].toLowerCase()]}-${r[2].toLowerCase()}--default`:null}function y(e,t){let n=x(e),r=v(t);return r?`<a href="${S(r)}" target="_top">${n}</a>`:/^https?:\/\//i.test(t)?`<a href="${S(t)}" target="_blank" rel="noreferrer noopener">${n}</a>`:`<a href="${S(t)}">${n}</a>`}function b(e){if(e==null)return``;let t=String(e),n=[],r=e=>`\u0000PH${e}\u0000`;for(let{re:e,fn:i}of O)t=t.replace(e,(...e)=>{let t=i(...e);return n.push(t),r(n.length-1)});let i=x(t);for(let e=0;e<5;e+=1){let e=i.replace(/\u0000PH(\d+)\u0000/g,(e,t)=>n[Number(t)]);if(e===i)break;i=e}return i}function x(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function S(e){return x(e).replace(/'/g,`&#39;`)}function C(e){return String(e).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}function w(e){if(!e)return null;let t=/(?:`)?(--[a-z0-9-]+)(?:`)?/i.exec(e);return t?t[1]:null}function T(e){if(!e)return null;let t=String(e).replace(/`/g,``).trim();return!t||t===`—`?null:t}var E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{t(),E=[`Figma source`],D=/^\s*\*\*(Note|Warning|Tip)\.\*\*\s+([\s\S]+)$/i,O=[{re:/`([^`]+)`/g,fn:(e,t)=>`<code>${x(t)}</code>`},{re:/\[([^\]]+)\]\(([^)]+)\)/g,fn:(e,t,n)=>y(t,n)},{re:/\*\*([^*]+)\*\*/g,fn:(e,t)=>`<strong>${x(t)}</strong>`},{re:/(?<![*])\*(?!\*)([^*]+?)\*(?!\*)/g,fn:(e,t)=>`<em>${x(t)}</em>`}],k={tokens:`design-system`,components:`components`,layouts:`layouts`,pages:`pages`},A=/^\.\.\/([a-z0-9][a-z0-9-]*)\/spec\.md$/i,j=/^\.\.\/\.\.\/(tokens|components|layouts|pages)\/([a-z0-9][a-z0-9-]*)\/spec\.md$/i,M=e=>typeof window>`u`||typeof document>`u`?``:getComputedStyle(document.documentElement).getPropertyValue(e).trim(),N=`
<style>
/*
 * Spec gallery — the polished documentation chrome shared by every
 * spec.md-driven story (tokens, components, layouts, pages). Self-
 * contained: no external CSS dependency, no LifeLock token leak — uses
 * only the CSS custom properties that ship globally on :root via
 * .storybook/preview.scss, with hard-coded fallbacks so the gallery
 * still reads well if a token isn't surfaced yet.
 */

.spec-gallery {
  --sg-bg: var(--color-canvas-default, #fff);
  --sg-surface: var(--color-bg-subtle, #f7f8fa);
  --sg-surface-strong: #eef0f4;
  --sg-border: var(--color-border-subtle, #e2e6ec);
  --sg-border-strong: #cbd2dc;
  --sg-text: var(--color-text-primary, #0f172a);
  --sg-text-muted: var(--color-text-secondary, #475569);
  --sg-text-faint: #6b7280;
  --sg-accent: var(--color-content-brand, #108389);
  --sg-accent-soft: var(--color-mist-blue, #e6f0f1);
  --sg-accent-strong: #084c50;
  --sg-anomaly: #b45309;
  --sg-anomaly-bg: #fffbeb;
  --sg-anomaly-border: #f59e0b;
  --sg-success: #15803d;
  --sg-success-bg: #f0fdf4;
  --sg-success-border: #86efac;
  --sg-info: #0369a1;
  --sg-info-bg: #f0f9ff;
  --sg-info-border: #bae6fd;
  --sg-code-bg: var(--color-bg-subtle, #f1f5f9);
  --sg-font-mono: ui-monospace, "JetBrains Mono", sfmono-regular, Menlo, Consolas, monospace;
  --sg-radius-sm: 4px;
  --sg-radius-md: 8px;
  --sg-radius-lg: 12px;
  --sg-shadow-sm: 0 1px 2px rgb(15 23 42 / 4%);

  font-family: var(--font-family-primary, "Inter", system-ui, sans-serif);
  color: var(--sg-text);
  background: var(--sg-bg);
  line-height: 1.6;
  font-size: 14px;
  padding: 40px 48px 64px;
  max-width: 1120px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.spec-gallery *,
.spec-gallery *::before,
.spec-gallery *::after {
  box-sizing: border-box;
}

/* ---------- Hero ---------- */

.spec-gallery__hero {
  border-bottom: 1px solid var(--sg-border);
  padding-bottom: 24px;
  margin-bottom: 40px;
}

.spec-gallery__eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sg-accent);
  margin: 0 0 8px;
}

.spec-gallery__title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--sg-text);
  margin: 0 0 12px;
  line-height: 1.15;
}

.spec-gallery__lede {
  font-size: 16px;
  line-height: 1.55;
  color: var(--sg-text-muted);
  margin: 0;
  max-width: 720px;
}

.spec-gallery__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

/* ---------- Pills ---------- */

.spec-gallery__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--sg-surface-strong);
  color: var(--sg-text-muted);
  border: 1px solid var(--sg-border);
  white-space: nowrap;
  text-decoration: none;
}

.spec-gallery__pill--accent {
  background: var(--sg-accent-soft);
  color: var(--sg-accent-strong);
  border-color: transparent;
}

.spec-gallery__pill--success {
  background: var(--sg-success-bg);
  color: var(--sg-success);
  border-color: var(--sg-success-border);
}

.spec-gallery__pill--anomaly {
  background: var(--sg-anomaly-bg);
  color: var(--sg-anomaly);
  border-color: var(--sg-anomaly-border);
}

.spec-gallery__pill--mono {
  font-family: var(--sg-font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.spec-gallery__pill--link {
  cursor: pointer;
  transition: filter 0.12s ease, transform 0.12s ease;
}

.spec-gallery__pill--link:hover,
.spec-gallery__pill--link:focus-visible {
  filter: brightness(0.96);
  transform: translateY(-1px);
}

.spec-gallery__pill-icon {
  width: 11px;
  height: 17px;
  flex: 0 0 auto;
}

/* ---------- Sections ---------- */

.spec-gallery__section {
  margin-bottom: 48px;
}

.spec-gallery__section:last-child {
  margin-bottom: 0;
}

.spec-gallery__section-heading {
  font-size: 20px;
  font-weight: 600;
  color: var(--sg-text);
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}

.spec-gallery__section-lede {
  font-size: 13px;
  color: var(--sg-text-muted);
  margin: 0 0 20px;
  max-width: 720px;
}

.spec-gallery__sub-section {
  margin-top: 28px;
}

.spec-gallery__sub-heading {
  font-size: 15px;
  font-weight: 600;
  color: var(--sg-text);
  margin: 0 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--sg-border);
  letter-spacing: -0.005em;
}

.spec-gallery__inline-heading {
  margin: 18px 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--sg-text);
}

/* ---------- Body text ---------- */

.spec-gallery__paragraph {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--sg-text);
  max-width: 740px;
}

.spec-gallery__paragraph:last-child {
  margin-bottom: 0;
}

.spec-gallery__list {
  margin: 0 0 14px;
  padding-inline-start: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--sg-text);
  max-width: 740px;
}

.spec-gallery__list:last-child {
  margin-bottom: 0;
}

/* Inline code — used in paragraphs, lists, quotes, table cells. */
.spec-gallery code {
  font-family: var(--sg-font-mono);
  background: var(--sg-code-bg);
  color: var(--sg-text);
  padding: 1px 6px;
  border-radius: var(--sg-radius-sm);
  font-size: 12px;
  border: 1px solid transparent;
}

/* ---------- Quote (plain) ---------- */

.spec-gallery__quote {
  margin: 0 0 14px;
  padding: 12px 16px;
  border-inline-start: 3px solid var(--sg-accent);
  background: var(--sg-accent-soft);
  font-size: 13px;
  line-height: 1.6;
  color: var(--sg-text);
  border-radius: var(--sg-radius-sm);
}

/* ---------- Callouts (auto from \`> **Note.**\` etc.) ---------- */

.spec-gallery__callout {
  border-radius: var(--sg-radius-md);
  padding: 14px 18px;
  margin: 0 0 14px;
  font-size: 13px;
  border: 1px solid var(--sg-border);
  border-inline-start-width: 4px;
  background: var(--sg-surface);
}

.spec-gallery__callout--info {
  background: var(--sg-info-bg);
  border-color: var(--sg-info-border);
  border-inline-start-color: #38bdf8;
}

.spec-gallery__callout--anomaly {
  background: var(--sg-anomaly-bg);
  border-color: var(--sg-anomaly-border);
  border-inline-start-color: var(--sg-anomaly);
}

.spec-gallery__callout--tip {
  background: var(--sg-success-bg);
  border-color: var(--sg-success-border);
  border-inline-start-color: #4ade80;
}

.spec-gallery__callout-title {
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0 0 6px;
}

.spec-gallery__callout--info .spec-gallery__callout-title { color: var(--sg-info); }
.spec-gallery__callout--anomaly .spec-gallery__callout-title { color: var(--sg-anomaly); }
.spec-gallery__callout--tip .spec-gallery__callout-title { color: var(--sg-success); }

.spec-gallery__callout-body {
  margin: 0;
  color: var(--sg-text);
  line-height: 1.6;
}

/* ---------- Code blocks ---------- */

.spec-gallery__code {
  margin: 0 0 14px;
  padding: 14px 18px;
  background: var(--sg-code-bg);
  border: 1px solid var(--sg-border);
  border-radius: var(--sg-radius-md);
  font-family: var(--sg-font-mono);
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  color: var(--sg-text);
}

.spec-gallery__code--mermaid {
  background: repeating-linear-gradient(135deg, rgb(0 0 0 / 2%) 0 4px, transparent 4px 8px);
  font-style: italic;
  color: var(--sg-text-muted);
}

.spec-gallery__code--mermaid::before {
  content: 'mermaid';
  display: block;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--sg-text-faint);
  margin-bottom: 8px;
}

/* ---------- Tables ---------- */

.spec-gallery__table-wrap {
  border: 1px solid var(--sg-border);
  border-radius: var(--sg-radius-md);
  overflow: hidden;
  background: var(--sg-bg);
  margin: 0 0 14px;
}

.spec-gallery__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 1.5;
}

.spec-gallery__table thead {
  background: var(--sg-surface);
}

.spec-gallery__table th {
  text-align: start;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sg-text-muted);
  padding: 12px 16px;
  border-bottom: 1px solid var(--sg-border);
  vertical-align: top;
}

.spec-gallery__table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--sg-border);
  color: var(--sg-text);
  vertical-align: top;
}

.spec-gallery__table tr:last-child td {
  border-bottom: 0;
}

.spec-gallery__table tr:hover td {
  background: var(--sg-surface);
}

/* ---------- Links inside body text ---------- */

.spec-gallery a:not(.spec-gallery__pill--link) {
  color: var(--sg-accent);
  text-underline-offset: 2px;
}

.spec-gallery a:not(.spec-gallery__pill--link):hover {
  color: var(--sg-accent-strong);
}

/* ---------- Responsive ---------- */

@media (max-width: 768px) {
  .spec-gallery {
    padding: 24px 20px 40px;
  }

  .spec-gallery__title {
    font-size: 26px;
  }

  .spec-gallery__lede {
    font-size: 15px;
  }
}
</style>
`})))()}function F(e){let{frontmatter:t,body:n}=I(e),r=V(R(n.split(/\r?\n/)));return{frontmatter:t,h1:r.h1,sections:r.sections}}function I(e){if(!e.startsWith(`---
`)&&!e.startsWith(`---\r
`))return{frontmatter:{},body:e};let t=e.replace(/^---\r?\n/,``),n=t.search(/\n---\r?\n/);if(n===-1)return{frontmatter:{},body:e};let r=t.slice(0,n),i=t.slice(n).replace(/^\n---\r?\n/,``);return{frontmatter:L(r),body:i}}function L(e){let t={};for(let n of e.split(/\r?\n/)){let e=n.trim();if(!e||e.startsWith(`#`))continue;let r=e.indexOf(`:`);if(r===-1)continue;let i=e.slice(0,r).trim(),a=e.slice(r+1).trim();(a.startsWith(`"`)&&a.endsWith(`"`)||a.startsWith(`'`)&&a.endsWith(`'`))&&(a=a.slice(1,-1)),t[i]=a}return t}function R(e){let t=[],n=0,r=e.length;for(;n<r;){let i=e[n],a=/^```(.*)$/.exec(i);if(a){let i=a[1].trim(),o=[];for(n+=1;n<r&&!/^```\s*$/.test(e[n]);)o.push(e[n]),n+=1;n<r&&(n+=1),t.push({type:`fence`,lang:i,body:o.join(`
`)});continue}let o=/^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(i);if(o){t.push({type:`heading`,level:o[1].length,text:o[2].trim()}),n+=1;continue}if(/^\s*$/.test(i)){t.push({type:`blank`}),n+=1;continue}if(z(i)){t.push({type:`tableSep`,raw:i}),n+=1;continue}if(/^\s*\|/.test(i)){t.push({type:`tableLine`,raw:i}),n+=1;continue}if(/^\s*>/.test(i)){t.push({type:`quoteLine`,raw:i.replace(/^\s*>\s?/,``)}),n+=1;continue}let s=/^(\s*)(\d+)\.\s+(.+)$/.exec(i);if(s){t.push({type:`listItem`,ordered:!0,indent:s[1].length,text:s[3]}),n+=1;continue}let c=/^(\s*)[-*]\s+(.+)$/.exec(i);if(c){t.push({type:`listItem`,ordered:!1,indent:c[1].length,text:c[2]}),n+=1;continue}t.push({type:`paragraph`,text:i}),n+=1}return t}function z(e){if(!/^\s*\|/.test(e))return!1;let t=B(e);return t.length!==0&&t.every(e=>/^:?-{3,}:?$/.test(e.trim()))}function B(e){return e.replace(/^\s*\|/,``).replace(/\|\s*$/,``).split(`|`).map(e=>e.trim())}function V(e){let t=null,n=[],r=null,i=null,a=[],o=0,s=e.length;for(;o<s;){let c=e[o];if(c.type===`heading`&&c.level===1){t=c.text,o+=1;continue}if(c.type===`heading`&&c.level===2){r={level:2,title:c.text,blocks:[],subsections:[]},i=null,n.push(r),o+=1;continue}if(c.type===`heading`&&c.level===3){let e=r||(n[n.length-1]??null);e&&(i={level:3,title:c.text,blocks:[]},e.subsections.push(i)),o+=1;continue}if(c.type===`heading`&&c.level>=4){let e=i||r,t={type:`subheading`,level:c.level,text:c.text};e?e.blocks.push(t):a.push(t),o+=1;continue}let l=i||r,u=l?l.blocks:a;if(c.type===`fence`){u.push({type:`code`,lang:c.lang,body:c.body}),o+=1;continue}if(c.type===`tableLine`){let t=[c],n=o+1;for(;n<s&&e[n].type===`blank`;)n+=1;if(n<s&&e[n].type===`tableSep`){for(t.push(e[n]),n+=1;n<s&&e[n].type===`tableLine`;)t.push(e[n]),n+=1;u.push(H(t)),o=n;continue}}if(c.type===`quoteLine`){let t=[c.raw],n=o+1;for(;n<s&&e[n].type===`quoteLine`;)t.push(e[n].raw),n+=1;u.push({type:`quote`,text:t.join(`
`)}),o=n;continue}if(c.type===`listItem`){let t=[],n=o,r=c.ordered;for(;n<s&&e[n].type===`listItem`&&e[n].ordered===r;)t.push({text:e[n].text}),n+=1,n<s&&e[n].type===`blank`&&n+1<s&&e[n+1].type===`listItem`&&e[n+1].ordered===r&&(n+=1);u.push({type:`list`,ordered:r,items:t}),o=n;continue}if(c.type===`paragraph`||c.type===`tableLine`){let t=[c.type===`tableLine`?c.raw:c.text],n=o+1;for(;n<s;){let r=e[n];if(r.type===`paragraph`)t.push(r.text),n+=1;else if(r.type===`tableLine`)t.push(r.raw),n+=1;else break}u.push({type:`paragraph`,text:t.join(` `)}),o=n;continue}if(c.type===`blank`){o+=1;continue}o+=1}return{h1:t,sections:n,lead:a}}function H(e){return{type:`table`,headers:B(e[0].raw),rows:e.slice(2).map(e=>B(e.raw)).filter(e=>e.some(e=>e.length>0))}}function U(){return(U=e((()=>{})))()}export{P as a,w as c,x as i,T as l,F as n,b as o,M as r,r as s,U as t};