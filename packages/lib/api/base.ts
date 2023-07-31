export type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>

type CallInfo = {
  route: `/${string}`
  method: HttpMethod
  body?: FormData | object
}

/** Send request to secure route of api */
export async function secureFetch(fetch: Fetch, base: string, info: CallInfo) {
  try {
    let headers = new Headers({
      accept: "application/json",
      "double-submit": "ueqc1"
    })

    let body = undefined
    if (info.body) {
      if (info.body instanceof FormData) {
        headers.append("content-type", "multipart/form-data")
        body = info.body
      } else {
        headers.append("content-type", "application/json")
        body = JSON.stringify(info.body)
      }
    }

    const response = await fetch(new URL(info.route, base), {
      method: info.method,
      credentials: "include",
      headers: headers,
      body: body
    })

    return response
  } catch {
    return null
  }
}

/** Send request to public route of api */
export async function publicFetch(fetch: Fetch, base: string, info: CallInfo) {
  try {
    let headers = new Headers({
      accept: "application/json"
    })

    let body = undefined
    if (info.body) {
      if (info.body instanceof FormData) {
        headers.append("content-type", "multipart/form-data")
        body = info.body
      } else {
        headers.append("content-type", "application/json")
        body = JSON.stringify(info.body)
      }
    }

    const response = await fetch(new URL(info.route, base), {
      method: info.method,
      credentials: "include",
      headers: headers,
      body: body
    })

    return response
  } catch {
    return null
  }
}

/** Return json from response or null if error appeared. */
export async function responseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

export const NOT_FOUND = 404
export const BAD_REQUEST = 400
export const CONFLICT = 409
export const FORBIDDEN = 403
export const PROBLEM = 403
