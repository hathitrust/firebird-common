<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';

  let modal;
  export let isOpen = false;

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
        <img src="/common/firebird/dist/hathitrust-icon-orange.svg" alt="" role="presentation" />
        <!-- <img src="/firebird-common/dist/hathitrust-icon-orange.svg" alt="" role="presentation" /> -->
        <h2 class="text-uppercase fs-3 mb-0">Choose a role</h2>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="body">
      <div>
        <div class="d-flex gap-4 h-100">
          <form action="/cgi/ping/switch" method="POST" class="w-100 h-100 d-flex flex-column justify-content-between">
            <div class="control">
              <input type="radio" name="role" value="default" id="role--default" checked />
              <label class="radio" for="role--default">Member</label>
              <div class="control--help">
                <p>Read and download public domain and open access books.</p>
              </div>
            </div>
            <div class="control">
              <input type="radio" name="role" value="resourceSharing" id="role--resourceSharing" />
              <label class="radio" for="role--resourceSharing">Resource Sharing</label>
              <div class="control--help">
                <p>This access is only provided for the following use cases:</p>
                <ul>
                  <li>PLACEHOLDER</li>
                </ul>
                <p>
                  Individuals making use of Resource Sharing are not permitted to use this access for other use cases,
                  such as:
                </p>
                <ul>
                  <li>PLACEHOLDER</li>
                </ul>

                <p>
                  HathiTrust will immediately terminate a registered user’s ability to employ Resource Sharing if we
                  determine that a disallowed use has occurred or is occurring. Individuals with Resource Sharing must
                  notify HathiTrust staff at support@hathitrust.org if they believe their credentials have been used by
                  someone else to gain inappropriate access to copyrighted materials; if they have any questions about
                  appropriate uses of this service; or if their role has changed (including departure from the
                  organization) and they no longer need this service.
                </p>
              </div>
            </div>
            <input type="hidden" name="refferer" value="referrer" />
          </form>
        </div>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="footer">
      <button class="btn btn-outline-dark" type="button" on:click={() => hide()}>Cancel</button>
      <button class="btn btn-primary" type="button" on:click={() => hide()}>Submit</button>
    </svelte:fragment>
  </Modal>
</div>

<style lang="scss">
  .cookie-settings {
    //removes the element from pt's grid layout
    position: absolute;
    a {
      color: var(--bs-link-color);
      &:hover {
        color: var(--bs-link-hover-color);
      }
    }
  }
  .cookie-settings :is(p, h3, button.accordion-button) {
    font-size: var(--ht-text-sm);
  }
  // .settings-heading {
  //   border-bottom: 1px solid var(--color-neutral-600);
  // }
  .settings-heading img {
    height: 2.625rem;
  }
  .settings-heading h2 {
    font-weight: 800;
    letter-spacing: 0.0225rem;
  }
  #settings-accordion {
    .accordion-button::after {
      all: unset;
    }
    .accordion-button::before {
      flex-shrink: 0;
      width: var(--bs-accordion-btn-icon-width);
      height: var(--bs-accordion-btn-icon-width);
      content: '';
      background-image: var(--bs-accordion-btn-icon);
      background-repeat: no-repeat;
      background-size: var(--bs-accordion-btn-icon-width);
      transition: var(--bs-accordion-btn-icon-transition);
      transform: rotate(-90deg);
    }
    .accordion-button:not(.collapsed)::before {
      transform: rotate(0deg);
    }
    &.accordion input.form-check-input {
      width: 1.25rem;
      height: 1.25rem;
      padding: 0.5rem;
    }
    .always-active {
      font-size: 0.75rem;
    }
    .accordion-body {
      padding: 0 1.75rem;
    }
  }
  button.btn {
    display: flex;
    height: 2.75rem;
    padding: 0.5rem 1rem;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
  }

  .settings-buttons {
    flex-direction: column;
    width: 100%;
    align-items: normal;
  }
  @media (min-width: 48em) {
    /* 768px, bootstrap "medium" and up */
    .cookie-settings :is(p, h3, button.accordion-button) {
      font-size: 1rem;
    }
    .always-active {
      font-size: var(--ht-text-sm);
    }
    .settings-buttons {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
