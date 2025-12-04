<script>
  let { children } = $props();
</script>

<div>
  <div id="my-account">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#">My account</a>
  </div>
  {@render children()}
</div>
