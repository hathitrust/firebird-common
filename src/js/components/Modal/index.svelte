<script>
  import { onMount } from 'svelte';

  import dialogPolyfill from 'dialog-polyfill';

  /**
   * @typedef {Object} Props
   * @property {boolean} [isOpen]
   * @property {any} [id]
   * @property {any} [onClose]
   * @property {string} [height]
   * @property {boolean} [scrollable]
   * @property {string} [mode]
   * @property {boolean} [modalLarge]
   * @property {boolean} [fullscreenOnMobile]
   * @property {boolean} [focusHelpOnClose]
   * @property {boolean} [focusMyAccountOnClose]
   * @property {boolean} [focusButtonOnClose]
   * @property {import('svelte').Snippet} [title]
   * @property {import('svelte').Snippet} [body]
   * @property {import('svelte').Snippet} [footer]
   * @property {import('svelte').Snippet} [action]
   */

  /** @type {Props} */
  let {
    isOpen = $bindable(false),
    id = `id${new Date().getTime()}-${Math.floor(Math.random() * Date.now())}`,
    onClose = function () {},
    height = 'auto',
    scrollable = false,
    mode = 'alert',
    modalLarge = false,
    fullscreenOnMobile = false,
    focusHelpOnClose = false,
    focusMyAccountOnClose = false,
    focusButtonOnClose = false,
    title,
    body,
    footer,
    action,
  } = $props();

  // let modalBody;

  let dialog = $state();

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
    if (focusHelpOnClose || focusMyAccountOnClose || focusButtonOnClose) {
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
    if (focusButtonOnClose) {
      document.querySelector('#feedback-form').focus();
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

  $effect(() => {
    if (dialog && isOpen) {
      show();
    }
  });
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
            {@render title?.()}
          </h1>
          <button
            type="button"
            class="close"
            aria-label="Close modal"
            data-bs-dismiss="modal"
            onclick={() => {
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
          {@render body?.()}
          <div class="visually-hidden" role="status" aria-atomic="true" aria-live="polite"></div>
        </div>
        {#if footer}
          <div class="modal-footer">
            {#if footer}
              {@render footer()}
            {:else}
              <!-- svelte-ignore a11y_autofocus -->
              <button
                type="reset"
                autofocus
                class="btn btn-secondary"
                onclick={() => {
                  hide();
                }}>Close</button
              >
            {/if}
            {#if mode == 'prompt'}
              <button type="button" class="btn btn-primary">
                {#if action}{@render action()}{:else}OK{/if}
              </button>
            {/if}
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
    &:has(:global(.modal-lg)) {
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
