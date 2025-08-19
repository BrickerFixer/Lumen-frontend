<script>
  export let methods = [];
  export let selectedMethod = null;
  export let methodCapabilities = {};
  export let onSelectMethod = () => {};

  // Prettify ID
  function prettifyId(id) {
    return id
      .replace(/[-_]+/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // Get method label
  function getMethodLabel(id) {
    const caps = methodCapabilities[id] || {};
    return caps.displayName || caps.label || caps.name || caps.title || prettifyId(id);
  }

  // Get method description
  function getMethodDescription(id) {
    const caps = methodCapabilities[id] || {};
    return caps.description || '';
  }
</script>

<nav id="typesNav" class="types" aria-label="Search types">
  {#each methods as method}
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a class="type" 
       aria-current={method === selectedMethod ? "page" : undefined}
       href="javascript:void(0)" 
       title={getMethodDescription(method)}
       on:click|preventDefault={() => onSelectMethod(method)}>
      <div class="ico"></div>
      <div class="lbl">{getMethodLabel(method)}</div>
    </a>
  {/each}
</nav>