<script>
  import Header from '../components/Header.svelte';
  import { onMount } from 'svelte';
  
  // Settings state
  const DEFAULTS = {
    doodles: true,
    logo: true,
    islands: true,
    customCSS: ''
  };
  
  let settings = {...DEFAULTS};
  let saveStatus = 'Saved';
  const customCSSPlaceholder = `/* Example */
body { letter-spacing: 0.2px; }
#logo { filter: saturate(1.1); }`;
  
  // Load settings from localStorage
  function loadSettings() {
    try {
      const raw = localStorage.getItem('indexSettings');
      if (!raw) return {...DEFAULTS};
      const obj = JSON.parse(raw);
      return {...DEFAULTS, ...obj};
    } catch {
      return {...DEFAULTS};
    }
  }
  
  // Save settings to localStorage
  function saveSettings(s) {
    localStorage.setItem('indexSettings', JSON.stringify(s));
    // Broadcast to other tabs
    window.dispatchEvent(new CustomEvent('index:settings-changed', { detail: s }));
  }
  
  // Apply custom CSS
  function applyCustomCss(css) {
    let tag = document.getElementById('index-custom-style');
    if (!tag) {
      tag = document.createElement('style');
      tag.id = 'index-custom-style';
      document.head.appendChild(tag);
    }
    tag.textContent = css || '';
  }
  
  // Set saved status
  function setSaved(msg = 'Saved') {
    saveStatus = msg;
    setTimeout(() => saveStatus = 'Saved', 800);
  }
  
  // Handle doodles toggle
  function handleDoodlesToggle() {
    settings.doodles = !settings.doodles;
    saveSettings(settings);
    setSaved();
  }
  
  // Handle logo toggle
  function handleLogoToggle() {
    settings.logo = !settings.logo;
    saveSettings(settings);
    setSaved();
  }
  
  // Handle islands toggle
  function handleIslandsToggle() {
    settings.islands = !settings.islands;
    saveSettings(settings);
    setSaved();
  }
  
  // Apply custom CSS
  function applyCustomCssHandler() {
    applyCustomCss(settings.customCSS);
    saveSettings(settings);
    setSaved('Applied');
  }
  
  // Reset to defaults
  function resetToDefaults() {
    settings = {...DEFAULTS};
    applyCustomCss(settings.customCSS);
    saveSettings(settings);
    setSaved('Defaults restored');
  }
  
  // Initialize
  onMount(() => {
    settings = loadSettings();
    applyCustomCss(settings.customCSS);
  });
</script>

<div class="flex flex-col min-h-screen bg-bg text-fg">
  <Header showSearch={false} />
  
  <main class="flex-1 min-w-0">
    <div class="max-w-[960px] mx-auto my-4 px-4">
      <h1 class="text-xl mt-0 mb-3">Settings</h1>
      
      <nav class="flex gap-2 border-b border-hair mb-3 overflow-x-auto" role="tablist" aria-label="Settings tabs">
        <button class="py-2 px-2.5 border border-transparent border-b-0 text-muted cursor-pointer select-none" 
                role="tab" aria-selected="true" aria-controls="tab-personalization" id="tabBtnPersonalization">
          Personalization
        </button>
      </nav>
      
      <section id="tab-personalization" class="border border-hair bg-bg p-3.5" role="tabpanel" aria-labelledby="tabBtnPersonalization">
        <!-- Doodles -->
        <div class="grid grid-cols-[1fr_auto] gap-2 items-center mb-3">
          <div class="grid gap-1">
            <div class="font-semibold">Doodles</div>
            <div class="text-xs text-muted">Show interactive doodles in the homepage logo area.</div>
          </div>
          <label class="relative w-[42px] h-6" title="Toggle doodles">
            <input id="setDoodles" type="checkbox" class="opacity-0 w-0 h-0" checked={settings.doodles} on:change={handleDoodlesToggle} />
            <span class="absolute inset-0 border border-hair bg-bg transition-colors duration-200 ease-in-out" 
                  class:bg-acc={settings.doodles} class:border-acc={settings.doodles}>
              <span class="absolute w-5 h-5 bg-bg border border-hair transition-transform duration-200 ease-in-out top-0.5 left-0.5"
                    class:translate-x-4.5={settings.doodles}></span>
            </span>
          </label>
        </div>
        
        <!-- Logo -->
        <div class="grid grid-cols-[1fr_auto] gap-2 items-center mb-3">
          <div class="grid gap-1">
            <div class="font-semibold">Logo</div>
            <div class="text-xs text-muted">Show the logo area on the homepage.</div>
          </div>
          <label class="relative w-[42px] h-6" title="Toggle logo">
            <input id="setLogo" type="checkbox" class="opacity-0 w-0 h-0" checked={settings.logo} on:change={handleLogoToggle} />
            <span class="absolute inset-0 border border-hair bg-bg transition-colors duration-200 ease-in-out" 
                  class:bg-acc={settings.logo} class:border-acc={settings.logo}>
              <span class="absolute w-5 h-5 bg-bg border border-hair transition-transform duration-200 ease-in-out top-0.5 left-0.5"
                    class:translate-x-4.5={settings.logo}></span>
            </span>
          </label>
        </div>
        
        <!-- Islands -->
        <div class="grid grid-cols-[1fr_auto] gap-2 items-center mb-3">
          <div class="grid gap-1">
            <div class="font-semibold">Islands</div>
            <div class="text-xs text-muted">Show knowledge islands and supporting blocks on the results page.</div>
          </div>
          <label class="relative w-[42px] h-6" title="Toggle islands">
            <input id="setIslands" type="checkbox" class="opacity-0 w-0 h-0" checked={settings.islands} on:change={handleIslandsToggle} />
            <span class="absolute inset-0 border border-hair bg-bg transition-colors duration-200 ease-in-out" 
                  class:bg-acc={settings.islands} class:border-acc={settings.islands}>
              <span class="absolute w-5 h-5 bg-bg border border-hair transition-transform duration-200 ease-in-out top-0.5 left-0.5"
                    class:translate-x-4.5={settings.islands}></span>
            </span>
          </label>
        </div>
        
        <!-- Custom CSS -->
        <div class="grid gap-1 mt-2">
          <div class="font-semibold">Custom CSS</div>
          <div class="text-xs text-muted">Your CSS will be injected on the homepage and the results page.</div>
        </div>
        <div class="mt-1.5">
          <textarea id="setCustomCss" class="w-full min-h-[160px] resize-y border border-hair bg-bg text-fg p-2.5 font-mono text-sm" placeholder={customCSSPlaceholder} bind:value={settings.customCSS}></textarea>
          <div class="flex gap-2 items-center mt-2.5">
            <button class="border border-hair bg-bg text-fg py-1.5 px-2.5 cursor-pointer" on:click={applyCustomCssHandler}>Apply</button>
            <button class="border border-hair bg-bg text-fg py-1.5 px-2.5 cursor-pointer" on:click={resetToDefaults}>Reset to defaults</button>
            <span class="text-xs text-muted ml-auto">{saveStatus}</span>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>