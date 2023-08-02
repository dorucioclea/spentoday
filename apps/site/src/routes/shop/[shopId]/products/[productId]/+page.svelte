<script lang="ts">
  import slugify from "@sindresorhus/slugify"
  import type { PageData } from "./$types"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { Api } from "lib"
  import { imageUrl } from "lib/api"

  export let data: PageData
  $: images = data.product.images

  let name: string = data.product.name
  let price: number = data.product.price
  let amount: number = data.product.amount
  let seoTitle: string = data.product.seoTitle
  let seoDescription: string = data.product.seoDescription
  let seoSlug: string = data.product.seoSlug
  let files: FileList

  let status: string = "Збережено"
  let timer: number = 0

  function debounceChange() {
    status = "Пишеться"
    clearTimeout(timer)
    timer = setTimeout(change, 700)
  }

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

    status = "Зберігається..."
    const updated = await Api.updateProduct(fetch, PUBLIC_API_URL, input)
    if (!updated) {
      status = "Не зберіглося"
      return
    }

    status = "Збережене"
    if (input.seoSlug) data.product.seoSlug = input.seoSlug
    if (input.seoTitle) data.product.seoTitle = input.seoTitle
    if (input.seoDescription) data.product.seoDescription = input.seoDescription
    if (input.name) data.product.name
    if (input.price) data.product.price = input.price
    if (input.amount) data.product.amount = input.amount
  }

  async function uploadImage() {
    const file = files.item(0)
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: `/v1/site/products/${data.productId}/image`,
      method: "POST",
      body: formData
    })
    if (!response || !response.ok) return alert("problem")
  }

  async function deleteImage(imageId: string) {
    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: `/v1/site/products/image/${imageId}`,
      method: "DELETE"
    })
    if (!response || !response.ok) return alert("problem")

    images = images.filter((x) => x.id != imageId)
  }
</script>

<h1 class="text-3xl text-center my-10 font-semibold">Редактувати продукт</h1>

<section class="flex flex-col gap-4 max-w-3xl m-auto">
  <span class="py-2 border-b border-gray-100">{status}</span>

  <div class="grid grid-cols-4 gap-2 my-4">
    {#each images as image (image.id)}
      <div>
        <img class="p-2 rounded-t bg-gray-50" src={Api.imageUrl(image)} alt="Product" />
        <button
          on:click={() => deleteImage(image.id)}
          class="w-full rounded-b p-2 bg-red-100 hover:bg-red-200 text-red-800"
        >
          Delete
        </button>
      </div>
    {/each}
  </div>

  <input type="file" bind:files />
  <!-- <button on:click={uploadImage}>Upload file</button> -->

  <input
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={name}
    on:keyup={debounceChange}
    placeholder="Name"
  />
  <input
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={price}
    on:keyup={debounceChange}
    type="number"
    placeholder="Price"
  />
  <input
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={amount}
    on:keyup={debounceChange}
    type="number"
    placeholder="Amount"
  />

  <h3 class="mt-4 text-2xl">SEO - search engine optimizations</h3>
  <input
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
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
  <input
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={seoTitle}
    on:keyup={debounceChange}
    placeholder="Назва"
  />
  <textarea
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={seoDescription}
    on:keyup={debounceChange}
    placeholder="Опис"
    rows="10"
  />
</section>
