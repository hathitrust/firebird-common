<script>
  import { onMount } from 'svelte';

  /**
   * @typedef {Object} Props
   * @property {any} items
   * @property {any} placeholder
   * @property {any} label
   * @property {any} icon
   * @property {boolean} [multiple]
   * @property {string} [value]
   * @property {string} [filterText]
   */

  /** @type {Props} */
  let { items, placeholder, label, icon, multiple = false, value = $bindable(), filterText = $bindable('') } = $props();

  let fieldset1 = $state();
  let fieldset2 = $state();
  let list = $state();

  export const utils = {
    resize(height, container) {
      let h = container.clientHeight;
      while (h > height) {
        list.style.height = `${list.clientHeight - 10}px`;
        h = container.clientHeight;
      }
    },
  };

  let guid = $state();

  function filterData(value) {
    if (value.trim() == '') {
      return items;
    }
    let re = new RegExp(value, 'i');
    return items.filter((item) => {
      return re.exec(item.option);
    });
  }

  function updateValue(event, forced) {
    if (forced) {
      event.target.checked = forced;
    }
    if (multiple) {
      let target = event.target.value;
      if (value.indexOf(target) > -1) {
        let idx = value.indexOf(target);
        value.splice(idx, 1);
      } else {
        value.push(target);
      }
      value = value;
    } else {
      value = event.target.value;
    }
  }

  function clearFilter(event) {
    event.stopPropagation();
    event.preventDefault();
    filterText = '';
  }

  let possibleItems = $derived(filterData(filterText));
  let isSelected = $derived((check, value) => value.indexOf(check) > -1);

  onMount(() => {
    guid = `${new Date().getTime()}-${Math.random() * 1000}`;
  });
</script>

<fieldset class="fieldset-filter mb-3" bind:this={fieldset1}>
  <legend class="fs-7">Filter by {label}</legend>
  <div class="input-group">
    {#if icon}
      <span class="input-group-text ms-0"><i class={icon} aria-hidden="true"></i></span>
    {/if}
    <input
      type="text"
      class="form-control"
      {placeholder}
      aria-label="Filter options"
      aria-describedby="filter-help-{guid}"
      bind:value={filterText}
    />
    <button class="btn btn-outline-secondary" aria-label="Clear filter" onclick={clearFilter}>
      <i class="fa-regular fa-circle-xmark" aria-hidden="true"></i>
    </button>
  </div>
  <p id="filter-help-{guid}" class="visually-hidden">
    Below this edit box is a list of items that allow you to filter down your options. As you type in this edit box, the
    list of items is updated to reflect only those that match the query typed in this box.
  </p>
</fieldset>

<fieldset class="fieldset-select" bind:this={fieldset2}>
  <legend class="fs-7">Select {label}</legend>
  <ul class="px-0 position-relative border border-dark rounded filterable-list" bind:this={list}>
    {#each possibleItems as item, index (item.key)}
      <li class="form-check mt-0 mb-0 px-0">
        {#if multiple}
          <input
            class="form-check-input visually-hidden"
            type="checkbox"
            name="item-{guid}"
            id="item{index}-{guid}"
            value={item.value}
            onclick={updateValue}
            checked={isSelected(item.value, value)}
          />
        {:else}
          <input
            class="form-check-input visually-hidden"
            type="radio"
            name="item-{guid}"
            id="item{index}-{guid}"
            checked={item.value == value}
            value={item.value}
            onclick={updateValue}
            onfocus={(event) => updateValue(event, true)}
          />
        {/if}
        <label class="form-check-label p-2 px-3" for="item{index}-{guid}">{@html item.option}</label>
      </li>
    {/each}
  </ul>
</fieldset>

<style>
  .filterable-list {
    max-height: var(--filterable-list-height, 22rem);
    overflow: scroll;
    min-height: 0;
    grid-row: 2/3;
  }

  label {
    width: 100%;
  }

  input:checked + label {
    background: var(--color-primary-600, '#000') !important;
    color: white !important;
  }

  li:nth-child(odd) input + label {
    background: var(--color-primary-50);
  }

  .fieldset-filter {
    grid-row: 1/2;
  }

  .fieldset-filter input[type='text'] {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .fieldset-select {
    grid-row: 2/3;
    display: grid;
    grid-template-rows: min-content minmax(0, 1fr);
    /* min-height: 0; */
    min-height: 10rem;
  }

  .fieldset-select legend {
    grid-row: 1/2;
  }
</style>
