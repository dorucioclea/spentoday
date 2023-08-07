import { BAD_REQUEST, CONFLICT, NOT_FOUND, responseJson, secureFetch } from "../base"
import type { Fetch } from "../base"

//
// GET ONE PRODUCT TO EDIT

export type OneProductOutput = {
  product: ProductOutput
  categories: CategoryOutput[]
}

export type ImageOutput = {
  id: string
  key: string
  bucket: string
  provider: string
}

type ProductOutput = {
  id: string
  name: string
  price: number
  amount: number
  isDraft: boolean
  seoTitle: string
  seoDescription: string
  seoSlug: string
  description: string
  images: ImageOutput[]
}

type CategoryOutput = {
  id: string
  name: string
  assigned: boolean
}

export async function oneProduct(fetch: Fetch, base: string, productId: string) {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/products/${productId}`,
    method: "GET"
  })
  if (!response) return null

  const json = await responseJson<OneProductOutput>(response)
  return json
}

//
// PUBLISH PRODUCT

export async function publishProduct(
  fetch: Fetch,
  base: string,
  productId: string
): Promise<"ok" | "fail" | "not-found"> {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/products/${productId}/publish`,
    method: "POST"
  })
  if (!response) return "fail"
  if (response.ok) return "ok"
  if (response.status == 404) return "not-found"
  return "fail"
}

//
// UPLOAD PRODUCT IMAGE
export async function uploadProductImage(
  fetch: Fetch,
  base: string,
  input: {
    productId: string
    file: File
  }
): Promise<
  | {
      data: ImageOutput
      status?: undefined
    }
  | {
      status: "not-image" | "not-found" | "count-limit-reached" | "problem"
    }
> {
  const formData = new FormData()
  formData.append("file", input.file)

  const response = await secureFetch(fetch, base, {
    route: `/v1/site/products/${input.productId}/image`,
    method: "POST",
    body: formData
  })
  if (!response) return { status: "problem" }
  if (response.ok) {
    const json = await responseJson<ImageOutput>(response)
    if (!json) return { status: "problem" }
    return { data: json }
  }
  if (response.status == CONFLICT) return { status: "count-limit-reached" }
  if (response.status == BAD_REQUEST) return { status: "not-image" }
  if (response.status == NOT_FOUND) return { status: "not-found" }
  return { status: "problem" }
}

//
// DELETE PRODUCT IMAGE

export async function deleteProductImage(fetch: Fetch, base: string, imageId: string) {
  const response = await secureFetch(fetch, base, {
    route: `/v1/site/products/image/${imageId}`,
    method: "DELETE"
  })
  return response && response.ok
}

//
// CHANGE PRODUCT CATEGORY

export async function changeProductCategory(
  fetch: Fetch,
  base: string,
  input: {
    categoryId: string
    productId: string
  }
) {
  const response = await secureFetch(fetch, base, {
    route: "/v1/site/products/categories",
    method: "PATCH",
    body: {
      productId: input.productId,
      categoryId: input.categoryId
    }
  })
  if (!response) return false
  return response.ok
}
