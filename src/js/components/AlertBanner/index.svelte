<script>
  export let alertType = 'warning';
</script>

<div
  class="alert d-flex mx-3 gap-2 {alertType === 'warning'
    ? 'alert-warning'
    : alertType === 'danger'
      ? 'alert-danger'
      : 'alert-info'}"
  role="alert"
>
  <i class="alert-icon fa-solid fa-triangle-exclamation"></i>
  <div class="d-flex flex-column gap-2 py-3">
    <p class="alert-heading">Outage: Incomplete search results</p>
    <p>Users searching within the full text of all volumes will receive incomplete search results.</p>
    <a class="alert-link" href="https://www.hathitrust.org/press-post/outage-incomplete-search-results/"
      >More information</a
    >
  </div>
</div>

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
    i {
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
  }
  .alert-heading {
    font-weight: 700;
    line-height: 1.3125rem; /* 131.25% */
    letter-spacing: -0.01rem;
  }
</style>
