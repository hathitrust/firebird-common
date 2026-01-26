<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';
  import ResourceSharing from './ResourceSharing.svelte';
  import TotalAccess from './TotalAccess.svelte';
  import EnhancedTextProxy from './EnhancedTextProxy.svelte';
  import docCookies from '../../lib/cookies.svelte';

  let HT = window.HT || {};
  let switchableRole = Object.keys(HT.login_status.r)[0];
  let roleActivated = Object.values(HT.login_status.r)[0];
  let role = $state(roleActivated ? switchableRole : 'default');

  const switchableRolesLabels = {};
  switchableRolesLabels['enhancedTextProxy'] = 'Accessible Text Request Service (ATRS)';
  switchableRolesLabels['totalAccess'] = 'Collection Administration Access';
  switchableRolesLabels['resourceSharing'] = 'Resource Sharing';

  let roleLabel = switchableRolesLabels[switchableRole];

  let url = $state(document.location.href);
  let modal = $state();
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
    checkForNotifications,
  } = $props();

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

  function submit(event) {
    event.preventDefault();
    loading = true;
    docCookies.setItem('HT-role-prompt', 'true', 4, 'hours');
    let params = new URLSearchParams();
    params.set('role', role);
    params.set('referer', url);
    params.set('action', 'submit');

    let switchUrl = new URL(`${location.protocol}//${HT.service_domain}/cgi/ping/switch?${params.toString()}`);

    location.href = switchUrl;
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

<div class="switch-roles">
  <Modal
    bind:this={modal}
    scrollable
    modalLarge
    fullscreenOnMobile
    setPromptCookie
    {checkForNotifications}
    focusMyAccountOnClose
  >
    {#snippet title()}
      <div class="align-items-center d-flex gap-2 py-2 settings-heading">
        <img {src} alt="" role="presentation" />
        <span class="text-uppercase fw-exbold fs-3 mb-0">Choose a role</span>
      </div>
    {/snippet}
    {#snippet body()}
      <div>
        <form
          id="ping-switch"
          action="/cgi/ping/switch"
          method="POST"
          class="w-100 h-100 d-flex flex-column justify-content-between"
          onsubmit={submit}
        >
          <fieldset class="roles d-flex flex-column h-100">
            <legend class="sr-only">Choose a role</legend>
            <label
              for="role--default"
              class="form-check option py-4 px-3"
              class:selected={role === 'default'}
              aria-labelledby={roleActivated ? 'member' : 'member-current-role member'}
            >
              <span id="member-current-role" class="badge rounded-pill" class:d-none={roleActivated}>Current role</span>
              <div class="d-flex justify-content-between gap-4" class:mt-n4={!roleActivated}>
                <div class="d-flex gap-75">
                  <span
                    class="role-icon d-flex align-items-center justify-content-center border border-neutral-300 rounded-circle bg-neutral-100"
                    ><i class="fa-solid fa-user text-neutral-800"></i></span
                  >
                  <div class=" d-flex flex-column gap-2">
                    <span id="member" class="form-check-label"
                      >Member <span class="visually-hidden">For additional info read below</span></span
                    >
                    <p class="option--help mb-0">Read and download public domain and open access books.</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="role"
                  value="default"
                  id="role--default"
                  class="form-check-input ms-0"
                  bind:group={role}
                />
              </div>
            </label>
            <label
              for="role--{switchableRole}"
              class="form-check option py-4 px-3"
              class:selected={role !== 'default'}
              aria-labelledby={roleActivated ? 'switchable-current-role switchable' : 'switchable'}
            >
              <span id="switchable-current-role" class="badge rounded-pill" class:d-none={!roleActivated}
                >Current role</span
              >
              <div class="d-flex justify-content-between gap-4" class:mt-n4={roleActivated}>
                <div class="d-flex gap-75">
                  <span
                    class="role-icon d-flex align-items-center justify-content-center border border-neutral-300 rounded-circle bg-neutral-100"
                    ><i class="fa-solid fa-user-plus text-primary-600"></i></span
                  >
                  <div class="d-flex flex-column gap-2">
                    <span id="switchable" class="form-check-label">
                      {roleLabel} <span class="visually-hidden">For additional info read below</span>
                    </span>
                    <div class="option--help">
                      {#if switchableRole === 'resourceSharing'}
                        <ResourceSharing />
                      {:else if switchableRole === 'totalAccess'}
                        <TotalAccess />
                      {:else if switchableRole === 'enhancedTextProxy'}
                        <EnhancedTextProxy />
                      {/if}
                    </div>
                  </div>
                </div>
                <input
                  class="form-check-input ms-0"
                  type="radio"
                  name="role"
                  value={switchableRole}
                  id="role--{switchableRole}"
                  bind:group={role}
                />
              </div>
              <div class="control--help"></div>
            </label>
            <input type="hidden" name="referer" bind:value={url} />
          </fieldset>
        </form>
      </div>
    {/snippet}
    {#snippet footer()}
      <div class="py-3 px-4 m-0">
        <div class="d-flex gap-3" role="status">
          <button
            class="btn btn-white border-0 py-2 px-3 m-0"
            name="action"
            value="cancel"
            onclick={() => {
              hide();
              checkForNotifications();
            }}>Cancel</button
          >
          <button class="btn btn-primary py-2 px-3 m-0" type="submit" form="ping-switch" disabled={loading}
            >Submit<span class={loading ? 'spinner-border spinner-border-sm ms-2' : ''} aria-hidden="true"
            ></span>{#if loading}
              <span class="visually-hidden">Switching your role to {role === 'default' ? 'Member' : roleLabel}</span
              >{/if}</button
          >
        </div>
      </div>
    {/snippet}
  </Modal>
</div>

<style lang="scss">
  .switch-roles :global {
    a {
      color: var(--color-primary-700);
      &:hover {
        color: var(--color-primary-800);
      }
    }
  }
  .settings-heading img {
    height: 2.625rem;
  }
  .settings-heading span {
    letter-spacing: 0.0225rem;
    line-height: 1.3125rem;
  }
  .gap-75 {
    gap: 0.75rem !important;
  }
  .roles {
    gap: 1.5rem;
    padding: 0.5rem 0;
  }
  .option {
    border-radius: 0.375rem;
    border: 0.5px solid var(--color-neutral-500);
    background: var(--color-shades-0);
    box-shadow: 6px 12px 4px 0px rgba(0, 0, 0, 0.01);
    &.selected {
      border-radius: 0.375rem;
      border: 1.5px solid var(--color-primary-600);
      background: var(--color-primary-50);
    }
  }
  .badge {
    --bs-badge-padding-x: 0.5rem;
    --bs-badge-padding-y: 0.25rem;
    --bs-badge-font-size: 0.75em;
    --bs-badge-font-weight: 500;
    --bs-badge-color: var(--color-shades-0);
    --bs-badge-border-radius: 2.5rem;
    background-color: var(--color-primary-600);
    line-height: 1.125rem;
    letter-spacing: -0.0075rem;
    position: relative;
    top: -2.5rem;
  }
  .role-icon {
    padding: 0.625rem;
    height: 2.5rem;
    width: 2.5rem;
  }
  label {
    color: var(--color-neutral-900);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.3125rem;
    letter-spacing: -0.01rem;
  }
  .option--help :global {
    color: var(--color-neutral-800);
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.3125rem;
    letter-spacing: -0.01rem;
    ul {
      padding-inline-start: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    & :last-child {
      margin-block-end: 0;
    }
  }
  .btn.btn-white {
    box-shadow: none;
    &:active {
      border: none;
    }
  }
</style>
