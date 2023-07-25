import { responseJson, callSecure, callPublic } from "./base"
import type { Fetch } from "./base"
export async function dashboardShops() {}

//
// Orders

export type Order = {
  id: string
  productId: string
  productSlug: string
  email: string
  amount: string
  price: string
}

export async function shopOrders(
  fetch: Fetch,
  base: string,
  shop: string,
  customerEmail: string,
  productName: string
): Promise<Order[] | null> {
  const response = await callSecure(
    fetch,
    base,
    `/v1/orders/${shop}?email=${customerEmail}&product=${productName}`
  )
  if (!response) return null

  return await responseJson<Order[]>(response)
}

type InfoPage = {
  id: string
  title: string
}

export async function shopInfoPages(
  fetch: Fetch,
  base: string,
  shop: string
): Promise<InfoPage[] | null> {
  const response = await callPublic(fetch, base, `/v1/shop/${shop}/pages`)
  return response ? await responseJson<InfoPage[]>(response) : null
}
