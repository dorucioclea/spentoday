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

export async function removeDomain(
  fetch: Fetch,
  base: string,
  shopId: string,
  domain: string
): Promise<"fail" | "ok" | "not-found" | "bad-domain"> {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/domains/${shopId}/${domain}`,
    method: "DELETE"
  })
  if (!response) return "fail"
  if (response.ok) return "ok"
  if (response.status == 404) return "not-found"
  if (response.status == 400) return "bad-domain"
  return "fail"
}

export async function addDomain(
  fetch: Fetch,
  base: string,
  input: {
    shopId: string
    domain: string
  }
): Promise<
  | {
      status: "fail" | "no-permission" | "bad-domain" | "has-free-domain" | "domain-taken"
      data?: undefined
    }
  | {
      data: ShopDomain
      status: "ok"
    }
> {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/domains/${input.shopId}`,
    method: "POST",
    body: { domain: input.domain }
  })
  if (!response) return { status: "fail" }
  if (response.ok) {
    var json = await responseJson<ShopDomain>(response)
    if (!json) return { status: "fail" }
    return { data: json, status: "ok" }
  }

  if (response.status == 409) {
    var reason = await responseJson<"has-free-domain" | "domain-taken">(response)
    return { status: reason ?? "fail" }
  }
  if (response.status == 400) return { status: "bad-domain" }
  if (response.status == 403) return { status: "no-permission" }

  return { status: "fail" }
}
