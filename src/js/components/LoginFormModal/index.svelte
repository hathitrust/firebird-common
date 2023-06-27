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

  if ( ! target ) {
    target = window.location.href;
    if (target.indexOf('babel.hathitrust') < 0) {
      // not a babel app, need to route through ping/pong
      target = HT.get_pong_target(target);
    }
  }

  export let isOpen = false;

  export const show = function () {
    if (!sdrinst) {
      filterText = '';
    } else {
      filterText = HT.login_status.idp_list
        .find((item) => item.sdrinst == sdrinst)
        .name.replace(/&amp;/g, '&');
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

  $: if (modal && isOpen) {
    show();
  }
  $: if (modal && !isOpen) {
    hide();
  }
</script>

<Modal bind:this={modal} height="90vh" scrollable={true}>
  <svelte:fragment slot="title">Member Library Login</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="mb-0">
      Log in with your institution account to access then largest number
      of volumes and features.
    </p>
    <div class="mt-3 pb-3 modal-grid gap-3">
      <InstitutionList bind:sdrinst {filterText}></InstitutionList>
    </div>
    <LoginFormAction {sdrinst} {target}></LoginFormAction>
    <div class="m-0 p-0 w-auto modal-full-width">
      <div>
        <p class="p-3 mb-0 border-top bg-light">
          <a
            href="https://www.hathitrust.org/help_digital_library#LoginNotListed"
            class="text-dark fw-bold">Why isn't my institution listed?</a
          >
        </p>
        <p class="p-3 mb-0 border-top bg-light rounded-bottom">
          <strong>Not with a member institution?</strong>
          <br />
          <a href="//{HT.service_domain}/cgi/wayf?target={encodeURIComponent(target)}" class="text-dark"
            >See options to log in as a guest</a
          >
        </p>
      </div>
    </div>
  </svelte:fragment>
  <!-- <svelte:fragment slot="footer">
  </svelte:fragment> -->
</Modal>

<style>
  .modal-full-width {
    margin-left: -1.75rem !important;
    margin-right: calc(1.75rem * -1.125) !important;
    margin-bottom: -1rem !important;
  }
</style>
