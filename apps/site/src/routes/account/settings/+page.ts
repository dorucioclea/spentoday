import type { PageLoad } from "./$types"
import { Api } from "lib"
import { PUBLIC_API_URL } from "$env/static/public"
import { error, redirect } from "@sveltejs/kit"
import { imageUrl, responseJson } from "lib/api"

export type UserOutput = {
  name: string
  imageUrl: string
}

export const load = (async ({fetch}) => {
 
    var response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
    route: "/v1/site/account/user",
    method: "GET"
  })
  if (!response) {
    return {
      message: "Сервер не працює."
    }
  }

  if (response.ok) {
    var user = await responseJson<UserOutput>(response)
    if (user == null) throw error

    return {
        name: user.name,
        imageUrl: user.imageUrl
    }
  }
}) satisfies PageLoad