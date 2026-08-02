import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{_ as t,i as n,n as r,r as i,t as a,v as o}from"./pretty-source-DwSPc3lY.js";var s;function c(){return(c=e((()=>{s=`/**
 * Patterns/Accordion — vertical progressive-disclosure pattern.
 *
 * Figma: Web-ODS Shared Library board \`2499:2626\` (page \`539:28425\`).
 * Masters: \`accordion / group\` \`2499:2627\`, \`accordion / item\`,
 * \`accordion / card\` \`2499:3764\`.
 */

.c-accordion {
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  box-sizing: border-box;
  font-family: var(--font-family-primary);
}

.c-accordion__group-title {
  margin: 0 0 var(--space-5) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  font-weight: var(--font-weight-semibold);
}

.c-accordion--top-divider {
  border-block-start: var(--border-width-xs) solid var(--color-border-strong);
  padding-block-start: var(--space-3);
}

.c-accordion__item {
  --c-accordion-item-pad-block: var(--space-5);
  --c-accordion-item-pad-inline-start: var(--space-2);
  --c-accordion-item-pad-inline-end: var(--space-0, 0);
  --c-accordion-content-pad-block-end: var(--space-6);

  display: block;
  inline-size: 100%;
  box-sizing: border-box;
  color: var(--color-text-primary);
}

.c-accordion__item--with-divider {
  border-block-end: var(--border-width-xs) solid var(--color-border-subtle);
}

.c-accordion__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  padding-block: var(--c-accordion-item-pad-block);
  padding-inline-start: var(--c-accordion-item-pad-inline-start);
  padding-inline-end: var(--c-accordion-item-pad-inline-end);
  list-style: none;
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: background-color 150ms ease;
}

.c-accordion__item-header::-webkit-details-marker {
  display: none;
}

.c-accordion__item-header::marker {
  display: none;
  content: '';
}

.c-accordion__item-header:hover,
.c-accordion__item[data-state='hover'] > .c-accordion__item-header {
  background-color: var(--color-canvas-subtle);
}

.c-accordion__item-header:active,
.c-accordion__item[data-state='pressed'] > .c-accordion__item-header {
  background-color: var(--color-canvas-contrast);
}

.c-accordion__item-header:focus-visible,
.c-accordion__item[data-state='focus'] > .c-accordion__item-header {
  outline: var(--border-width-s, 2px) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-accordion__item-leading {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
}

.c-accordion__item-title {
  flex: 1 1 auto;
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  font-weight: var(--font-weight-semibold);
  text-align: start;
}

.c-accordion__item-chevron {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  border-radius: var(--border-radius-s);
  color: var(--color-text-primary);
  transition: transform 200ms ease;
}

.c-accordion__item[open] > .c-accordion__item-header .c-accordion__item-chevron {
  transform: rotate(180deg);
}

.c-accordion__item-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-block: 0 var(--c-accordion-content-pad-block-end);
  padding-inline-start: var(--c-accordion-item-pad-inline-start);
  padding-inline-end: var(--c-accordion-item-pad-inline-end);
  overflow: visible;
}

.c-accordion__item[data-animating] > .c-accordion__item-content {
  overflow: clip;
}

.c-accordion__item-body,
.c-accordion__item-list {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
}

.c-accordion__item-list {
  padding-inline-start: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.c-accordion__item-list > li {
  margin: 0;
}

.c-accordion__item-link {
  display: inline-block;
  color: var(--color-text-accent);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-regular);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.c-accordion__item-link:hover,
.c-accordion__item-link:focus-visible {
  text-decoration-thickness: var(--border-width-s, 2px);
}

.c-accordion__item-link:focus-visible {
  outline: var(--border-width-s, 2px) solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

.c-accordion__item-image,
.c-accordion__item-video {
  display: block;
  max-inline-size: 100%;
  border-radius: var(--border-radius-l);
  overflow: hidden;
}

.c-accordion__item-image > img,
.c-accordion__item-video > video {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

/* Card appearance — Figma \`accordion / card\` */
.c-accordion--card {
  gap: var(--space-3);
}

.c-accordion--card .c-accordion__item {
  --c-accordion-item-pad-block: var(--space-5);
  --c-accordion-item-pad-inline-start: var(--space-5);
  --c-accordion-item-pad-inline-end: var(--space-5);
  border: 0;
}

.c-accordion--card .c-accordion__item--with-divider {
  border-block-end: 0;
}

.c-accordion--card .c-accordion__item-header {
  gap: var(--space-4);
  background-color: var(--color-bg-subtle);
  border-radius: var(--border-radius-l);
}

.c-accordion--card .c-accordion__item[open] > .c-accordion__item-header {
  border-end-start-radius: 0;
  border-end-end-radius: 0;
}

.c-accordion--card .c-accordion__item-content {
  background-color: var(--color-bg-subtle);
  border-end-start-radius: var(--border-radius-l);
  border-end-end-radius: var(--border-radius-l);
  padding-block-start: 0;
}

.c-accordion--card .c-accordion__item-title {
  font-size: var(--font-size-h7);
  line-height: var(--lineheight-h7, var(--lineheight-body-lg));
  font-weight: var(--font-weight-medium);
}

.c-accordion--card .c-accordion__item-header:hover,
.c-accordion--card .c-accordion__item[data-state='hover'] > .c-accordion__item-header {
  background-color: var(--color-canvas-subtle);
}

.c-accordion__item[data-disabled='true'] {
  color: var(--color-disabled-text);
}

.c-accordion__item[data-disabled='true'] > .c-accordion__item-header {
  cursor: not-allowed;
  pointer-events: none;
  background-color: transparent;
}

.c-accordion--card .c-accordion__item[data-disabled='true'] > .c-accordion__item-header {
  background-color: var(--color-disabled-bg, var(--color-bg-subtle));
}

.c-accordion__item[data-disabled='true'] .c-accordion__item-title,
.c-accordion__item[data-disabled='true'] .c-accordion__item-chevron,
.c-accordion__item[data-disabled='true'] .c-accordion__item-leading {
  color: var(--color-disabled-text);
}

@media (prefers-reduced-motion: reduce) {
  .c-accordion__item-header,
  .c-accordion__item-chevron,
  .c-accordion__item-content {
    transition: none;
  }
}
`})))()}var l;function u(){return(u=e((()=>{l=`/**
 * Patterns/Accordion — progressive-enhancement behavior layer.
 *
 * Native \`<details>\` works without JS. This module adds height
 * animation, optional single-open enforcement, disabled short-circuit,
 * and \`lifelock:accordion:*\` CustomEvents (namespace matches core
 * Checkbox / Radio / Switch).
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

function getContentEl(details) {
  return details.querySelector(':scope > .c-accordion__item-content');
}

function isDisabled(details) {
  return details.getAttribute('data-disabled') === 'true';
}

function dispatch(details, type, detail) {
  details.dispatchEvent(
    new CustomEvent(\`lifelock:accordion:\${type}\`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
}

function getItemId(details) {
  return details.id || details.getAttribute('data-accordion-item-id') || '';
}

/**
 * @param {HTMLElement} root
 * @param {{ singleOpen?: boolean, animate?: boolean, duration?: number }} [options]
 */
export function initAccordion(root, options = {}) {
  if (!root || root.dataset.accordionInitialized === 'true') {
    return null;
  }
  root.dataset.accordionInitialized = 'true';

  const animate = options.animate !== false;
  const duration = typeof options.duration === 'number' ? options.duration : 200;
  const singleOpen =
    typeof options.singleOpen === 'boolean'
      ? options.singleOpen
      : root.getAttribute('data-single-open') === 'true';

  const items = Array.from(root.querySelectorAll(':scope > .c-accordion__item'));

  function findDetails(target) {
    if (typeof target === 'number') return items[target] || null;
    return items.find((d) => getItemId(d) === target) || null;
  }

  function animatePanel(details, opening, source) {
    const content = getContentEl(details);
    if (!content) return;

    if (!animate || prefersReducedMotion()) {
      details.open = opening;
      dispatch(details, 'toggle', { id: getItemId(details), open: opening, source });
      dispatch(details, opening ? 'opened' : 'closed', {
        id: getItemId(details),
        source,
      });
      return;
    }

    if (opening) {
      details.open = true;
      details.dataset.animating = 'opening';
      const target = content.scrollHeight;
      content.style.maxBlockSize = '0px';
      requestAnimationFrame(() => {
        content.style.transition = \`max-block-size \${duration}ms ease\`;
        content.style.maxBlockSize = \`\${target}px\`;
      });
      const onEnd = () => {
        content.style.transition = '';
        content.style.maxBlockSize = '';
        delete details.dataset.animating;
        content.removeEventListener('transitionend', onEnd);
        dispatch(details, 'opened', { id: getItemId(details), source });
      };
      content.addEventListener('transitionend', onEnd);
      dispatch(details, 'toggle', { id: getItemId(details), open: true, source });
    } else {
      const startHeight = content.scrollHeight;
      details.dataset.animating = 'closing';
      content.style.maxBlockSize = \`\${startHeight}px\`;
      requestAnimationFrame(() => {
        content.style.transition = \`max-block-size \${duration}ms ease\`;
        content.style.maxBlockSize = '0px';
      });
      const onEnd = () => {
        content.style.transition = '';
        content.style.maxBlockSize = '';
        delete details.dataset.animating;
        details.open = false;
        content.removeEventListener('transitionend', onEnd);
        dispatch(details, 'closed', { id: getItemId(details), source });
      };
      content.addEventListener('transitionend', onEnd);
      dispatch(details, 'toggle', { id: getItemId(details), open: false, source });
    }
  }

  function open(target, source = 'api') {
    const details = findDetails(target);
    if (!details || isDisabled(details) || details.open) return;
    if (singleOpen) {
      items
        .filter((d) => d !== details && d.open && !isDisabled(d))
        .forEach((sibling) => animatePanel(sibling, false, 'api'));
    }
    animatePanel(details, true, source);
  }

  function close(target, source = 'api') {
    const details = findDetails(target);
    if (!details || !details.open) return;
    animatePanel(details, false, source);
  }

  function toggle(target, source = 'api') {
    const details = findDetails(target);
    if (!details) return;
    if (details.open) close(target, source);
    else open(target, source);
  }

  function getOpen() {
    return items.filter((d) => d.open).map(getItemId);
  }

  function onSummaryClick(event) {
    const summary = event.target.closest('.c-accordion__item-header');
    if (!summary) return;
    const details = summary.parentElement;
    if (!details || !details.classList.contains('c-accordion__item')) return;
    if (isDisabled(details)) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    const source = event.detail === 0 ? 'keyboard' : 'click';
    if (details.open) {
      close(details.id || items.indexOf(details), source);
    } else {
      open(details.id || items.indexOf(details), source);
    }
  }

  items.forEach((details) => {
    const summary = details.querySelector(':scope > .c-accordion__item-header');
    if (summary) summary.addEventListener('click', onSummaryClick);
  });

  function destroy() {
    items.forEach((details) => {
      const summary = details.querySelector(':scope > .c-accordion__item-header');
      if (summary) summary.removeEventListener('click', onSummaryClick);
      const content = getContentEl(details);
      if (content) {
        content.style.transition = '';
        content.style.maxBlockSize = '';
      }
      delete details.dataset.animating;
    });
    delete root.dataset.accordionInitialized;
  }

  return { open, close, toggle, getOpen, destroy };
}

/**
 * @param {ParentNode} [scope]
 * @param {object} [options]
 */
export function initAccordions(scope, options) {
  const root = scope || (typeof document !== 'undefined' ? document : null);
  if (!root) return [];
  return Array.from(root.querySelectorAll('.c-accordion'))
    .map((node) => initAccordion(node, options))
    .filter(Boolean);
}

export default initAccordion;
`})))()}function d(){if(typeof window>`u`||!window.matchMedia)return!1;try{return window.matchMedia(v).matches}catch{return!1}}function f(e){return e.querySelector(`:scope > .c-accordion__item-content`)}function p(e){return e.getAttribute(`data-disabled`)===`true`}function m(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:accordion:${t}`,{bubbles:!0,composed:!0,detail:n}))}function h(e){return e.id||e.getAttribute(`data-accordion-item-id`)||``}function g(e,t={}){if(!e||e.dataset.accordionInitialized===`true`)return null;e.dataset.accordionInitialized=`true`;let n=t.animate!==!1,r=typeof t.duration==`number`?t.duration:200,i=typeof t.singleOpen==`boolean`?t.singleOpen:e.getAttribute(`data-single-open`)===`true`,a=Array.from(e.querySelectorAll(`:scope > .c-accordion__item`));function o(e){return typeof e==`number`?a[e]||null:a.find(t=>h(t)===e)||null}function s(e,t,i){let a=f(e);if(a){if(!n||d()){e.open=t,m(e,`toggle`,{id:h(e),open:t,source:i}),m(e,t?`opened`:`closed`,{id:h(e),source:i});return}if(t){e.open=!0,e.dataset.animating=`opening`;let t=a.scrollHeight;a.style.maxBlockSize=`0px`,requestAnimationFrame(()=>{a.style.transition=`max-block-size ${r}ms ease`,a.style.maxBlockSize=`${t}px`});let n=()=>{a.style.transition=``,a.style.maxBlockSize=``,delete e.dataset.animating,a.removeEventListener(`transitionend`,n),m(e,`opened`,{id:h(e),source:i})};a.addEventListener(`transitionend`,n),m(e,`toggle`,{id:h(e),open:!0,source:i})}else{let t=a.scrollHeight;e.dataset.animating=`closing`,a.style.maxBlockSize=`${t}px`,requestAnimationFrame(()=>{a.style.transition=`max-block-size ${r}ms ease`,a.style.maxBlockSize=`0px`});let n=()=>{a.style.transition=``,a.style.maxBlockSize=``,delete e.dataset.animating,e.open=!1,a.removeEventListener(`transitionend`,n),m(e,`closed`,{id:h(e),source:i})};a.addEventListener(`transitionend`,n),m(e,`toggle`,{id:h(e),open:!1,source:i})}}}function c(e,t=`api`){let n=o(e);!n||p(n)||n.open||(i&&a.filter(e=>e!==n&&e.open&&!p(e)).forEach(e=>s(e,!1,`api`)),s(n,!0,t))}function l(e,t=`api`){let n=o(e);!n||!n.open||s(n,!1,t)}function u(e,t=`api`){let n=o(e);n&&(n.open?l(e,t):c(e,t))}function g(){return a.filter(e=>e.open).map(h)}function _(e){let t=e.target.closest(`.c-accordion__item-header`);if(!t)return;let n=t.parentElement;if(!n||!n.classList.contains(`c-accordion__item`))return;if(p(n)){e.preventDefault();return}e.preventDefault();let r=e.detail===0?`keyboard`:`click`;n.open?l(n.id||a.indexOf(n),r):c(n.id||a.indexOf(n),r)}a.forEach(e=>{let t=e.querySelector(`:scope > .c-accordion__item-header`);t&&t.addEventListener(`click`,_)});function v(){a.forEach(e=>{let t=e.querySelector(`:scope > .c-accordion__item-header`);t&&t.removeEventListener(`click`,_);let n=f(e);n&&(n.style.transition=``,n.style.maxBlockSize=``),delete e.dataset.animating}),delete e.dataset.accordionInitialized}return{open:c,close:l,toggle:u,getOpen:g,destroy:v}}function _(e,t){let n=e||(typeof document<`u`?document:null);return n?Array.from(n.querySelectorAll(`.c-accordion`)).map(e=>g(e,t)).filter(Boolean):[]}var v;function y(){return(y=e((()=>{v=`(prefers-reduced-motion: reduce)`})))()}function b(){if(x||typeof document>`u`||typeof MutationObserver>`u`)return;x=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-accordion`)&&e.dataset?.accordionInitialized!==`true`&&g(e),e.querySelectorAll?.(`.c-accordion:not([data-accordion-initialized])`).forEach(e=>{g(e)}))},t=()=>{document.body&&new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}).observe(document.body,{childList:!0,subtree:!0})};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var x;function S(){return(S=e((()=>{y(),x=!1})))()}var C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{n(),r(),c(),u(),o(),y(),S(),b(),C=i.default.compile(t),w=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28425&m=dev`,T=`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sodales massa in sapien tempor venenatis.`,E=[{title:`Lorem ipsum dolor sit amet, consectetur adipiscing elit?`,body:T,expanded:!1,showBody:!0,showDivider:!0,showIcon:!0},{title:`Aenean ac eleifend lacus, in mollis lectus?`,body:T,expanded:!0,showBody:!0,showDivider:!0,showIcon:!0},{title:`Donec maximus, sapien id auctor consectetur?`,body:T,expanded:!1,showBody:!0,showDivider:!0,showIcon:!0}],D={name:`playground`,appearance:`default`,topDivider:!1,singleOpen:!1,groupTitle:null,items:E},O=async({canvasElement:e})=>{_(e)},k={title:`Patterns/Accordion`,tags:[`autodocs`],render:e=>C(e),args:D,argTypes:{name:{control:`text`,name:`Name`},appearance:{control:{type:`inline-radio`},options:[`default`,`card`],name:`Appearance`},topDivider:{control:`boolean`,name:`Top divider`},singleOpen:{control:`boolean`,name:`Single open`},groupTitle:{control:`text`,name:`Group title`},items:{control:`object`,name:`Items`}},parameters:{docs:{description:{component:`Accordion — progressive disclosure pattern. [Figma](${w}).`}}}},A={name:`Demo`,play:O,parameters:a(C(D),{scss:s,js:l})},j={name:`Card`,play:O,args:{...D,name:`card-demo`,appearance:`card`,items:E.map(e=>({...e,showDivider:!1}))},parameters:a(C({...D,name:`card-demo`,appearance:`card`,items:E.map(e=>({...e,showDivider:!1}))}),{scss:s,js:l})},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInit,
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    scss: scssSource,
    js: jsSource
  })
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: 'Card',
  play: playInit,
  args: {
    ...defaultArgs,
    name: 'card-demo',
    appearance: 'card',
    items: defaultItems.map(item => ({
      ...item,
      showDivider: false
    }))
  },
  parameters: htmlStoryParameters(compiled({
    ...defaultArgs,
    name: 'card-demo',
    appearance: 'card',
    items: defaultItems.map(item => ({
      ...item,
      showDivider: false
    }))
  }), {
    scss: scssSource,
    js: jsSource
  })
}`,...j.parameters?.docs?.source}}},M=[`Demo`,`Card`]})))()}N();export{j as Card,A as Demo,M as __namedExportsOrder,k as default};