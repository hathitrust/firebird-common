<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';

  export let manager;
  let modal;

  export let isOpen = false;

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

  onMount(() => {
    if (modal && manager.hasNewNotifications()) {
      modal.show();
    }
  });

  $: if (modal && manager.hasNewNotifications()) {
    show();
  }
  $: if (modal && isOpen) {
    show();
  }
  // $: if ( modal && ! isOpen ) { hide() }
</script>

{#if manager.hasNotifications()}
  <Modal bind:this={modal} {onClose}>
    <svelte:fragment slot="title">Your notifications</svelte:fragment>
    <svelte:fragment slot="body">
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
    </svelte:fragment>
  </Modal>
{/if}

<style>
</style>
