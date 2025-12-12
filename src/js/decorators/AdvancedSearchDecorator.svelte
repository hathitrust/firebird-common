<script>
  let { children } = $props();

  const HT = {};
  HT.service_domain = 'babel.hathitrust.org';
  HT.catalog_domain = 'catalog.hathitrust.org';

  globalThis.HT = HT;
</script>

<div>
  {@render children()}
</div>
