<script lang="ts">
  export let url = '';
  export let title = '';
  export let domain = '';
  export let snippet = '';
  export let query = '';
  
  // Highlight keyword in text
  function highlightKeyword(text: string, keyword: string): string {
    if (!text || !keyword) return text || '';
    const safe = keyword.replace(/[.*+?^${}()|[\\]]/g, '\\$&');
    return text.replace(new RegExp(`(${safe})`, 'gi'), '<b>$1</b>');
  }
</script>

<div class="result">
  <a href={url} target="_blank" rel="noopener noreferrer">{@html highlightKeyword(title || url || '', query)}</a>
  <div class="url">{domain || ''}</div>
  <div class="meta">{@html highlightKeyword(snippet || '', query)}</div>
</div>