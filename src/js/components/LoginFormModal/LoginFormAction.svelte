<script>
  import { consent } from '../../lib/store.svelte';
  let HT = window.HT || {};

  /**
   * @typedef {Object} Props
   * @property {any} sdrinst
   * @property {string} [target]
   * @property {any} [onSubmit]
   */

  /** @type {Props} */
  let {
    sdrinst,
    target = '',
    onSubmit = function (href) {
      setTimeout(() => {
        window.location.assign(href);
      });
    },
  } = $props();

  function handleClick() {
    let selected = HT.loginStatus.idp_list.find((item) => item.sdrinst == sdrinst);
    console.log('-- handleClick', sdrinst, selected);
    if (selected) {
      if (consent.preferencesConsent === 'true') {
        HT.prefs.set({ sdrinst: sdrinst });
      }
      let login_href = selected.idp_url.replace('___TARGET___', encodeURIComponent(target));
      onSubmit(login_href);
    }
  }
</script>

<div class="m-0 w-100">
  <div class="p-3 px-modal mb-2 d-flex flex-wrap flex-lg-nowrap gap-3 gap-lg-5 justify-content-between">
    <p class="fs-7 m-0">
      By logging into HathiTrust, you agree to follow our
      <a href="//{HT.www_domain}/the-collection/search-access/access-use-policy/">Acceptable Use Policy</a>.
    </p>
    <button type="submit" name="submit" class="btn btn-primary align-self-center" onclick={handleClick}>Continue</button
    >
  </div>
</div>
