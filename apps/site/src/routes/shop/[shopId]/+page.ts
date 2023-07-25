import type { PageLoad } from "./$types"

/*

Need:
- shop info
- products

*/

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId

  return {
    shopId
  }
}) satisfies PageLoad
