<script>
  let { snippetLink = null } = $props();

  let snippet;
  let tooltip = $state();
  let tooltipOpen = $state(false);

  async function copyCode(snippet, tooltip) {
    await navigator.clipboard.writeText(snippet);

    //updates tooltip text
    tooltip.innerHTML =
      '<span aria-live="polite">Copied</span> <i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
  }

  function onmouseleave(e) {
    e.target.lastElementChild.innerText = 'Copy';
    tooltip.removeAttribute('style');
  }
  function onblur(e) {
    e.target.lastElementChild.innerText = 'Copy';
    tooltip.removeAttribute('style');
  }

  function onCancel() {
    if (tooltipOpen) {
      tooltip.style.visibility = 'hidden';
      tooltipOpen = false;
      return false;
    }
    return true;
  }
</script>

<div class="d-flex gap-3">
  <figure class="snippet">
    <div class="d-flex">
      <pre tabindex="-1"><code bind:this={snippet}>{snippetLink}</code></pre>
      <button
        type="button"
        class="copycode"
        title="Copy to clipboard"
        onclick={() => copyCode(snippetLink, tooltip)}
        onfocus={() => (tooltipOpen = true)}
        {onblur}
        {onmouseleave}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="copy-icon" viewBox="0 0 448 512"
          ><path
            d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"
          ></path></svg
        >
        <tool-tip role="tooltip" bind:this={tooltip}>Copy</tool-tip>
      </button>
    </div>
  </figure>
</div>

<style lang="scss">
  tool-tip {
    opacity: 0;
    visibility: hidden;
    z-index: 1;
    transform: translate(var(-50%, 0)) translateY(var(3px, 0));
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    background: var(--color-shades-100);
    font-family: Mulish, sans-serif;
    font-size: 0.75rem;
    text-wrap: nowrap;
    padding: 0.75rem;
    margin-block-end: 6px;
    border-radius: 0.5rem;
    position: absolute;
  }

  tool-tip:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -7px;
    border-width: 7px;
    border-style: solid;
    border-color: var(--color-shades-100) transparent transparent transparent;
    z-index: -1;
  }

  .snippet tool-tip {
    inset-block-end: 105%;
  }

  button.copycode {
    position: relative;
    color: var(--color-shades-0);
    border-left-width: 0;
  }

  button.copycode:is(:hover, :focus-visible, :active) tool-tip {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.2s;
  }

  button.copycode svg.copy-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.125em;
    fill: var(--color-shades-0);
  }

  tool-tip:before {
    content: '; Has tooltip: ';
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }

  button.copycode {
    color: var(--color-shades-0);
    // anchor-name: --copycode-button;
  }

  figure.snippet {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .snippet pre {
    display: flex;
    align-items: center;
    gap: 0.9375rem;
    flex: 1 0 0;
    border-radius: 0.25rem 0rem 0rem 0.25rem;
    border-top: 0.75px solid var(--color-neutral-300);
    border-bottom: 0.75px solid var(--color-neutral-300);
    border-left: 0.75px solid var(--color-neutral-300);
    background: var(--color-neutral-50);
    margin-block: 0;
  }

  .snippet pre code {
    padding: 0.625rem;
    color: var(--color-neutral-800);
    font-family:
      Roboto Mono,
      monospace;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: normal;
    width: 100%;
  }

  .snippet button.copycode {
    display: flex;
    width: 2.75rem;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border-radius: 0rem 0.25rem 0.25rem 0rem;
    border-top: 0.75px solid var(--color-neutral-700);
    border-right: 0.75px solid var(--color-neutral-700);
    border-bottom: 0.75px solid var(--color-neutral-700);
    background: var(--color-neutral-700);
  }
</style>
