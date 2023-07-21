import { Api } from "$lib"
import { error, redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

// export const ssr = false // if just client side rendering

type DashboardShop = {
  name: string
}

/*

- shops 
- user info

*/

export const load = (async (event) => {
  const response = await Api.callSecure(event.fetch, "/api/dashboard/shops")

  console.log(event.url)

  if (!response) throw error(500)

  if (response.status == 403 || response.status == 401)
    throw redirect(302, "/dashboald/login")

  if (!response.ok) throw redirect(302, "/")

  const json = (await response.json()) as DashboardShop[]

  const shops: DashboardShop[] = [
    {
      name: "Shop 1"
    },
    {
      name: "Shop 2"
    }
  ]

  return { shops }
}) satisfies PageLoad
