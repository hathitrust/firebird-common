<script>
  import { slide } from 'svelte/transition';
  import { sineIn, sineOut } from 'svelte/easing';

  import Navbar from '../Navbar/';
  import SearchBar from '../SearchBar';

  export let searchState = 'default';
  export let compact = false;
  export let userNavigation = true;

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

  $: searchOpenToggle = ( searchState == 'default' );
  $: searchFormDisplayed = ( searchState == 'default' );
  $: console.log("AHOY search_state", searchState, searchOpenToggle, searchFormDisplayed);
  $: console.log("AHOY searchOpenToggle changed", searchOpenToggle);

</script>

<div>
  <Navbar bind:searchOpen={searchOpenToggle} {searchState} {compact} {userNavigation} />
  {#if searchOpenToggle}
    <div
      out:slide={{ easing: sineOut, duration: 150 }}
      in:slide={{ easing: sineIn, duration: 150 }}
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
