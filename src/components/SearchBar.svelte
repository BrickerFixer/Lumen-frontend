<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let variant = 'homepage'; // 'homepage' or 'header'
  export let onSearch = () => {};
  export let onAdvancedToggle = () => {};
  export let initialQuery = ''; // New prop to accept initial query
  
  let query = initialQuery;
  let nodeAddress = 'http://localhost:3000';
  let methods = [];
  let selectedMethod = '';
  let methodCapabilities = {};
  let filterValues = {};
  let advOpen = false;
  
  const dispatch = createEventDispatcher();
  
  // Toggle advanced search
  function toggleAdvanced() {
    advOpen = !advOpen;
    onAdvancedToggle(advOpen);
  }
  
  // Handle search
  function handleSearch() {
    if (!query.trim()) return;
    onSearch({ query, nodeAddress, selectedMethod, filterValues });
  }
  
  // Prettify ID
  function prettifyId(id) {
    return id.replace(/[-_]+/g,' ').replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/\s+/g,' ').trim().replace(/\b\w/g,c=>c.toUpperCase());
  }
  
  // Get method label
  function getMethodLabel(id) {
    const caps = methodCapabilities[id] || {};
    return caps.displayName || caps.label || caps.name || caps.title || prettifyId(id);
  }
  
  // Get method filters
  function getMethodFilters() {
    const caps = methodCapabilities[selectedMethod] || {};
    return Array.isArray(caps.filters) ? caps.filters : [];
  }
  
  // Initialize filter values when method changes
  function initFilterValues() {
    const filters = getMethodFilters();
    filters.forEach(filter => {
      if (filterValues[filter.name] === undefined) {
        filterValues[filter.name] = filter.default !== undefined ? filter.default : '';
      }
    });
  }
  
  // Handle filter change
  function handleFilterChange(name, value) {
    filterValues[name] = value;
  }
  
  // Fetch methods and capabilities
  async function fetchMethods() {
    try {
      const res = await fetch(nodeAddress + '/metadata');
      const data = await res.json();
      methods = data.methods || [];
      methodCapabilities = data.methodCapabilities || {};
      
      // Set default method if available
      if (methods.length > 0 && !selectedMethod) {
        selectedMethod = methods[0];
        initFilterValues();
      }
    } catch (e) {
      console.error('Failed to fetch methods:', e);
    }
  }
  
  // Watch for node address changes
 $: {
    if (nodeAddress) {
      fetchMethods();
    }
  }
  
  // Watch for selected method changes
  $: {
    if (selectedMethod) {
      initFilterValues();
    }
  }
</script>

{#if variant === 'header'}
  <!-- Header search bar -->
  <div class="search-table">
    <form class="search" on:submit|preventDefault={handleSearch}>
      <input class="q" type="search" placeholder="Search the index" bind:value={query} />
      <div class="suggestions-list" aria-label="Suggestions"></div>
    </form>
    <button class="bar-search-button" type="button" on:click={handleSearch}>Go</button>
  </div>
{:else}
  <!-- Homepage search bar -->
  <div class="search-stack" class:adv-open={advOpen}>
    <div class="search-table">
      <form class="search" on:submit|preventDefault={handleSearch}>
        <input class="q" type="search" placeholder="Search the index" bind:value={query} />
        <div class="suggestions-list" aria-label="Suggestions"></div>
      </form>
      <button class="bar-search-button" type="button" on:click={handleSearch}>Go</button>
      <button class="bar-param-button" type="button" on:click={toggleAdvanced}>
        {#if advOpen}Hide{:else}Advanced{/if}
      </button>
    </div>
    
    <!-- Inline Advanced -->
    <div class="search-adv" class:open={advOpen}>
      <div class="adv-grid">
        <label>
          <span class="lbl">Node</span>
          <input class="flt-input" placeholder="http://localhost:3000" bind:value={nodeAddress} />
          <div class="hint"></div>
        </label>
        <label>
          <span class="lbl">Method</span>
          <select class="sel" bind:value={selectedMethod}>
            {#each methods as method}
              <option value={method}>{getMethodLabel(method)}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="mt-2">
        <div class="lbl">Filters</div>
        <div class="filters-grid mt-2">
          {#each getMethodFilters() as filter}
            <label>
              <span class="lbl">{filter.name || ''}</span>
              {#if Array.isArray(filter.choices)}
                <select class="sel" bind:value={filterValues[filter.name]}>
                  {#each filter.choices as choice}
                    <option value={choice}>{choice}</option>
                  {/each}
                </select>
              {:else}
                <input class="flt-input" type="text" bind:value={filterValues[filter.name]} placeholder={filter.default || ''} />
              {/if}
              {#if filter.description}
                <div class="hint">{filter.description}</div>
              {/if}
            </label>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}