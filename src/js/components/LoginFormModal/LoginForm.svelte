<script>
  import { getContext } from 'svelte';

  import InstitutionList from './InstitutionList.svelte';
  import LoginFormAction from './LoginFormAction.svelte';
  import FilterableSelection from '../FilterableSelection.svelte';

  let HT = window.HT || {};
  let sdrinst = HT.prefs ? HT.prefs.get().sdrinst : undefined;

  export let target;
  let filterText;

  $: loginStatus = HT.loginStatus;
  $: idpList = $loginStatus.idp_list;
  $: console.log("-- wut", idpList);
  $: if ( sdrinst && idpList && idpList.length ) {
      filterText = idpList
        .find((item) => item.sdrinst == sdrinst)
        .name.replace(/&amp;/g, '&');
  }

</script>

{#if ! $loginStatus}
<pre>WAITING</pre>
{:else if $loginStatus.logged_in}
<div class="alert alert-info">You are currently logged into HathiTrust by way of {$loginStatus.institutionName}.</div>
<p>
  <a href="//{HT.service_domain}/cgi/logout" class="btn btn-primary">Log out</a>
</p>
{:else}
  <InstitutionList bind:sdrinst {filterText}></InstitutionList>
  <LoginFormAction {sdrinst} {target}></LoginFormAction>
{/if}
