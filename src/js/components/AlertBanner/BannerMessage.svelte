<script>
  let HT = window.HT || {};
  let cookieJar = HT.cookieJar;
  import { preferencesConsent } from '../../lib/store';

  //   export let title = 'Outage: Website is down';
  export let title = '';
  export let message = `We're experiencing technical difficulties with our site and applications. Thank you for your patience!`;
  export let link = 'https://www.hathitrust.org/press-post/outage-incomplete-search-results/';
  export let linkText = 'See updates here';
  export let type = 'warning';
  //ID should increment with each new alert
  export let id = 1;

  let isVisible = true;

  export function closeAlert() {
    //if user has functional/preference cookies enabled, set a 14-day cookie to remember dismissed preference
    if ($preferencesConsent === 'true') {
      let expires = new Date();
      expires.setDate(expires.getDate() + 14);
      cookieJar.setItem(`HT-alert-${id}`, 'dismissed', expires, '/', HT.cookies_domain, true);
      isVisible = false;
    }
    //reset focus to the main element once the banner is removed from the DOM
    if (document.querySelector('main')) {
      document.querySelector('main').focus();
    }
  }

  if (cookieJar.getItem(`HT-alert-${id}`) === 'dismissed') {
    isVisible = false;
  }
</script>

{#if isVisible}
  <section class="alert alert-dismissible d-flex mx-3 justify-content-between fade show alert-{type}" id="alert-{id}">
    <div class="d-flex gap-2">
      <i
        class="alert-icon fa-solid"
        class:fa-circle-xmark={type === 'danger'}
        class:fa-triangle-exclamation={type === 'warning'}
        class:fa-bell={type === 'brand'}
      ></i>
      {#if type === 'warning'}
        {#if title}
          <span class="visually-hidden sr-only">Informational alert</span>
        {:else}
          <h2 class="visually-hidden sr-only">Informational alert</h2>
        {/if}
      {:else if type === 'danger'}
        {#if title}
          <span class="visually-hidden sr-only">Warning alert</span>
        {:else}
          <h2 class="visually-hidden sr-only">Warning alert</h2>
        {/if}
      {/if}
      <div class="py-3 {title.length > 0 ? 'd-flex flex-column gap-2' : ''}">
        {#if title}
          <h2 class="h4 alert-heading mb-0">{title}</h2>
        {/if}
        <p class="message">{message}</p>
        <a class="alert-link" href={link}>{linkText}</a>
      </div>
    </div>
    <div class="close-wrapper">
      <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close" on:click={closeAlert}>
        <span class="close-icon">
          <i class="fa-solid fa-xmark icon-default" aria-hidden="true"></i><span class="fa-sr-only">Close banner</span>
          <i class="fa-solid fa-circle-xmark fa-2x icon-hover" aria-hidden="true"></i><span class="fa-sr-only"
            >Close banner</span
          >
        </span>
      </button>
    </div>
  </section>
{/if}

<style lang="scss">
  .alert-warning {
    --bs-alert-color: var(--color-neutral-800);
    --bs-alert-border-color: #997404;
  }
  .alert-danger {
    --bs-alert-color: var(--color-neutral-800);
    --bs-alert-border-color: #b02a37;
  }
  .alert-brand {
    --bs-alert-color: var(--color-neutral-800);
    --bs-alert-border-color: var(--color-primary-700);
    --bs-alert-bg: var(--color-primary-100);
  }
  .alert {
    container-type: inline-size;
    border: none;
    border-inline-start: 0.25rem solid var(--bs-alert-border-color);
    padding: 0;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 8px 0px rgba(25, 11, 1, 0.04);
    i.alert-icon {
      color: var(--bs-alert-border-color);
      display: flex;
      width: 1.5rem;
      padding-block-start: 1rem;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      align-self: stretch;
      margin-inline-start: 0.5rem;
      line-height: 1.3125rem;
    }
    p,
    a {
      line-height: 1.3125rem;
      letter-spacing: -0.01rem;
      margin-block-end: 0;
    }
    a.alert-link {
      font-weight: 500;
      color: var(--bs-alert-color);
    }
    .close-wrapper {
      display: flex;
      align-items: flex-start;
    }
    button {
      background: var(--bs-alert-bg);
      border: none;
      display: flex;
      width: 2.75rem;
      height: 2.75rem;
      padding: 0rem 1rem;
      justify-content: center;
      align-items: center;
      margin-top: 0.25rem;
    }
  }
  @media (min-width: 48em) {
    /* 768px, bootstrap "medium" and up */
  }

  @container (min-width: 35rem) {
    p.message {
      display: inline;
    }
  }
  @container (width < 35rem) {
    p.message {
      margin-block-end: 0.5rem;
    }
  }
  .alert-heading {
    font-weight: 700;
    line-height: 1.3125rem; /* 131.25% */
    letter-spacing: -0.01rem;
  }
</style>
