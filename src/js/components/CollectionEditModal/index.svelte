<script>
  import Modal from '../Modal';

  let modal;
  let errorMessage,
    nameError = false;

  export let c = '__NEW__';
  export let cn = '';
  export let desc = '';
  export let contributorName = '';
  export let shared = 0;
  export let userIsAnonymous = true;

  if (HT.login_status.logged_in) {
    userIsAnonymous = false;
  }

  export let submitAction = function () {};

  export function show() {
    modal.show();
  }

  export function hide() {
    modal.hide();
  }

  function saveChanges(event) {
    const formValid = document.querySelector('form#edit-collection.needs-validation');
    //check for required field
    if (!formValid.checkValidity()) {
      formValid.classList.add('was-validated');
      if (formValid.querySelector('#cn.form-control:invalid')) {
        nameError = true;
        errorMessage = true;
      }
    } else {
      let params = new URLSearchParams();
      if (c != '__NEW__') {
        params.set('c', c);
      }
      params.set('cn', cn.trim());
      params.set('desc', desc.trim());
      params.set('contributor_name', contributorName.trim());
      params.set('shrd', shared);

      submitAction(params);
      modal.hide();
    }
  }

  $: if (cn.length == 100) {
    HT.live.announce('Collection Name has a maximum size of 100');
  }
  $: if (desc.length == 255) {
    HT.live.announce('Description has a maximum size of 255');
  }
  $: if (contributorName.length == 255) {
    HT.live.announce('Contributor Name has a maximum size of 255');
  }
</script>

<Modal bind:this={modal} scrollable={true}>
  <svelte:fragment slot="title">{c == '__NEW__' ? 'New' : 'Edit'} Collection</svelte:fragment>
  <svelte:fragment slot="body">
    <form id="edit-collection" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="cn" class="form-label"
          >Collection Name <span class="required" aria-hidden="true">(required)</span>
        </label>
        <input
          type="text"
          class="form-control"
          id="cn"
          name="cn"
          aria-describedby="cn-help"
          maxlength="100"
          bind:value={cn}
          required
        />
        <div id="cn-help" class="form-text" class:text-danger={nameError}>
          {#if nameError}
            <span>Error: Please provide a collection name.</span>
          {/if} Collection names can be 100 characters long ({100 - cn.length} characters remaining).
        </div>
      </div>
      <div class="mb-3">
        <label for="desc" class="form-label">Description</label>
        <textarea
          class="form-control"
          id="desc"
          name="desc"
          aria-describedby="desc-help"
          rows="3"
          maxlength="255"
          bind:value={desc}
        />
        <div id="desc-help" class="form-text">
          Descriptions can be 255 characters long ({255 - desc.length} characters remaining).
        </div>
      </div>
      <div class="mb-3">
        <label for="contributor_name" class="form-label">Contributor Name</label>
        <input
          type="text"
          class="form-control"
          id="contributor_name"
          name="contributor_name"
          aria-describedby="contributor_name-help"
          maxlength="255"
          bind:value={contributorName}
        />
        <div id="contributor_name-help" class="form-text">
          <strong>Optional.</strong> Set a public contributor name ({255 - contributorName.length} characters remaining).
        </div>
      </div>
      <div class="mb-0">
        <fieldset>
          <legend class="fs-4 mb-1">Is this collection visible to others?</legend>
          <div class="d-flex">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="shared" id="shared-0" value={0} bind:group={shared} />
              <label class="form-check-label" for="shared-0">
                <i class="fa-solid fa-lock" aria-hidden="true" />
                Private
              </label>
            </div>
            {#if !userIsAnonymous}
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="shared"
                  id="shared-1"
                  value={1}
                  bind:group={shared}
                />
                <label class="form-check-label" for="shared-1"> Public </label>
              </div>
            {/if}
          </div>
        </fieldset>
      </div>
    </form>
  </svelte:fragment>
  <svelte:fragment slot="footer">
    {#if userIsAnonymous}
      <div class="alert alert-block alert-danger mx-3">
        <p class="mb-0">
          <strong>This collection will be temporary.</strong> Log in to create permanent and public collections.
        </p>
      </div>
    {/if}
    {#if errorMessage}
      <div role="alert" class="alert alert-block alert-danger mx-3">
        The form did not submit. Please add a collection name and resubmit the form.
      </div>
    {/if}
    <button class="btn btn-secondary" type="button" on:click={() => modal.hide()}>Close</button>
    <button class="btn btn-primary" type="button" on:click={saveChanges}>Save Changes</button>
  </svelte:fragment>
</Modal>

<style>
</style>
