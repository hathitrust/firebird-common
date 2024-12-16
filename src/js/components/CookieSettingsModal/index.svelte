<script>
  import { onMount } from 'svelte';
  import Modal from '../Modal';
  import { allowSelected, denyAll } from '../../lib/cookies';
  import { cookieConsentSeen, allowTracking, allowMarketing, allowPreferences } from '../../lib/store.js';

  let HT = window.HT || {};
  let cookieJar = HT.cookieJar;

  function makeBool(cookie) {
    if (cookie === 'true') {
      cookie = true;
    }
    if (cookie === 'false') {
      cookie = false;
    }
    return cookie;
  }

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
    if ($cookieConsentSeen === 'true') {
      $allowTracking = makeBool(cookieJar.getItem('HT-tracking-cookie-consent'));
      $allowMarketing = makeBool(cookieJar.getItem('HT-marketing-cookie-consent'));
      $allowPreferences = makeBool(cookieJar.getItem('HT-preferences-cookie-consent'));
    } else {
      $allowTracking = false;
      $allowMarketing = false;
      $allowPreferences = false;
    }
  });

  $: if (modal && isOpen) {
    show();
  }
  $: if (modal && !isOpen) {
    hide();
  }
</script>

<div class="cookie-settings">
  <Modal bind:this={modal} scrollable modalLarge fullscreenOnMobile>
    <svelte:fragment slot="title">
      <div class="align-items-center d-flex gap-2 py-2 settings-heading">
        <img src="/common/firebird/dist/hathitrust-icon-orange.svg" alt="" role="presentation" />
        <!-- <img src="/firebird-common/dist/hathitrust-icon-orange.svg" alt="" role="presentation" /> -->
        <h2 class="text-uppercase fs-3 mb-0">HathiTrust cookie settings</h2>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="body">
      <div>
        <div class="d-flex gap-4 h-100">
          <form class="w-100 h-100 d-flex flex-column justify-content-between">
            <div>
              <p>
                HathiTrust uses cookies to ensure you have the best experience on our website. You control which cookies
                you want to allow. Disabling some cookies may impact your experience on our site and the services we
                provide. More information about each type of cookie is provided in our <a
                  class="fw-bold"
                  href="https://www.hathitrust.org/the-collection/terms-conditions/privacy-policy/#cookies-on-our-website"
                  >Privacy Policy</a
                >.
              </p>
              <h3 class="fw-exbold">Manage cookie preferences</h3>
              <p>Select the cookies that you want to allow.</p>
              <div class="container p-0">
                <div class="accordion accordion-flush" id="settings-accordion" data-role="default">
                  <div class="accordion-item">
                    <h2 class="accordion-header d-flex align-items-center" id="heading1">
                      <button
                        class="accordion-button fw-bold collapsed gap-2 px-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse1"
                        aria-expanded="false"
                        aria-controls="collapse1"
                        id="necessary-button"
                      >
                        Necessary cookies
                      </button>
                      <input
                        id="necessary"
                        name="necessary"
                        type="button"
                        value="Always active"
                        class="always-active text-success bg-white border-0 fw-bold"
                        aria-labelledby="necessary-button"
                        aria-describedby="necessary-description"
                        disabled
                      />
                    </h2>
                    <div id="collapse1" class="accordion-collapse collapse" aria-labelledby="heading1">
                      <div class="accordion-body">
                        <p id="necessary-description">
                          Necessary cookies are required to enable basic website functionality. The website cannot
                          function without these cookies.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <h2 class="accordion-header d-flex align-items-center gap-1" id="heading3">
                        <button
                          class="accordion-button fw-bold collapsed px-0 gap-2"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse3"
                          aria-expanded="false"
                          aria-controls="collapse3"
                          id="preferences-button"
                          aria-describedby="preferences-description"
                        >
                          Functional cookies
                        </button>
                      </h2>
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="preferences"
                        value="preferences"
                        id="preferences"
                        aria-labelledby="preferences-button"
                        bind:checked={$allowPreferences}
                      />
                    </div>
                    <div id="collapse3" class="accordion-collapse collapse" aria-labelledby="heading3">
                      <div class="accordion-body">
                        <p id="preferences-description">
                          Functional cookies allow us to remember your preferences when you use our website. These
                          cookies include your preferred search and reading options.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <h2 class="accordion-header d-flex align-items-center gap-1" id="heading2">
                        <button
                          class="accordion-button fw-bold collapsed px-0 gap-2"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse2"
                          aria-expanded="false"
                          aria-controls="collapse2"
                          id="statistics-button"
                        >
                          Statistics cookies
                        </button>
                      </h2>
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="statistics"
                        value="statistics"
                        id="statistics"
                        aria-labelledby="statistics-button"
                        aria-describedby="statistics-description"
                        bind:checked={$allowTracking}
                      />
                    </div>
                    <div id="collapse2" class="accordion-collapse collapse" aria-labelledby="heading2">
                      <div class="accordion-body">
                        <p id="statistics-description">
                          Statistics cookies help us improve our website through feedback surveys or by analyzing usage
                          by people like you. We anonymize and combine this data with other user data so that it can't
                          identify you. You can block these cookies without any impact to your usage of the site.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <h2 class="accordion-header d-flex align-items-center gap-1" id="heading4">
                        <button
                          class="accordion-button fw-bold collapsed px-0 gap-2"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse4"
                          aria-expanded="false"
                          aria-controls="collapse4"
                          id="marketing-button"
                          aria-describedby="marketing-description"
                        >
                          Marketing cookies
                        </button>
                      </h2>
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="marketing"
                        value="marketing"
                        id="marketing"
                        aria-labelledby="marketing-button"
                        bind:checked={$allowMarketing}
                      />
                    </div>
                    <div id="collapse4" class="accordion-collapse collapse" aria-labelledby="heading4">
                      <div class="accordion-body">
                        <p id="marketing-description">
                          Our website enables limited Google marketing cookies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--close accordion container-->
            </div>

            <div class="settings-buttons d-flex mt-4 justify-content-center gap-2">
              <button
                type="button"
                class="btn btn-primary"
                id="deny-all"
                on:click={() => {
                  $allowMarketing = false;
                  $allowPreferences = false;
                  $allowTracking = false;
                  denyAll();
                  hide();
                }}>Allow necessary cookies only</button
              >
              <button
                type="button"
                class="btn btn-primary"
                id="allow-selected"
                on:click={() => {
                  allowSelected();
                  hide();
                }}>Confirm my choices</button
              >
            </div>
          </form>
        </div>
      </div>
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
    flex: 1 0 0;
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
