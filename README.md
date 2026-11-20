# Jira Capacity

Chrome extension (Manifest V3) that exports Jira capacity reports and ticket
comments as formatted HTML for pasting into Excel.

Built with React (plain JavaScript), Mantine, and Vite via
`@crxjs/vite-plugin`.

> This extension only works when the popup is opened on a logged-in Jira tab.
> Every Jira request is executed by the content script running on that tab, so
> the corporate SSO session is the only credential involved.

## Develop

```bash
npm install
npm run dev     # Vite dev server with extension HMR
npm test        # node:test suite for the pure report engine
npm run build   # production build into dist/
```

Load `dist/` via **chrome://extensions → Developer mode → Load unpacked**.

## Layout

```
src/lib/jira/       pure engine: JQL, field catalog, parsers, table builder
src/runtime/        chrome messaging, tab gate, clipboard, injected runner
src/state/          chrome.storage backed profiles and working config
src/components/     popup UI pieces
src/App.jsx         popup shell
```
