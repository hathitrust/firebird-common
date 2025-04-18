<script>
  import { slide } from 'svelte/transition';
  export let id = `id${new Date().getTime()}`;
  export let form = `form#${id}`;
  let imageQuality = 'No problems';
  let imageProblems = ['No problems'];
  let userURL = location.href;
  let userAgent = navigator.userAgent;
  let formName = 'content-correction';
  let errorMessage,
    nameError,
    emailError,
    summaryError,
    urlError = false;

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
  let userAuthStatus = cookies.HTstatus || 'not logged in';

  export let postResponseStatusCode;

  // when true, spinner on submit button animates
  export let loading = false;
  // when true, hides the element (in this case, the form)
  export let hidden = false;
  // when true, shows the success/failure alert message
  export let submitted = false;

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

  // handles front-end reaction to form submission
  const onSubmit = (event) => {
    // set the submit button spinner spinning
    loading = true;
    // create form data variable
    let data = new FormData(event.target);
    // couldn't fix the checkbox values overwriting each other, so i'm appending it instead
    data.append('imageProblems', imageProblems.join(', '));
    //serialize form data
    data = JSON.stringify(Object.fromEntries(data));

    const formValid = document.querySelector(`${form}.needs-validation`);

    // check for required fields
    if (!formValid.checkValidity()) {
      event.stopPropagation();
      loading = false;
      formValid.classList.add('was-validated');
      if (formValid.querySelector('#name.form-control:invalid')) {
        nameError = true;
      }
      if (formValid.querySelector('#email.form-control:invalid')) {
        emailError = true;
      }
      if (formValid.querySelector('#summary.form-control:invalid')) {
        summaryError = true;
      }
      if (formValid.querySelector('#bookURL.form-control:invalid')) {
        descriptionError = true;
      }
      errorMessage = true;
    } else {
      // do the post fetch function, passing in the seralized data
      postForm(data)
        // if no error, hide form and log new issue ID
        .then((jiraResponseData) => {
          loading = false;
          submitted = true;
          hidden = true;
          nameError = false;
          emailError = false;
          summaryError = false;
          urlError = false;
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
    imageQuality = 'No problems';
    imageProblems = ['No problems'];
    //remove validation styling
    document.querySelector(form).classList.remove('was-validated');
    //reset form
    document.querySelector(form).reset();
  };
</script>

<main>
  <form on:submit|preventDefault={onSubmit} class:hidden class="needs-validation mb-3" name="feedback" novalidate {id}>
    <div class="mb-3">
      <label for="name" class="form-label">Name <span class="required" aria-hidden="true">(required)</span></label>
      <input
        aria-describedby="name-error"
        type="name"
        autocomplete="name"
        class="form-control"
        id="name"
        name="name"
        required
      />
      <div class="invalid-feedback" id="name-error">
        {#if nameError}<span>Error: Please provide your name.</span>{/if}
      </div>
      <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
    </div>
    <div class="mb-3">
      <label for="email" class="form-label"
        >Email address <span class="required" aria-hidden="true">(required)</span></label
      >
      <input
        type="email"
        aria-describedby="email-error"
        autocomplete="email"
        class="form-control"
        id="email"
        name="email"
        required
      />
      <div class="invalid-feedback" id="email-error">
        {#if emailError}<span>Error: Please provide an email address.</span>{/if}
      </div>
    </div>
    <div class="mb-3">
      <label for="summary" class="form-label"
        >Short summary <span class="required" aria-hidden="true">(required)</span></label
      >
      <input type="text" class="form-control" aria-describedby="summary-error" id="summary" name="summary" required />
      <div class="invalid-feedback" id="summary-error">
        {#if summaryError}<span>Error: Please provide a title or subject line to summarize your feedback.</span>{/if}
      </div>
    </div>
    <div class="mb-3">
      <label for="bookURL" class="form-label"
        >URL of book that you are reporting a problem with <span class="required" aria-hidden="true">(required)</span
        ></label
      >
      <input type="text" class="form-control" aria-describedby="url-error" id="bookURL" name="bookURL" />
      <div class="invalid-feedback" id="url-error">
        {#if urlError}<span>Please provide the URL of the record from the catalog where you found the issue.</span>{/if}
      </div>
    </div>
    <div class="mb-3">
      <label for="itemTitle" class="form-label"
        >Title of the book <span class="required" aria-hidden="true">(optional)</span></label
      >
      <input type="text" class="form-control" id="itemTitle" name="itemTitle" />
    </div>

    <fieldset class="mb-3">
      <div>
        <p>What specific problems are you noticing with the digital scans?</p>
      </div>
      <legend class="mb-3 fs-6">
        Overall page readability and quality <span class="required" aria-hidden="true">(required)</span>
      </legend>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="imageQuality"
          id="public-domain"
          value="Few problems, page is readable"
          bind:group={imageQuality}
        />
        <label class="form-check-label" for="public-domain"> A few problems, entire page is readable </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="imageQuality"
          value="Some problems but still readable"
          bind:group={imageQuality}
          id="fed-document"
        />
        <label class="form-check-label" for="fed-document"> Some problems, but still readable </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="imageQuality"
          value="Signficant: difficult or impossible to read"
          bind:group={imageQuality}
          id="should-not-have-access"
        />
        <label class="form-check-label" for="should-not-have-access">
          Significant problems, difficult or impossible to read
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="imageQuality"
          value="Other problem"
          bind:group={imageQuality}
          id="readability-other"
        />
        <label class="form-check-label" for="should-not-have-access">
          Other problem (please describe in comment field below)
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="imageQuality"
          id="none"
          value="No problems"
          bind:group={imageQuality}
          checked
        />
        <label class="form-check-label" for="none"> No problems </label>
      </div>
    </fieldset>

    <fieldset class="mb-3">
      <legend class="mb-3 fs-6">
        Specific page image problems?
        <span class="required" aria-hidden="true">(required)</span>
      </legend>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          name="imageProblems"
          value="Missing parts of the page"
          id="c1"
          bind:group={imageProblems}
        />
        <label class="form-check-label" for="c1"> Missing parts of the page </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          name="imageProblems"
          value="Blurry text"
          id="c2"
          bind:group={imageProblems}
        />
        <label class="form-check-label" for="c2"> Blurry text </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          name="imageProblems"
          value="OCR unreadable"
          id="c3"
          bind:group={imageProblems}
        />
        <label class="form-check-label" for="c3"> The OCR is unreadable </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          name="imageProblems"
          value="Other"
          id="c4"
          bind:group={imageProblems}
        />
        <label class="form-check-label" for="c4"> Other (describe in description box) </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          name="imageProblems"
          value="No problems"
          id="c5"
          bind:group={imageProblems}
          checked
        />
        <label class="form-check-label" for="c5"> No problems </label>
      </div>
    </fieldset>
    <div class="mb-3">
      <label for="description" class="form-label"
        >Other problems or comments? <span class="required" aria-hidden="true">(optional)</span></label
      >
      <textarea class="form-control" id="description" name="description" rows="3" />
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
        <span class="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true" />
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
            <i class="fa-solid fa-circle-check fa-lg me-2" />
            <div>
              <div class="d-flex flex-column">
                <strong>Thank you!&nbsp;</strong>Your feedback has been submitted.
              </div>
              <button type="button" class="btn btn-success" on:click={startOver} on:keypress={startOver}
                >Start over <i class="fa-solid fa-arrow-rotate-left fa-lg ms-2" /></button
              >
            </div>
          </div>
        </div>
      {:else if postResponseStatusCode === 429}
        <div transition:slide|global>
          <div class="alert alert-danger submit-message" role="alert">
            <i class="fa-solid fa-triangle-exclamation fa-lg me-2" />
            <div>
              <strong>Limit reached.&nbsp;</strong>You have reached the maximum amount of submissions for this time
              period. Please submit your request again another time.
            </div>
          </div>
        </div>
      {:else}
        <div transition:slide|global={{ duration: 300 }}>
          <div class="alert alert-danger submit-message" role="alert">
            <i class="fa-solid fa-triangle-exclamation fa-lg me-2" />
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
