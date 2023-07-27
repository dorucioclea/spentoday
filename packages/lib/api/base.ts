export type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>

function formBody(body?: FormData | object): BodyInit | null {
  if (!body) return null

  if (body instanceof FormData) return body

  return JSON.stringify(body)
}

export async function callSecure(
  fetch: Fetch,
  base: string,
  route: `/${string}`,
  method: HttpMethod = "GET",
  body?: FormData | object
): Promise<Response | null> {
  try {
    const response = await fetch(new URL(route, base), {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type":
          body instanceof FormData ? "multipart/form-data" : "application/json",
        accept: "application/json",
        "double-submit": "uhe1"
      },
      body: formBody(body)
    })

    return response
  } catch {
    return null
  }
}

export async function callPublic(
  fetch: Fetch,
  base: string,
  route: `/${string}`,
  method: HttpMethod = "GET",
  body?: FormData | object
): Promise<Response | null> {
  try {
    const response = await fetch(new URL(route, base), {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type":
          body instanceof FormData ? "multipart/form-data" : "application/json",
        accept: "application/json"
      },
      body: formBody(body)
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
