<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';

  let modal = $state();

  /**
   * @typedef {Object} Props
   * @property {any} manager
   * @property {boolean} [isOpen]
   */

  /** @type {Props} */
  let { manager, isOpen = $bindable(false), autoOpen = true } = $props();

  export const show = function () {
    if (!manager.hasNotifications()) {
      return;
    }
    modal.show();
  };

  export const hide = function () {
    modal.hide();
  };

  const onClose = function () {
    manager.updateTimestamp();
  };

  $effect(() => {
    if (modal && autoOpen && manager.hasNewNotifications() && !isOpen) {
      isOpen = true;
      show();
    }
  });
</script>

{#if manager.hasNotifications()}
  <Modal bind:this={modal} bind:isOpen {onClose} focusMyAccountOnClose>
    {#snippet title()}
      Your notifications
    {/snippet}
    {#snippet body()}
      <ul class="list-group list-group-flush">
        {#each manager.notificationData as datum, i}
          <li class="list-group-item p-3">
            <h2 class="fs-6">{datum.title}</h2>
            {#if datum.message.indexOf('<p>') > -1}
              {@html datum.message}
              <p>
                <a href={datum.read_more_link} target="_blank" rel="noreferrer">{datum.read_more_label}</a>
              </p>
            {:else}
              <p>
                {datum.message}
                <a href={datum.read_more_link} target="_blank" rel="noreferrer">{datum.read_more_label}</a>
              </p>
            {/if}
          </li>
        {/each}
      </ul>
    {/snippet}
  </Modal>
{/if}

<style>
</style>
