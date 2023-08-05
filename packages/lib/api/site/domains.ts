import type { Fetch } from "../base"
import { secureFetch, responseJson } from "../base"

export type ShopDomain =
  | {
      domain: string
      gotStatus: true
      verifications?: {
        type: string
        domain: string
        value: string
      }[]
    }
  | {
      domain: string
      gotStatus: false
      verifications: undefined
    }

export async function verifyDomain(
  fetch: Fetch,
  base: string,
  domain: string
): Promise<
  | {
      status: "ok" | "problem" | "bad-domain"
    }
  | {
      data: ShopDomain
      status: "not-verified"
    }
> {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/domains/${domain}/verify`,
    method: "PATCH"
  })
  if (!response) return { status: "problem" }
  if (response.status == 200) return { status: "ok" }

  if (response.status == 202) {
    const json = await responseJson<ShopDomain>(response)
    if (!json) return { status: "problem" }
    return { data: json, status: "not-verified" }
  }
  if (response.status == 404) return { status: "bad-domain" }
  return { status: "problem" }
}
