<script lang="ts">
  import { onMount } from "svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  onMount(() => {
    data.categories.push({ name: "mounted", id: "" })
    data = data
  })
</script>

<header />
<main>
  {#each data.categories as category}
    <div>
      {category.name}
    </div>
  {/each}
</main>
