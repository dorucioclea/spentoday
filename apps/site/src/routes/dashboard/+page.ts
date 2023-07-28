import type { PageLoad } from "./$types"
import { Api } from "lib"
import { PUBLIC_API_URL } from "$env/static/public"

type DashboardShop = {
  name: string
}

/*

- shops 
- user info

*/

export const load = (async ({ fetch, url }) => {
  const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: "/v1/auth/me",
    method: "GET"
  })
  console.log(response?.status)
  if (response == null) return { me: null }

  var me = await Api.responseJson(response)

  return { me }
}) satisfies PageLoad
