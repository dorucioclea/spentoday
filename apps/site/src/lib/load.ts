import { PUBLIC_API_URL } from "$env/static/public"
import { error, redirect } from "@sveltejs/kit"
import { Api } from "lib"

/**
 * Fetch data inside of load function.
 * Throw errors if unexpected or unauthenticated.
 */
export async function fetch(fetch: Api.Fetch, info: Api.FetchInfo) {
  const response = await Api.secureFetch(fetch, PUBLIC_API_URL, info)
  if (response == null) {
    throw error(500, {
      message: "Щось неочікуване сталося. Не кип'ятіться. Зараз полагодимо."
    })
  }
  if (response.status == 401) throw redirect(302, "/login")
  return response
}

/**
 * Get json from response inside of load function.
 * Throw errors if error happend.
 */
export async function json<T>(response: Response): Promise<T> {
  const json = await Api.responseJson<T>(response)
  if (json == null) {
    throw error(500, {
      message: "Щось неочікуване сталося. Не кип'ятіться. Зараз полагодимо."
    })
  }
  return json
}
