<script>
  import { slide } from 'svelte/transition';
  import { sineIn, sineOut } from 'svelte/easing';

  import Navbar from '../Navbar/';
  import SearchBar from '../SearchBar';

  /**
   * @typedef {Object} Props
   * @property {string} [searchState]
   * @property {boolean} [compact]
   * @property {boolean} [userNavigation]
   */

  /** @type {Props} */
  let { searchState = 'default', compact = false, userNavigation = true } = $props();

  // let searchFormDisplayed = search_state == 'default';
  // let searchFormDisplayed = true;

  function displaySearchForm() {
    if (searchState == 'default') {
      return true;
    } else if (searchState == 'toggle') {
      return searchOpenToggle;
    }
    return false;
  }
  // function toggleSearch() {
  //   searchFormDisplayed = !searchFormDisplayed;
  // }

  // let searchOpenToggle = ( searchState == 'default' );

  let searchOpenToggle = $derived(searchState == 'default');
  let searchFormDisplayed = $derived(searchState == 'default');
  $effect(() => {
    console.log('AHOY search_state', searchState, searchOpenToggle, searchFormDisplayed);
  });
  $effect(() => {
    console.log('AHOY searchOpenToggle changed', searchOpenToggle);
  });
</script>

<div>
  <Navbar bind:searchOpen={searchOpenToggle} {searchState} {compact} {userNavigation} />
  {#if searchOpenToggle}
    <div
      out:slide|global={{ easing: sineOut, duration: 150 }}
      in:slide|global={{ easing: sineIn, duration: 150 }}
      class="collapse"
      class:show={searchOpenToggle}
      id="siteSearchDropdown"
    >
      {#if displaySearchForm()}
        <SearchBar />
      {/if}
    </div>
  {/if}
</div>
