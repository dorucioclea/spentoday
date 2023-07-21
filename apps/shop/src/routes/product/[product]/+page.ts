import type { PageLoad } from "./$types"
import { Api } from "lib"
import { redirect } from "@sveltejs/kit"
import { api } from "$lib"

type FullProduct = {
  name: string
  price: string
  images: string[]

  seoTitle: string
  seoDescription: string
}

/*

- images
- title, price, salePrice, description 
- categories
- properties

*/

export const load = (async ({ url, fetch, params }) => {
  const domain = url.hostname
  const product = params.product

  // fetch shop metadata and products

  const response = await Api.callPublic(
    fetch,
    api(`/api/shop/${domain}/product/${product}`)
  )

  if (!response || !response.ok) throw redirect(302, `/${domain}`)

  const json = (await response.json()) as FullProduct

  return json
}) satisfies PageLoad
