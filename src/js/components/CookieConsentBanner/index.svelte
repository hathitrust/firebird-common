<script>
  import { onMount } from 'svelte';
  import { allowAll, denyAll } from '../../lib/cookies.js';
  import { cookieConsentSeen, trackingConsent, marketingConsent, preferencesConsent } from '../../lib/store.js';
  import CookieSettingsModal from '../CookieSettingsModal';

  let HT = window.HT || {};

  export function trapFocus() {
    var element = document.querySelector('.cookie-banner');
    var focusableEls = element.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    );
    var firstFocusableEl = focusableEls[0];
    var lastFocusableEl = focusableEls[focusableEls.length - 1];
    var KEYCODE_TAB = 9;

    element.addEventListener('keydown', function (e) {
      var isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) {
        /* shift + tab */ if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } /* tab */ else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    });
  }

  export let lgSrc = '/common/firebird/dist/hathitrust-logo-stacked-orange-gray.png';
  export let smSrc = '/common/firebird/dist/hathitrust-icon-orange.png';

  let settingsModal;
  function openSettings() {
    settingsModal.show();
  }
  export let cookieJar = HT.cookieJar;

  setTimeout(() => {
    if (!document.querySelector('.cookie-banner')) {
      return;
    }
    trapFocus();
  }, 1000);

  onMount(() => {
    $cookieConsentSeen = cookieJar.getItem('HT-cookie-banner-seen') || 'false';
    $trackingConsent = cookieJar.getItem('HT-tracking-cookie-consent') || 'false';
    $marketingConsent = cookieJar.getItem('HT-marketing-cookie-consent') || 'false';
    $preferencesConsent = cookieJar.getItem('HT-preferences-cookie-consent') || 'false';
  });
</script>

{#if $cookieConsentSeen === 'false'}
  <CookieSettingsModal bind:this={settingsModal} />
  <div aria-labelledby="cookie-heading" aria-describedby="cookie-description" role="dialog" aria-modal="false">
    <div class="cookie-banner alert alert-dark alert-block mb-0 shadow-lg rounded-bottom-0">
      <div class="banner-container">
        <div class="banner-image align-items-center d-none d-xl-flex justify-content-center">
          <img src={lgSrc} height="133" width="100" class="" alt="" role="presentation" />
        </div>
        <!-- <div class="banner-content d-flex gap-3"> -->
        <div class="banner-header">
          <!-- <div class="banner-image d-xl-none"> -->
          <img src={smSrc} class="banner-image d-xl-none" alt="" role="presentation" />
          <!-- </div> -->
          <h2 class="h2 bold" id="cookie-heading">Can we use cookies in your browser?</h2>
          <button
            type="button"
            class="close"
            aria-label="Close banner"
            on:click={() => {
              denyAll();
            }}
            ><span class="close-icon">
              <i class="fa-solid fa-xmark icon-default" aria-hidden="true"></i><span class="fa-sr-only"
                >Close banner</span
              >
              <i class="fa-solid fa-circle-xmark fa-2x icon-hover" aria-hidden="true"></i><span class="fa-sr-only"
                >Close banner</span
              >
            </span></button
          >
        </div>
        <div class="banner-body">
          <div id="cookie-description">
            <p>
              HathiTrust uses cookies to ensure you have the best experience on our website. <span class="fw-bold"
                >You control which cookies you want to allow.</span
              >
            </p>
            <p class="mb-0">
              Our <a
                class="fw-bold"
                href="https://www.hathitrust.org/the-collection/terms-conditions/privacy-policy/#cookies-on-our-website"
                >Privacy Policy</a
              >
              includes more details on the cookies we use and how we protect your privacy. By proceeding, you agree to follow
              our <a class="fw-bold" href="https://www.hathitrust.org/acceptable-use">Acceptable Use Policy</a>.
            </p>
          </div>
          <div class="banner-buttons d-flex gap-2">
            <button
              type="button"
              class="btn btn-primary"
              on:click={() => {
                allowAll();
              }}>Allow all cookies</button
            >
            <button
              type="button"
              class="btn btn-primary"
              on:click={() => {
                denyAll();
              }}>Allow necessary cookies only</button
            >

            <button type="button" class="btn btn-tertiary" on:click={openSettings}
              >Customize cookies<i class="fa-solid fa-fw fa-sm fa-chevron-right"></i></button
            >
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  //general and mobile styles
  .cookie-banner {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    gap: 2rem !important;
    border-end-end-radius: 0;
    border-end-start-radius: 0;
    background: var(--color-primary-200);
    padding: 1.25rem 1rem;
    max-height: 34rem;

    .h2 {
      font-size: 1.25rem;
      line-height: 120%; /* 1.5rem */
      letter-spacing: -0.0125rem;
      color: var(--color-neutral-900);
      margin: 0;
    }
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn-tertiary {
      gap: 0.75rem;
    }
    p {
      font-size: 0.875rem;
      line-height: 1.125rem; /* 128.571% */
      letter-spacing: -0.00875rem;
      padding: 0;
      margin: 0;
      color: var(--color-neutral-900);
      a {
        color: var(--color-primary-600);
      }
    }
    img.banner-image {
      max-inline-size: 1.875rem;
      grid-area: logo;
      align-self: center;
    }
    .banner-header {
      grid-area: header;
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: auto;
      grid-template-areas:
        'logo . close'
        'heading heading heading';
    }
    .banner-body {
      grid-area: body;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    #cookie-heading {
      grid-area: heading;
    }
    #cookie-description {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .banner-buttons {
      display: flex;
      flex-direction: column;
      button {
        line-height: 1.3125rem; /* 131.25% */
        letter-spacing: -0.01rem;
        height: 2.75rem;
      }
    }
    .banner-container {
      display: grid;
      gap: 0.5rem;
      grid-template-columns: auto;
      grid-template-rows: auto;
      grid-template-areas:
        'header header header'
        'body body body';
    }
    button.close {
      grid-area: close;
      width: 2.75rem;
      height: 2.75rem;
      background: inherit;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      justify-self: end;
      border-radius: 0.375rem;
      span.close-icon {
        padding: 0.625rem;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        //trying to animate these icons
        display: block;
        position: relative;
        i {
          color: var(--color-neutral-600);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: opacity 0.25s ease-out;
        }
      }
      .close-icon .icon-default {
        opacity: 1;
      }
      .close-icon .icon-hover {
        opacity: 0;
      }
      .close-icon:hover .icon-default,
      .close-icon:focus .icon-default {
        opacity: 0;
        color: transparent;
      }
      .close-icon:hover .icon-hover,
      .close-icon:focus .icon-hover {
        opacity: 1;
      }
      &:focus-visible {
        outline: 4px solid rgba(51, 51, 51, 0.4);
        border-radius: 50%;
      }
    }
    .close i {
      color: var(--color-neutral-600);
    }
    @media (min-width: 40em) {
      /* 640px, bootstrap "small" and up */
      /* .cookie-banner */
      padding: 1.25rem 2rem;
      .h2 {
        font-size: 1.5rem;
        line-height: 2.125rem; /* 141.667% */
        letter-spacing: -0.015rem;
      }
      .banner-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      #cookie-heading {
        flex-grow: 1;
      }
      p {
        font-size: 1rem;
        line-height: 1.3125rem; /* 131.25% */
        letter-spacing: -0.01rem;
        padding-inline-end: 1.25rem;
      }
    }
    @media (min-width: 48em) {
      /* 768px, bootstrap "medium" and up */
      .banner-buttons {
        flex-direction: row;
        button {
          display: flex;
          height: 2.75rem;
          padding: 0.5rem 1rem;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          // &:nth-child(odd) {
          //   flex: 1 0 0;
          // }
        }
      }
    }
    @media (max-width: 75em) and (min-width: 48em) {
      .banner-buttons button:nth-child(odd) {
        flex: 1 0 0;
      }
    }
    @media (min-width: 75em) {
      /* 992px, bootstrap "xl" and up */
      .banner-image {
        grid-column: 1;
        grid-row: 1 / 3;
        padding: 0.6875rem 1.375rem;
        width: 10.3125rem;
        height: 10.3125rem;
        img {
          max-inline-size: 6.875rem;
          max-block-size: 8.34181rem;
        }
      }
      .banner-container {
        grid-template-areas:
          'logo header header'
          'logo body body';
        align-items: center;
        column-gap: 1rem;
        grid-template-columns: auto 1fr;
      }
      .banner-body {
        flex-direction: row;
        justify-content: space-between;
      }
      #cookie-description {
        gap: 1rem;
        max-inline-size: 34.25rem;
      }
      .banner-buttons {
        flex-direction: column;
        width: 22.5rem;
        align-self: stretch;
      }
    }
  }
  @media (min-width: 82rem) {
    /* 1312 px */
    .banner-container {
      margin-inline: max(clamp(0.938rem, calc(0.268rem + 3.348vw), 1.875rem), ((100% - 73.125rem) / 2));
    }
  }
</style>
