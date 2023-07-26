<script lang="ts">
  import type { ShopDomain } from "./+page"
  import type { PageData } from "./$types"
  import { Api } from "lib"
  import { PUBLIC_API_URL } from "$env/static/public"

  export let data: PageData
  $: domains = data.domains ?? []

  let domainInput: string = ""

  async function addDomain() {
    const response = await Api.callSecure(
      fetch,
      PUBLIC_API_URL,
      `/v1/domains/${data.shopId}`,
      "POST",
      { domain: domainInput }
    )
    if (!response) {
      alert("Can't add domain at the current moment.")
      return
    }

    if (response.status == 400) {
      alert("Domain isn't valid")
      return
    }

    if (response.status == 409) {
      alert("Domain is already taken.")
      return
    }

    if (response.status == 403) {
      alert("You have no access to the shop.")
      return
    }

    if (!response.ok) {
      alert("Can't add the domain at the current moment.")
      return
    }

    var json = await Api.responseJson<ShopDomain>(response)
    if (!json) {
      alert("Something went wrong.")
      return
    }

    domains.push({
      domain: json.domain,
      verifications: json.verifications
    })
  }

  async function removeDomain(domain: string) {
    const response = await Api.callSecure(
      fetch,
      PUBLIC_API_URL,
      `/v1/domains/${data.shopId}/${domain}`,
      "DELETE"
    )
    if (!response) return alert("Can't remove now")

    const json = Api.responseJson(response)
    if (!json) return alert("not now")

    if (response.status == 400) return alert("bad request")
    if (response.status == 404) return alert("domain not found")
    if (!response.ok) return alert("Can't remove now")

    domains = domains.filter((x) => x.domain != domain)
  }

  async function verifyDomain(domain: string) {
    const response = await Api.callSecure(
      fetch,
      PUBLIC_API_URL,
      `/v1/domains/${domain}/verify`,
      "PATCH"
    )
    if (!response) return alert("something wrong")

    if (response.status == 200) {
      const domainElement = domains.find((x) => x.domain == domain)
      if (domainElement) domainElement.verifications = undefined
      return
    }

    if (response.status == 404) return alert("bad request")
    if (response.status != 202) return alert("wrong")

    const json = await Api.responseJson<ShopDomain>(response)
    if (!json) return alert("wrong")

    const domainElement = domains.find((x) => x.domain == json.domain)
    if (!domainElement) return
    domainElement.verifications = json.verifications
  }
</script>

<form on:submit|preventDefault={addDomain} class="flex gap-4 mb-10">
  <input
    class="flex-1 bg-gray-100 focus:bg-gray-50 px-6 py-3 rounded-md border border-gray-200"
    bind:value={domainInput}
    placeholder="Domain name: example.com"
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
    <div class="p-8 border-2 border-gray-100 rounded-md">
      <div class="flex justify-between gap-4 items-center">
        <a
          rel="noreferrer"
          target="_blank"
          class="flex-1 font-semibold underline decoration-2 decoration-gray-300
           hover:decoration-primary-300 text-2xl"
          href="https://{domain.domain}">{domain.domain}</a
        >
        <button
          class="bg-gray-100 py-2 px-4 rounded-md"
          on:click={() => verifyDomain(domain.domain)}>Verify</button
        >
        <button
          class="bg-red-100 py-2 px-4 rounded-md"
          on:click={() => removeDomain(domain.domain)}>Remove</button
        >
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
      {:else}
        Domain is verified
      {/if}
    </div>
  {/each}
</div>
