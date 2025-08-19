<script>
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  
  let fastlaneOpen = false;
  let advOpen = false;
  let methods = [];
  let selectedMethod = '';
  let methodCapabilities = {};
  let filterValues = {};
  let metadataFetchId = 0;
  
  // Logo assets
  const ASSET_DIR = "resources/logo/";
  let LOGO_ASSETS = ["copycat.html","proc.html","flashlight.html","pongpong.html","magnet.html"].map(x => ASSET_DIR + x);
  let currentLogo = '';
  
  // Toggle fastlane
  function toggleFastlane() {
    fastlaneOpen = !fastlaneOpen;
  }
  
  // Toggle advanced search
  function toggleAdvanced(isOpen) {
    advOpen = isOpen;
  }
  
  // Load random logo
  function loadRandomLogo() {
    if (!LOGO_ASSETS.length) {
      showDefaultLogo();
      return;
    }
    showAsset(LOGO_ASSETS[Math.floor(Math.random() * LOGO_ASSETS.length)]);
  }
  
  // Show default logo
  function showDefaultLogo() {
    currentLogo = 'default';
  }
  
  // Show asset
  function showAsset(url) {
    currentLogo = url;
  }
  
  // Initialize assets
  function initAssets() {
    loadRandomLogo();
  }
  
  // Handle search
  function handleSearch(searchData) {
    // Redirect to search page with query parameters
    const searchParams = new URLSearchParams({
      q: searchData.query,
      node: searchData.nodeAddress
    });
    window.location.href = `/indsearch.html?${searchParams.toString()}`;
  }
  
  // Initialize
  initAssets();
</script>

<div class="flex flex-col min-h-screen bg-bg text-fg">
  <Header bind:fastlaneOpen={fastlaneOpen} showSearch={false} on:toggleFastlane={toggleFastlane} />
  
  <main class="wrap">
    <!-- Logo -->
    <div id="logo" 
         on:click={loadRandomLogo} 
         role="button" 
         tabindex="0" 
         on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadRandomLogo(); }}}>
      {#if currentLogo === 'default'}
        <div class="logo-text" aria-label="Index">
          <span class="i">I</span>
          <span class="rest">ndex</span>
        </div>
      {:else}
        <iframe src={currentLogo} loading="eager" title="Index logo"></iframe>
      {/if}
    </div>
    
    <!-- Search -->
    <SearchBar 
      variant="homepage" 
      onSearch={handleSearch} 
      onAdvancedToggle={toggleAdvanced} 
    />
  </main>
  
  <Footer />
</div>