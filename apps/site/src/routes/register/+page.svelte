<script lang="ts">
  import { goto } from "$app/navigation"
  import { Api } from "lib"

  let name: string
  let email: string
  let password: string
  let confirmPassword: string
  let message: string | null

  async function register() {
    const response = await Api.callPublic(fetch, "/api/auth/register", "POST")

    if (!response) {
      message = "Can't communicate with server. Try later!"
      return
    }

    if (response.ok) {
      goto("/dashboard")
      return
    }

    // do better error handling

    message = "We can't register you right now. Try later!"
  }
</script>

<svelte:head>
  <title>Register at Spentoday</title>
</svelte:head>

<h1>Register</h1>

{#if message}
  <div class="text-xl text-red-500">
    {message}
  </div>
{/if}

<form on:submit|preventDefault={register}>
  <label for="name">Full name</label>
  <input bind:value={name} id="name" />

  <label for="email">Email</label>
  <input type="email" bind:value={email} id="email" />

  <label for="password">Password</label>
  <input type="password" bind:value={password} id="password" />

  <label for="confirmPassword">Confirm password</label>
  <input type="password" bind:value={confirmPassword} id="confirmPassword" />

  <button type="submit">Register</button>
</form>
