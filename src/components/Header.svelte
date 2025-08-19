<script>
  import { onMount } from 'svelte';
  import SearchBar from './SearchBar.svelte';
  
  export let fastlaneOpen = false;
  export let filtersOpen = false;
  export let showSearch = false; // New prop to control search visibility
  export let currentQuery = ''; // New prop to pass current query to search bar
  
  let fastlaneBtn;
  let fastlane;
  let hdr;
  
  function applyHeaderState() {
    // This would be implemented based on the original JavaScript logic
  }
  
  function handleSearch(searchData) {
    // Handle search from header search bar
    console.log('Search from header:', searchData);
    // Redirect to search page with query parameters
    const searchParams = new URLSearchParams({
      q: searchData.query,
      node: searchData.nodeAddress
    });
    window.location.href = `/indsearch.html?${searchParams.toString()}`;
  }
  
  onMount(() => {
    // Initialize header state
    applyHeaderState();
  });
</script>

<header class="hdr" class:is-filters={filtersOpen && showSearch} class:is-fastlane={fastlaneOpen} style="--hdr-h:72px;">
  <div class="hdr-inner">
    <div class="bar">
      <a href="/" aria-label="Index home">
        <img class="logo-img" src="resources/service-icons/mini-mini.png" alt="Index">
      </a>
      
      {#if showSearch}
        <SearchBar variant="header" onSearch={handleSearch} initialQuery={currentQuery} />
      {:else}
        <div></div> <!-- Empty div to maintain layout -->
      {/if}
      
      <div class="flex gap-2">
        {#if showSearch}
          <button class="icon-btn" aria-label="Filters" on:click={() => filtersOpen = !filtersOpen}>
            <img class="icon" src="resources/svg/tune_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt="Filters">
          </button>
        {/if}
        <button class="icon-btn" aria-label="Fastlane" on:click={() => fastlaneOpen = !fastlaneOpen}>
          <img class="icon" src="resources/svg/dashboard_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt="Dashboard">
        </button>
      </div>
    </div>

    {#if showSearch}
      <div class="filters" class:hidden={!filtersOpen} aria-hidden={!filtersOpen}>
        <!-- Dynamic filters will be rendered here -->
      </div>
    {/if}

    <div class="fastlane" class:open={fastlaneOpen} aria-hidden={!fastlaneOpen}>
      <div class="fl-grid">
        <div class="fl-item"><div class="ico"></div><span class="text-xs text-muted">Mail</span></div>
        <div class="fl-item"><div class="ico"></div><span class="text-xs text-muted">Docs</span></div>
        <a href="/settings"><div class="fl-item"><div class="ico"></div><span class="text-xs text-muted">Settings</span></div></a>
        <div class="fl-item"><div class="ico"></div><span class="text-xs text-muted">Profile</span></div>
        <div class="fl-item"><div class="ico"></div><span class="text-xs text-muted">Shortcuts</span></div>
        <div class="fl-item"><div class="ico"></div><span class="text-xs text-muted">Labs</span></div>
      </div>
    </div>
  </div>
</header>