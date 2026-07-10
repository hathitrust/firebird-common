<script>
  import { getAllContexts, onMount } from 'svelte';
  import Modal from '../Modal';

  /**
   * @typedef {Object} Props
   * @property {string} [src]
   * @property {boolean} [isOpen]
   * @property {boolean} [loading]
   */

  /** @type {Props} */
  let {
    src = '/common/firebird/dist/hathitrust-icon-orange.svg',
    isOpen = $bindable(false),
    loading = $bindable(false),
    // c = null,
    // cn = null,
    collections = null,
    transferLink = null,
    completeTransferLink = null,
    queued = false,
    step = 1,
    view = 'start-transfer',
  } = $props();

  let url = $state(document.location.href);
  let modal = $state();
  let collectionList = $derived(JSON.parse(collections));
  let transferToken = $derived(completeTransferLink.split('/').pop());
  let cancelLoading = $state(false);
  let tooltip = $state();
  let snippetLink;
  let tooltipOpen = $state(false);

  function reloadPage() {
    if (view !== 'cancel-transfer') {
      location.href = url;
    } else {
      modal.hide();
    }
  }

  export const show = function () {
    isOpen = true;
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

  async function getTransferToken(event) {
    event.preventDefault();
    loading = true;

    let params = new URLSearchParams();
    collections.forEach((col) => params.append('c', col.c));
    params.set('action', 'submit');
    params.set('referer', url);

    let transferUrl = `${location.protocol}//${HT.service_domain}/cgi/mb/transfer`;
    console.log('transferUrl', transferUrl);

    try {
      const response = await fetch(transferUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      const data = await response.json();
      if (data) console.log('data', data);
      transferLink = `${location.protocol}//${HT.service_domain}/cgi/mb/transfer/complete/${data.token}`;
      queued = true;
    } catch (err) {
      console.log('error: ', err);
    } finally {
      step = 2;
      loading = false;
    }
  }

  async function cancelTransfer() {
    event.preventDefault();
    cancelLoading = true;

    let params = new URLSearchParams();
    params.set('action', 'cancel');
    params.set('referer', url);

    const parsed = new URL(url.replace(/;/g, '&'));
    let payload = parsed.searchParams.has('c') ? parsed.searchParams.get('c') : 'ALL';

    let cancelTransferUrl = transferLink
      ? `${location.protocol}//${HT.service_domain}/cgi/mb/transfer/${transferLink.split('/').pop()}?c=${payload}`
      : `${location.protocol}//${HT.service_domain}/cgi/mb/transfer/${transferToken}?c=${payload}`;
    // console.log('cancelTransferUrl', cancelTransferUrl);

    try {
      const response = await fetch(cancelTransferUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      location.href = url;
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async function copyCode(snippetLink, tooltip) {
    let text = snippetLink.innerText;

    await navigator.clipboard.writeText(text);

    //updates tooltip text
    tooltip.innerHTML =
      '<span aria-live="polite">Copied</span> <i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
  }

  function onmouseleave(e) {
    // console.log('mouseleave copy button', e.target.lastElementChild);
    e.target.lastElementChild.innerText = 'Copy';
    tooltip.removeAttribute('style');
  }
  function onblur(e) {
    // console.log('mouseleave copy button', e.target.lastElementChild);
    e.target.lastElementChild.innerText = 'Copy';
    tooltip.removeAttribute('style');
  }

  function onCancel() {
    if (tooltipOpen) {
      tooltip.style.visibility = 'hidden';
      tooltipOpen = false;
      return false;
    }
    return true;
  }

  $effect(() => {
    if (modal && isOpen) {
      show();
    }
    if (modal && !isOpen) {
      hide();
    }
  });
</script>

<!-- 
// TODO
// 1. will need a focus-on-close function
// 2. can't forget about mondo collection template in ls!!!

***left to do***
- address error states, make sure all template parts are accounted for
  - probably need to rework the cgi so it returns error json instead of html 
-->
<div>
  <Modal bind:this={modal} {onCancel} scrollable modalLarge fullscreenOnMobile>
    {#snippet title()}
      <div class="align-items-center d-flex gap-2 py-2 settings-heading">
        <img {src} alt="" role="presentation" />
        <span class="text-uppercase fw-exbold fs-3 mb-0">Transfer collections</span>
      </div>
    {/snippet}
    {#snippet body()}
      <form id="transfer-collection">
        {#if !queued}
          {#if step === 1}
            <h2 class="h3">Step 1: Selection collections</h2>
            <p>You've selected these collections to transfer:</p>
            <ul>
              <!-- i need some props that pass in collection name and link-->
              <!-- preferrably as an array that i can iterate -->
              {#each collections as collection}
                <li>
                  <a href="{location.protocol}//{HT.service_domain}/cgi/mb/a=listis;c={collection.c}">{collection.cn}</a
                  >
                </li>
              {/each}
            </ul>
          {/if}
        {/if}
        {#if step === 2}
          <h2 class="h3">
            {#if !queued}Step 2:&nbsp;
            {/if}Copy link
          </h2>
          <p>Copy this link and use in a new browser session:</p>
          <div class="d-flex gap-3">
            <figure class="snippet">
              <div class="d-flex">
                <pre tabindex="-1"><code bind:this={snippetLink}
                    >{#if transferLink}{transferLink}{:else}{location.protocol}//{HT.service_domain}/cgi/mb/transfer/complete/{transferToken}{/if}</code
                  ></pre>
                <button
                  type="button"
                  class="copycode"
                  title="Copy to clipboard"
                  onclick={() => copyCode(snippetLink, tooltip)}
                  onfocus={() => ((tooltipOpen = true), console.log('tooltip?', tooltipOpen))}
                  {onblur}
                  {onmouseleave}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="copy-icon" viewBox="0 0 448 512"
                    ><path
                      d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"
                    ></path></svg
                  >
                  <tool-tip role="tooltip" bind:this={tooltip}>Copy</tool-tip>
                </button>
              </div>
            </figure>
          </div>
          <p class="mt-3">
            If you are using this link to migrate your collections to a new identity, make sure you log out of
            HathiTrust with your current account before proceeding.
          </p>
        {/if}
      </form>
    {/snippet}
    {#snippet footer()}
      <div class="py-3 px-4 m-0">
        <div class="d-flex gap-3" role="status">
          {#if !queued}
            <button
              class="btn btn-white border-0 py-2 px-3 m-0"
              onclick={() => {
                hide();
              }}>Cancel</button
            >
          {:else}
            <button
              class="btn btn-white border-0 py-2 px-3 m-0"
              disabled={cancelLoading}
              onclick={() => {
                cancelTransfer();
              }}
              >Cancel transfer
              <span class={cancelLoading ? 'spinner-border spinner-border-sm ms-2 text-dark' : ''} aria-hidden="true"
              ></span>{#if cancelLoading}
                <span class="visually-hidden">Cancelling collection transfer</span>{/if}</button
            >
          {/if}
          {#if step === 1}
            <button class="btn btn-primary py-2 px-3 m-0" onclick={getTransferToken} disabled={loading}
              >Next<span class={loading ? 'spinner-border spinner-border-sm ms-2' : ''} aria-hidden="true"
              ></span>{#if loading}
                <span class="visually-hidden">Preparing collection transfer</span>{/if}</button
            >
          {:else}
            <button class="btn btn-primary py-2 px-3 m-0" onclick={reloadPage} disabled={loading}
              >Done<span class={loading ? 'spinner-border spinner-border-sm ms-2' : ''} aria-hidden="true"
              ></span>{#if loading}
                <span class="visually-hidden">Submitting collection transfer</span>{/if}</button
            >
          {/if}
        </div>
      </div>
    {/snippet}
  </Modal>
</div>

<style lang="scss">
  form#transfer-collection {
    min-width: 0;
  }

  .settings-heading img {
    height: 2.625rem;
  }

  .settings-heading span {
    letter-spacing: 0.0225rem;
    line-height: 1.3125rem;
  }

  .btn.btn-white {
    box-shadow: none;
    &:active {
      border: none;
    }
  }

  tool-tip {
    opacity: 0;
    visibility: hidden;
    z-index: 1;
    transform: translate(var(-50%, 0)) translateY(var(3px, 0));
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    background: var(--color-shades-100);
    font-family: Mulish, sans-serif;
    font-size: 0.75rem;
    text-wrap: nowrap;
    padding: 0.75rem;
    margin-block-end: 6px;
    border-radius: 0.5rem;
    position: absolute;
  }

  tool-tip:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -7px;
    border-width: 7px;
    border-style: solid;
    border-color: var(--color-shades-100) transparent transparent transparent;
    z-index: -1;
  }

  .snippet tool-tip {
    inset-block-end: 105%;
  }

  button.copycode {
    position: relative;
    color: var(--color-shades-0);
    border-left-width: 0;
  }

  button.copycode:is(:hover, :focus-visible, :active) tool-tip {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.2s;
  }

  button.copycode svg.copy-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.125em;
    fill: var(--color-shades-0);
  }

  tool-tip:before {
    content: '; Has tooltip: ';
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }

  button.copycode {
    color: var(--color-shades-0);
    // anchor-name: --copycode-button;
  }

  figure.snippet {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .snippet pre {
    display: flex;
    align-items: center;
    gap: 0.9375rem;
    flex: 1 0 0;
    border-radius: 0.25rem 0rem 0rem 0.25rem;
    border-top: 0.75px solid var(--color-neutral-300);
    border-bottom: 0.75px solid var(--color-neutral-300);
    border-left: 0.75px solid var(--color-neutral-300);
    background: var(--color-neutral-50);
    margin-block: 0;
  }

  .snippet pre code {
    padding: 0.625rem;
    color: var(--color-neutral-800);
    font-family:
      Roboto Mono,
      monospace;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: normal;
    width: 100%;
  }

  .snippet button.copycode {
    display: flex;
    width: 2.75rem;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border-radius: 0rem 0.25rem 0.25rem 0rem;
    border-top: 0.75px solid var(--color-neutral-700);
    border-right: 0.75px solid var(--color-neutral-700);
    border-bottom: 0.75px solid var(--color-neutral-700);
    background: var(--color-neutral-700);
  }
</style>
