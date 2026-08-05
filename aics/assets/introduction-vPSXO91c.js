import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./react-Bl2r1tuC.js";import{a as r}from"./chunk-W22LQPXL-CPu2TbWr.js";import{a as i,o as a}from"./blocks-Cn9MpxaW.js";function o(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...t(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Introduction`}),`
`,(0,c.jsx)(n.h1,{id:`storybook-core`,children:`Storybook core`}),`
`,(0,c.jsxs)(n.p,{children:[`White-label / core library package (`,(0,c.jsx)(n.code,{children:`@aics/storybook-core`}),`) on port `,(0,c.jsx)(n.strong,{children:`6001`}),`.`]}),`
`,(0,c.jsxs)(n.ul,{children:[`
`,(0,c.jsxs)(n.li,{children:[`Sole theme: `,(0,c.jsx)(n.code,{children:`themes/default`}),` (`,(0,c.jsx)(n.code,{children:`data-theme="default"`}),`)`]}),`
`,(0,c.jsx)(n.li,{children:`No Brand toolbar`}),`
`,(0,c.jsx)(n.li,{children:`Brands inherit from this package; they never import each other`}),`
`]}),`
`,(0,c.jsx)(n.h2,{id:`for-ai-agents`,children:`For AI agents`}),`
`,(0,c.jsxs)(n.p,{children:[`This hub is `,(0,c.jsx)(n.strong,{children:`not`}),` a consumption surface. Open the brand library you need,
then follow that brand’s agent contract:`]}),`
`,`
`,(0,c.jsxs)(n.ul,{children:[`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(`a`,{href:`./AGENTS.md`,children:(0,c.jsx)(`code`,{children:`/AGENTS.md`})}),` — hub router (pick a brand)`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(`a`,{href:`./README.md`,children:(0,c.jsx)(`code`,{children:`/README.md`})}),` — hub overview`]}),`
`,(0,c.jsxs)(n.li,{children:[`Then e.g. `,(0,c.jsx)(`a`,{href:`./norton/AGENTS.md`,children:(0,c.jsx)(`code`,{children:`/norton/AGENTS.md`})}),` →
`,(0,c.jsx)(`a`,{href:`./norton/llms.txt`,children:(0,c.jsx)(`code`,{children:`/norton/llms.txt`})}),` →
`,(0,c.jsx)(`a`,{href:`./norton/api/index.json`,children:(0,c.jsx)(`code`,{children:`/norton/api/…`})})]}),`
`]}),`
`,(0,c.jsx)(n.p,{children:`(Composed preview / Pages only — brand segments are not present on port 6001 alone.)`}),`
`,(0,c.jsx)(n.h2,{id:`brand-storybooks`,children:`Brand Storybooks`}),`
`,(0,c.jsxs)(n.p,{children:[`Each brand runs as its own Storybook package (hot reload on its own port
during day-to-day work). After `,(0,c.jsx)(n.code,{children:`npm run build:storybooks`}),` at the repo
root, the same packages are composed into one static site:`]}),`
`,(0,c.jsxs)(n.p,{children:[`| Brand | Local dev | Composed path |
|---|---|---|
| Core (this package) | `,(0,c.jsx)(n.a,{href:`http://localhost:6001`,rel:`nofollow`,children:`http://localhost:6001`}),` | `,(0,c.jsx)(n.code,{children:`.`}),` (this hub) |
| LifeLock | `,(0,c.jsx)(n.a,{href:`http://localhost:6101`,rel:`nofollow`,children:`http://localhost:6101`}),` | `,(0,c.jsx)(n.a,{href:`lifelock/`,children:`lifelock/`}),` |
| Norton | `,(0,c.jsx)(n.a,{href:`http://localhost:6102`,rel:`nofollow`,children:`http://localhost:6102`}),` | `,(0,c.jsx)(n.a,{href:`norton/`,children:`norton/`}),` |
| AVG | `,(0,c.jsx)(n.a,{href:`http://localhost:6103`,rel:`nofollow`,children:`http://localhost:6103`}),` | `,(0,c.jsx)(n.a,{href:`avg/`,children:`avg/`}),` |
| Avast | `,(0,c.jsx)(n.a,{href:`http://localhost:6104`,rel:`nofollow`,children:`http://localhost:6104`}),` | `,(0,c.jsx)(n.a,{href:`avast/`,children:`avast/`}),` |`]}),`
`,(0,c.jsxs)(n.p,{children:[`Relative composed-path links resolve under local preview (`,(0,c.jsx)(n.code,{children:`/`}),`) and under
GitHub Pages (`,(0,c.jsx)(n.code,{children:`/<repo>/<branch>/`}),`). On local port `,(0,c.jsx)(n.strong,{children:`6001`}),` alone they only
work after `,(0,c.jsx)(n.code,{children:`npm run build:storybooks`}),` + `,(0,c.jsx)(n.code,{children:`npm run preview:storybooks`}),`.
Storybook docs may rewrite them to in-app `,(0,c.jsx)(n.code,{children:`?path=`}),` routes — for the
composed site, open brand URLs in the address bar. Use the local-dev
URLs for hot reload.`]}),`
`,(0,c.jsxs)(n.p,{children:[`Legacy packages live under `,(0,c.jsx)(n.code,{children:`legacy/storybook`}),` and `,(0,c.jsx)(n.code,{children:`legacy/storybook-lifelock`}),`.`]})]})}function s(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),n(),a()})))()}l();export{s as default};