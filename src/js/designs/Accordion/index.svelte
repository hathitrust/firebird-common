<script>
  import { Accordion } from '../../lib/accordion';
	import { onMount } from 'svelte';
  export let role = 'default';
  export let example = '<!-- add example -->';

  onMount(() => {
    Accordion.configure('details');
  })
</script>

<div class="container">
  <div class="row">
    <div class="col-md-4">
      <div data-role={role}>
        {@html example}
      </div>
    </div>
  </div>
</div>
