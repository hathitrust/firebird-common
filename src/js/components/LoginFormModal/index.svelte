<svelte:options accessors={true} />

<!-- <svelte:body on:keyup={handleKeydown} /> -->
<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';

  import InstitutionList from './InstitutionList.svelte';
  import LoginFormAction from './LoginFormAction.svelte';

  import FilterableSelection from '../FilterableSelection.svelte';

  let HT = window.HT || {};
  let sdrinst = HT.prefs ? HT.prefs.get().sdrinst : undefined;
  let filterText;
  let modal;

  export let target;

  if (!target) {
    target = window.location.href;
    if (target.indexOf('babel.hathitrust') < 0) {
      // not a babel app, need to route through ping/pong
      target = HT.get_pong_target(target);
    }
  }

  export let isOpen = false;

  export const show = function () {
    if (!idpList.length) {
      return;
    }
    if (!sdrinst) {
      filterText = '';
    } else {
      filterText = idpList.find((item) => item.sdrinst == sdrinst).name.replace(/&amp;/g, '&');
    }
    modal.show();
  };

  export const hide = function () {
    modal.hide();
  };

  onMount(() => {
    if (isOpen && modal) {
      modal.show();
    }
  });

  $: loginStatus = HT.loginStatus;
  $: idpList = $loginStatus.idp_list;
  $: if (modal && isOpen) {
    show();
  }
  $: if (modal && !isOpen) {
    hide();
  }
</script>

<!--  height="90vh" ?? -->
<Modal bind:this={modal}>
  <svelte:fragment slot="title">Log in with Your Institution</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="mb-0">Log in with your university or library to access the largest number of volumes and features.</p>
    <div class="mt-3" style="display: grid; grid-template-rows: minmax(0, 1fr); min-height: 0;">
      <InstitutionList bind:sdrinst {filterText} />
    </div>
  </svelte:fragment>
  <svelte:fragment slot="footer">
    <LoginFormAction {...$$props} {sdrinst} {target} />
    <div class="m-0 p-0 w-100">
      <div>
        <p class="p-3 px-modal mb-0 border-top bg-light rounded-bottom">
          Can't find your university or library?
          <a href="//{HT.service_domain}/cgi/wayf?target={encodeURIComponent(target)}" class="text-dark"
            >See options to log in as a guest</a
          >
        </p>
      </div>
    </div>
  </svelte:fragment>
</Modal>

<style>
  /* :global(.modal-body) {
    overflow: hidden !important;
  } */
</style>
