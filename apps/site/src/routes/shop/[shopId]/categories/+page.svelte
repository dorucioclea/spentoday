<script lang="ts">
  import { Api } from "lib"
  import type { PageData } from "./$types"
  import { PUBLIC_API_URL } from "$env/static/public"
  import type { ShopCategory } from "./+page"
  import { goto } from "$app/navigation"

  export let data: PageData
  $: categories = data.categories

  let categoryInput: string = ""
  let parentInput: string | null = null
  let message: string = ""

  async function add() {
    const name = categoryInput.trim()
    if (name == "") {
      message = "Ім'я категорії не можу бути пустим."
      return
    }

    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: "/v1/categories",
      method: "POST",
      body: {
        name: name,
        shopId: data.shopId
      }
    })
    if (!response || !response.ok) {
      message = "Щось не так"
      return
    }

    const json = await Api.responseJson<ShopCategory>(response)
    if (!json) {
      message = "Щось не так"
      return
    }

    categories.push(json)
    categories = categories
  }

  async function remove(id: string) {
    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: `/v1/categories/${id}`,
      method: "DELETE"
    })
    if (!response) {
      message = "Не можемо видалити."
    } else if (response.ok) {
      categories = categories.filter((x) => x.id != id)
    } else if (response.status == Api.NOT_FOUND) {
      message = "Категорія не знайдена в базі данних."
    } else if (response.status == Api.FORBIDDEN) {
      goto("/login")
    } else {
      message = "Не можемо видалити."
    }
  }
</script>

<header />
<main class="px-6 mt-20">
  <form on:submit|preventDefault={add} class="max-w-xl m-auto flex flex-col gap-6">
    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
      bind:value={categoryInput}
      placeholder="Category name: Toys"
    />
    <div>
      <label class="block mb-2" for="parent">Parent:</label>

      <select
        id="parent"
        bind:value={parentInput}
        class="bg-gray-100 block w-full focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
      >
        <option selected value={null}>Top level category</option>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>
    <button
      class="px-6 py-3 font-semibold hover:bg-gray-900 bg-gray-800 text-white rounded-md"
      type="submit"
    >
      Add
    </button>
  </form>

  <ul class="mt-10">
    {#each categories as category}
      <li class="p-4 mb-4 border-2 rounded-md border-gray-100 flex justify-between">
        <h3>{category.name}</h3>
        {#if category.parentId}
          <span>
            parent:
            {categories.find((x) => x.id == category.parentId)?.name}
          </span>
        {/if}
        <button
          class="underline decoration-2 decoration-red-300 hover:decoration-red-500"
          on:click={() => remove(category.id)}
        >
          Delete
        </button>
      </li>
    {/each}
  </ul>
</main>
