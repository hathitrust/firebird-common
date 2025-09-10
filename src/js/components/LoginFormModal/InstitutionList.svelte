<script>
  import FilterableSelection from '../FilterableSelection.svelte';

  let HT = window.HT || {};

  let { sdrinst = $bindable(), filterText = $bindable() } = $props();

  function getItems() {
    return HT.loginStatus.idp_list.map((item) => ({
      option: item.name.replace(/&amp;/g, '&'),
      key: item.sdrinst,
      value: item.sdrinst,
    }));
  }

  // let idpList = HT.loginStatus.idp_list;
</script>

{#if !HT.loginStatus}
  <pre>WAITING</pre>
{:else if HT.loginStatus.logged_in}
  <div class="alert alert-info">
    You are currently logged into HathiTrust by way of {HT.loginStatus.institutionName}.
  </div>
  <p>
    <a href="//{HT.service_domain}/cgi/logout" class="btn btn-primary">Log out</a>
  </p>
{:else if HT.loginStatus.idp_list.length == 0}
  <div class="alert alert-warning">No institution list.</div>
{:else}
  <div class="filterable-grid gap-1 mb-1" style:--filterable-list-height="12rem">
    <FilterableSelection
      items={getItems()}
      label="Institution"
      placeholder="Type something"
      icon="fa-solid fa-building-columns"
      bind:filterText
      bind:value={sdrinst}
    />
  </div>
{/if}

<style>
  .filterable-grid {
    display: grid;
    grid-template-rows: min-content 1fr;
    min-height: 0;
    overflow: hidden;
  }
</style>
