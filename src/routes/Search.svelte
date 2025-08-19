<script>
  import Header from '../components/Header.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import SearchMethodRail from '../components/SearchMethodRail.svelte';
  import ResultColumn from '../components/ResultColumn.svelte';
  import SupportingColumn from '../components/SupportingColumn.svelte';
  import ResultBlock from '../components/ResultBlock.svelte';
  import Island from '../components/Island.svelte';
  import SkeletonLoader from '../components/SkeletonLoader.svelte';
  import { onMount } from 'svelte';
  
  let filtersOpen = false;
  let fastlaneOpen = false;
  let methods = [];
  let selectedMethod = null;
  let methodCapabilities = {};
  let currentPage = 1;
  let filterValues = {};
  let suggestions = [];
  let selectedSuggestion = -1;
  let showSuggestions = false;
  let currentQuery = ''; // New variable to store current query
  
  // Search results state
  let mainIslands = [];
  let supportingIslands = [];
  let results = [];
  let customHtml = '';
  let showCustomHtml = false;
  
  // Loading states
  let searchLoading = false;
  let islandsLoading = false;
  
  // Node address from URL or default
  let NODE = new URLSearchParams(window.location.search).get('node') || 'http://localhost:3000';
  
  // Initialize currentQuery from URL parameter if present
  let urlParams = new URLSearchParams(window.location.search);
  currentQuery = urlParams.get('q') || '';
  
  // Toggle filters
  function toggleFilters() {
    filtersOpen = !filtersOpen;
  }
  
  // Toggle fastlane
  function toggleFastlane() {
    fastlaneOpen = !fastlaneOpen;
  }
  
  // Select method
  function selectMethod(method) {
    selectedMethod = method;
    currentPage = 1;
    
    // Update URL with new method parameter
    const url = new URL(window.location);
    url.searchParams.set('method', method);
    window.history.replaceState({}, '', url);
    
    // Clear previous results when changing method
    mainIslands = [];
    supportingIslands = [];
    results = [];
    customHtml = '';
    showCustomHtml = false;
    
    // Re-initialize filter values for the selected method (but keep existing values if they exist)
    const caps = methodCapabilities[method] || {};
    if (Array.isArray(caps.filters)) {
      caps.filters.forEach(filter => {
        // Only set default value if filter doesn't already have a value
        if (filterValues[filter.name] === undefined) {
          filterValues[filter.name] = filter.default !== undefined ? filter.default : '';
        }
      });
    }
    
    // If there's already a query, perform search with the new method
    const currentQuery = url.searchParams.get('q');
    if (currentQuery) {
      performSearch(currentQuery);
    }
  }
  
  // Handle search from search bar
  async function handleSearch(searchData) {
    // Update NODE with the new node address if provided
    if (searchData.nodeAddress) {
      NODE = searchData.nodeAddress;
    }
    
    // Update URL with parameters
    const url = new URL(window.location);
    url.searchParams.set('node', NODE);
    url.searchParams.set('q', searchData.query);
    
    // Update URL with method if provided
    if (searchData.selectedMethod) {
      selectedMethod = searchData.selectedMethod;
      url.searchParams.set('method', selectedMethod);
    } else if (selectedMethod) {
      // Ensure current method is in URL
      url.searchParams.set('method', selectedMethod);
    }
    
    // Update URL with filter values
    if (searchData.filterValues) {
      Object.entries(searchData.filterValues).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.set(`f_${key}`, value);
          // Also update our local filterValues
          filterValues[key] = value;
        } else {
          url.searchParams.delete(`f_${key}`);
          // Also update our local filterValues
          filterValues[key] = '';
        }
      });
    } else {
      // If no filterValues provided, ensure current filter values are in URL
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.set(`f_${key}`, value);
        } else {
          url.searchParams.delete(`f_${key}`);
        }
      });
    }
    
    window.history.replaceState({}, '', url);
    
    // Perform search
    await performSearch(searchData.query);
  }
  
  // Perform search using separate endpoints for faster results
  async function performSearch(query) {
    if (!query || !selectedMethod) return;
    
    // Update current query
    currentQuery = query;
    
    // Set loading states
    searchLoading = true;
    islandsLoading = true;
    results = []; // Clear results to show skeleton
    mainIslands = []; // Clear islands to show skeleton
    supportingIslands = [];
    
    let body = { query, method: selectedMethod };
    let rankingPreferences = {};
    
    const caps = methodCapabilities[selectedMethod] || {};
    if (caps.pagination) {
      const pageParam = caps.pageParam || 'p';
      rankingPreferences[pageParam] = currentPage;
    }
    if (Array.isArray(caps.filters)) {
      caps.filters.forEach(filter => {
        if (filterValues[filter.name] !== undefined && filterValues[filter.name] !== '') {
          rankingPreferences[filter.name] = filterValues[filter.name];
        } else if (filter.default !== undefined) {
          rankingPreferences[filter.name] = filter.default;
        }
      });
    }
    if (Object.keys(rankingPreferences).length > 0) {
      body.rankingPreferences = rankingPreferences;
    }
    
    try {
      // Make parallel requests for faster loading
      const searchPromise = fetch(NODE + '/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const islandsPromise = fetch(NODE + '/islands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, method: selectedMethod })
      });
      
      // Handle search results first (faster)
      const searchRes = await searchPromise;
      const searchData = await searchRes.json();
      
      // Update loading state
      searchLoading = false;
      
      // Handle custom HTML layout
      if (typeof searchData.html === 'string' && searchData.html.trim()) {
        customHtml = searchData.html;
        showCustomHtml = true;
        mainIslands = [];
        supportingIslands = [];
        results = [];
        return;
      }
      
      // Handle search results
      const answers = Array.isArray(searchData.answers) ? searchData.answers : [];
      if (!answers.length) {
        results = [{ component: ResultBlock, props: { title: 'No results', snippet: '', url: '#' } }];
      } else {
        // Convert answers to result components
        results = answers.map(answer => ({
          component: ResultBlock,
          props: {
            url: answer.url,
            title: answer.name,
            domain: answer.domain,
            snippet: answer.snippet,
            query: query
          }
        }));
      }
      
      // Handle islands when they're ready
      const islandsRes = await islandsPromise;
      const islandsData = await islandsRes.json();
      
      // Update loading state
      islandsLoading = false;
      
      if (Array.isArray(islandsData.islands) && islandsData.islands.length) {
        const mainIslandsData = islandsData.islands.filter(island => island.column === 'main' && typeof island.html === 'string');
        const suppIslandsData = islandsData.islands.filter(island => island.column === 'supporting' && typeof island.html === 'string');
        
        mainIslands = mainIslandsData.map(island => ({
          component: Island,
          props: {
            name: island.name || '',
            htmlContent: island.html,
            renderHtml: true
          }
        }));
        
        supportingIslands = suppIslandsData.map(island => ({
          component: Island,
          props: {
            name: island.name || '',
            htmlContent: island.html,
            renderHtml: true
          }
        }));
      } else {
        mainIslands = [];
        supportingIslands = [];
      }
      
    } catch (err) {
      // Update loading states
      searchLoading = false;
      islandsLoading = false;
      
      results = [{ component: ResultBlock, props: { title: 'Search failed', snippet: (err && err.message) || 'Unknown error', url: '#' } }];
      mainIslands = [];
      supportingIslands = [];
      showCustomHtml = false;
    }
  }
  
  // Fetch methods
  async function fetchMethods() {
    try {
      const res = await fetch(NODE + '/metadata');
      const data = await res.json();
      methods = data.methods || [];
      methodCapabilities = data.methodCapabilities || {};
      
      // Select method from URL ?method= or ?type=
      const urlParams = new URLSearchParams(window.location.search);
      const urlMethod = urlParams.get('method') || urlParams.get('type');
      if (!selectedMethod && methods.length) {
        const pick = methods.includes(urlMethod) ? urlMethod : methods[0];
        selectMethod(pick);
      }
      
      // Initialize filter values from URL parameters
      for (const [key, value] of urlParams.entries()) {
        if (key.startsWith('f_')) {
          const filterName = key.substring(2);
          filterValues[filterName] = value;
        }
      }
      
      // Pre-fill query
      const q = urlParams.get('q');
      if (q) {
        currentQuery = q;
        // Perform search when query exists
        await performSearch(q);
      }
    } catch (e) {
      console.error('Failed to fetch methods:', e);
    }
  }
  
  // Initialize
  onMount(() => {
    fetchMethods();
  });
</script>

<div class="flex flex-col min-h-screen bg-bg text-fg">
  <Header bind:fastlaneOpen={fastlaneOpen} bind:filtersOpen={filtersOpen} 
          showSearch={true}
          {currentQuery}
          on:toggleFilters={toggleFilters} on:toggleFastlane={toggleFastlane} />
  
  <main class="page">
    <SearchMethodRail 
      {methods} 
      {selectedMethod} 
      {methodCapabilities} 
      onSelectMethod={selectMethod} 
    />
    
    {#if showCustomHtml}
      <div class="col-span-2">
        {@html customHtml}
      </div>
    {:else}
      <ResultColumn 
        islands={mainIslands}
        results={results}
        renderHtml={false}
        htmlContent=""
      >
        {#if searchLoading}
          <div class="space-y-4">
            <SkeletonLoader type="result" />
            <SkeletonLoader type="result" />
            <SkeletonLoader type="result" />
          </div>
        {/if}
      </ResultColumn>
      
      <SupportingColumn 
        islands={supportingIslands}
        renderHtml={false}
        htmlContent=""
      >
        {#if islandsLoading}
          <div class="space-y-4">
            <SkeletonLoader type="island" />
            <SkeletonLoader type="island" />
          </div>
        {/if}
      </SupportingColumn>
    {/if}
  </main>
</div>