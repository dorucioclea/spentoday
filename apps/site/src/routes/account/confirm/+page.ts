import type { PageLoad } from "./$types"
import { Api } from "lib"
import { PUBLIC_API_URL } from "$env/static/public"
import { redirect } from "@sveltejs/kit"

export const load = (async ({ fetch, url }) => {
  const token = url.searchParams.get("token")
  if (token == null) {
    return {
      message: "Токен відсутній, перевірте правильність посилання."
    }
  }

  const user = url.searchParams.get("user")
  if (user == null) {
    return {
      message: "Електронна адреса відсутня, перевірте правильність посилання."
    }
  }

  var response = await Api.publicFetch(fetch, PUBLIC_API_URL, {
    route: `/v1/auth/confirm?token=${encodeURIComponent(token)}&user=${user}`,
    method: "GET"
  })
  if (!response) {
    return {
      message: "Сервер не працює."
    }
  }
  // const status = await Api.confirm(fetch, PUBLIC_API_URL, token, user)
  if (response.ok) throw redirect(302, "/confirm-success")

  return {
    message: "Не можемо підтвердити пошту."
  }
}) satisfies PageLoad
