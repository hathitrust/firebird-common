<script>
  import InstitutionList from './InstitutionList.svelte';
  import LoginFormAction from './LoginFormAction.svelte';
  import FilterableSelection from '../FilterableSelection.svelte';
  let HT = window.HT || {};
  let sdrinst = HT.prefs ? HT.prefs.get().sdrinst : undefined;

  export let target;

</script>

{#if ! HT.login_status}
<pre>WAITING</pre>
{:else if HT.login_status.logged_in}
<div class="alert alert-info">You are currently logged into HathiTrust by way of {HT.login_status.institutionName}.</div>
<p>
  <a href="//{HT.service_domain}/cgi/logout" class="btn btn-primary">Log out</a>
</p>
{:else}
  <InstitutionList {sdrinst}></InstitutionList>
  <LoginFormAction {sdrinst} {target}></LoginFormAction>
{/if}
