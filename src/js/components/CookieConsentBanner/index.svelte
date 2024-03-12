<script>
  import { onMount } from 'svelte';
  import { allowAll, denyAll } from '../../lib/cookies.js';
  import { cookieConsentSeen, trackingConsent, marketingConsent, preferencesConsent } from '../../lib/store.js';
  import CookieSettingsModal from '../CookieSettingsModal';

  let HT = window.HT || {};

  let mainContent;
  let skiplinks;
  if (document.body.classList.contains('apps')) {
    //apps
    mainContent = document.querySelector('#root');
    skiplinks = document.querySelector('#skiplinks');
  } else {
    //wordpress
    mainContent = document.querySelector('#maindocument');
  }

  let lgSrc = '/common/firebird/dist/hathitrust-logo-stacked-orange-gray.png';
  let smSrc = '/common/firebird/dist/hathitrust-logo-horizontal-orange-gray.png';

  let settingsModal;
  function openSettings() {
    settingsModal.show();
  }
  export let cookieJar = HT.cookieJar;

  onMount(() => {
    $cookieConsentSeen = cookieJar.getItem('HT-cookie-banner-seen') || 'false';
    $trackingConsent = cookieJar.getItem('HT-tracking-cookie-consent') || 'false';
    $marketingConsent = cookieJar.getItem('HT-marketing-cookie-consent') || 'false';
    $preferencesConsent = cookieJar.getItem('HT-preferences-cookie-consent') || 'false';
    if ($cookieConsentSeen === 'false') {
      if (mainContent) mainContent.inert = true;
      if (skiplinks) skiplinks.inert = true;
    }
  });
</script>

{#if $cookieConsentSeen === 'false'}
  <CookieSettingsModal bind:this={settingsModal} />
  <section aria-labelledby="cookie-heading" class="banner-blur">
    <div class="cookie-banner alert alert-dark alert-block p-4 mb-0 shadow-lg rounded-bottom-0">
      <div class="banner-container d-flex gap-4 justify-content-between">
        <div class="banner-content d-flex gap-3">
          <div class="image-wrapper align-items-center d-flex justify-content-center">
            <img src={lgSrc} class="d-none d-lg-block" alt="" role="presentation" />
            <img src={smSrc} class="d-lg-none" alt="" role="presentation" />
          </div>
          <div class="">
            <h1 class="h2 bold" id="cookie-heading">Can we use cookies in your browser?</h1>
            <p>
              HathiTrust uses cookies to ensure you have the best experience on our website. You control which cookies
              you want to allow. Our <a
                class="fw-bold"
                href="https://www.hathitrust.org/the-collection/terms-conditions/privacy-policy/#cookies-on-our-website"
                >Privacy Policy</a
              > includes more details on the cookies we use and how we protect your privacy.
            </p>
            <p class="mb-0">
              By proceeding, you agree to follow our <a class="fw-bold" href="https://www.hathitrust.org/acceptable-use"
                >Acceptable Use Policy</a
              >.
            </p>
          </div>
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
    </div>
  </section>
{/if}

<style lang="scss">
  //general and mobile styles
  .banner-blur {
    position: fixed;
    z-index: 999999;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.6);
  }
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

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn-tertiary {
      gap: 0.75rem;
    }
    p a {
      color: var(--color-primary-600);
    }
  }
  .banner-container {
    flex-direction: column;
    align-items: start;
  }
  .image-wrapper {
    padding: 0;
  }
  img {
    max-inline-size: 11.25rem;
  }
  .banner-content {
    flex-direction: column;
    align-items: start;
  }
  .banner-buttons {
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
  @media (min-width: 48em) {
    /* 768px, bootstrap "medium" and up */
    .banner-content {
      align-items: start;
    }
    .banner-buttons {
      flex-direction: row;
      width: 100%;
      button {
        display: flex !important;
        flex: 1 0 0;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 1rem;
      }
    }
  }
  @media (min-width: 62em) {
    /* 992px, bootstrap "large" and up */
    .banner-container {
      flex-direction: row;
    }
    .banner-content {
      flex-direction: row;
      align-items: center;
      flex-basis: 70%;
    }
    .image-wrapper {
      padding-inline: 1rem;
    }
    img {
      max-inline-size: 5.625rem;
    }
    .banner-buttons {
      width: auto;
      flex-direction: column;
      align-self: stretch;
    }
  }

  @media (min-width: 82rem) {
    .banner-container {
      margin-inline: max(clamp(0.938rem, calc(0.268rem + 3.348vw), 1.875rem), ((100% - 73.125rem) / 2));
    }
  }
</style>
