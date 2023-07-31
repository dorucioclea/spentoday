<script lang="ts">
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { Api } from "lib"

  let message: string | null = null

  async function confirm() {
    const token = $page.url.searchParams.get("token")
    if (token == null) {
      message = "Токен відсутній, перевірте правильність посилання."
      return
    }

    const user = $page.url.searchParams.get("user")
    if (user == null) {
      message = "Електронна адресса відсутня, перевірте правильність посилання."
      return
    }

    const status = await Api.confirm(fetch, PUBLIC_API_URL, token, user)
    if (status == Api.ConfirmStatus.Success) {
      goto("/confirmSuccess")
      return
    }
  }
</script>

<main>
  <h1 class="text-center text-5xl font-bold my-10">Confirm your account email.</h1>

  {#if message}
    <div
      class="p-4 bg-red-50 my-10 border-2 border-red-200 text-red-800 rounded-md max-w-4xl m-auto"
    >
      {message}
    </div>
  {/if}

  <button
    class="m-auto block bg-primary-500 text-white py-3 px-6 rounded-full"
    on:click={confirm}
  >
    Confirm
  </button>
</main>
