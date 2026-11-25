// Shared profile stamping. Publication and saved edits both move `updatedAt`
// forward, which is what `profiles list` uses to show "local changes".

export async function stampProfile(profile, ctx) {
  profile.updatedAt = new Date().toISOString()
  try {
    const me = await ctx.jira().myself()
    profile.updatedBy = me?.displayName || me?.name || profile.updatedBy || ''
  } catch {
    // Name-only edits and Confluence-only runs should not need a Jira PAT.
  }
  return profile
}
