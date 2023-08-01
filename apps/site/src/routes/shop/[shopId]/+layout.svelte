<script lang="ts">
  import { routes } from "$lib"
  import { page } from "$app/stores"
  import type { LayoutData } from "./$types"

  export let data: LayoutData

  const links = [
    { name: "Products", href: routes.shop(data.shopId) },
    { name: "Orders", href: routes.shopOrders(data.shopId) },
    { name: "Categories", href: routes.shopCategories(data.shopId) },
    { name: "Domains", href: routes.shopDomains(data.shopId) },
    { name: "Pages", href: routes.shopPages(data.shopId) },
    { name: "Settings", href: routes.shopSettings(data.shopId) }
  ]
</script>

<header class="p-4">
  <nav class="flex gap-2">
    {#each links as link}
      <a
        class="py-2 px-4 rounded {$page.url.pathname == link.href
          ? 'bg-primary-500 text-white'
          : 'hover:bg-gray-100'}"
        href={link.href}
      >
        {link.name}
      </a>
    {/each}
  </nav>
</header>

<slot />
