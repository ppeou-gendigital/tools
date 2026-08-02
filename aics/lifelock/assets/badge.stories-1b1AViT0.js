import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,f as n,n as r,t as i}from"./pretty-source-BQFAze2y.js";import{n as a,t as o}from"./handlebars-helpers-7cGStAwP.js";var s;function c(){return(c=e((()=>{s=`/**
 * Molecules/Badge — core (.c-badge).
 * Figma: Web-ODS Shared Library 1284:14251 / page 539:28416.
 *
 * Axes → BEM:
 *   variant  → .c-badge--dot | --count | --text
 *   color    → .c-badge--info | --success | --warning
 *              | --error | --brand | --inverse
 *   emphasis → .c-badge--low | --high
 */

.c-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: fit-content;
  box-sizing: border-box;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
  background-color: transparent;
  color: var(--color-text-primary);
}

.c-badge__value {
  display: inline-block;
}

.c-badge__label {
  display: inline-block;
  text-transform: uppercase;
}

.c-badge--dot {
  inline-size: 8px;
  block-size: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 0;
}

.c-badge--count,
.c-badge--text {
  border-radius: var(--border-radius-pill);
  padding-block: var(--space-1);
  padding-inline: var(--space-3);
  min-inline-size: 0;
}

// --- info -------------------------------------------------------------------

.c-badge--info.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-info-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-info-subtle);
    color: var(--color-signal-info);
  }
}

.c-badge--info.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-info);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-info);
    color: var(--color-text-inverse);
  }
}

// --- success ----------------------------------------------------------------

.c-badge--success.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-success-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-success-subtle);
    color: var(--color-signal-success);
  }
}

.c-badge--success.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-success);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-success);
    color: var(--color-text-inverse);
  }
}

// --- warning ----------------------------------------------------------------

// High content stays --color-text-primary (not inverse) for WCAG on yellow.
.c-badge--warning.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-warning-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-warning-subtle);
    color: var(--color-text-primary);
  }
}

.c-badge--warning.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-warning);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-warning);
    color: var(--color-text-primary);
  }
}

// --- error (Signal/Critical) ------------------------------------------------

.c-badge--error.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-critical-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-critical-subtle);
    color: var(--color-signal-critical);
  }
}

.c-badge--error.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-critical);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-critical);
    color: var(--color-text-inverse);
  }
}

// --- brand ------------------------------------------------------------------

.c-badge--brand.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-border-brand);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-brand-soft);
    color: var(--color-text-brand);
  }
}

.c-badge--brand.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-bg-brand);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-brand);
    color: var(--color-text-inverse);
  }
}

// --- inverse (Figma Color=Inverse; was LifeLock gray) -----------------------

.c-badge--inverse.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-text-secondary);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-subtle);
    color: var(--color-text-secondary);
  }
}

.c-badge--inverse.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-bg-inverse-strong);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-inverse-strong);
    color: var(--color-text-inverse);
  }
}
`})))()}function l(e){return u({variant:e.variant||`dot`,color:e.color||`info`,emphasis:e.emphasis||`low`,countValue:e.countValue??`3`,label:e.label??`NEW`,accessibleLabel:e.accessibleLabel||``})}var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{a(),r(),c(),n(),u=o.default.compile(t),d=[`dot`,`count`,`text`],f=[`info`,`success`,`warning`,`error`,`brand`,`inverse`],p=[`low`,`high`],m=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28416&m=dev`,h={title:`Molecules/Badge`,tags:[`autodocs`],parameters:{docs:{description:{component:`Compact status / count / text badge (3 × 6 × 2 = 36 variants). Inherited from core. Color includes Inverse (not Gray). [Figma](${m}).`}}},argTypes:{variant:{control:{type:`inline-radio`},options:d,name:`Variant`},color:{control:{type:`inline-radio`},options:f,name:`Color`},emphasis:{control:{type:`inline-radio`},options:p,name:`Emphasis`},countValue:{control:`text`,name:`Count value`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`}},args:{variant:`dot`,color:`info`,emphasis:`low`,countValue:`3`,label:`NEW`,accessibleLabel:``}},g={name:`Demo`,render:e=>l(e),parameters:i(l({variant:`dot`,color:`info`,emphasis:`low`,countValue:`3`,label:`NEW`,accessibleLabel:``}),{scss:s})},_={name:`AllStyles`,render:()=>`<div style="padding:16px;">${d.flatMap(e=>p.map(t=>`
          <section style="margin-block-end:24px;">
            <h3 style="margin:0 0 12px;font:600 13px/18px system-ui,sans-serif;">
              Variant = ${e} · Emphasis = ${t}
            </h3>
            <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">
              ${f.map(n=>`
            <figure style="margin:0;display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-inline-size:72px;">
              <div>${l({variant:e,color:n,emphasis:t,countValue:`3`,label:`NEW`,accessibleLabel:e===`dot`?`${n} status`:``})}</div>
              <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${n}</figcaption>
            </figure>`).join(`
`)}
            </div>
          </section>`)).join(`
`)}</div>`},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    variant: 'dot',
    color: 'info',
    emphasis: 'low',
    countValue: '3',
    label: 'NEW',
    accessibleLabel: ''
  }), {
    scss: scssSource
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const sections = VARIANT_OPTIONS.flatMap(variant => EMPHASIS_OPTIONS.map(emphasis => {
      const cards = COLOR_OPTIONS.map(color => {
        const html = render({
          variant,
          color,
          emphasis,
          countValue: '3',
          label: 'NEW',
          accessibleLabel: variant === 'dot' ? \`\${color} status\` : ''
        });
        return \`
            <figure style="margin:0;display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-inline-size:72px;">
              <div>\${html}</div>
              <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">\${color}</figcaption>
            </figure>\`;
      }).join('\\n');
      return \`
          <section style="margin-block-end:24px;">
            <h3 style="margin:0 0 12px;font:600 13px/18px system-ui,sans-serif;">
              Variant = \${variant} · Emphasis = \${emphasis}
            </h3>
            <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">
              \${cards}
            </div>
          </section>\`;
    })).join('\\n');
    return \`<div style="padding:16px;">\${sections}</div>\`;
  }
}`,..._.parameters?.docs?.source}}},v=[`Demo`,`AllStyles`]})))()}y();export{_ as AllStyles,g as Demo,v as __namedExportsOrder,h as default};