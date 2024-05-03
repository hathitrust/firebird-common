<script>
  import { preferencesConsent } from '../../lib/store';
  let HT = window.HT || {};
  let cookieJar = HT.cookieJar;

  const alertData = [
    {
      title: 'Outage: Incomplete search results',
      message: 'Users searching within the full text of all volumes will receive incomplete search results.',
      link: 'https://www.hathitrust.org/press-post/outage-incomplete-search-results/',
      linkText: 'More information',
      type: 'warning',
      id: 1,
    },
  ];

  let isVisible = true;

  function closeAlert() {
    //if user has functional/preference cookies enabled, set a 14-day cookie to remember dismissed preference
    if ($preferencesConsent === 'true') {
      let expires = new Date();
      expires.setDate(expires.getDate() + 14);
      cookieJar.setItem(`HT-alert-${alertData[0].id}`, 'dismissed', expires, '/', HT.cookies_domain, true);
      isVisible = false;
    }
    //reset focus to the main element once the banner is removed from the DOM
    if (document.querySelector('main')) {
      document.querySelector('main').focus();
    }
  }

  if (cookieJar.getItem(`HT-alert-${alertData[0].id}`) === 'dismissed') {
    isVisible = false;
  }
</script>

{#if isVisible}
  {#each alertData as alert}
    <div class="alert alert-dismissible d-flex mx-3 justify-content-between fade show alert-{alert.type}" role="alert">
      <div class="d-flex gap-2">
        <i class="alert-icon fa-solid fa-triangle-exclamation"></i>
        <div class="d-flex flex-column gap-2 py-3">
          <p class="alert-heading">{alert.title}</p>
          <p>{alert.message}</p>
          <a class="alert-link" href={alert.link}>{alert.linkText}</a>
        </div>
      </div>
      <div class="close-wrapper">
        <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close" on:click={closeAlert}>
          <span class="close-icon">
            <i class="fa-solid fa-xmark icon-default" aria-hidden="true"></i><span class="fa-sr-only">Close banner</span
            >
            <i class="fa-solid fa-circle-xmark fa-2x icon-hover" aria-hidden="true"></i><span class="fa-sr-only"
              >Close banner</span
            >
          </span>
        </button>
      </div>
    </div>
  {/each}
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
  .alert {
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
      // gap: 0.625rem;
      border-radius: 0.25rem;
      margin-top: 0.25rem;
      .close-icon {
        padding: 0.625rem;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
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
    }
  }
  @media (min-width: 48em) {
    /* 768px, bootstrap "medium" and up */
  }
  .alert-heading {
    font-weight: 700;
    line-height: 1.3125rem; /* 131.25% */
    letter-spacing: -0.01rem;
  }
</style>
