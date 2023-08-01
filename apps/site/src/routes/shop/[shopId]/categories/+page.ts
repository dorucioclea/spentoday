import { PUBLIC_API_URL } from "$env/static/public"
import { error, redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { Api } from "lib"

export type ShopCategory = {
  id: string
  name: string
  parentId: string | null
}

export const load = (async ({ fetch, params }) => {
  const shopId = params.shopId

  const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/site/categories/${shopId}`,
    method: "GET"
  })
  if (!response) throw error(Api.PROBLEM, { message: "Сталася помилка, вибачайте!" })

  if (response.status == Api.FORBIDDEN) throw redirect(302, "/login")
  if (!response.ok) throw error(Api.PROBLEM, { message: "Щось пішло не так, вибачайте!" })

  const data = await Api.responseJson<ShopCategory[]>(response)
  if (!data) throw error(Api.PROBLEM, { message: "Хмм, проблема!" })

  return {
    categories: data,
    shopId: shopId
  }
}) satisfies PageLoad
