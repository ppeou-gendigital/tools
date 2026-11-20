// Shared applicability guards.
//
// A rule should only guard on fields its href actually depends on. These cover
// the recurring cases so rules do not drift between `when` and `build` logic.

export const aemOnly = (ctx) => ctx.isAem

export const pageOnly = (ctx) =>
  ctx.isAem &&
  ctx.hasResource &&
  !ctx.isDam &&
  ctx.resourcePath.startsWith('/content/') &&
  ctx.resourcePath.split('/').filter(Boolean).length >= 3

export const damOnly = (ctx) => ctx.isAem && ctx.isDam

export const hasSite = (ctx) => ctx.isAem && Boolean(ctx.siteName)

export const traditionalOnly = (ctx) => ctx.isAem && ctx.flavor === 'traditional'
