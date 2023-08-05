<script lang="ts">
  import type { PageData } from "./$types"
  import { Api } from "lib"
  import { PUBLIC_API_URL } from "$env/static/public"
  import { goto } from "$app/navigation"
  import { routes } from "$lib"

  export let data: PageData
  $: domains = data.domains
  $: hasFreeDomain = domains.findIndex((x) => x.domain.endsWith("spentoday.com")) != -1

  let domainInput: string = ""

  async function addDomain() {
    if (hasFreeDomain && domainInput.endsWith(".spentoday.com")) {
      return alert("You can only have 1 free .spentoday.com domain")
    }

    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: `/v1/site/domains/${data.shopId}`,
      method: "POST",
      body: { domain: domainInput }
    })
    if (!response) return alert("Can't add domain at the current moment.")

    if (response.ok) {
      var json = await Api.responseJson<Api.ShopDomain>(response)
      if (!json) {
        alert("Something went wrong.")
        return
      }
      domains.push({
        domain: json.domain,
        gotStatus: true,
        verifications: json.verifications
      })
      domains = domains
      return
    }

    if (response.status == 400) return alert("Domain isn't valid")
    if (response.status == Api.CONFLICT) {
      var reason = await Api.responseJson<"has-free-domain" | "domain-taken">(response)

      if (reason == "has-free-domain") {
        return alert("Тільки 1 бескоштовний .spentoday.com домен можливо додати.")
      }

      if (reason == "domain-taken") return alert("Домен вже занят.")
    }
    if (response.status == 403) {
      goto(routes.shop(data.shopId))
      return
    }
    alert("Can't add the domain at the current moment.")
  }

  async function removeDomain(domain: string) {
    const response = await Api.secureFetch(fetch, PUBLIC_API_URL, {
      route: `/v1/site/domains/${data.shopId}/${domain}`,
      method: "DELETE"
    })
    if (!response) return alert("Can't remove now")

    if (response.status == 400) return alert("bad request")
    if (response.status == 404) return alert("domain not found")
    if (!response.ok) return alert("Can't remove now")

    domains = domains.filter((x) => x.domain != domain)
  }

  async function verifyDomain(domain: string) {
    const res = await Api.verifyDomain(fetch, PUBLIC_API_URL, domain)

    if (res.status == "ok") {
      const domainElement = domains.find((x) => x.domain == domain)
      if (domainElement) {
        domainElement.gotStatus = true
        domainElement.verifications = undefined
        domains = domains
      }
      return
    }

    if (res.status == "not-verified") {
      alert("Домен не підтверджено.")

      const domainElement = domains.find((x) => x.domain == domain)
      if (!domainElement || res.data.gotStatus == false) return

      domainElement.gotStatus = true
      domainElement.verifications = res.data.verifications
      domains = domains
      return
    }

    if (res.status == "bad-domain") return alert("Домен не мажо буди порожнім.")
    alert("Щось пішло не так. Зараз полагодимо.")
  }
</script>

{#if !hasFreeDomain}
  <div class="p-4 mb-4 text-green-900 bg-green-50 border border-green-200">
    Ви можете безкоштовно отримати 1 домен від нашого сервісу! Наприклад:
    my-shop.spentoday.com. Для цього введіть у поле назву вашого домену з закінченням
    <b>.spentoday.com</b>.
  </div>
{/if}

<form on:submit|preventDefault={addDomain} class="flex gap-4 mb-10">
  <input
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={domainInput}
    placeholder={hasFreeDomain
      ? "Кастомний домен: example.com"
      : "Кастомний або бескоштовний .spentoday.com домен"}
  />
  <button
    class="px-6 py-3 font-semibold hover:bg-gray-900 bg-gray-800 text-white rounded-md"
    type="submit"
  >
    Add
  </button>
</form>

<div class="flex flex-col gap-8">
  {#each domains as domain (domain.domain)}
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between gap-4">
        <a
          rel="noreferrer"
          target="_blank"
          class="flex-1 font-semibold underline decoration-2 decoration-gray-300
           hover:decoration-primary-300 text-2xl"
          href="https://{domain.domain}">{domain.domain}</a
        >
        {#if domain.verifications || !domain.gotStatus}
          <button
            class="bg-gray-100 py-2 px-4"
            on:click={() => verifyDomain(domain.domain)}>Verify</button
          >
        {:else}
          <span class="bg-gray-100 py-2 px-4">Domain is verified</span>
        {/if}
        <button class="bg-red-100 py-2 px-4" on:click={() => removeDomain(domain.domain)}>
          Remove
        </button>
      </div>
      {#if domain.verifications}
        <p class="mt-6 mb-4">You need to add such one of DNS records for your domain:</p>

        <table class="w-full text-left">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
          </tr>
          {#each domain.verifications as verification}
            <tr>
              <td>{verification.domain}</td>
              <td>{verification.type}</td>
              <td class="break-words">{verification.value}</td>
            </tr>
          {/each}
        </table>
      {/if}
    </div>
  {/each}
</div>
