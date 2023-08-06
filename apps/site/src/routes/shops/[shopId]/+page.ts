import { Api } from "lib"
import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"
import { error } from "@sveltejs/kit"

/*

Need:
- shop info
- products

*/

export const load = (async ({ fetch, params }) => {
  const products = await Api.shopProducts(fetch, PUBLIC_API_URL, {
    shopId: params.shopId,
    start: 0,
    count: 10
  })
  if (!products) throw error(500, { message: "AAAA" })

  return {
    products: products
  }
}) satisfies PageLoad
