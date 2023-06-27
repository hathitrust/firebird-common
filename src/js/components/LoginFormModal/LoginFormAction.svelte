<script>
  let HT = window.HT || {};

  export let sdrinst;
  export let target = '';

  export let onSubmit = function (href) {
    setTimeout(() => {
      window.location.assign(href);
      console.log(href);
    });
  };

  function handleClick() {

    let selected = HT.login_status.idp_list.find(
      (item) => item.sdrinst == sdrinst
    );
    console.log("-- handleClick", sdrinst, selected);
    if (selected) {
      HT.prefs.set({ sdrinst: sdrinst });
      let login_href = selected.idp_url.replace(
        '___TARGET___',
        encodeURIComponent(target)
      );
      onSubmit(login_href);
    }
  }

</script>

<div class="m-0 w-auto">
  <div class="py-3 mb-2 d-flex flex-wrap flex-lg-nowrap gap-3 gap-lg-5 justify-content-between">
    <p class="fs-7 m-0">
      By logging into HathiTrust, you agree to follow our
      <a href="https://hathitrust.org/the-collection/access-use-policy/"
        >Acceptable Use Policy</a
      >.
    </p>
    <button
      type="submit"
      name="submit"
      class="btn btn-primary align-self-center"
      on:click={handleClick}>Continue</button
    >
  </div>
</div>