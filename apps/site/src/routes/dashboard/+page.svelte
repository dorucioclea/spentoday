<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
</script>

{#each data.shops as shop}
  <div>{shop.name}</div>
{/each}
