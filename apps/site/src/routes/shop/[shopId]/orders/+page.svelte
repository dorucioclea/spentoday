<script lang="ts">
  import { Api } from "lib"
  import type { PageData } from "./$types"
  import { PUBLIC_API_URL } from "$env/static/public"

  let data: PageData

  let customerEmail: string = ""
  let productName: string = ""
  let timer: number

  $: orders = data.orders

  function debounceSearch() {
    clearTimeout(timer)
    timer = setTimeout(search, 500)
  }

  async function search() {
    const response = await Api.shopOrders(
      fetch,
      PUBLIC_API_URL,
      data.shopId,
      customerEmail,
      productName
    )
    if (response == null) return
    orders = response
  }
</script>

<main>
  <form>
    <input
      type="email"
      placeholder="Customer email"
      bind:value={customerEmail}
      on:keyup={debounceSearch}
    />
    <input
      placeholder="Product name/slug"
      bind:value={productName}
      on:keyup={debounceSearch}
    />
  </form>

  <div class="flex flex-col gap-4">
    {#each orders as order}
      <div>
        <h3>{order.id}</h3>
      </div>
    {/each}
  </div>
</main>
