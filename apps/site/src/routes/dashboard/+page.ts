import { Api } from "lib"
import { error, redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"

// export const ssr = false // if just client side rendering

export type DashboardShop = {
  name: string,
  id: string
}

/*

- shops 
- user info

*/

export const load = (async ({ fetch, url }) => {

  
  const response = await Api.secureFetch(fetch,PUBLIC_API_URL, 
    {
      route:"/v1/dashboard/shops",
      method: "GET"
    })

  console.log(url)
 
  if (!response) throw error(500)

  if (response.status == 403 || response.status == 401) throw redirect(302, "/login")

  if (!response.ok) throw redirect(302, "/")

  const shops = (await response.json()) as DashboardShop[]

  console.log(response.status);
  return { shops }
}) satisfies PageLoad
