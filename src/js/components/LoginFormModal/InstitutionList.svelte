<script>
  import FilterableSelection from '../FilterableSelection.svelte';

  let HT = window.HT || {};
  export let sdrinst = HT.prefs ? HT.prefs.get().sdrinst : undefined;

  export let filterText;

</script>

{#if ! HT.login_status}
<pre>WAITING</pre>
{:else if HT.login_status.logged_in}
<div class="alert alert-info">You are currently logged into HathiTrust by way of {HT.login_status.institutionName}.</div>
<p>
  <a href="//{HT.service_domain}/cgi/logout" class="btn btn-primary">Log out</a>
</p>
{:else}
<div class="filterable-grid gap-1 mb-1" style:--filterable-list-height="12rem">
  <FilterableSelection
    items={HT.login_status.idp_list.map((item) => ({
      option: item.name.replace(/&amp;/g, '&'),
      key: item.sdrinst,
      value: item.sdrinst,
    }))}
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