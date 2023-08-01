<script lang="ts">
  import { routes } from "$lib"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<h1>{data.product.name}</h1>
