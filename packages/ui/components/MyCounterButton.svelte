<script lang="ts">
  let count = 0

  function handleClick() {
    count += 1
  }
</script>

<button class="bg-emerald-500 p-5" on:click={handleClick}>
  clicks: {count}
</button>
