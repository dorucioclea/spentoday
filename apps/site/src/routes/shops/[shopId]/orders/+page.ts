import type { PageLoad } from "./$types"
import type { Api } from "lib"

/*

- get orders of shop (user should own shop)
- search orders of shop

*/
export const load = (async ({ fetch, params }) => {
  const orders: Api.Order[] = []

  return {
    shopId: params.shopId,
    orders: orders
  }
}) satisfies PageLoad
