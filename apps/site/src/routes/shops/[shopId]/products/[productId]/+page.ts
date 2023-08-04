import { Api } from "lib"
import type { PageLoad } from "./$types"
import { PUBLIC_API_URL } from "$env/static/public"
import { error } from "@sveltejs/kit"

export const load = (async ({ fetch, params }) => {
  const output = await Api.oneProduct(fetch, PUBLIC_API_URL, params.productId)
  if (!output) {
    throw error(
      500,
      "Не можемо опрацювати данні з серверу. Зараз чортові програмісти полагодять."
    )
  }

  return {
    product: output.product,
    categories: output.categories,
    productId: params.productId
  }
}) satisfies PageLoad
