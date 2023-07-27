<script lang="ts">
  import { isValidSlug } from "$lib"
  import { Api } from "lib"
  import type { PageData } from "./$types"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { goto } from "$app/navigation"

  type Page = {
    slug: string
    title: string
    updatedAt: Date
  }

  export let data: PageData

  let newPageSlug: string = ""
  let newPageModal: HTMLDialogElement
  let slugValid: boolean = true

  function slugInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    newPageSlug = newPageSlug.toLowerCase().replace(" ", "-").replace("--", "-")

    const char = newPageSlug[newPageSlug.length - 1]
    if ((char < "a" || char > "z") && (char < "0" || char > "9") && char !== "-") {
      slugValid = false
      newPageSlug = newPageSlug.slice(0, newPageSlug.length - 1)
    }
  }

  async function createPage() {
    if (!isValidSlug(newPageSlug)) {
      slugValid = false
      return
    }

    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: `/v1/dashboard/${data.shopId}/page`,
      method: "POST",
      body: { slug: newPageSlug }
    })
    if (!response) return

    if (response.status == 401 || response.status == 403) {
      goto("/login")
    }

    const json = await Api.responseJson<Page>(response)
    if (!json) return

    data.pages.push(json)
  }
</script>

<button
  class="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md"
  on:click={() => newPageModal.showModal()}>Add new</button
>

<dialog bind:this={newPageModal} class="p-10 bg-white text-lg rounded-md max-w-2xl">
  <form class="flex gap-8 flex-col" on:submit|preventDefault={createPage}>
    <h3>
      To add new page enter page slug/path, like: privacy-policy. Slug will be seen in url
      of page.
    </h3>

    {#if !slugValid}
      <p class="border-red-800 rounded-md p-3 px-4 bg-red-50 text-red-800">
        Slug/path can only contain lowercase english symbols, numbers and minus (-)
      </p>
    {/if}

    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={newPageSlug}
      on:input={slugInput}
      placeholder="New page slug"
    />
    <div class="gap-4 items-end">
      <button
        class="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-md"
        on:click={() => newPageModal.close()}
      >
        Cancel
      </button>
      <button
        class="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md"
        type="submit"
      >
        Add
      </button>
    </div>
  </form>
</dialog>

{#each data.pages as page}
  <div class="flex justify-between">
    <span>{page.slug}</span>
    <span>{page.title}</span>
    <span>{page.updatedAt.toString()}</span>
  </div>
{/each}
