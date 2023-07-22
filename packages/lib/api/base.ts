export type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>

export function formBody(body?: FormData | object): BodyInit | null {
  if (!body) return null

  if (body instanceof FormData) return body

  return JSON.stringify(body)
}

export async function callSecure(
  fetch: Fetch,
  route: string | URL,
  method: HttpMethod = "GET",
  body?: FormData | object
): Promise<Response | null> {
  try {
    const response = await fetch(route, {
      method: method,
      credentials: "include",
      headers: {
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
      headers: {
        accept: "application/json"
      },
      body: formBody(body)
    })

    return response
  } catch {
    return null
  }
}

export function url(base: string, path: string) {
  return new URL(path, base)
}

export const NOT_FOUND = 404
export const BAD_REQUEST = 400
export const CONFLICT = 409
