<script>
  let index = $state('library');

  //search form bindings
  let _select = $state();
  let _searchtype = $state();
  let _root = $state();
  let _input = $state();
  let fieldValue = $state('Everything');

  const ACCESSIBLE_ITEMS = 'items you can access';
  const ALL_ITEMS = 'all items';
  let accessScope = $state(ACCESSIBLE_ITEMS);
  let isFullView = $state(true);
  let dropdownSelected = $state(false);

  //updates UI when 'Collection' or 'Website' is selected in search options
  let _updateSelect = function (event) {
    index = event.target.value;
    _root.dataset.index = event.target.value;
    if (index == 'library') {
      dropdownSelected = true;
    }
  };

  function isSiteBabel() {
    if (
      location.pathname.match('/cgi/ls') ||
      location.pathname.match('/cgi/mb') ||
      location.pathname.match('/cgi/pt')
    ) {
      return true;
    }
    return false;
  }

  function isSiteCatalog() {
    if (
      location.pathname.match('/Record') ||
      location.pathname.match('/Search/Home') ||
      location.pathname.match('/Search/Advanced')
    ) {
      return true;
    }
    return false;
  }

  function isWebsiteHome() {
    if (location.host === HT.www_domain && location.pathname === '/') {
      return true;
    }
    return false;
  }

  //updates search hint message when use selects search type
  function _updateSearchType() {
    if (_searchtype) {
      let value = _searchtype.value;
      _root.dataset.field = value;

      let menuItem = _searchtype.options[_searchtype.selectedIndex];

      console.log('-- updateSearchType', value, _searchtype, menuItem);
      fieldValue = menuItem.text;
    }
  }

  let SERVICE_DOMAIN = $state('babel.hathitrust.org');
  let CATALOG_DOMAIN = 'catalog.hathitrust.org';
  let WWW_DOMAIN = 'www.hathitrust.org';
  if (window.HT && window.HT.service_domain) {
    SERVICE_DOMAIN = window.HT.service_domain;
    CATALOG_DOMAIN = window.HT.catalog_domain;
    WWW_DOMAIN = window.HT.www_domain;
  }

  let _submitSearch = function (event) {
    event.preventDefault();
    let search_url;
    if (index == 'library' && _searchtype.value == 'everything') {
      let submitData = new URLSearchParams();
      submitData.set('q1', _input.value);
      submitData.set('field1', 'ocr');
      submitData.set('a', 'srchls');
      submitData.set('ft', 'ft');
      submitData.set('lmt', isFullView ? 'ft' : 'all');
      search_url = `//${SERVICE_DOMAIN}/cgi/ls?${submitData.toString()}`;
    } else if (index == 'library') {
      let submitData = new URLSearchParams();
      submitData.set('lookfor', _input.value);
      submitData.set('searchtype', _searchtype.value);
      if (isFullView) {
        submitData.set('ft', 'ft');
        submitData.set('setft', 'true');
      }
      search_url = `//${CATALOG_DOMAIN}/Search/Home?${submitData.toString()}`;
    } else {
      // website search
      let searchTerms = _input.value.toLowerCase();
      search_url = `//${WWW_DOMAIN}/search/${searchTerms}`;
      // search_url = `https://www.hathitrust.org/search/node/${searchTerms}`;
    }
    if (search_url) {
      location.href = search_url;
    }
  };

  $effect(() => {
    // find current configuration
    let _searchtypeValue = 'everything';
    let _selectValue = 'library';
    let _inputValue = '';
    if (location && location.href) {
      let searchParams = new URLSearchParams(location.search.replace(/;/g, '&'));

      const isAdvancedSearch = searchParams.get('adv') == '1';

      if (isSiteBabel() || isWebsiteHome()) {
        console.log('isSiteBabel or isWebsite');
        _searchtypeValue = 'everything';
        _selectValue = 'library';
        // set _inputValue to q1 IF this is ls AND it's not a mondo collection
        if (location.pathname.match('/cgi/ls') && !searchParams.has('c')) {
          _inputValue = searchParams.get('q1');
          isFullView = !(searchParams.get('lmt') == 'all');
        }
      } else if (isSiteCatalog()) {
        _searchtypeValue = searchParams.get('searchtype') || 'all';
        _selectValue = 'library';
        _inputValue = searchParams.get('lookfor') || searchParams.get('lookfor[]') || '';
        if (location.pathname == '/Record' && searchParams.has('ft')) {
          // default to isFullView=true if /Record does not have an ft parameter
          isFullView = searchParams.get('ft') == 'ft';
        } else if (location.pathname != '/Record') {
          isFullView = searchParams.has('ft') && searchParams.get('ft') == 'ft';
        }
      } else {
        _searchtypeValue = 'everything';
        if (dropdownSelected == false && location.pathname.startsWith('/search/')) {
          _selectValue = 'website';
          index = 'website';
          let tmp = location.pathname.split('/').slice(2);
          tmp = tmp.pop();
          _inputValue = decodeURI(tmp);
        } else if (dropdownSelected == true && index == 'library') {
          _selectValue = 'library';
          index = 'library';
          _inputValue = '';
        } else {
          _selectValue = 'website';
          index = 'website';
          _inputValue = searchParams.get('s');
        }
      }
      if (searchParams.get('adv') == '1') {
        // if the query was an advanced search do not try to
        // summarize the query here
        _inputValue = '';
      }
    }

    if (_searchtype) _searchtype.value = _searchtypeValue;
    _select.value = _selectValue;
    _input.value = _inputValue;
    accessScope = isFullView ? ACCESSIBLE_ITEMS : ALL_ITEMS;
    _updateSearchType();
  });
</script>

<div>
  <div class="search-form-wrapper" bind:this={_root}>
    <form onsubmit={_submitSearch}>
      <div id="searchbar-form" class="input-group d-flex">
        <div class="search-input">
          <input
            type="text"
            class="form-control"
            aria-label="Keywords"
            placeholder="Search using keywords"
            bind:this={_input}
          />
          <span class="input-group-text" id="search-icon"><i class="fa-solid fa-magnifying-glass fa-fw"></i></span>
        </div>
        <div class="select-container" id="search-where">
          <select
            class="form-select select-caret"
            aria-label="Where do you want to search?"
            aria-describedby="search-bar-help"
            bind:this={_select}
            onchange={_updateSelect}
          >
            <option value="library" selected>Collection</option>
            <option value="website">Website</option>
          </select>
        </div>
        {#if index == 'library'}
          <div class="select-container" id="search-what">
            <select
              class="form-select select-caret"
              aria-label="Field"
              aria-describedby="search-bar-help"
              bind:this={_searchtype}
              onchange={_updateSearchType}
            >
              <option value="everything">Full Text & All Fields</option>
              <option value="all">All Fields</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="subject">Subject</option>
              <option value="isn">ISBN, ISSN, OCLC, etc.</option>
              <option value="publisher">Publisher</option>
              <option value="seriestitle">Series Title</option>
            </select>
          </div>
        {/if}
        <button class="btn btn-primary btn-outline-secondary" type="button" id="button-addon2" onclick={_submitSearch}
          >Search
        </button>
      </div>
    </form>
    <div class="search-details d-flex">
      <span class="search-help" id="search-bar-help"
        ><i class="fa-solid fa-circle-info fa-fw"></i>
        {#if index == 'library'}
          You're searching in {fieldValue} for {accessScope}.
        {/if}
        {#if index == 'website'}
          You're searching the information website.
        {/if}
      </span>
      <div class="search-links">
        <a href="//{window.HT.www_domain}/the-collection/search-access/#hathitrust-search-basics"
          ><i class="fa-regular fa-circle-question fa-fw"></i><span>Search Help</span></a
        >
        <a href={`//${SERVICE_DOMAIN}/cgi/ls?a=page&page=advanced`}
          ><i class="fa-solid fa-toolbox fa-fw"></i><span>Advanced Search</span></a
        >
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .search-form-wrapper {
    padding: 1rem;
    background: #fff;
  }
  #searchbar-form {
    display: flex;
    flex-direction: column;
    &.input-group {
      gap: 0.5rem;
    }
    .search-input {
      display: flex;
      border: 0.5px solid var(--color-neutral-500);
      border-radius: 0.375em;
      &:focus-within {
        outline: 2px solid var(--ht-focus-border-color) !important;
        z-index: 3;
        border-radius: 6px 0 0 6px !important;
      }
    }
    input {
      width: 100%;
      border: none;
      box-shadow: none;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      padding: 0.625em 0.75em;
      &:focus {
        outline: 3px solid transparent;
      }
      &:focus-visible {
        outline: 3px solid transparent !important;
        outline-offset: 0;
      }
    }
    .input-group-text {
      font-size: 1rem;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      border: none;
      background-color: var(--color-neutral-50);
      padding: 0.625em 0.75em;
      i {
        font-size: 14px;
      }
    }
    .form-select {
      border: 0.5px solid var(--color-neutral-500);
      padding: 0.625em 0.75em;
      width: 100%;
      border-radius: 0.375rem;
      margin-left: 0;
      &:focus {
        outline: 3px solid transparent;
      }
      &:focus-visible {
        outline: 2px solid var(--ht-focus-border-color) !important;
        outline-offset: 0;
      }
    }
    button {
      border-radius: 0.375rem;
      margin-left: 0;
      text-transform: uppercase;
      font-weight: var(--btn-font-weight);
      letter-spacing: -0.01em;
      padding: 0.5em 0.75em;
      transition-duration: 0s;
      &:focus-visible {
        outline: 2px solid var(--ht-focus-border-color) !important;
        outline-offset: 0;
        box-shadow: inset 0 0 0 2px white !important;
      }
    }
  }
  .search-details {
    padding-top: 1rem;
    flex-direction: column;
    gap: 1.375em;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.01em;
    .search-help {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5em;
      font-style: italic;
      i {
        font-size: 14px;
        color: var(--color-primary-500);
      }
    }
    .search-links {
      display: flex;
      align-items: center;
      gap: 1.25em;
      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.75em;
        text-decoration: none;
        color: var(--color-neutral-800);
        span:hover {
          text-decoration: underline;
        }
      }
      i {
        font-size: 14px;
        color: var(--color-primary-500);
      }
    }
  }
  .select-container {
    width: 100%;
  }
  select.select-caret {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath d='M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z'/%3E%3C/svg%3E");
    -moz-appearance: none;
    -webkit-appearance: none;
    -webkit-border-radius: 0px;
    border-radius: 0px;
    border: none;
    appearance: none;
    outline-width: 0;
  }
  // medium (and up) screen size styles
  @media (min-width: 768px) {
    #searchbar-form {
      flex-direction: row;
      border: 1px solid var(--color-neutral-500);
      border-radius: 0.5em;
      box-shadow: none;
      &.input-group {
        gap: 0;
      }
      .search-input {
        flex-grow: 2;
        border: none;
        @media (min-width: 992px) {
          flex-grow: 3;
        }

        .input-group-text {
          order: -1;
          border-top-left-radius: 0.375em !important;
          border-bottom-left-radius: 0.375em !important;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          padding: 1em 0 1em 1em;
        }
      }
      input {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        padding: 1em;
      }

      #search-where.select-container {
        width: 125px;
      }
      #search-what.select-container {
        width: 265px;
      }
      .form-select {
        border-radius: 0;
        padding: 1em;
        border: none;
        box-shadow: none;
        border-width: 0px 1px;
        border-style: solid;
        border-color: var(--color-neutral-100);
        position: relative;
      }
      button {
        margin-left: -1px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        padding: 1em;
        border: none;
      }
    }
    .search-details {
      flex-direction: row;
      justify-content: space-between;
      align-items: start;
      padding-top: 0.75em;
      .search-links {
        gap: 1.5em;
      }
    }
  }
</style>
