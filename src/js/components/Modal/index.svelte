<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import dialogPolyfill from 'dialog-polyfill';

  export let isOpen = false;
  export let id = `id${new Date().getTime()}-${Math.floor(Math.random() * Date.now())}`;
  export let onClose = function () {};
  export let height = 'auto';
  export let scrollable = false;
  export let mode = 'alert';

  let modalBody;

  let dialog;

  export const show = function () {
    if (dialog.open) {
      return;
    }
    isOpen = true;
    dialog.showModal();
    // setTimeout(() => {
    //   dialog.querySelector('button').focus();
    // })
  };

  export const hide = function () {
    if (!dialog) {
      return;
    } // rare edge case
    if (!dialog.open) {
      return;
    }
    dialog.close();
    isOpen = false;
    onClose();
    console.log('-- dialog is closed');
  };

  onMount(() => {
    if (!globalThis.HTMLDialogElement) {
      console.log('-- polyfilling dialog');
      dialogPolyfill.registerDialog(dialog);
    }

    if (isOpen) {
      openModal();
    }
  });

  $: if (dialog && isOpen) {
    show();
  }
</script>

<!-- <svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/open-props" />
</svelte:head> -->

<dialog bind:this={dialog} aria-hidden={!isOpen} data-polyfilled={!globalThis.HTMLDialogElement}>
  <div class="modal show" aria-labelledby="{id}-label" style="display: block;">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
      <div class="modal-content" style:height={height != 'auto' && height}>
        <div class="modal-header">
          <h1 id="{id}-label" class="modal-title">
            <slot name="title" />
          </h1>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 justify-between order-1 ms-auto text-uppercase"
            aria-label="Close Modal"
            data-bs-dismiss="modal"
            on:click={() => {
              hide();
            }}>Close <i class="fa-solid fa-xmark" aria-hidden="true" /></button
          >
        </div>
        <div class="modal-body {scrollable ? '' : 'dont-scroll'}">
          <slot name="body" />
          <div class="visually-hidden" role="status" aria-atomic="true" aria-live="polite" />
        </div>
        {#if $$slots.footer}
          <div class="modal-footer">
            <slot name="footer">
              <button
                type="reset"
                autofocus
                class="btn btn-secondary"
                on:click={() => {
                  hide();
                }}>Close</button
              >
              {#if mode == 'prompt'}
                <button type="button" class="btn btn-primary">
                  <slot name="action">OK</slot>
                </button>
              {/if}
            </slot>
          </div>
        {/if}
      </div>
    </div>
  </div>
</dialog>

<style lang="scss">
  :global(html:has(dialog[open])) {
    overflow: hidden;
  }

  dialog {
    display: grid;
    position: fixed;
    margin: auto;
    padding: 0;
    inset: 0;
    border: none;
    background: transparent;
    z-index: var(--layer-important);
    /* z-index: -1; */
    max-inline-size: min(90vw, var(--size-content-3));
    max-block-size: min(80vh, 100%);
    max-block-size: min(80dvb, 100%);
    max-height: none;
    transition: opacity 0.25s var(--ease-3);

    &[data-polyfilled='true'] {
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  dialog:not([open]) {
    display: none;
  }

  // dialog:not([open]) {
  //   pointer-events: none;
  //   opacity: 0;
  //   z-index: -100;

  //   // for browsers that do not support inert
  //   position: absolute !important;
  //   width: 1px !important;
  //   height: 1px !important;
  //   padding: 0 !important;
  //   margin: -1px !important;
  //   overflow: hidden !important;
  //   clip: rect(0, 0, 0, 0) !important;
  //   white-space: nowrap !important;
  //   border: 0 !important;
  // }

  dialog::backdrop {
    transition: backdrop-filter 0.25s ease;
    backdrop-filter: blur(2px);
  }

  :global(dialog + .backdrop) {
    transition: backdrop-filter 0.25s ease;
    backdrop-filter: blur(2px);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  :global(._dialog_overlay) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  dialog {
    animation: var(--animation-scale-down) forwards;
    animation-timing-function: var(--ease-squish-3);
  }

  dialog[open] {
    animation: var(--animation-slide-in-down) forwards;
    animation-duration: 0.25s;
    /* z-index: var(--layer-important); */
  }

  .modal {
    position: static;
  }

  .modal-title {
    font-size: 1.75rem;
  }

  .modal-header {
    flex-wrap: wrap;
  }

  .modal-title {
    flex-basis: 100%;
    order: 2;
  }

  button[data-bs-dismiss] i.fa-solid {
    color: var(--color-primary-500) !important;
  }

  .dont-scroll {
    overflow: hidden !important;
  }
</style>
