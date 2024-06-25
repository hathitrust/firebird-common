<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';
  import FeedbackFormBasic from '../FeedbackFormBasic';
  import FeedbackFormCatalog from '../FeedbackFormCatalog';
  import FeedbackFormContent from '../FeedbackFormContent';
  let modal;
  export let form = 'basic';
  export let isOpen = false;
  export let dropdownLinkTrigger;

  export const show = function () {
    isOpen = true;
    modal.show();
  };

  onMount(() => {
    if (isOpen && modal) {
      modal.show();
    }
  });

  $: if (modal && isOpen) {
    show();
  }

  let today = new Date();

  export let winterBreak = false;

  if (
    (today.getFullYear() == 2023 && today.getMonth() == 11 && today.getDate() >= 22) ||
    (today.getFullYear() == 2024 && today.getMonth() == 0 && today.getDate() <= 2)
  ) {
    // if today is a date in 2023, in the month of december, on or after the 22nd
    // OR today is a date in 2024, in the month of january, on or before the 2nd
    winterBreak = true;
  }

  let message = `<i class="fa-regular fa-snowflake" aria-hidden="true"></i> HathiTrust User Support is out of the office
            during the United States holidays through January 2nd. The team is still receiving patron messages at
            <a href="mailto:support@hathitrust.org">support@hathitrust.org</a>, but you should expect a delay in
            response during this time. Thanks for your patience.`;
</script>

<div>
  {#if form == 'catalog'}
    <Modal bind:this={modal} {dropdownLinkTrigger} openHelpDropdownOnModalClose scrollable>
      <svelte:fragment slot="title">Catalog Quality Correction</svelte:fragment>
      <svelte:fragment slot="body">
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormCatalog />
      </svelte:fragment>
    </Modal>
  {:else if form == 'content'}
    <Modal bind:this={modal} {dropdownLinkTrigger} openHelpDropdownOnModalClose scrollable>
      <svelte:fragment slot="title">Content Quality Correction</svelte:fragment>
      <svelte:fragment slot="body">
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormContent />
      </svelte:fragment>
    </Modal>
  {:else if form == 'basic'}
    <Modal bind:this={modal} {dropdownLinkTrigger} openHelpDropdownOnModalClose scrollable>
      <svelte:fragment slot="title">Questions?</svelte:fragment>
      <svelte:fragment slot="body">
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormBasic />
      </svelte:fragment>
    </Modal>
  {:else}
    <Modal bind:this={modal} {dropdownLinkTrigger} openHelpDropdownOnModalClose scrollable>
      <svelte:fragment slot="title">Questions?</svelte:fragment>
      <svelte:fragment slot="body">
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormBasic />
      </svelte:fragment>
    </Modal>
  {/if}
</div>
