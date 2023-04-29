<script>
  import { onDestroy } from 'svelte';
  import { playlistStore, initializePlaylist } from '$lib/stores/playlistStore';
  import PlaylistItem from '$lib/components/PlaylistItem.svelte';

  let items = [];

  const unsubscribe = playlistStore.subscribe(state => {
    items = state.tracks;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="playlist-container">
  <ul id="playlist">
    {#await initializePlaylist()}
      <li>Loading...</li>
    {:then}
      {#each items as item}
        <PlaylistItem track_id={item.id} title={item.title}/>
      {/each}
    {:catch error}
      <li>Error: {error}</li>
    {/await}
  </ul>
</div>
