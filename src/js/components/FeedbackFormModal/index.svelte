<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';
  import FeedbackFormBasic from '../FeedbackFormBasic';
  import FeedbackFormCatalog from '../FeedbackFormCatalog';
  import FeedbackFormContent from '../FeedbackFormContent';
  let modal = $state();

  export const show = function () {
    isOpen = true;
    modal.show();
  };

  onMount(() => {
    if (isOpen && modal) {
      modal.show();
    }
  });

  let today = new Date();

  /**
   * @typedef {Object} Props
   * @property {string} [form]
   * @property {boolean} [isOpen]
   * @property {boolean} [winterBreak]
   */

  /** @type {Props} */
  let { form = 'basic', isOpen = $bindable(false), winterBreak = $bindable(false) } = $props();

  if (
    (today.getFullYear() == 2024 && today.getMonth() == 11 && today.getDate() >= 22) ||
    (today.getFullYear() == 2025 && today.getMonth() == 0 && today.getDate() <= 2)
  ) {
    // if today is a date in 2023, in the month of december, on or after the 22nd
    // OR today is a date in 2024, in the month of january, on or before the 2nd
    winterBreak = true;
  }

  let message = `<i class="fa-regular fa-snowflake" aria-hidden="true"></i> HathiTrust User Support is out of the office
            during the United States holidays through January 2nd. The team is still receiving patron messages at
            <a href="mailto:support@hathitrust.org">support@hathitrust.org</a>, but you should expect a delay in
            response during this time. Thanks for your patience.`;
  $effect(() => {
    if (modal && isOpen) {
      show();
    }
  });
</script>

<div>
  {#if form == 'catalog'}
    <Modal bind:this={modal} focusHelpOnClose scrollable>
      {#snippet title()}
        Catalog Quality Correction
      {/snippet}
      {#snippet body()}
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormCatalog />
      {/snippet}
    </Modal>
  {:else if form == 'content'}
    <Modal bind:this={modal} focusHelpOnClose scrollable>
      {#snippet title()}
        Content Quality Correction
      {/snippet}
      {#snippet body()}
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormContent />
      {/snippet}
    </Modal>
  {:else if form == 'basic'}
    <Modal bind:this={modal} focusHelpOnClose scrollable>
      {#snippet title()}
        Questions?
      {/snippet}
      {#snippet body()}
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormBasic />
      {/snippet}
    </Modal>
  {:else}
    <Modal bind:this={modal} focusHelpOnClose scrollable>
      {#snippet title()}
        Questions?
      {/snippet}
      {#snippet body()}
        {#if winterBreak}<p>{@html message}</p>{/if}
        <FeedbackFormBasic />
      {/snippet}
    </Modal>
  {/if}
</div>
