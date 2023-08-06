<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<!-- Independent shop page -->

<svelte:head>
  <title>{data.shop.seo.title}</title>
  <meta name="description" content={data.shop.seo.description} />
</svelte:head>

<section class="grid grid-cols-2 md:grid-cols-4">
  {#each data.shop.products as product}
    <div class="">
      <img src={product.image} alt="{product.name} image" />
      <h3>{product.name}</h3>
      <span>{product.price}</span>
    </div>
  {/each}
</section>
