<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<svelte:head>
  <title>{data.seoTitle}</title>
  <meta name="description" content={data.seoDescription} />
</svelte:head>

<h1>{data.name}</h1>

{#each data.images as image}
  <img class="rounded-lg w-full" src={image} alt="{data.name} image" />
{/each}
