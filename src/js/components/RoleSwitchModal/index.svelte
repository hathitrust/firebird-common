<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';

  let HT = window.HT || {};
  let switchableRole = Object.keys(HT.login_status.r)[0];
  let roleActivated = Object.values(HT.login_status.r)[0];
  let role = roleActivated ? switchableRole : 'default';

  const switchableRolesLabels = {};
  switchableRolesLabels['enhancedTextProxy'] = 'Accessible Text Request Service (ATRS)';
  switchableRolesLabels['totalAccess'] = 'Collection Administration Access';
  switchableRolesLabels['resourceSharing'] = 'Resource Sharing';

  let roleLabel = switchableRolesLabels[switchableRole];

  let url = document.location.href;
  let modal;
  export let src = '/common/firebird/dist/hathitrust-icon-orange.svg';
  export let isOpen = false;
  export let loading = false;

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
    let params = new URLSearchParams();
    params.set('role', role);
    params.set('referer', url);
    params.set('action', 'submit');

    let switchUrl = new URL(`${location.protocol}//${HT.service_domain}/cgi/ping/switch?${params.toString()}`);

    location.href = switchUrl;
  }

  $: if (modal && isOpen) {
    show();
  }
  $: if (modal && !isOpen) {
    hide();
  }
</script>

<div class="switch-roles">
  <Modal bind:this={modal} scrollable modalLarge fullscreenOnMobile>
    <svelte:fragment slot="title">
      <div class="align-items-center d-flex gap-2 py-2 settings-heading">
        <img {src} alt="" role="presentation" />
        <span class="text-uppercase fw-exbold fs-3 mb-0">Choose a role</span>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="body">
      <div>
        <form
          id="ping-switch"
          action="/cgi/ping/switch"
          method="POST"
          class="w-100 h-100 d-flex flex-column justify-content-between"
          on:submit={submit}
        >
          <div class="roles d-flex flex-column h-100">
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
                        <p>This access is only provided for the following use cases:</p>
                        <ul>
                          <li>PLACEHOLDER</li>
                        </ul>
                        <p>
                          Individuals making use of Resource Sharing are not permitted to use this access for other use
                          cases, such as:
                        </p>
                        <ul>
                          <li>PLACEHOLDER</li>
                        </ul>
                        <p>
                          HathiTrust will immediately terminate a registered user’s ability to employ Resource Sharing
                          if we determine that a disallowed use has occurred or is occurring. Individuals with Resource
                          Sharing must notify HathiTrust staff at support@hathitrust.org if they believe their
                          credentials have been used by someone else to gain inappropriate access to copyrighted
                          materials; if they have any questions about appropriate uses of this service; or if their role
                          has changed (including departure from the organization) and they no longer need this service.
                        </p>
                      {:else if switchableRole === 'totalAccess'}
                        <p>This access is only provided for the following use cases:</p>
                        <ul>
                          <li>
                            Evaluating or improving the quality of digital files or catalog records in the HathiTrust
                            collection
                          </li>
                          <li>Reviewing the copyright status of HathiTrust volumes</li>
                          <li>Developing or maintaining HathiTrust systems, applications, and the repository</li>
                        </ul>
                        <p>
                          Individuals making use of Collection Administration Access are not permitted to use this
                          access for other use cases, such as:
                        </p>
                        <ul>
                          <li>Answering patron reference questions using copyrighted HathiTrust books.</li>
                          <li>Reading copyrighted HathiTrust books for their own purposes.</li>
                          <li>Downloading or otherwise copying and sharing copyrighted files for personal use.</li>
                          <li>Downloading or otherwise copying and sharing copyrighted files with patrons.</li>
                          <li>
                            Downloading and sharing pages from copyrighted works with co-workers who will use them for
                            any non-permitted uses listed above. However, to meet the permitted use cases above, users
                            with Collection Administration Access may, when absolutely necessary, download and share a
                            few pages of a copyrighted work with co-workers.
                          </li>
                          <li>
                            Providing others with credentials to use Collection Administration Access to perform any
                            task.
                          </li>
                        </ul>
                        <p>
                          HathiTrust will immediately terminate a registered user’s ability to employ Collection
                          Administration Access if we determine that a disallowed use has occurred or is occurring.
                          Individuals with Collection Administration Access must notify HathiTrust staff at
                          support@hathitrust.org if they believe their credentials have been used by someone else to
                          gain inappropriate access to copyrighted materials; if they have any questions about
                          appropriate uses of this service; or if their role has changed (including departure from the
                          organization) and they no longer need this service.
                        </p>
                      {:else if switchableRole === 'enhancedTextProxy'}
                        <p>
                          Download copyrighted books, in order to provide them to eligible patrons with print
                          disabilities.
                        </p>
                        <p>
                          The following terms of use apply when accessing books as an ATRS provider. Per the agreement
                          you signed to become an ATRS provider, you must confirm with eligible patrons that they
                          understand:
                        </p>
                        <ul>
                          <li>The copyrighted nature of the content</li>
                          <li>Why they are being granted special access to the work</li>
                          <li>
                            That the cover sheet indicating the copyright status and terms of use must remain with the
                            work at all times
                          </li>
                          <li>
                            That the accessible copies are for personal use only and may not be reproduced, distributed,
                            or made available to anyone else other than to facilitate the Eligible Patron’s personal use
                          </li>
                          <li>
                            That if the Eligible Patrons have any questions about proper use of the material or suspect
                            unauthorized access to the material, they should contact the DSP immediately
                          </li>
                        </ul>
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
          </div>
        </form>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="footer">
      <div class="py-3 px-4 m-0">
        <div class="d-flex gap-3">
          <button class="btn btn-white border-0 py-2 px-3 m-0" name="action" value="cancel" on:click={() => hide()}
            >Cancel</button
          >
          <button class="btn btn-primary py-2 px-3 m-0" type="submit" form="ping-switch" disabled={loading}
            >Submit{#if loading}
              <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
              <span class="visually-hidden">Switching your role to {role === 'default' ? 'Member' : roleLabel}</span
              >{/if}</button
          >
        </div>
      </div>
    </svelte:fragment>
  </Modal>
</div>

<style lang="scss">
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
  .option--help {
    color: var(--color-neutral-800);
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.3125rem;
    letter-spacing: -0.01rem;
    ul {
      padding-inline-start: 1rem;
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
