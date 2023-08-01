<script lang="ts">
  import slugify from "@sindresorhus/slugify"
  import { Api } from "lib"
  import type { PageData } from "./$types"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { routes } from "$lib"

  export let data: PageData

  let newProduct: string = ""

  async function add() {
    console.log("stct")
    const name = newProduct.trim()
    if (name == "") {
      alert("Name can't be empty")
      return
    }

    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: "/v1/site/products",
      method: "POST",
      body: {
        name: name,
        seoSlug: slugify(name),
        shopId: data.shopId
      }
    })
    if (!response) return alert("Server oops!")

    const json = await Api.responseJson<Api.Product>(response)
    if (!json) return alert("trcstecr")

    data.products.push(json)
    data = data
  }
</script>

<form on:submit|preventDefault={add} class="max-w-xl m-auto flex flex-col gap-6">
  <h1>Add</h1>

  <input
    class="bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={newProduct}
    placeholder="New product name: Coat of Goat"
  />

  <button type="submit">Add</button>
</form>

{#each data.products as product}
  <div>
    <span>
      {product.name}
    </span>
    {product.isDraft}

    <a class="decoration" href={routes.shopProduct(data.shopId, product.id)}>Edit</a>
  </div>
{/each}
