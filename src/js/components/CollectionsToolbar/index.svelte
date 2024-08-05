<script>
  import { onMount, tick } from 'svelte';

  import CollectionEditModal from '../CollectionEditModal';

  export let editable = false;
  export let userIsAnonymous = true;
  export let colldata = null;
  export let collid = null;
  // export let collname = null;
  // export let desc = null;
  // export let shared = 0;

  let userCollections = [];
  let div;

  let externItemIdOptions;
  let allItemsSelected = false;

  let modal;

  let c = '__NEW__';
  let cn = '';
  let desc = '';
  let contributorName = '';
  let shared = 0;

  let action = 'addc';
  let status = { result: null };
  let statusEl;

  function selectAllItems() {
    allItemsSelected = !allItemsSelected;
    externItemIdOptions.forEach((el) => {
      el.checked = allItemsSelected;
    });
  }

  function fetchSelection() {
    let selected = [];
    externItemIdOptions.forEach((el) => {
      if (el.checked) {
        selected.push(el);
      }
    });
    return selected;
  }

  function clearSelection() {
    externItemIdOptions.forEach((el) => {
      if (el.checked) {
        el.checked = false;
      }
    });
  }

  function checkSelection() {
    if (fetchSelection().length) {
      return true;
    }
    status.class = 'alert-danger';
    status.message = 'One or more items must be selected.';
    status = status;
    return false;
  }

  function openModal() {
    cn = desc = contributorName = '';
    shared = 0;
    modal.show();
  }

  function addItems(event) {
    if (!checkSelection()) {
      return;
    }
    action = 'addits';
    if (c == '__NEW__') {
      action = 'additsnc';
      openModal();
      return;
    }
    let params = new URLSearchParams();
    params.set('c2', c);
    params.set('page', 'ajax');
    submitAction(params);
  }

  function moveItems() {
    if (!checkSelection()) {
      return;
    }
    action = 'movit';
    if (c == '__NEW__') {
      openModal();
      return;
    }
    let params = new URLSearchParams();
    params.set('c', collid);
    params.set('c2', c);
    submitAction(params);
  }

  function removeItems() {
    if (!checkSelection()) {
      return;
    }
    action = 'delit';
    let params = new URLSearchParams();
    params.set('c', collid);
    submitAction(params);
  }

  function editMetadata() {
    action = 'editc';
    c = collid;
    cn = document.documentElement.dataset.collname;
    desc = document.documentElement.dataset.desc;
    shared = parseInt(document.documentElement.dataset.shared, 10);
    contributorName = document.documentElement.dataset.contributorName;
    modal.show();
  }

  async function submitAction(params) {
    const non_ajax = { movit: true, delit: true, movitnc: true, editc: true, addc: true };

    status.class = null;
    status = status;
    params.set('a', action);
    if (!non_ajax[action]) {
      params.set('page', 'ajax');
    }

    fetchSelection().forEach((el) => {
      params.append('id', el.value);
    });

    let url = new URL(`${location.protocol}//${HT.service_domain}/cgi/mb?${params.toString()}`);

    if (params.get('page') == 'ajax') {
      let response = await fetch(url, {
        method: 'GET',
      });
      if (response.ok) {
        parseResponse(await response.text());

        const found = userCollections.find((item) => item.value == status.coll_id);
        if (!found) {
          userCollections.push({
            value: status.coll_id,
            label: status.coll_name,
          });
        }

        c = status.coll_id;

        userCollections = userCollections;
        console.log('-- collections.toolbar', userCollections);
        clearSelection();
      }
    } else {
      location.href = url;
    }
  }

  function parseResponse(line) {
    var kv;
    var tmp = line.trim().split('|');
    let message = [];
    for (var i = 0; i < tmp.length; i++) {
      kv = tmp[i].split('=');
      status[kv[0]] = kv[1];
    }
    if (status.result == 'ADD_ITEM_FAILURE') {
      status.class = 'alert-danger';
      message.push('Sorry; there was a problem adding these items to your collection.');
    } else if (status.result == 'ADD_ITEM_SUCCESS') {
      status.class = 'alert-success';
      let collection_link = `<a href="mb?a=listis;c=${status.coll_id}">${status.coll_name}</a>`;
      if (status.NumFailed > 0) {
        message.push(`${numFailed} item${numFailed > 1 ? 's' : ''} could not be added to your collection`);
      }
      if (status.NumAddedToCollection > 0) {
        message.push(
          `${status.NumAddedToCollection} item${status.NumAddedToCollection > 1 ? 's' : ''} ${
            status.NumAddedToCollection > 1 ? 'were' : 'was'
          } added to ${collection_link}.`
        );
      }
      if (status.NumAlreadyInCollection > 0) {
        message.push(
          `${status.NumAlreadyInCollection} item${status.NumAlreadyInCollection > 1 ? 's' : ''} ${
            status.NumAlreadyInCollection > 1 ? 'were' : 'was'
          } already in ${collection_link}.`
        );
      }
    }
    status.message = message.join(' ');
    status = status;
  }

  function pluralize(string, value) {
    return `${string}${value == 1 ? '' : 's'}`;
  }

  async function announceStatus() {
    await tick();
    HT.live.announce(statusEl.innerText);
  }

  $: if (status.class) {
    announceStatus();
  }

  onMount(() => {
    let parentEl = div.parentElement;
    parentEl.querySelectorAll('[data-use="collections"] option').forEach((optionEl) => {
      userCollections.push({
        value: optionEl.value,
        label: optionEl.innerText,
      });
    });
    userCollections = userCollections;

    externItemIdOptions = document.querySelectorAll('input[name="extern_item_id"]');
    externItemIdOptions.forEach((el) => {
      el.addEventListener('click', (event) => {
        if (!el.checked && allItemsSelected) {
          allItemsSelected = false;
        }
      });
    });

    let btnEdit = document.querySelector('button[data-action="edit-metadata"]');
    if (btnEdit) {
      btnEdit.addEventListener('click', editMetadata);
    }

    let checkInterval;
    let isFetching = false;
    let checkDownloadStatus = function (collid, button) {
      if (isFetching) {
        if (HT && HT.is_dev) {
          console.log('-- still checking status');
        }
        return;
      }
      isFetching = true;
      fetch(`/cgi/mb/download?a=download-status&c=${collid}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          isFetching = false;
          if (HT && HT.is_dev) {
            console.log('-- download status', data.status);
          }
          if (data.status == 'done') {
            clearInterval(checkInterval);
            button.disabled = false;
            button.classList.remove('btn-loading');
            HT.live.announce('Metadata has been downloaded.');
          }
        });
    };

    let downloadForm = document.querySelector('form[data-action="download-metadata"]');
    if (downloadForm) {
      downloadForm.addEventListener('submit', (event) => {
        let button = downloadForm.querySelector('button[type="submit"]');
        button.disabled = true;
        button.classList.add('btn-loading');
        checkInterval = setInterval(() => {
          checkDownloadStatus(collid, button);
        }, 1000);
        HT.live.announce('Download request submitted.');
      });
    }

    return () => {
      if (btnEdit) {
        btnEdit.removeEventListener('click', editMetdata);
      }
    };
  });
</script>

<div
  bind:this={div}
  class="bg-secondary rounded-2 p-2 px-3 d-flex flex-sm-row flex-column gap-3 justify-content-between align-items-start align-items-sm-center mt-1"
  role="toolbar"
  aria-label="Collections toolbar"
>
  <button
    class="btn btn-outline-light d-flex align-items-center gap-2 flex-nowrap"
    aria-pressed={allItemsSelected}
    on:click={selectAllItems}
  >
    {#if allItemsSelected}
      <i class="fa-solid fa-square-check" aria-hidden="true" />
    {:else}
      <i class="fa-regular fa-square" aria-hidden="true" />
    {/if}
    <span class="text-nowrap">Select all items</span>
  </button>
  <div class="d-flex align-items-center justiy-content-end gap-2">
    <select class="form-select" aria-label="Add to collection" size="1" id="collections-chooser" bind:value={c}>
      <option value="__NEW__">New collection…</option>
      {#each userCollections as collection}
        <option value={collection.value}>{collection.label}</option>
      {/each}
    </select>
    <div class="btn-group">
      <button id="addits" type="button" class="btn btn-outline-light" on:click={addItems}>Add</button>
      {#if editable}
        <button
          type="button"
          class="btn btn-outline-light dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu">
          <li>
            <button class="dropdown-item" type="button" on:click={moveItems}>Move</button>
          </li>
          <li>
            <button class="dropdown-item" type="button" on:click={removeItems}>Remove</button>
          </li>
        </ul>
      {/if}
    </div>
  </div>
</div>
{#if status.class}
  <div class="alert mt-1 {status.class} d-flex align-items-center gap-3" bind:this={statusEl}>
    {#if status.class == 'alert-danger'}
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true" />
    {:else}
      <i class="fa-regular fa-circle-check" aria-hidden="true" />
    {/if}
    <span>{@html status.message}</span>
  </div>
{/if}

<CollectionEditModal bind:this={modal} {userIsAnonymous} {c} {cn} {desc} {contributorName} {shared} {submitAction} />

<style>
  .bg-secondary button:not(.dropdown-item):focus-visible, .bg-secondary .form-select:focus-visible {
    outline-offset:0;
  }
</style>
