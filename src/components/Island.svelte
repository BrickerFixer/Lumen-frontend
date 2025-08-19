<script>
  export let name = '';
  export let htmlContent = '';
  export let renderHtml = false;
</script>

<article class="island">
  <div class="head">{name || ''}</div>
  <div class="inner">
    <div style="grid-column: 1 / -1;">
      {#if renderHtml && htmlContent}
        {@html htmlContent}
      {:else}
        <div>Island content will be rendered here</div>
      {/if}
    </div>
  </div>
</article>