<script>
  import { onMount } from 'svelte';
  
  let feVersion = 'dev';
  let nodeVersion = 'Node: offline';
  
  onMount(async () => {
    // Get frontend version
    const feMeta = document.querySelector('meta[name="app:version"]');
    feVersion = (window.__FRONTEND_VERSION__ || (feMeta && feMeta.content) || 'dev').trim();
    
    // Try to get node info
    try {
      const nodeBase = 'http://localhost:3000';
      const info = { name: '', version: '' };
      
      // Helper with timeout
      async function getJSON(url, ms = 2500) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), ms);
        try {
          const res = await fetch(url, { signal: ctrl.signal });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return await res.json();
        } finally {
          clearTimeout(t);
        }
      }
      
      try {
        const meta = await getJSON(nodeBase + '/metadata');
        info.name = meta && (meta.name || '');
        info.version = (meta && (meta.version || meta.nodeVersion)) || '';
      } catch {}
      
      if (!info.version) {
        try {
          const health = await getJSON(nodeBase + '/health');
          info.version = (health && (health.version || health.nodeVersion)) || '';
        } catch {}
      }
      
      // Fallbacks
      if (!info.name) {
        try { info.name = new URL(nodeBase).host; } catch { info.name = nodeBase; }
      }
      
      const verText = info.version ? ` v${info.version}` : '';
      nodeVersion = `Node: ${info.name}${verText}`;
    } catch {
      nodeVersion = 'Node: offline';
    }
  });
</script>

<footer class="site-footer">
  <div class="foot-inner">
    <div class="foot-meta">
      <span>Frontend v{feVersion}</span>
      <span>•</span>
      <span>{nodeVersion}</span>
    </div>
    <nav class="foot-links">
      <a href="/settings">Settings</a>
      <a href="/instances">Instances</a>
      <a href="/news">News</a>
      <a href="/api">API</a>
      <a href="/about">About</a>
      <a href="https://github.com/your/repo" target="_blank" rel="noopener noreferrer">Source</a>
    </nav>
  </div>
</footer>