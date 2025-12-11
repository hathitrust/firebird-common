<script>
  import { onMount } from 'svelte';
  import FilterableSelection from '../FilterableSelection.svelte';

  // CONFIGURING <hathi-advanced-search-form>
  // formatData and languageData are exposed as
  // data-prop-format-data
  // data-prop-language-data
  // and can be assigned a JSON-encoded array of strings, e.g.

  /**
   * @typedef {Object} Props
   * @property {any} [formatData] - <hathi-advanced-search-form data-prop-language-data="[&quot;Abkhaz&quot;,&quot;Achinese&quot;,&quot;Acoli&quot;,&quot;Adangme&quot;...
   * @property {any} [languageData]
   * @property {any} [locationData]
   * @property {any} [collid]
   * @property {any} [collectionName]
   */

  /** @type {Props} */
  let { formatData = [], languageData = [], locationData = [], collid = null, collectionName = null } = $props();

  // export let useAnyAll = true;

  const fieldOptions = [
    { value: 'ocr', label: 'Full Text & All Fields' },
    { value: 'ocronly', label: 'Only Full Text' },
    { value: 'all', label: 'All Fields' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'subject', label: 'Subject' },
    { value: 'isn', label: 'ISBN, ISSN, OCLC, etc.' },
    { value: 'publisher', label: 'Publisher' },
    { value: 'series', label: 'Series' },
    // { field: 'year', label: 'Year of Publication' },
  ];

  let booleanOptions = [
    { value: 'AND', label: 'And' },
    { value: 'OR', label: 'Or' },
  ];

  const yopOptions = [
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'between', label: 'Between' },
    { value: 'in', label: 'Only during' },
  ];

  const anyallOptions = [
    { value: 'all', label: 'all of these words' },
    { value: 'any', label: 'any of these words' },
    { value: 'phrase', label: 'this exact phrase' },
  ];

  let yop = $state('after');
  let pubYear = $state({});
  let lang = $state([]);
  let format = $state([]);
  let originalLocation = $state('');
  let modal;
  // let types = new Array(4); types.fill('ocr');
  let types = $state(['ocr', 'all', 'title', 'author']);
  let lookFors = $state(new Array(4));
  lookFors.fill('');
  let bools = $state(new Array(4));
  bools.fill('AND');
  let anyalls = $state(new Array(4));
  anyalls.fill('all');
  let isFullView = $state(true);
  let useFullTextIndex = $state(sessionStorage.getItem('useFullTextIndex') == 'true');

  let errors = $state({
    lookFors: false,
    yop: false,
  });

  let protocol = 'https:' == location.protocol ? 'https:' : 'http:';

  function saveIndexSelection() {
    console.log('AHOY saveIndexSelection', useFullTextIndex);
    sessionStorage.setItem('useFullTextIndex', useFullTextIndex);
  }

  function validatePubYear(value) {
    if (!value.match(/^\d+$/)) {
      errors.yop = true;
    }
  }

  function submitForm(event) {
    // which are we targeting?
    errors.lookFors = false;
    errors.yop = false;
    errors = errors;
    event.preventDefault();

    let target = useFullTextIndex ? 'ls' : 'catalog';
    let url;
    for (let i = 0; i < types.length; i++) {
      if ((types[i] == 'ocr' || types[i] == 'ocronly') && lookFors[i]) {
        target = 'ls';
        break;
      }
    }
    if (target == 'catalog') {
      url = new URL(`${protocol}//${HT.catalog_domain}/Search/Home`);
      let searchParams = new URLSearchParams();
      searchParams.set('adv', 1);
      if (isFullView) {
        searchParams.set('setft', 'true');
        searchParams.set('ft', 'ft');
      }

      let hasSearchTerms = false;
      let lookForIndex = [];
      lookFors.forEach((value, idx) => {
        if (value) {
          if (anyalls[idx] == 'any') {
            value = value.replace(' ', ' OR ');
          } else if (anyalls[idx] == 'phrase' && value[0] != '"') {
            value = `"${value}"`;
          }
          searchParams.append('lookfor[]', value);
          hasSearchTerms = true;
          lookForIndex.push(idx);
        }
      });
      types.forEach((value, idx) => {
        if (value && lookFors[idx]) {
          searchParams.append(`type[]`, value);
        }
      });

      if (!hasSearchTerms) {
        errors.lookFors = true;
      }

      if (Object.values(pubYear).find((value) => value != '' && value != null)) {
        // possibly have pub year
        if (yop == 'before' && pubYear.end) {
          searchParams.set('yop', yop);
          searchParams.set('fqrange-end-publishDateTrie-1', pubYear.end);
          validatePubYear(pubYear.end);
        } else if (yop == 'after' && pubYear.start) {
          searchParams.set('yop', yop);
          searchParams.set('fqrange-start-publishDateTrie-1', pubYear.start);
          validatePubYear(pubYear.start);
        } else if (yop == 'between') {
          if (!(pubYear.start && pubYear.end)) {
            yop = pubYear.start ? 'after' : 'before';
          }
          searchParams.set('yop', yop);
          if (pubYear.start) {
            searchParams.set('fqrange-start-publishDateTrie-1', pubYear.start);
            validatePubYear(pubYear.start);
          }
          if (pubYear.end) {
            searchParams.set('fqrange-end-publishDateTrie-1', pubYear.end);
            validatePubYear(pubYear.end);
          }
        } else if (yop == 'in' && pubYear.exact) {
          searchParams.set('yop', yop);
          searchParams.set('fqor-publishDateTrie[]', pubYear.exact);
          validatePubYear(pubYear.exact);
        }
      }

      bools.forEach((value, idx) => {
        if (idx === 0) {
          return;
        }
        if (value && lookFors[idx] && lookFors[idx - 1]) {
          searchParams.append('bool[]', value);
        }
      });
      lang.forEach((value) => {
        searchParams.append('fqor-language[]', value);
      });
      format.forEach((value) => {
        searchParams.append('fqor-format[]', value);
      });
      if (originalLocation) {
        searchParams.append('filter[]', `htsource:${originalLocation}`);
      }

      let preSearch = searchParams.toString();
      // note: searchParams.toString() turns the : after htsource into a %3A and I don't want that
      url.search = preSearch.replace(/htsource%3A/g, 'htsource:');
    } else {
      url = new URL(`${protocol}//${HT.service_domain}/cgi/ls`);
      let searchParams = new URLSearchParams();
      if (isFullView) {
        searchParams.set('lmt', 'ft');
      }
      searchParams.set('a', 'srchls');
      searchParams.set('adv', 1);

      if (collid) {
        searchParams.set('c', collid);
      }

      let hasSearchTerms = false;
      lookFors.forEach((value, idx) => {
        if (value) {
          searchParams.set(`q${idx + 1}`, value);
          hasSearchTerms = true;
        }
      });
      types.forEach((value, idx) => {
        if (value && lookFors[idx]) {
          searchParams.set(`field${idx + 1}`, value == 'everything' ? 'ocr' : value);
        }
      });
      anyalls.forEach((value, idx) => {
        if (value && lookFors[idx]) {
          searchParams.set(`anyall${idx + 1}`, value);
        }
      });
      bools.forEach((value, idx) => {
        if (value && lookFors[idx]) {
          searchParams.set(`op${idx + 1}`, value);
        }
      });

      if (!hasSearchTerms) {
        errors.lookFors = true;
      }

      if (Object.values(pubYear).find((value) => value != '' && value != null)) {
        // possibly have pub year
        if (yop == 'before' && pubYear.end) {
          searchParams.set('yop', yop);
          searchParams.set('pdate_end', pubYear.end);
          validatePubYear(pubYear.end);
        } else if (yop == 'after' && pubYear.start) {
          searchParams.set('yop', yop);
          searchParams.set('pdate_start', pubYear.start);
          validatePubYear(pubYear.start);
        } else if (yop == 'between') {
          if (!(pubYear.start && pubYear.end)) {
            yop = pubYear.start ? 'after' : 'before';
          }
          searchParams.set('yop', yop);
          if (pubYear.start) {
            searchParams.set('pdate_start', pubYear.start);
            validatePubYear(pubYear.start);
          }
          if (pubYear.end) {
            searchParams.set('pdate_end', pubYear.end);
            validatePubYear(pubYear.end);
          }
        } else if (yop == 'in' && pubYear.exact) {
          searchParams.set('yop', yop);
          searchParams.set('pdate', pubYear.exact);
          validatePubYear(pubYear.exact);
        }
      }

      lang.forEach((value) => {
        searchParams.append('facet_lang', `language008_full:${value}`);
      });
      format.forEach((value) => {
        searchParams.append('facet_format', `format:${value}`);
      });
      if (originalLocation) {
        searchParams.append('facet', `htsource:"${originalLocation}"`);
      }

      url.search = searchParams.toString();
    }

    console.log(url.toString());
    if (window.xyzzy) {
      return;
    }

    location.assign(url.toString());
  }

  onMount(() => {
    let params = new URLSearchParams(location.search.replace(/;/g, '&'));
    if (location.pathname == '/Search/Advanced') {
      // catalog
      params.getAll('lookfor[]').forEach((value, idx) => {
        lookFors[idx] = value;
      });
      params.getAll('type[]').forEach((value, idx) => {
        types[idx] = value;
      });
      params.getAll('bool[]').forEach((value, idx) => {
        bools[idx + 1] = value;
      });

      if (params.get('fqor-language[]')) {
        params.getAll('fqor-language[]').forEach((value) => {
          lang.push(value);
        });
        lang = lang;
      }
      if (params.get('fqor-format[]')) {
        params.getAll('fqor-format[]').forEach((value) => {
          format.push(value);
        });
        format = format;
      }
      if (params.get('filter[]')?.includes('htsource')) {
        params.getAll('filter[]').forEach((value) => {
          if (value.includes('htsource')) {
            originalLocation = value.replace('htsource:', '');
          }
        });
        originalLocation = originalLocation;
      }

      if (!params.get('ft') && window.location.href.includes('?')) {
        isFullView = false;
      }

      yop = params.get('yop') || 'after';
      switch (yop) {
        case 'in':
          let value = params.get('facet') || '';
          pubYear.exact = params.get('fqor-publishDateTrie[]');
          break;
        case 'after':
          pubYear.start = params.get('fqrange-start-publishDateTrie-1');
          break;
        case 'before':
          pubYear.end = params.get('fqrange-end-publishDateTrie-1');
          break;
        case 'between':
          pubYear.start = params.get('fqrange-start-publishDateTrie-1');
          pubYear.end = params.get('fqrange-end-publishDateTrie-1');
          break;
      }
      pubYear = pubYear;
    } else {
      // ls
      // full-text search
      lookFors[0] = params.get('q1');
      types[0] = params.get('field1') || 'ocr';
      anyalls[0] = params.get('anyall1') || 'all';
      lookFors[1] = params.get('q2');
      types[1] = params.get('field2') || 'all';
      anyalls[1] = params.get('anyall2') || 'all';
      bools[1] = params.get('op2') || 'AND';
      lookFors[2] = params.get('q3');
      types[2] = params.get('field3') || 'title';
      anyalls[2] = params.get('anyall3') || 'all';
      bools[2] = params.get('op3') || 'AND';
      lookFors[3] = params.get('q4');
      types[3] = params.get('field4') || 'author';
      anyalls[3] = params.get('anyall4') || 'all';
      bools[4] = params.get('op3') || 'AND';

      if (params.get('facet_lang')) {
        params.getAll('facet_lang').forEach((value) => {
          lang.push(value.replace('language008_full:', ''));
        });
        lang = lang;
      }
      if (params.get('facet_format')) {
        params.getAll('facet_format').forEach((value) => {
          format.push(value.replace('format:', ''));
        });
        format = format;
      }
      if (params.get('facet')?.includes('htsource')) {
        params.getAll('facet').forEach((value) => {
          if (value.includes('htsource')) {
            originalLocation = value.replace('htsource:', '').replaceAll('"', '');
          }
        });
        originalLocation = originalLocation;
      }

      yop = params.get('yop') || 'after';
      switch (yop) {
        case 'in':
          let value = params.get('facet') || '';
          pubYear.exact = value.match(/bothPublishDateRange:"(\d+)"/)[1];
          break;
        case 'after':
          pubYear.start = params.get('pdate_start');
          break;
        case 'before':
          pubYear.end = params.get('pdate_end');
          break;
        case 'between':
          pubYear.start = params.get('pdate_start');
          pubYear.end = params.get('pdate_end');
          break;
      }
      pubYear = pubYear;
    }
  });
</script>

<div class="twocol">
  <div class="twocol-side" id="sidebar">
    {#if collid}
      <hgroup role="group" aria-roledescription="Heading group">
        <h1>Advanced Search</h1>
        <p aria-roledescription="subtitle" class="h2">
          <a href="/cgi/ls?a=srchls&q1=*&c={collid}">{collectionName}</a>
        </p>
      </hgroup>
    {:else}
      <h1>Advanced Search</h1>
    {/if}
    <div class="search-details d-flex">
      <span class="search-help"
        ><i class="fa-solid fa-circle-info fa-fw"></i>
        {#if isFullView}
          Search for items you can access.
        {:else}
          Search for all items.
        {/if}
      </span>
    </div>

    <div class="d-flex flex-column pe-4">
      <div class="accordion accordion-flush" id="search-help">
        <div class="accordion-item">
          <h2 class="accordion-header" id="search-ops">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#search-ops-collapse"
              aria-expanded="false"
              aria-controls="search-ops-collapse"
            >
              Search Help
            </button>
          </h2>
          <div id="search-ops-collapse" class="accordion-collapse collapse" data-bs-parent="#search-ops">
            <div class="accordion-body">
              <dl>
                <dt>All of these words</dt>
                <dd>
                  Treats your query as a boolean <code>AND</code> expression:
                  <code>heart cardiac</code>
                  will match fields containing <code>heart AND cardiac</code>
                </dd>
                <dt>Any of these words</dt>
                <dd>
                  Treats your query as a boolean <code>OR</code> expression:
                  <code>heart cardiac</code>
                  will match fields containing either <code>heart</code>
                  <strong>or</strong> <code>cardiac</code>.
                </dd>
                <dt>This exact phrase</dt>
                <dd>
                  Treats your query as a phrase expression:
                  <code>occult fiction</code>
                  will match fields containing the phrase
                  <code>"occult fiction"</code>.
                </dd>
                <dt>Using wildcards</dt>
                <dd>
                  Use <code>*</code> or <code>?</code> to search for alternate forms of a word. Use <code>*</code>
                  to stand for several characters, and <code>?</code> for a single character: e.g.,
                  <code>optim*</code> will find optimal, optimize or optimum;
                  <code>wom?n</code> will find woman and women. If you would simply like to browse without entering a
                  search term you can enter <code>*</code> by itself. Wildcard search is
                  <strong>not</strong>
                  available in
                  <strong>Full Text & All Fields</strong> and
                  <strong>Only Full Text</strong> search.
                </dd>
                <dd>
                  If you would simply like to browse without entering a search term you can enter <code>*</code> by itself.
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="search-index">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#search-index-collapse"
              aria-expanded="false"
              aria-controls="search-index-collapse"
            >
              Using the Full Text Index
            </button>
          </h2>
          <div id="search-index-collapse" class="accordion-collapse collapse" data-bs-parent="#search-ops">
            <div class="accordion-body">
              <p>
                Check the <strong>Always use the Full Text Index</strong>
                option to display search results at the item level and to be able to add your search results to a collection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="twocol-main">
    <div class="mainplain w-auto position-relative">
      <form onsubmit={submitForm}>
        <h2 class="mb-3">Search by field</h2>
        {#if errors.lookFors}
          <div class="alert alert-block alert-warning d-flex gap-3 align-items-center">
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            A search term is required to submit an advanced search.
          </div>
        {/if}
        {#each lookFors as value, idx}
          {#if idx > 0}
            <fieldset class="mb-3">
              <legend class="visually-hidden">Boolean operator for field {idx} and field {idx + 1}</legend>
              <div class="d-flex gap-3 align-items-center justify-content-center justify-content-sm-start">
                {#each booleanOptions as option, bidx}
                  <div class="form-check">
                    <input
                      name="boolean-{idx}"
                      id="boolean-{idx}_{bidx}"
                      type="radio"
                      class="form-check-input"
                      value={option.value}
                      checked={option.value == bools[idx]}
                      bind:group={bools[idx]}
                    />
                    <label class="form-check-label text-uppercase" for="boolean-{idx}_{bidx}">{option.value}</label>
                  </div>
                {/each}
              </div>
            </fieldset>
          {/if}
          <fieldset class="search-clause mb-3">
            <legend class="visually-hidden">Search field {idx + 1}:</legend>
            <div class="field-container d-flex search-field border border-dark rounded">
              <div class="select-container border border-0 flex-grow-1">
                <select
                  class="form-select rounded-0 rounded-start"
                  aria-label="Selected field {idx + 1}"
                  bind:value={types[idx]}
                >
                  {#each fieldOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              <div class="select-container border border-0 flex-grow-1">
                <select class="form-select rounded-0" aria-label="Selected match {idx + 1}" bind:value={anyalls[idx]}>
                  {#each anyallOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
              <div class="search-input flex-grow-1">
                <input
                  type="text"
                  class="form-control shadow-none"
                  aria-label="Search Term {idx + 1}"
                  placeholder="Search term {idx + 1}"
                  bind:value={lookFors[idx]}
                />
              </div>
            </div>
          </fieldset>
        {/each}

        <div class="d-flex mb-3 justify-content-end">
          <button class="btn btn-primary btn-lg" type="submit">
            <span>Advanced Search</span>
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>
        </div>

        <h2 class="mb-3">Additional Search Options</h2>

        <div class="row mb-4">
          <div class="col-md-6">
            <fieldset>
              <legend class="fs-4 fw-bold">View Options</legend>
              <div class="form-check">
                <input
                  id="view-options"
                  type="checkbox"
                  class="form-check-input"
                  value="ft"
                  bind:checked={isFullView}
                />
                <label class="form-check-label" for="view-options">Full View Only</label>
              </div>
            </fieldset>
          </div>
          <div class="col-md-6">
            <fieldset>
              <legend class="fs-4 fw-bold">
                <i class="fa-solid fa-database" aria-hidden="true"></i>
                Index Options</legend
              >
              <div class="form-check">
                <input
                  id="index-options"
                  type="checkbox"
                  class="form-check-input"
                  value="ft"
                  bind:checked={useFullTextIndex}
                  onchange={saveIndexSelection}
                />
                <label class="form-check-label" for="index-options">Always use the Full Text Index</label>
              </div>
            </fieldset>
          </div>
        </div>

        <fieldset class="mb-4">
          <legend class="fs-4 fw-bold">Publication Year</legend>
          {#if errors.yop}
            <div class="alert alert-block alert-warning d-flex gap-3 align-items-center">
              <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              Publication Year must be between 0-9999.
            </div>
          {/if}
          <div class="d-flex gap-3 mb-1 flex-wrap">
            {#each yopOptions as option, yidx}
              <div class="form-check">
                <input
                  name="yop"
                  id="yop-{yidx}"
                  type="radio"
                  class="form-check-input"
                  value={option.value}
                  checked={yop == option.value}
                  bind:group={yop}
                />
                <label class="form-check-label" for="yop-{yidx}">{option.label}</label>
              </div>
            {/each}
          </div>
          <div class="d-flex gap-3">
            {#if yop == 'before'}
              <div>
                <label for="yop-before" class="form-label fs-7">End Year</label>
                <input type="text" class="form-control" id="yop-before" placeholder="yyyy" bind:value={pubYear.end} />
              </div>
            {:else if yop == 'after'}
              <div>
                <label for="yop-after" class="form-label fs-7">Start Year</label>
                <input type="text" class="form-control" id="yop-after" placeholder="yyyy" bind:value={pubYear.start} />
              </div>
            {:else if yop == 'between'}
              <div>
                <label for="yop-after" class="form-label fs-7">Start Year</label>
                <input type="text" class="form-control" id="yop-after" placeholder="yyyy" bind:value={pubYear.start} />
              </div>
              <div>
                <label for="yop-before" class="form-label fs-7">End Year</label>
                <input type="text" class="form-control" id="yop-before" placeholder="yyyy" bind:value={pubYear.end} />
              </div>
            {:else}
              <div>
                <label for="yop-in" class="form-label fs-7">Year</label>
                <input type="text" class="form-control" id="yop-in" placeholder="yyyy" bind:value={pubYear.exact} />
              </div>
            {/if}
          </div>
        </fieldset>

        <div>
          <fieldset class="mb-4">
            <legend class="fs-4 fw-bold">Language</legend>

            <div class="advanced-search-list">
              <FilterableSelection
                --filterable-list-height="15rem"
                items={languageData.map((item) => ({
                  option: item,
                  key: item,
                  value: item,
                }))}
                label="Language"
                placeholder="Filter by language"
                multiple={true}
                bind:value={lang}
              />
            </div>
          </fieldset>

          <fieldset class="mb-4">
            <legend class="fs-4 fw-bold">Format</legend>

            <p>Select one or more options to narrow your results to items that match all of your format selections.</p>

            <div class="advanced-search-list">
              <FilterableSelection
                --filterable-list-height="15rem"
                items={formatData.map((item) => ({
                  option: item,
                  key: item,
                  value: item,
                }))}
                label="Format"
                placeholder="Filter by format"
                multiple={true}
                bind:value={format}
              />
            </div>
          </fieldset>

          <fieldset class="mb-4">
            <legend class="fs-4 fw-bold">Original Location</legend>

            <div class="advanced-search-list">
              <FilterableSelection
                --filterable-list-height="15rem"
                items={locationData.map((item) => ({
                  option: item,
                  key: item,
                  value: item,
                }))}
                label="Original location"
                placeholder="Filter by original location"
                multiple={false}
                bind:value={originalLocation}
              />
            </div>
          </fieldset>
        </div>

        <div class="d-flex gap-3 mb-3 justify-content-end">
          <button class="btn btn-secondary" type="reset">
            <span>Reset Form</span>
            <i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
          </button>
          <button class="btn btn-primary btn-lg" type="submit">
            <span>Advanced Search</span>
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<style lang="scss">
  .search-input {
    display: flex;
    // border: 0.5px solid var(--color-neutral-500);
    // border-radius: 0.375em;
  }
  .search-clause {
    input[type='text'] {
      width: 100%;
      border: none;
      box-shadow: none;
      border-top-right-radius: 0.375rem !important;
      border-bottom-right-radius: 0.375rem !important;
      padding: 0.625em 0.75em;
    }
    .form-select {
      border: none;
      border-right: 0.5px solid var(--color-neutral-500);
      padding: 0.625em 2.25rem 0.626em 0.75em;
      width: 100%;
      border-radius: 0.375rem;
      margin-left: 0;
    }
  }
  @media (max-width: 36rem) {
    .field-container {
      border: none !important;
    }
    .search-field {
      flex-direction: column;
      gap: 0.5rem;
    }
    .select-container select {
      border: 1px solid var(--color-neutral-500) !important;
      border-radius: 0.375rem !important;
    }
    .search-input .form-control {
      border: 1px solid var(--color-neutral-500) !important;
      border-radius: 0.375rem !important;
    }
  }
</style>
