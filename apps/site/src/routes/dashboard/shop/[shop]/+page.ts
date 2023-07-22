import type { PageLoad } from "./$types"

/*

Need:
- shop info
- products

*/

export const load = (async ({ fetch, url }) => {
  const domain = url.hostname

  return {
    domain
  }
}) satisfies PageLoad
