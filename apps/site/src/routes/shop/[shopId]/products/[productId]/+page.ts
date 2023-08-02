import { Api } from "lib"
import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"
import { error } from "@sveltejs/kit"

export type ImageOutput = {
  id: string
  key: string
  bucket: string
  provider: string
}

export type GetProductOutput = {
  id: string
  name: string
  price: number
  amount: number
  isDraft: boolean
  seoTitle: string
  seoDescription: string
  seoSlug: string
  images: ImageOutput[]
}

export const load = (async ({ fetch, params }) => {
  const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/products/${params.productId}`,
    method: "GET"
  })
  if (!response) throw error(500, "Не можемо зв'язатися з сервером")

  const json = await Api.responseJson<GetProductOutput>(response)
  if (!json)
    throw error(
      500,
      "Не можемо опрацювати данні з серверу. Зараз чортові програмісти полагодять."
    )

  return {
    product: json,
    productId: params.productId
  }
}) satisfies PageLoad
