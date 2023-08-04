import { PUBLIC_API_URL } from "$env/static/public"
import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { Api } from "lib"

/*

- get orders of shop (user should own shop)
- search orders of shop

*/

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId

  const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/domains/${shopId}`,
    method: "GET"
  })
  if (response == null) throw error(500, "Не можемо підгрузити ващі домени.")

  const data = await Api.responseJson<Api.ShopDomain[]>(response)
  if (data == null) throw error(500, "Не можемо підгрузити ващі домени.")

  return {
    shopId: shopId,
    domains: data
  }
}) satisfies PageLoad
