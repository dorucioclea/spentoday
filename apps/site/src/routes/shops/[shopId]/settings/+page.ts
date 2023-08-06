import type { PageLoad } from "./$types"
import { Api } from "lib"
import { error, redirect } from "@sveltejs/kit"
import { PUBLIC_API_URL } from "$env/static/public"

export type Banner = {
  id: string
  url: string
}

export type Link = {
  id: string
  link: string
  name: string
}

export const _getLogo = async (response: Response) => {
  if (response.ok) return await Api.responseJson<string>(response)
  console.log(response.status)
  return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDsRxTnsSBMmVvRxdygcb9ue6xfUYL58YX27JLNLohHQ&s"
}

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId
  const responseLinks = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/shopsettings/${shopId}/getlinks`,
    method: "GET"
  })
  if (!responseLinks) throw error(500)
  if (responseLinks.status == 403 || responseLinks.status == 401)
    throw redirect(302, "/login")
  if (!responseLinks.ok) throw redirect(302, "/")

  const responseBanners = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/shopsettings/${shopId}/getbanners`,
    method: "GET"
  })
  if (!responseBanners) throw error(500)
  if (!responseBanners.ok) throw redirect(302, "/")

  const responseName = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/shopsettings/${shopId}/getname`,
    method: "GET"
  })

  if (!responseName) throw error(500)
  if (!responseName.ok) throw redirect(302, "/")
  const responseLogo = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/shopsettings/${shopId}/getlogo`,
    method: "GET"
  })
  if (!responseLogo) throw error(500)

  const links = await Api.responseJson<Link[]>(responseLinks)
  const banners = await Api.responseJson<Banner[]>(responseBanners)
  const name = await Api.responseJson<string>(responseName)
  const logo = _getLogo(responseLogo)

  return {
    links,
    banners,
    shopId,
    name,
    logo
  }
}) satisfies PageLoad
