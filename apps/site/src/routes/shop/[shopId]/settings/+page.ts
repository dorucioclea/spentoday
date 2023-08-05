import { Api } from "lib"
import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"
import { error, redirect } from "@sveltejs/kit"

export type Banner = {
  id: string
  url: string
}

export type Link = {
  id: string
  link: string
  name: string
}
export type Shopsettings={
  banners: Banner[]
  links: Link[]
  name: string
  logo: string
}

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId
  const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/shopsettings/${shopId}/getshop`,
    method: "GET"
  })
  console.log(response)
  if (!response) throw error(500)
  if (response.status == 403 || response.status == 401)
    throw redirect(302, "/login")
  if (!response.ok) throw redirect(302, "/")

  const shop = await Api.responseJson<Shopsettings>(response)
  console.log(shop)
  if(shop == null) throw error(500)
  const banners = shop.banners
  const links = shop.links
  const name = shop.name
  const logo = shop.logo
  console.log(logo)
 return {
    shopId,
    logo,
    name,
    banners,
    links
  }
}) satisfies PageLoad
