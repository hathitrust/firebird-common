<script>
  import BannerMessage from './BannerMessage.svelte';

  let alert = $state();
  let alertEmpty = $state(true);

  const request = async () => {
    try {
      const response = await fetch(`/common/firebird/alerts/alert.json`);
      const data = await response.json();
      alert = data;
      alertEmpty = false;
    } catch (error) {
      console.log('catch: no alert');
    }
  };
  request();
</script>

{#if !alertEmpty}
  <BannerMessage {...alert}></BannerMessage>
{/if}
