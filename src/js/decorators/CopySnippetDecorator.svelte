<script>
  let { children } = $props();
</script>

<div>
  <div class="snippet-decorator">
    {@render children()}
  </div>
</div>

<style>
  .snippet-decorator {
    margin: 3em 0;
  }
</style>
