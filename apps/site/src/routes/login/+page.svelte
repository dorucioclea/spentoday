<script lang="ts">
  import { goto } from "$app/navigation"
  import { Api } from "lib"
  import { z } from "zod"

  const emailSchema = z.string().email()

  let email: string = ""
  let password: string = ""
  let message: string | null

  function isEmailCorrect(email: string) {
    const result = emailSchema.safeParse(email)
    return result.success
  }

  async function login() {
    const response = await Api.callPublic(fetch, "/api/auth/login", "POST")

    if (!response) {
      message = "Can't communicate with server. Try later!"
      return
    }

    if (response.ok) {
      goto("/dashboard")
      return
    }

    // do better error handling

    message = "We can't login you right now. Try later!"
  }
</script>

<svelte:head>
  <title>Login to Spentoday</title>
</svelte:head>

<!-- {#if message}
  <div class="text-xl text-red-500">
    {message}
  </div>
{/if} -->

<main class="min-h-[70vh] max-w-screen-xl m-auto pt-20 px-6">
  <h1 class="text-4xl md:text-6xl text-center m-auto font-bold">Login</h1>
  <p class="text-center text-gray-600 mt-6 max-w-3xl m-auto">
    By login you accept our Terms of Servic and Privacy Policy. And get closer to making
    money.
  </p>

  <form
    on:submit|preventDefault={login}
    class="max-w-lg m-auto flex flex-col gap-4 mt-12"
  >
    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={email}
      type="email"
      placeholder="Email address..."
    />

    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={password}
      type="password"
      placeholder="Password"
    />

    <button
      class="bg-primary-500 disabled:bg-gray-100 font-semibold px-6 py-3 text-white hover:bg-primary-400 disabled:text-gray-400 rounded-md"
      type="submit"
      disabled={email.trim() == "" || !isEmailCorrect(email)}
    >
      Login
    </button>
  </form>
</main>
