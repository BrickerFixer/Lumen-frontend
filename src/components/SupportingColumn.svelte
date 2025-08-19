<script>
  export let islands = [];
  export let renderHtml = false;
  export let htmlContent = '';
</script>

<aside id="supportingIslands" class="aside" aria-label="Related">
  {#if renderHtml && htmlContent}
    <div>{@html htmlContent}</div>
  {:else}
    {#if islands.length > 0}
      {#each islands as island}
        <svelte:component this={island.component} {...island.props} />
      {/each}
    {:else}
      <slot />
    {/if}
  {/if}
</aside>