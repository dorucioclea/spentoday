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
// UPLOAD PRODUCT IMAGE

enum UploadProductImageStatus {
  NotImage,
  NotFound,
  CountLimitReached,
  Problem
}

type UploadProductImageResult =
  | {
      data: ImageOutput
      status?: undefined
    }
  | {
      data?: undefined
      status: UploadProductImageStatus
    }

export async function uploadProductImage(
  fetch: Fetch,
  base: string,
  input: {
    productId: string
    file: File
  }
): Promise<UploadProductImageResult> {
  const formData = new FormData()
  formData.append("file", input.file)

  const response = await secureFetch(fetch, base, {
    route: `/v1/site/products/${input.productId}/image`,
    method: "POST",
    body: formData
  })
  if (!response) return { status: UploadProductImageStatus.Problem }
  if (response.ok) {
    const json = await responseJson<ImageOutput>(response)
    if (!json) return { status: UploadProductImageStatus.Problem }
    return { data: json }
  }

  if (response.status == BAD_REQUEST) return { status: UploadProductImageStatus.NotImage }
  if (response.status == NOT_FOUND) return { status: UploadProductImageStatus.NotFound }
  if (response.status == CONFLICT) {
    return { status: UploadProductImageStatus.CountLimitReached }
  }
  return { status: UploadProductImageStatus.Problem }
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
