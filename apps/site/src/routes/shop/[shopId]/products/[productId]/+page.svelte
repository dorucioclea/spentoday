<script lang="ts">
  import slugify from "@sindresorhus/slugify"
  import type { PageData } from "./$types"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { Api } from "lib"
  import type { ImageOutput } from "./+page"

  export let data: PageData
  $: images = data.product.images

  let name: string = data.product.name
  let price: number = data.product.price
  let amount: number = data.product.amount
  let seoTitle: string = data.product.seoTitle
  let seoDescription: string = data.product.seoDescription
  let seoSlug: string = data.product.seoSlug

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

    if (Object.keys(input).length <= 1) return

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

  async function uploadImage(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const file = event.currentTarget.files?.item(0)
    if (!file) return alert("Can't upload")

    const formData = new FormData()
    formData.append("file", file)
    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: `/v1/site/products/${data.productId}/image`,
      method: "POST",
      body: formData
    })
    if (!response || !response.ok) return alert("problem")

    const json = await Api.responseJson<ImageOutput>(response)
    if (!json) return alert("something wrong")

    images.push(json)
    images = images
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

    {#if images.length < 12}
      <label
        for="dropzone-file"
        class="flex items-center justify-center bg-gray-100 hover:bg-gray-50
        border border-gray-300 border-dashed rounded cursor-pointer"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            class="w-8 h-8 mb-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p class="mb-2 text-sm text-gray-500 font-semibold">Click to upload image</p>
        </div>
        <input
          on:change={uploadImage}
          id="dropzone-file"
          accept="image/*"
          type="file"
          class="hidden"
        />
      </label>
    {/if}
  </div>

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
