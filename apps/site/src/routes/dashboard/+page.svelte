<script lang="ts">
  import type { PageData } from "./$types"
  import { goto } from "$app/navigation"
  import { error, redirect } from "@sveltejs/kit"
  import { z } from "zod"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { Api } from "lib"
    import type { DashboardShop } from "./+page"

  let shopName: string = ""

  $: isInvalid = shopName.trim() == ""
    
  $: shops = data.shops ?? []
  async function addShop() {
    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
     route: "/v1/dashboard/addshop",
     method: "POST",
     body: {
      shopName: shopName
     }
    })

    if (!response) throw error(500)

    if (response.status == 403 || response.status == 401) throw redirect(302, "/login")

    if (!response.ok) throw redirect(302, "/")

    if (response.ok) {
      const shop = (await Api.responseJson(response))as DashboardShop
      shops.push(shop)
      return
    }

  }

  export let data: PageData
</script>

<form
    on:submit|preventDefault={addShop}
    class="max-w-lg m-auto flex flex-col gap-4 mt-2"
    
  >
    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={shopName}
      placeholder="Shop name"
    />

    <button
      class="bg-primary-500 disabled:bg-gray-100 font-semibold px-6 py-3 text-white
       hover:bg-primary-400 disabled:text-gray-400 rounded-md"
      type="submit"
      disabled={isInvalid}
    >
      Add
    </button>
  </form>


<div id="list">
  <div>your shops:</div>
{#each data.shops as shop}
  <div>{shop.name}</div>
{/each}
</div>

