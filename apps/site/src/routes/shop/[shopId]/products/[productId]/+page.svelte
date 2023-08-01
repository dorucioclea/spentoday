<script lang="ts">
  import slugify from "@sindresorhus/slugify"
  import type { PageData } from "./$types"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { debounce } from "$lib"
  import { Api } from "lib"

  export let data: PageData

  let name: string
  let price: number
  let amount: number
  let seoTitle: string
  let seoDescription: string
  let seoSlug: string

  let timer: number = 0

  const debounceChange = debounce(timer, change)

  async function change() {
    const input: Api.UpdateProductInput = { id: data.productId }

    if (data.product.seoSlug != seoSlug) input.seoSlug = seoSlug.slice()
    if (data.product.seoTitle != seoTitle) input.seoTitle = seoTitle.slice()
    if (data.product.seoDescription != seoDescription) {
      input.seoDescription = seoDescription.slice()
    }
    if (data.product.name != name) input.name = name.slice()
    if (data.product.price != price) input.price = price
    if (data.product.amount != amount) input.amount = amount

    const updated = await Api.updateProduct(fetch, PUBLIC_API_URL, input)
    if (!updated) return alert("Can't update")

    if (input.seoSlug) data.product.seoSlug = input.seoSlug
    if (input.seoTitle) data.product.seoTitle = input.seoTitle
    if (input.seoDescription) data.product.seoDescription = input.seoDescription
    if (input.name) data.product.name
    if (input.price) data.product.price = input.price
    if (input.amount) data.product.amount = input.amount
  }
</script>

<h1>{data.product.name}</h1>

<div class="flex flex-col gap-4">
  <h3 class="mb-4 text-2xl">SEO - search engine optimizations</h3>
  <input
    bind:value={seoSlug}
    on:keyup={debounceChange}
    on:input={() => {
      seoSlug = slugify(seoSlug.replace(" ", "-"), { preserveTrailingDash: true })
    }}
    on:change={() => {
      seoSlug = slugify(seoSlug)
    }}
    placeholder="Slug, приклад: product-name"
  />
  <input bind:value={seoTitle} placeholder="Назва" />
  <input bind:value={seoDescription} placeholder="Опис" />
</div>
