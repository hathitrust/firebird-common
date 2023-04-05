<script>
  import { Accordion } from '../../lib/accordion';
	import { onMount } from 'svelte';
  export let role = 'default';
  export let example = '<!-- add example -->';

  let examples = (example instanceof Array) ? example : [example];

  onMount(() => {
    Accordion.configure('details');
  })
</script>

<div class="container">
  {#each examples as example}
  <div class="row mb-4">
    <div class="col-md-4">
      <div data-role={role}>
        {@html example}
      </div>
    </div>
  </div>    
  {/each}
</div>
