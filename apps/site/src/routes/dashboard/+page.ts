import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"
import { Api } from "lib"
import { error, redirect } from "@sveltejs/kit"
import { routes } from "$lib"

export type DashboardShop = {
  name: string
  id: string
}

/*

- shops 
- user info

*/

export const load = (async ({ fetch, url }) => {
  const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: "/v1/site/dashboard/shops",
    method: "GET"
  })

  if (!response) throw error(500)

  if (response.status == 403 || response.status == 401) throw redirect(302, routes.login)

  if (!response.ok) throw redirect(302, "/")

  const shops = await Api.responseJson<DashboardShop[]>(response)
  return { shops }
}) satisfies PageLoad
