![Spentoday banner](./assets/banner.svg)

---

If you are afraid of losing money, spend it today. Live without fear.
Selling platform of future for customers and business owners.

Website: [comming soon]

Api GitHub repo: [flurium/spentoday-api](https://github.com/flurium/spentoday-api)

Spelling: spen + to + day (do it as italian)

Technical requirements!: [docs/tech-requirements](./docs/tech-requirements.md)

## Developing

Clone the repository:

```bash
git clone https://github.com/flurium/spentoday.git
```

Get inside of folder:

```bash
cd spentoday
```

Use dev branch:

```bash
git checkout dev
```

From install dependencies:

```bash
npm install
```

Set environment variable on your machine, so it works with local backend.
Not in .env file, but in machine settings.

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Setup .env file for `site` with such variables:

```bash
PUBLIC_API_URL=https://localhost:44303
```

Setup .env file for `shop` with such variables:

```bash
PUBLIC_API_URL=https://localhost:44303
```

Start all development servers:

```bash
npm run dev
```

Start site:

```bash
npm run dev:site
```

Start shop:

```bash
npm run dev:shop
```

To run type checks to generate types, you need to go to an app. For example, site:

```bash
cd apps/site
```

And run next command to watch for code changes and generate types when changes appear:

```bash
npm run check:watch
```

## Svelte

To create new route you should create new folder inside of `src/routes`. For example,
`page`, so you will have folder `src/routes/page`.

Inside of folder you should create 2 files: `+page.svelte` and `+page.ts`. `+page.svelte`
will contain UI and client side functionality. In `+page.ts` you will have universal load
function. Universal `load` will be called on the server at first request and then will be
called on client for further navigation.

To start requesting data in `+page.ts` you should use next code:

```ts
import { PUBLIC_API_URL } from "$env/static/public"
import type { PageLoad } from "./$types"
import { Api } from "lib"

export const load = (async ({ fetch, params }) => {
  const response = await Api.callSecure(fetch, PUBLIC_API_URL, `/route-to-request`)

  // more code...

  return {
    list: [] // any data
  }
}) satisfies PageLoad
```

Then to access this data in `+page.svelte` you should use next code:

```svelte
<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
</script>

{#each data.list as element}
  <div>Now you have access to {element} on ui</div>
{/each}
```

To make types work rerun from `apps/site` the command in terminal:

```bash
npm run check:watch
```

### Resources to learn Svelte

- [Svelte Docs](https://svelte.dev/docs/) for ui.
- [SvelteKit Docs](https://kit.svelte.dev/docs/) for loading data, server-side renderin, routing.
