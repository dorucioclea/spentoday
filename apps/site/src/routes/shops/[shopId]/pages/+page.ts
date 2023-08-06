import { Api } from "lib"
import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"
import { error } from "@sveltejs/kit"

type PageResponse = {
  slug: string
  title: string
  updatedAt: string
}

type Page = {
  slug: string
  title: string
  updatedAt: Date
}

export const load = (async ({ fetch, params }) => {
  const response = await Api.publicFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/dashboard/${params.shopId}/pages`,
    method: "GET"
  })
  if (!response) return { pages: [] as Page[] } //throw error(500)

  const json = await Api.responseJson<PageResponse[]>(response)
  if (!json) return { pages: [] as Page[] } // throw error(500)

  const pages: Page[] = json.map((x) => ({
    slug: x.slug,
    title: x.title,
    updatedAt: new Date(x.updatedAt)
  }))

  return {
    pages,
    shopId: params.shopId
  }
}) satisfies PageLoad
