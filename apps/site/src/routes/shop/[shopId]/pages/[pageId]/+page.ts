import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"
import { Api } from "lib"

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId
  const response = Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: "/v1/",
    method: "GET"
  })

  return {
    shopId
  }
}) satisfies PageLoad
