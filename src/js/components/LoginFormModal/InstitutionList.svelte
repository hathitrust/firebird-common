<script>
  import { get } from 'svelte/store';
  import FilterableSelection from '../FilterableSelection.svelte';

  let HT = window.HT || {};
  export let sdrinst = HT.prefs ? HT.prefs.get().sdrinst : undefined;

  export let filterText;

  function getItems() {
    return idpList.map((item) => ({
      option: item.name.replace(/&amp;/g, '&'),
      key: item.sdrinst,
      value: item.sdrinst,
    }));
  }

  $: loginStatus = HT.loginStatus;
  $: idpList = $loginStatus.idp_list;
</script>

{#if !$loginStatus}
  <pre>WAITING</pre>
{:else if $loginStatus.logged_in}
  <div class="alert alert-info">You are currently logged into HathiTrust by way of {$loginStatus.institutionName}.</div>
  <p>
    <a href="//{HT.service_domain}/cgi/logout" class="btn btn-primary">Log out</a>
  </p>
{:else if idpList.length == 0}
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
