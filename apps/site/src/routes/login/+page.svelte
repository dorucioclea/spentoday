<script lang="ts">
  import { goto } from "$app/navigation"
  import { Api } from "$lib"

  let email: string
  let password: string
  let message: string | null

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

<h1>Login</h1>

{#if message}
  <div class="text-xl text-red-500">
    {message}
  </div>
{/if}

<form on:submit|preventDefault={login}>
  <label for="email">Email</label>
  <input type="email" bind:value={email} name="email" id="email" />

  <label for="password">Password</label>
  <input type="password" bind:value={password} id="password" name="password" />

  <button type="submit">Login</button>
</form>
