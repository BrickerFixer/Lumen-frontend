<script>
  import { Router, Route } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import Search from './routes/Search.svelte';
  import Settings from './routes/Settings.svelte';
  
  export let url = '';
</script>

<div class="bg-bg text-fg min-h-screen">
  <Router {url}>
    <Route path="/" component={Home} />
    <Route path="/indsearch.html" component={Search} />
    <Route path="/settings" component={Settings} />
  </Router>
</div>