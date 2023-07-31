<script lang="ts">

    import { goto } from "$app/navigation"
    import { PUBLIC_API_URL } from "$env/static/public"
    import { Api } from "lib"
    import { z } from "zod"
    import { onMount } from "svelte";
    import { ConfirmStatus } from "lib/api"
    
    let token: string = ""
    let user: string = ""
    
    function getDataFromUrl() {
        const params = new URLSearchParams(document.location.search);
        token = params.get("token") || ""; 
        user = params.get("user") || "";
    }
  
    async function confirm() {
    getDataFromUrl();
  
    const status = await Api.confirm(fetch, PUBLIC_API_URL, token, user)
        if (status == ConfirmStatus.Success) {
        goto("/confirmSuccess") 
        return
        }
    }
  
  onMount(() => {
    confirm();
  });
    
</script>

<main>
    <p>
        !!!CONFIRM!!!
        {encodeURIComponent(token)}
        {encodeURIComponent(user)}
        {decodeURIComponent(token)}
        {decodeURIComponent(user)}
    </p>
</main>