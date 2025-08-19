<script>
  export let islands = [];
  export let results = [];
  export let renderHtml = false;
  export let htmlContent = '';
</script>

<section id="main" class="main" aria-label="Main results">
  {#if renderHtml && htmlContent}
    <div>{@html htmlContent}</div>
  {:else}
    <div id="mainIslands">
      {#each islands as island}
        <svelte:component this={island.component} {...island.props} />
      {/each}
    </div>
    <div id="results">
      {#if results.length > 0}
        {#each results as result}
          <svelte:component this={result.component} {...result.props} />
        {/each}
      {:else}
        <slot />
      {/if}
    </div>
  {/if}
  <div id="pager" class="pager" style="display:none;"></div>
</section>