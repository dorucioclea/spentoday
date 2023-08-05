<script lang="ts">
  import { goto } from "$app/navigation"
  import { z } from "zod"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { Api } from "lib"
  import { routes } from "$lib"

  let name: string = ""

  let currentPassword: string = ""
  let newPassword: string = ""
  let confirmPassword: string = ""

  let message: string | null = null
  let message1: string | null = null
  let message2: string | null = null
  let message3: string | null = null

  $: isInvalid1 =
    name.trim() == "" 

  $: isInvalid2 =
    confirmPassword.trim() == "" ||
    newPassword.trim() == "" ||
    currentPassword.trim() == ""

  async function changeName() {
  
    const status = await Api.changeName(fetch, PUBLIC_API_URL, name)

    if (status == "success") {
        message = "Ім'я успішно змінено"
        message1 = ""
      goto("/settings")
      return
    }

    if (status == "not-found") {
      message1 = "Користувач не знайдений"
      return
    }

    if (status == "fail") {
      message1 = "Сервер не відповідає"
      return
    }

    message1 = "Щось пішло не так"
  }

  async function changePassword() {
    if (newPassword != confirmPassword) {
      message2 = "Паролі не співпадають"
      return
    }
  
    const status = await Api.changePassword(fetch, PUBLIC_API_URL, currentPassword, newPassword, confirmPassword)

    if (status == "success") {
        message = "Пароль успішно змінений"
        message2 = ""
      goto("/settings")
      return
    }

    if (status == "not found") {
      message2 = "Користувач не знайдений"
      return
    }

    if (status == "fail") {
      message2 = "Сервер не відповідає"
      return
    }

    if (status == "passwords mismatch") {
        message2 = "Паролі не співпадають"
    }

    message2 = "Щось пішло не так"
  }

async function setUserImage(
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    const file = event.currentTarget.files?.item(0)
    if (!file) return alert("Can't upload")

    const result = await Api.uploadUserImage(fetch, PUBLIC_API_URL, {
      file: file
    })
    
    if (result == "not-found") {
      message3 = "Користувач не знайдений"
      return
    }

    if (result == "fail") {
      message3 = "Сервер не відповідає"
      return
    }

    if (result == "not-image") {
      message3 = "Не зображення"
      return
    }

    if (typeof result === 'object') {
        console.log(result.data)
        message = "Зображення профілю успішно змінене"
      return
    }

    message3 = "Щось пішло не так" 
  }

</script>

<svelte:head>
  <title>Налаштування</title>
</svelte:head>

<main class="min-h-[70vh] max-w-screen-xl m-auto px-6">
  <h1 class="text-4xl md:text-6xl text-center m-auto font-bold">Налаштування</h1>
  <p class="text-center text-gray-600 mt-6 max-w-3xl m-auto mb-10">
    Налаштування профілю
  </p>

  {#if message}
      <div class="px-5 py-3 border border-green-200 bg-green-100 rounded-md text-green-800">
        {message}
      </div>
    {/if}

  <form
    on:submit|preventDefault={changeName}
    class="max-w-lg m-auto flex flex-col gap-4 mt-2"
  >
    {#if message1}
      <div class="px-5 py-3 border border-red-200 bg-red-100 rounded-md text-red-800">
        {message1}
      </div>
    {/if}

    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={name}
      placeholder="New name"
    />

    <button
      class="bg-primary-500 disabled:bg-gray-100 font-semibold px-6 py-3 text-white
       hover:bg-primary-400 disabled:text-gray-400 rounded-md"
      type="submit"
      disabled={isInvalid1}
    >
      Change name
    </button>
  </form>

  <form
    on:submit|preventDefault={changePassword}
    class="max-w-lg m-auto flex flex-col gap-4 mt-2"
  >
    {#if message2}
      <div class="px-5 py-3 border border-red-200 bg-red-100 rounded-md text-red-800">
        {message2}
      </div>
    {/if}

    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={currentPassword}
      type="password"
      placeholder="Enter current password"
    />

    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={newPassword}
      type="password"
      placeholder="New Password"
    />

    <input
      class="bg-gray-100 focus:bg-gray-50 px-6 py-4 rounded-md border border-gray-200"
      bind:value={confirmPassword}
      type="password"
      placeholder="Confirm Password"
    />

    <button
      class="bg-primary-500 disabled:bg-gray-100 font-semibold px-6 py-3 text-white
       hover:bg-primary-400 disabled:text-gray-400 rounded-md"
      type="submit"
      disabled={isInvalid2}
    >
      Change password
    </button>
  </form>

  <div>
    <p>Встановити зображення профілю</p>
        <input
          on:change={setUserImage}
          id="dropzone-file"
          accept="image/*"
          type="file"
        />
  </div>
    
  <a
    href={"/account/settings/delete"}
    class="underline decoration-primary-100 hover:decoration-primary-300 decoration-2
    mt-8 block text-center"
  >
    Хочете видалити свій аккаунт? Вже залишаєте нас?
  </a>
</main>
