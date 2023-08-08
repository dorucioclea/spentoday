import { error, redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { call, callJson } from "$lib/fetch"
import type { ShopDomain } from "$lib/api"

/*

- get orders of shop (user should own shop)
- search orders of shop

*/

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId

  const response = await call(fetch, "load", {
    route: `/v1/site/domains/${shopId}`,
    method: "GET"
  })
  if (response == null) throw error(500, "Не можемо підгрузити ващі домени.")

  if (response.status == 401) throw redirect(302, "/login")

  const data = await callJson<ShopDomain[]>(response)
  if (data == null) throw error(500, "Не можемо підгрузити ващі домени.")

  return {
    shopId: shopId,
    domains: data
  }
}) satisfies PageLoad
