<script>
  import { cookieConsentSeen } from '../../lib/store';
  import CookieSettingsModal from '../CookieSettingsModal';
  const year = new Date().getFullYear();
  let HT = window.HT || {};
  let settingsModal;
  function openSettings() {
    settingsModal.show();
  }
</script>

{#if $cookieConsentSeen === 'true'}
  <CookieSettingsModal bind:this={settingsModal} />
{/if}
<!-- svelte-ignore a11y-invalid-attribute -->
<div class="sub-footer">
  <div class="legal">
    <span class="copyright">&#169;{year} HathiTrust</span>
    <div>
      <a href="//{HT.www_domain}/privacy-policy">Privacy Policy</a><span>|</span><a
        href="//{HT.www_domain}/takedown-policy">Takedown Policy</a
      ><span>|</span><a href="#" role="button" on:click|preventDefault={openSettings}>Cookie Settings</a>
    </div>
  </div>
  <ul>
    <li><a href="//{HT.www_domain}/careers">Careers</a></li>
    <li><a href="//{HT.www_domain}/accessibility">Accessibility</a></li>
    <li><a href="//{HT.www_domain}/contact">Contact</a></li>
  </ul>
</div>

<style lang="scss">
  .sub-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 0.875em;
    color: #fff;
    letter-spacing: -0.01em;
    background: var(--color-neutral-800);
    padding: 1.875em 1em;
    gap: 1.875em;
    a {
      color: #fff;
      &:focus-visible {
        outline: 4px solid rgba(255, 255, 255, 0.7);
      }
    }
    .legal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25em;
      div {
        display: flex;
        flex-direction: row;
        gap: 0.7em;
      }
    }
    .copyright {
      font-weight: 800;
      text-transform: uppercase;
    }
    ul {
      order: -1;
      list-style: none;
      padding-left: 0;
      margin-bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5em;
      a {
        text-decoration: none;
        font-weight: 800;
      }
    }
  }
  @media (min-width: 768px) {
    .sub-footer {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 1.5em 1.875em;

      .legal {
        flex-direction: row;
        gap: 0.75em;
        align-items: start;
      }

      ul {
        order: 1;
        flex-direction: row;
      }
    }
  }
</style>
