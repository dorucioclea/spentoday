<script>
  import "../app.css"
</script>

<header class="px-5 py-8 max-w-screen-xl m-auto flex justify-between items-center">
  <nav>
    <a class="text-primary-500 font-bold text-2xl" href="/">Spentoday</a>
  </nav>

  <nav>
    <a
      class="px-6 py-3 text-md underline decoration-primary-300 decoration-2 font-semibold"
      href="/login"
    >
      Get started
    </a>
  </nav>
</header>

<slot />

<footer class="mt-20" />
