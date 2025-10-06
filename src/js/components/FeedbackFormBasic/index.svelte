<script>
  import { slide } from 'svelte/transition';
  let userURL = $state(location.href);
  let userAgent = $state(navigator.userAgent);
  let formName = $state('basic-form');
  let errorMessage = $state(),
    nameError = $state(),
    emailError = $state(),
    summaryError = $state(),
    descriptionError = $state(false);

  const id = $props.id();
  const form = `form#${id}`;

  //takes long string output of document.cookie and splits it into a usable javascript object
  let cookies = document.cookie
    .split(';')
    .map((cookie) => cookie.split('='))
    .reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key.trim()]: decodeURIComponent(value),
      }),
      {}
    );

  //if user isn't logged in, HTstatus cookie won't exist
  let userAuthStatus = $state(cookies.HTstatus || 'not logged in');

  /**
   * @typedef {Object} Props
   * @property {any} postResponseStatusCode
   * @property {boolean} [loading] - when true, spinner on submit button animates
   * @property {boolean} [hidden] - when true, hides the element (in this case, the form)
   * @property {boolean} [submitted] - when true, shows the success/failure alert message
   * @property {any} [postForm]
   * @property {any} [onSubmit] - handles front-end reaction to form submission
   */

  /** @type {Props} */
  let {
    postResponseStatusCode = $bindable(),
    loading = $bindable(false),
    hidden = $bindable(false),
    submitted = $bindable(false),
  } = $props();

  const postForm = async (data) => {
    console.log(data);
    return fetch(
      'https://feedback-collector.hathitrust.org/api',
      // 'http://localhost:5006/api',
      {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    ).then((response) => {
      // did something go wrong with the fetch?
      // if yes, the function stops here
      if (!response.ok) {
        postResponseStatusCode = response.status;
        throw new Error(`status: ${response.status}`);
      }

      // otherwise, return jira response promise
      postResponseStatusCode = response.status;
      return response.json();
    });
  };
  const onsubmit = (event) => {
    event.preventDefault();
    // set the submit button spinner spinning
    loading = true;
    //serialize form data
    const data = JSON.stringify(Object.fromEntries(new FormData(event.target)));

    const formValid = document.querySelector(`${form}.needs-validation`);

    // check for required fields
    if (!formValid.checkValidity()) {
      event.stopPropagation();
      loading = false;
      formValid.classList.add('was-validated');
      if (formValid.querySelector(`#${id}-name.form-control:invalid`)) {
        nameError = true;
      }
      if (formValid.querySelector(`#${id}-email.form-control:invalid`)) {
        emailError = true;
      }
      if (formValid.querySelector(`#${id}-summary.form-control:invalid`)) {
        summaryError = true;
      }
      if (formValid.querySelector(`#${id}-description.form-control:invalid`)) {
        descriptionError = true;
      }
      errorMessage = true;
    } else {
      // do the post fetch function, passing in the seralized data
      postForm(data)
        // if no error, hide form, reset all the error messages, and log new issue ID
        .then((jiraResponseData) => {
          loading = false;
          submitted = true;
          hidden = true;
          nameError = false;
          emailError = false;
          summaryError = false;
          descriptionError = false;
          errorMessage = false;

          console.log(
            `request created in service desk ${jiraResponseData.serviceDeskId}: ${jiraResponseData.issueKey}`
          );
          console.log('status code', postResponseStatusCode);
        })

        // if something went wrong, stop the submit button spinner, show appropriate error message to user, log error message
        .catch((error) => {
          loading = false;
          submitted = true;
          console.log(`There was an error posting the form, ${error}`);
        });
    }
  };

  const startOver = () => {
    //unhide the form, hide the submission message, reset the form
    hidden = !hidden;
    submitted = !submitted;
    console.log(`start over clicked, hidden: ${hidden}, submitted: ${submitted}`);
    //remove validation styling
    document.querySelector(form).classList.remove('was-validated');
    //reset form
    document.querySelector(form).reset();
  };
</script>

<main>
  <form {onsubmit} class:hidden class="needs-validation mb-3" name="feedback" novalidate {id}>
    <div class="mb-3">
      <label for="{id}-name" class="form-label"
        >Name <span class="required" aria-hidden="true">(required)</span>
      </label>
      <input
        aria-describedby="{id}-name-error"
        type="name"
        class="form-control"
        id="{id}-name"
        name="name"
        autocomplete="name"
        required
      />
      <div class="invalid-feedback" id="{id}-name-error">
        {#if nameError}
          <span>Error: Please provide your name.</span>
        {/if}
      </div>
    </div>
    <div class="mb-3">
      <label for="{id}-email" class="form-label"
        >Email address <span class="required" aria-hidden="true">(required)</span></label
      >
      <input
        type="email"
        class="form-control"
        id="{id}-email"
        name="email"
        aria-describedby="{id}-email-error"
        autocomplete="email"
        required
      />
      <div class="invalid-feedback" id="{id}-email-error">
        {#if emailError}<span>Error: Please provide an email address.</span>{/if}
      </div>
    </div>
    <div class="mb-3">
      <label for="{id}-summary" class="form-label"
        >Short summary <span class="required" aria-hidden="true">(required)</span></label
      >
      <input
        type="text"
        class="form-control"
        id="{id}-summary"
        name="summary"
        aria-describedby="{id}-summary-error"
        required
      />
      <div class="invalid-feedback" id="{id}-summary-error">
        {#if summaryError}<span>Error: Please provide a title or subject line to summarize your feedback.</span>{/if}
      </div>
    </div>
    <div class="mb-3">
      <label for="{id}-bookDescription" class="form-label"
        >If your question is related to a specific book, what is the title or URL? <span
          class="required"
          aria-hidden="true">(optional)</span
        ></label
      >
      <input type="text" class="form-control" id="{id}-bookDescription" name="bookDescription" />
    </div>
    <div class="mb-3">
      <label for="{id}-description" class="form-label"
        >Full description of problem or question <span class="required" aria-hidden="true">(required)</span></label
      >
      <textarea
        class="form-control"
        aria-describedby="{id}-description-error"
        id="{id}-description"
        name="description"
        rows="3"
        required
      ></textarea>
      <div class="invalid-feedback" id="{id}-description-error">
        {#if descriptionError}<span
            >Error: Please provide some background or details for your feedback or question.</span
          >{/if}
      </div>
    </div>
    <input name="userURL" id="userURL" type="hidden" bind:value={userURL} />
    <input name="userAgent" id="userAgent" type="hidden" bind:value={userAgent} />
    <input name="userAuthStatus" id="userAuthStatus" type="hidden" bind:value={userAuthStatus} />
    <input name="formName" id="formName" type="hidden" bind:value={formName} />
    {#if errorMessage}
      <div role="alert" class="mb-3">
        The form did not submit due to errors in the fields. Please review error messages and resubmit the form.
      </div>
    {/if}

    <button type="submit" class="btn btn-primary" disabled={loading}>
      Submit{#if loading}
        <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
        <span class="visually-hidden">Loading...</span>
      {/if}
    </button>
    <div id="data-message" class="form-text">
      By submitting this form, you agree to send your browser details to help our team track down your issue.
    </div>
  </form>

  <!-- TODO: use props to make these messages more modular <FormMessage /> -->
  {#if submitted}
    <section>
      {#if postResponseStatusCode === 200}
        <div transition:slide|global>
          <div class="alert alert-success submit-message" role="alert">
            <i class="fa-solid fa-circle-check fa-lg me-2"></i>
            <div>
              <div class="d-flex flex-column">
                <strong>Thank you!&nbsp;</strong>Your feedback has been submitted.
              </div>
              <button type="button" class="btn btn-success" onclick={startOver} onkeypress={startOver}
                >Start over <i class="fa-solid fa-arrow-rotate-left fa-lg ms-2"></i></button
              >
            </div>
          </div>
        </div>
      {:else if postResponseStatusCode === 429}
        <div transition:slide|global>
          <div class="alert alert-danger submit-message" role="alert">
            <i class="fa-solid fa-triangle-exclamation fa-lg me-2"></i>
            <div>
              <strong>Limit reached.&nbsp;</strong>You have reached the maximum amount of submissions for this time
              period. Please submit your request again another time.
            </div>
          </div>
        </div>
      {:else}
        <div transition:slide|global={{ duration: 300 }}>
          <div class="alert alert-danger submit-message" role="alert">
            <i class="fa-solid fa-triangle-exclamation fa-lg me-2"></i>
            <div>
              <strong>Oops!&nbsp;</strong>There was an error submitting the form. Please try again or email us at
              support@hathitrust.org
            </div>
          </div>
        </div>
      {/if}
    </section>
  {/if}
</main>

<style lang="scss">
  .form-control:focus {
    background-color: var(--color-neutral-50);
  }
  .hidden {
    display: none;
  }
  .required {
    font-size: 0.75em;
  }
  .submit-message {
    /*styles for md and up screens*/
    display: flex;
    align-items: center;
    gap: 1em;
    @media (min-width: 768px) {
      gap: 0.25em;
    }
    & > div {
      display: flex;
      flex-direction: column;
    }
    & > i {
      font-size: 2em;
      @media (min-width: 768px) {
        font-size: 1.5em;
      }
    }
    button {
      margin-top: 0.5em;
    }
  }
  .alert-success.submit-message {
    & > div {
      @media (min-width: 768px) {
        flex-direction: row;
        gap: 1em;
      }
    }
    button {
      @media (min-width: 768px) {
        margin-top: 0;
      }
    }
  }
</style>
