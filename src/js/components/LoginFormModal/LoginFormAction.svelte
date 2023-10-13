<script>
  let HT = window.HT || {};

  export let sdrinst;
  export let target = '';

  let loginStatus = HT.loginStatus;

  export let onSubmit = function (href) {
    setTimeout(() => {
      window.location.assign(href);
    });
  };

  function handleClick() {
    let selected = idpList.find((item) => item.sdrinst == sdrinst);
    console.log('-- handleClick', sdrinst, selected);
    if (selected) {
      HT.prefs.set({ sdrinst: sdrinst });
      let login_href = selected.idp_url.replace('___TARGET___', encodeURIComponent(target));
      onSubmit(login_href);
    }
  }

  $: idpList = $loginStatus.idp_list;
</script>

<div class="m-0 w-100">
  <div class="p-3 px-modal mb-2 d-flex flex-wrap flex-lg-nowrap gap-3 gap-lg-5 justify-content-between">
    <p class="fs-7 m-0">
      By logging into HathiTrust, you agree to follow our
      <a href="//{HT.www_domain}/the-collection/search-access/access-use-policy/">Acceptable Use Policy</a>.
    </p>
    <button type="submit" name="submit" class="btn btn-primary align-self-center" on:click={handleClick}
      >Continue</button
    >
  </div>
</div>
