<style>
  .skeleton {
    background: linear-gradient(90deg, 
      rgb(229 231 235 / var(--tw-bg-opacity)) 25%, 
      rgb(156 163 175 / var(--tw-bg-opacity)) 50%, 
      rgb(229 231 235 / var(--tw-bg-opacity)) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
    min-height: 16px;
    --tw-bg-opacity: 1;
  }

  @media (prefers-color-scheme: dark) {
    .skeleton {
      background: linear-gradient(90deg, 
        rgb(55 65 81 / var(--tw-bg-opacity)) 25%, 
        rgb(75 85 99 / var(--tw-bg-opacity)) 50%, 
        rgb(55 65 81 / var(--tw-bg-opacity)) 75%);
    }
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .result-skeleton {
    margin-bottom: 24px;
  }

  .result-skeleton .title {
    height: 20px;
    width: 60%;
    margin-bottom: 8px;
  }

  .result-skeleton .url {
    height: 16px;
    width: 40%;
    margin-bottom: 8px;
  }

  .result-skeleton .snippet {
    height: 16px;
    width: 100%;
    margin-bottom: 4px;
  }

  .result-skeleton .snippet.short {
    width: 80%;
  }

  .island-skeleton {
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;
    background-color: transparent;
  }

  .island-skeleton .header {
    height: 20px;
    width: 30%;
    margin-bottom: 12px;
  }

  .island-skeleton .content {
    height: 60px;
  }
</style>

<script>
  export let type = 'result'; // 'result' or 'island'
</script>

{#if type === 'result'}
  <div class="result-skeleton">
    <div class="skeleton title"></div>
    <div class="skeleton url"></div>
    <div class="skeleton snippet"></div>
    <div class="skeleton snippet short"></div>
  </div>
{:else if type === 'island'}
  <div class="island-skeleton">
    <div class="skeleton header"></div>
    <div class="skeleton content"></div>
  </div>
{/if}