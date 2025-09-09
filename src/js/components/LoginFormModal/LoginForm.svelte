<script>
  import { run } from 'svelte/legacy';

  import { getContext } from 'svelte';

  import InstitutionList from './InstitutionList.svelte';
  import LoginFormAction from './LoginFormAction.svelte';
  import FilterableSelection from '../FilterableSelection.svelte';

  let HT = window.HT || {};
  let sdrinst = $state(HT.prefs ? HT.prefs.get().sdrinst : false);

  let { target, ...rest } = $props();
  let filterText = $state('');

  $effect(() => {
    console.log('-- wut', HT.loginStatus.idp_list);
    if (sdrinst && HT.loginStatus.idp_list && HT.loginStatus.idp_list.length) {
      filterText = HT.loginStatus.idp_list.find((item) => item.sdrinst == sdrinst).name.replace(/&amp;/g, '&');
    }
  });
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
{:else}
  <InstitutionList bind:sdrinst {filterText} />
  <LoginFormAction {...rest} {sdrinst} {target} />
{/if}
