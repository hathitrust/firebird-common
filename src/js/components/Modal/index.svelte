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
  export let modalLarge = false;
  export let fullscreenOnMobile = false;
  export let focusHelpOnClose = false;
  export let focusMyAccountOnClose = false;

  let modalBody;

  let dialog;

  function logKeys(e) {
    // console.log(`Key "${e.key}" was pressed`);
    if (e.key === 'Escape') {
      hide();
      window.removeEventListener('keydown', logKeys);
    }
  }

  export const show = function () {
    if (dialog.open) {
      return;
    }
    isOpen = true;
    dialog.showModal();
    if (focusHelpOnClose || focusMyAccountOnClose) {
      window.addEventListener('keydown', logKeys);
    }
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
    window.removeEventListener('keydown', logKeys);
    console.log('-- dialog is closed');

    if (focusHelpOnClose) {
      document.getElementById('get-help').focus();
    }
    if (focusMyAccountOnClose) {
      document.querySelector('#my-account a').focus();
    }
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

<dialog
  bind:this={dialog}
  aria-hidden={!isOpen}
  data-polyfilled={!globalThis.HTMLDialogElement}
  class={fullscreenOnMobile ? 'fullscreen-sm-down' : ''}
>
  <div class="modal show" aria-labelledby="{id}-label" style="display: block;">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered {modalLarge ? 'modal-lg' : ''}">
      <div class="modal-content" style:height={height != 'auto' && height}>
        <div class="modal-header d-flex flex-row-reverse">
          <h1 id="{id}-label" class="modal-title">
            <slot name="title" />
          </h1>
          <button
            type="button"
            class="close"
            aria-label="Close modal"
            data-bs-dismiss="modal"
            on:click={() => {
              hide();
            }}
            ><span class="close-icon">
              <i class="fa-solid fa-xmark icon-default" aria-hidden="true"></i><span class="fa-sr-only"
                >Close modal</span
              >
              <i class="fa-solid fa-circle-xmark fa-2x icon-hover" aria-hidden="true"></i><span class="fa-sr-only"
                >Close modal</span
              >
            </span></button
          >
        </div>
        <div class="modal-body {scrollable ? '' : 'dont-scroll'}">
          <slot name="body" />
          <div class="visually-hidden" role="status" aria-atomic="true" aria-live="polite" />
        </div>
        {#if $$slots.footer}
          <div class="modal-footer">
            <slot name="footer">
              <!-- svelte-ignore a11y-autofocus -->
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
    &:has(.modal-lg) {
      max-inline-size: min(90vw, 70ch);
      /* this feels redundant with a style below, but safari mobile isn't applying
      styles in the correct order */
      @media (max-width: 575.98px) {
        max-inline-size: 100vw;
      }
    }
  }

  @media (max-width: 575.98px) {
    dialog.fullscreen-sm-down {
      width: 100vw;
      // max-width: none;
      height: 100%;
      margin: 0;
      max-inline-size: 100vw;
      .modal {
        --bs-modal-margin: 0;
        --bs-modal-border-radius: 0;
      }
      .modal-content {
        min-height: 100vh;
      }
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

  button.close {
    // grid-area: close;
    width: 2.75rem;
    height: 2.75rem;
    background: inherit;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.625rem;
    justify-self: end;
    &:focus-visible {
      outline-offset: 0px;
    }
  }

  .modal-title {
    flex-basis: 100%;
    order: 2;
  }

  button[data-bs-dismiss] i.fa-solid {
    color: var(--color-neutral-900) !important;
  }

  .dont-scroll {
    overflow: hidden !important;
  }
</style>
