import { PUBLIC_API_URL } from "$env/static/public"
import type { PageLoad } from "./$types"
import { Api } from "lib"

/*

- get orders of shop (user should own shop)
- search orders of shop

*/
export type ShopDomain = {
  domain: string
  verifications?: {
    type: string
    domain: string
    value: string
  }[]
}

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId

  const response = await Api.callSecure(fetch, PUBLIC_API_URL, `/v1/domains/${shopId}`)
  if (response == null)
    return {
      domains: []
    }

  const data = await Api.responseJson<ShopDomain[]>(response)
  if (data == null) return {}

  return {
    shopId: shopId,
    domains: data
  }
}) satisfies PageLoad
