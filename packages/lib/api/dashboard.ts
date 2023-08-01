import { publicFetch, responseJson, secureFetch } from "./base"
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
  info: {
    shop: string
    customerEmail: string
    productName: string
  }
): Promise<Order[] | null> {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/orders/${info.shop}?email=${info.customerEmail}&product=${info.productName}`,
    method: "GET"
  })
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
  const response = await publicFetch(fetch, base, {
    route: `/v1/site/shop/${shop}/pages`,
    method: "GET"
  })
  return response ? await responseJson<InfoPage[]>(response) : null
}

export type Product = {
  id: string
  name: string
  price: number
  isDraft: boolean
}

export async function shopProducts(
  fetch: Fetch,
  base: string,
  query: {
    shopId: string
    start: number
    count: number
  }
) {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/products/shop/${query.shopId}?start=${query.start}&count=${query.count}`,
    method: "GET"
  })
  if (!response || !response.ok) return null

  const json = await responseJson<Product[]>(response)
  return json
}

//

export type UpdateProductInput = {
  id: string
  name?: string
  price?: number
  amount?: number
  isDraft?: boolean
  seoTitle?: string
  seoDescription?: string
  seoSlug?: string
}

export async function updateProduct(
  fetch: Fetch,
  base: string,
  input: UpdateProductInput
) {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/products`,
    method: "PATCH",
    body: input
  })
  return response != null && response.ok
}
